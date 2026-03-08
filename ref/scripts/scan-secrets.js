#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ZERO_SHA = /^0+$/;
const PLACEHOLDERS = new Set(["", "[REDACTED]"]);
const CURRENT_TREE_MODE = "current-tree";
const COMMIT_MODE = "commits";

const rules = [
  {
    id: "google-oauth-access-token",
    label: "Google OAuth access token",
    regex: /ya29\.[A-Za-z0-9._-]{20,}/g,
    getSecret: (match) => match[0]
  },
  {
    id: "google-oauth-refresh-token",
    label: "Google OAuth refresh token",
    regex: /1\/\/[A-Za-z0-9._-]{20,}/g,
    getSecret: (match) => match[0]
  },
  {
    id: "encoded-google-token-object",
    label: "Encoded googleToken object",
    regex: /&quot;googleToken&quot;:\{/g,
    getSecret: () => "googleToken:{...}"
  },
  {
    id: "plain-google-token-object",
    label: "Plain googleToken object",
    regex: /"googleToken"\s*:\s*\{/g,
    getSecret: () => "googleToken:{...}"
  },
  {
    id: "encoded-sensitive-json-value",
    label: "Encoded OAuth secret field",
    regex: /&quot;(access_token|refresh_token|id_token|client_secret)&quot;:&quot;([^&]{8,})&quot;/g,
    getSecret: (match) => match[2]
  },
  {
    id: "plain-sensitive-json-value",
    label: "Plain OAuth secret field",
    regex: /"(access_token|refresh_token|id_token|client_secret)"\s*:\s*"([^"\r\n]{8,})"/g,
    getSecret: (match) => match[2]
  }
];

function main() {
  const args = process.argv.slice(2);

  if (args.includes("--pre-push")) {
    const stdin = fs.readFileSync(0, "utf8");
    const commits = getCommitsFromPrePush(stdin);
    return exitWithScanResults(scanCommits(commits));
  }

  const range = getFlagValue(args, "--range");
  const commitArgs = getFlagValues(args, "--commits");
  if (range) {
    return exitWithScanResults(scanCommits(getCommitsFromRange(range)));
  }

  if (commitArgs.length) {
    return exitWithScanResults(scanCommits(commitArgs));
  }

  return exitWithScanResults(scanCurrentTree());
}

function getFlagValue(args, flagName) {
  const index = args.indexOf(flagName);
  if (index === -1 || index === args.length - 1) {
    return null;
  }

  return args[index + 1];
}

function getFlagValues(args, flagName) {
  const index = args.indexOf(flagName);
  if (index === -1 || index === args.length - 1) {
    return [];
  }

  return args.slice(index + 1).filter((value) => !value.startsWith("--"));
}

function getCommitsFromPrePush(stdin) {
  const commits = [];
  const seen = new Set();
  const lines = stdin.trim().split(/\r?\n/).filter(Boolean);

  for (const line of lines) {
    const [localRef, localSha, remoteRef, remoteSha] = line.trim().split(/\s+/);
    if (!localRef || !localSha || !remoteRef || !remoteSha || ZERO_SHA.test(localSha)) {
      continue;
    }

    const rangeCommits = ZERO_SHA.test(remoteSha)
      ? gitLines(["rev-list", "--reverse", localSha, "--not", "--remotes"])
      : gitLines(["rev-list", "--reverse", `${remoteSha}..${localSha}`]);

    for (const commit of rangeCommits) {
      if (seen.has(commit)) {
        continue;
      }

      seen.add(commit);
      commits.push(commit);
    }
  }

  return commits;
}

function getCommitsFromRange(range) {
  return gitLines(["rev-list", "--reverse", range]);
}

function scanCurrentTree() {
  const files = gitNullSeparated(["ls-files", "-z", "--cached", "--others", "--exclude-standard"]);
  const findings = [];

  for (const filePath of files) {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    const buffer = fs.readFileSync(absolutePath);
    if (isBinary(buffer)) {
      continue;
    }

    findings.push(...scanText(buffer.toString("utf8"), {
      mode: CURRENT_TREE_MODE,
      path: filePath
    }));
  }

  return findings;
}

function scanCommits(commits) {
  const findings = [];

  for (const commit of commits) {
    const changedPaths = gitNullSeparated([
      "diff-tree",
      "--no-commit-id",
      "--diff-filter=AMCR",
      "--name-only",
      "-r",
      "-z",
      commit
    ]);

    for (const filePath of changedPaths) {
      const buffer = gitBuffer(["show", `${commit}:${filePath}`], true);
      if (!buffer || isBinary(buffer)) {
        continue;
      }

      findings.push(...scanText(buffer.toString("utf8"), {
        mode: COMMIT_MODE,
        commit,
        path: filePath
      }));
    }
  }

  return dedupeFindings(findings);
}

function scanText(content, location) {
  const findings = [];

  for (const rule of rules) {
    const regex = new RegExp(rule.regex.source, rule.regex.flags);
    let match;

    while ((match = regex.exec(content)) !== null) {
      const secret = rule.getSecret(match);
      if (PLACEHOLDERS.has(secret)) {
        continue;
      }

      const position = getLineAndColumn(content, match.index);
      findings.push({
        ...location,
        rule: rule.label,
        line: position.line,
        column: position.column,
        sample: maskSecret(secret)
      });
    }
  }

  return findings;
}

function dedupeFindings(findings) {
  const seen = new Set();
  return findings.filter((finding) => {
    const key = [
      finding.mode,
      finding.commit || "",
      finding.path,
      finding.rule,
      finding.line,
      finding.column,
      finding.sample
    ].join(":");

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function getLineAndColumn(content, index) {
  const lines = content.slice(0, index).split("\n");
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  };
}

function maskSecret(secret) {
  if (secret.length <= 12) {
    return "[REDACTED]";
  }

  return `${secret.slice(0, 4)}...${secret.slice(-4)}`;
}

function isBinary(buffer) {
  return buffer.includes(0);
}

function exitWithScanResults(findings) {
  if (!findings.length) {
    console.log("Secret scan passed.");
    process.exit(0);
  }

  console.error("Secret scan failed. Remove or sanitize these findings before pushing:");
  for (const finding of findings.slice(0, 50)) {
    const prefix = finding.commit
      ? `${finding.commit.slice(0, 7)} ${finding.path}`
      : finding.path;
    console.error(
      `- ${prefix}:${finding.line}:${finding.column} ${finding.rule} (${finding.sample})`
    );
  }

  if (findings.length > 50) {
    console.error(`- ... ${findings.length - 50} more findings omitted`);
  }

  process.exit(1);
}

function gitLines(args) {
  const output = gitText(args).trim();
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

function gitNullSeparated(args) {
  const output = gitBuffer(args);
  if (!output.length) {
    return [];
  }

  return output
    .toString("utf8")
    .split("\0")
    .filter(Boolean);
}

function gitText(args, allowFailure = false) {
  return gitBuffer(args, allowFailure).toString("utf8");
}

function gitBuffer(args, allowFailure = false) {
  try {
    return execFileSync("git", args, {
      cwd: process.cwd(),
      encoding: "buffer",
      stdio: ["ignore", "pipe", "pipe"]
    });
  } catch (error) {
    if (allowFailure) {
      return Buffer.alloc(0);
    }

    const stderr = error.stderr ? error.stderr.toString("utf8").trim() : "";
    throw new Error(stderr || `git ${args.join(" ")} failed`);
  }
}

main();

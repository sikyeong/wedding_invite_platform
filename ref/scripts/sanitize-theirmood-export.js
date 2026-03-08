#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const DEFAULT_TARGET = path.resolve(__dirname, "../extracted/theirmood");
const SENSITIVE_KEYS = new Set([
  "access_token",
  "refresh_token",
  "id_token",
  "client_secret"
]);

function collectTargets(inputPaths) {
  const targets = inputPaths.length ? inputPaths : [DEFAULT_TARGET];
  const files = [];

  for (const inputPath of targets) {
    const resolvedPath = path.resolve(inputPath);
    if (!fs.existsSync(resolvedPath)) {
      console.warn(`Skipping missing path: ${resolvedPath}`);
      continue;
    }

    const stat = fs.statSync(resolvedPath);
    if (stat.isDirectory()) {
      files.push(...walkDirectory(resolvedPath));
      continue;
    }

    if (isSanitizableFile(resolvedPath)) {
      files.push(resolvedPath);
    }
  }

  return [...new Set(files)];
}

function walkDirectory(directoryPath) {
  const files = [];
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDirectory(entryPath));
      continue;
    }

    if (isSanitizableFile(entryPath)) {
      files.push(entryPath);
    }
  }

  return files;
}

function isSanitizableFile(filePath) {
  return filePath.endsWith(".html");
}

function sanitizeContent(content) {
  let sanitized = content;

  sanitized = sanitized.replace(
    /&quot;googleToken&quot;:\{.*?\}(?=,&quot;[A-Za-z0-9_]+&quot;:)/gs,
    "&quot;googleToken&quot;:null"
  );
  sanitized = sanitized.replace(
    /"googleToken":\{.*?\}(?=,"[A-Za-z0-9_]+":)/gs,
    '"googleToken":null'
  );
  sanitized = sanitized.replace(
    /&quot;(access_token|refresh_token|id_token|client_secret)&quot;:&quot;([^&]*)&quot;/g,
    (_, key, value) => encodedReplacement(key, value)
  );
  sanitized = sanitized.replace(
    /"(access_token|refresh_token|id_token|client_secret)"\s*:\s*"([^"\r\n]*)"/g,
    (_, key, value) => plainReplacement(key, value)
  );

  return sanitized;
}

function encodedReplacement(key, value) {
  if (!SENSITIVE_KEYS.has(key) || shouldKeepValue(value)) {
    return `&quot;${key}&quot;:&quot;${value}&quot;`;
  }

  return `&quot;${key}&quot;:&quot;[REDACTED]&quot;`;
}

function plainReplacement(key, value) {
  if (!SENSITIVE_KEYS.has(key) || shouldKeepValue(value)) {
    return `"${key}":"${value}"`;
  }

  return `"${key}":"[REDACTED]"`;
}

function shouldKeepValue(value) {
  return value === "" || value === "[REDACTED]";
}

function main() {
  const inputPaths = process.argv.slice(2);
  const files = collectTargets(inputPaths);

  if (!files.length) {
    console.error("No sanitizable export files found.");
    process.exit(1);
  }

  const changedFiles = [];
  for (const filePath of files) {
    const original = fs.readFileSync(filePath, "utf8");
    const sanitized = sanitizeContent(original);

    if (sanitized !== original) {
      fs.writeFileSync(filePath, sanitized, "utf8");
      changedFiles.push(path.relative(process.cwd(), filePath));
    }
  }

  if (!changedFiles.length) {
    console.log(`Sanitized 0 files. Checked ${files.length} export files.`);
    return;
  }

  console.log(`Sanitized ${changedFiles.length} files:`);
  for (const filePath of changedFiles) {
    console.log(`- ${filePath}`);
  }
}

main();

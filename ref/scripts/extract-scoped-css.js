#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const [,, bundlePath, scopeId, outputPath] = process.argv;

if (!bundlePath || !scopeId || !outputPath) {
  console.error("Usage: node scripts/extract-scoped-css.js <bundle.js> <scope-id> <output.css>");
  process.exit(1);
}

const js = fs.readFileSync(bundlePath, "utf8");
const regex = /a\.push\(\[e\.id,"((?:\\.|[^"\\])*)",""\]\);/g;

const blocks = [];
let match;

while ((match = regex.exec(js)) !== null) {
  try {
    const css = JSON.parse(`"${match[1]}"`);
    if (css.includes(scopeId)) {
      blocks.push(css);
    }
  } catch {
    // Ignore malformed strings.
  }
}

if (!blocks.length) {
  console.error(`No CSS block found for scope: ${scopeId}`);
  process.exit(2);
}

const unique = [...new Set(blocks)];
const joined = unique.join("\n\n");
const pretty = joined
  .replace(/}/g, "}\n")
  .replace(/{/g, " {\n")
  .replace(/;/g, ";\n")
  .replace(/\n{3,}/g, "\n\n");

const target = path.resolve(outputPath);
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, pretty, "utf8");

console.log(`Extracted ${unique.length} block(s) for ${scopeId}`);
console.log(`Saved to ${target}`);

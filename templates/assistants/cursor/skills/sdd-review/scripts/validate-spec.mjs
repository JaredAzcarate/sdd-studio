#!/usr/bin/env node

/**
 * Validates workspace/spec/ after sdd-review edits.
 * Usage: node scripts/validate-spec.mjs [path-to-spec]
 * Default path: workspace/spec
 */

import fs from "fs";
import path from "path";

const specRoot = path.resolve(process.argv[2] || "workspace/spec");

const CATEGORIES = [
  { folder: "domain", suffix: "domain" },
  { folder: "relations", suffix: "relations" },
  { folder: "capabilities", suffix: "capabilities" },
  { folder: "flows", suffix: "flows" },
  { folder: "rules", suffix: "rules" },
  { folder: "security", suffix: "security" },
  { folder: "events", suffix: "events" },
  { folder: "api", suffix: "api" },
  { folder: "ui", suffix: "ui" },
  { folder: "testing", suffix: "testing" },
];

const ALLOWED_TOP = new Set(["vision.md", ...CATEGORIES.map((c) => c.folder)]);

const FORBIDDEN_IN_SPEC = [
  /^roadmap/i,
  /^milestone/i,
  /^release/i,
  /^tasks?\./i,
  /index\.md$/i,
  /README\.md$/i,
  /map\.md$/i,
];

const errors = [];
const warnings = [];

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function listMdFiles(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

function extractDomains(specPath) {
  const domainDir = path.join(specPath, "domain");
  const files = listMdFiles(domainDir);
  const domains = new Set();

  for (const file of files) {
    const match = file.match(/^([a-z0-9-]+)-domain\.md$/);
    if (match) domains.add(match[1]);
    else errors.push(`Invalid domain file name: domain/${file}`);
  }

  return domains;
}

function validateFileName(folder, suffix, file) {
  const expected = new RegExp(`^([a-z0-9-]+)-${suffix}\\.md$`);
  const match = file.match(expected);
  if (!match) {
    errors.push(`Invalid file name: ${folder}/${file} (expected <domain>-${suffix}.md)`);
    return null;
  }
  return match[1];
}

function validateH1(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const h1Matches = content.match(/^# .+$/gm) || [];
  if (h1Matches.length === 0) errors.push(`Missing H1: ${filePath}`);
  else if (h1Matches.length > 1) warnings.push(`Multiple H1 headings: ${filePath}`);
}

function main() {
  if (!exists(specRoot)) {
    console.error(`Spec directory not found: ${specRoot}`);
    process.exit(1);
  }

  const visionPath = path.join(specRoot, "vision.md");
  if (!exists(visionPath)) errors.push("Missing workspace/spec/vision.md");

  const topEntries = fs.readdirSync(specRoot);
  for (const entry of topEntries) {
    const full = path.join(specRoot, entry);
    const stat = fs.statSync(full);
    if (stat.isFile() && entry !== "vision.md") {
      if (FORBIDDEN_IN_SPEC.some((re) => re.test(entry))) {
        errors.push(`Forbidden file in spec/: ${entry}`);
      }
    }
    if (stat.isDirectory() && !ALLOWED_TOP.has(entry)) {
      errors.push(`Unexpected folder in spec/: ${entry}`);
    }
  }

  const domains = extractDomains(specRoot);

  for (const { folder, suffix } of CATEGORIES) {
    const dir = path.join(specRoot, folder);
    if (!exists(dir)) {
      errors.push(`Missing folder: spec/${folder}/`);
      continue;
    }

    const files = listMdFiles(dir);

    for (const file of files) {
      if (FORBIDDEN_IN_SPEC.some((re) => re.test(file))) {
        errors.push(`Forbidden file: ${folder}/${file}`);
        continue;
      }
      if (validateFileName(folder, suffix, file)) {
        validateH1(path.join(dir, file));
      }
    }

    for (const domain of domains) {
      const expected = `${domain}-${suffix}.md`;
      if (!files.includes(expected)) {
        errors.push(`Missing file for domain "${domain}": ${folder}/${expected}`);
      }
    }
  }

  if (warnings.length > 0) {
    console.log("Warnings:");
    warnings.forEach((w) => console.log(`  - ${w}`));
    console.log("");
  }

  if (errors.length > 0) {
    console.error("Validation failed:");
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  console.log(`OK: ${specRoot} (${domains.size} domain(s))`);
  process.exit(0);
}

main();

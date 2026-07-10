#!/usr/bin/env node

/**
 * Validates .workspace/spec/ against SDD Studio naming and structure conventions.
 * Usage: node scripts/validate-spec.mjs [path-to-spec]
 * Default path: .workspace/spec
 * Exit 0 = OK, 1 = errors found
 */

import fs from "fs";
import path from "path";

const specRoot = path.resolve(process.argv[2] || ".workspace/spec");

const CATEGORIES = [
  { perspective: "business", folder: "domain", suffix: "domain" },
  { perspective: "business", folder: "relations", suffix: "relations" },
  { perspective: "business", folder: "capabilities", suffix: "capabilities" },
  { perspective: "business", folder: "flows", suffix: "flows" },
  { perspective: "business", folder: "rules", suffix: "rules" },
  { perspective: "business", folder: "security", suffix: "security" },
  { perspective: "business", folder: "events", suffix: "events" },
  { perspective: "business", folder: "decisions", suffix: "decisions" },
  { perspective: "technical", folder: "api", suffix: "api" },
  { perspective: "technical", folder: "ui", suffix: "ui" },
  { perspective: "technical", folder: "testing", suffix: "testing" },
  { perspective: "technical", folder: "architecture", suffix: "architecture" },
  { perspective: "technical", folder: "database", suffix: "database" },
];

const ALLOWED_TOP = new Set(["business", "technical"]);
const ALLOWED_BUSINESS = new Set(
  CATEGORIES.filter((c) => c.perspective === "business").map((c) => c.folder),
);
const ALLOWED_TECHNICAL = new Set(
  CATEGORIES.filter((c) => c.perspective === "technical").map((c) => c.folder),
);

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

function categoryPath(category) {
  return path.join(specRoot, category.perspective, category.folder);
}

function categoryLabel(category) {
  return `${category.perspective}/${category.folder}`;
}

function extractDomains(specPath) {
  const domainDir = path.join(specPath, "business", "domain");
  const files = listMdFiles(domainDir);
  const domains = new Set();

  for (const file of files) {
    const match = file.match(/^([a-z0-9-]+)-domain\.md$/);
    if (match) {
      domains.add(match[1]);
    } else {
      errors.push(
        `Invalid domain file name: business/domain/${file} (expected <domain>-domain.md)`,
      );
    }
  }

  return domains;
}

function validateFileName(label, suffix, file) {
  const expected = new RegExp(`^([a-z0-9-]+)-${suffix}\\.md$`);
  const match = file.match(expected);
  if (!match) {
    errors.push(
      `Invalid file name: ${label}/${file} (expected <domain>-${suffix}.md)`,
    );
    return null;
  }
  return match[1];
}

function validateH1(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const h1Matches = content.match(/^# .+$/gm) || [];
  if (h1Matches.length === 0) {
    errors.push(`Missing H1: ${filePath}`);
  } else if (h1Matches.length > 1) {
    warnings.push(`Multiple H1 headings: ${filePath}`);
  }
}

function validatePerspectiveFolder(perspective, allowed) {
  const perspectiveDir = path.join(specRoot, perspective);
  if (!exists(perspectiveDir)) {
    errors.push(`Missing folder: spec/${perspective}/`);
    return;
  }

  const entries = fs.readdirSync(perspectiveDir);
  for (const entry of entries) {
    const full = path.join(perspectiveDir, entry);
    const stat = fs.statSync(full);

    if (stat.isFile()) {
      errors.push(`Unexpected file in spec/${perspective}/: ${entry}`);
      continue;
    }

    if (!allowed.has(entry)) {
      errors.push(`Unexpected folder in spec/${perspective}/: ${entry}`);
    }
  }
}

function main() {
  if (!exists(specRoot)) {
    console.error(`Spec directory not found: ${specRoot}`);
    process.exit(1);
  }

  const topEntries = fs.readdirSync(specRoot);
  for (const entry of topEntries) {
    const full = path.join(specRoot, entry);
    const stat = fs.statSync(full);

    if (stat.isFile()) {
      if (FORBIDDEN_IN_SPEC.some((re) => re.test(entry))) {
        errors.push(`Forbidden file in spec/: ${entry}`);
      } else if (!entry.endsWith(".md")) {
        warnings.push(`Unexpected non-markdown file in spec/: ${entry}`);
      } else {
        errors.push(
          `Unexpected file in spec/: ${entry} (only business/ and technical/ allowed at top level)`,
        );
      }
    }

    if (stat.isDirectory() && !ALLOWED_TOP.has(entry)) {
      errors.push(`Unexpected folder in spec/: ${entry}`);
    }
  }

  validatePerspectiveFolder("business", ALLOWED_BUSINESS);
  validatePerspectiveFolder("technical", ALLOWED_TECHNICAL);

  const domains = extractDomains(specRoot);

  if (domains.size === 0) {
    warnings.push(
      "No domains found in spec/business/domain/ (expected <domain>-domain.md files)",
    );
  }

  for (const category of CATEGORIES) {
    const label = categoryLabel(category);
    const dir = categoryPath(category);

    if (!exists(dir)) {
      errors.push(`Missing folder: spec/${label}/`);
      continue;
    }

    const files = listMdFiles(dir);
    const domainsInFolder = new Set();

    for (const file of files) {
      if (FORBIDDEN_IN_SPEC.some((re) => re.test(file))) {
        errors.push(`Forbidden file: ${label}/${file}`);
        continue;
      }

      const domain = validateFileName(label, category.suffix, file);
      if (domain) {
        domainsInFolder.add(domain);
        validateH1(path.join(dir, file));
      }
    }

    for (const domain of domains) {
      const expected = `${domain}-${category.suffix}.md`;
      if (!files.includes(expected)) {
        errors.push(`Missing file for domain "${domain}": ${label}/${expected}`);
      }
    }

    for (const domain of domainsInFolder) {
      if (!domains.has(domain) && category.suffix !== "domain") {
        warnings.push(
          `Orphan file: ${label}/${domain}-${category.suffix}.md (no matching domain in business/domain/)`,
        );
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

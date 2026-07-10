#!/usr/bin/env node

/**
 * Validates .workspace/workflow/ against SDD Studio conventions.
 * Usage: node scripts/validate-workflow.mjs [path-to-workflow]
 * Default path: .workspace/workflow
 */

import fs from "fs";
import path from "path";

const workflowRoot = path.resolve(process.argv[2] || ".workspace/workflow");

const errors = [];
const warnings = [];

const ID_PATTERNS = {
  roadmap: /^ROADMAP-\d{3}$/,
  milestone: /^MILESTONE-\d{3}$/,
  release: /^RELEASE-\d{3}$/,
  task: /^TASK-\d{3}$/,
  review: /^REVIEW-\d{3}$/,
  decision: /^DECISION-\d{3}$/,
};

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

function validateH1(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  if (!(content.match(/^# .+$/m))) {
    errors.push(`Missing H1: ${filePath}`);
  }
}

function checkIdsInFile(filePath, pattern, label) {
  const content = fs.readFileSync(filePath, "utf8");
  const idMatches = content.match(/\b[A-Z]+-\d{3}\b/g) || [];
  for (const id of idMatches) {
    if (pattern && !pattern.test(id) && !Object.values(ID_PATTERNS).some((p) => p.test(id))) {
      warnings.push(`Unexpected ID format "${id}" in ${filePath}`);
    }
  }
  const tableRows = content.match(/^\|[^|]+\|/gm) || [];
  for (const row of tableRows) {
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    if (cells.length > 0 && cells[0].match(/^[A-Z]+-\d{3}$/) && pattern && !pattern.test(cells[0])) {
      if (!Object.values(ID_PATTERNS).some((p) => p.test(cells[0]))) {
        warnings.push(`ID "${cells[0]}" in ${filePath} may not match expected ${label} pattern`);
      }
    }
  }
}

function validateRoadmaps(wf) {
  const dir = path.join(wf, "roadmap");
  if (!exists(dir)) {
    errors.push("Missing folder: workflow/roadmap/");
    return;
  }
  const files = listMdFiles(dir);
  if (files.length === 0) warnings.push("No roadmap files in workflow/roadmap/");
  for (const file of files) {
    if (!/^roadmap-\d{3}\.md$/.test(file)) {
      errors.push(`Invalid roadmap file: roadmap/${file} (expected roadmap-NNN.md)`);
    } else {
      validateH1(path.join(dir, file));
    }
  }
}

function validateMilestones(wf) {
  const dir = path.join(wf, "milestones");
  if (!exists(dir)) {
    errors.push("Missing folder: workflow/milestones/");
    return;
  }
  const files = listMdFiles(dir);
  if (files.length === 0) warnings.push("No milestone files in workflow/milestones/");
  for (const file of files) {
    if (!/^milestone-\d{3}\.md$/.test(file)) {
      errors.push(`Invalid milestone file: milestones/${file} (expected milestone-NNN.md)`);
    } else {
      validateH1(path.join(dir, file));
    }
  }
}

function validateReleases(wf) {
  const dir = path.join(wf, "releases");
  if (!exists(dir)) {
    errors.push("Missing folder: workflow/releases/");
    return;
  }

  const entries = fs.readdirSync(dir);
  const releaseDirs = entries.filter((e) => {
    const full = path.join(dir, e);
    return fs.statSync(full).isDirectory();
  });

  if (releaseDirs.length === 0) warnings.push("No release folders in workflow/releases/");

  const REQUIRED_FILES = ["release.md", "tasks.md", "reviews.md"];

  for (const relDir of releaseDirs) {
    if (!/^release-\d{3}$/.test(relDir)) {
      errors.push(`Invalid release folder: releases/${relDir} (expected release-NNN)`);
      continue;
    }

    const relPath = path.join(dir, relDir);
    const files = fs.readdirSync(relPath);

    for (const req of REQUIRED_FILES) {
      if (!files.includes(req)) {
        errors.push(`Missing file: releases/${relDir}/${req}`);
      }
    }

    const extra = files.filter((f) => !REQUIRED_FILES.includes(f));
    for (const ex of extra) {
      errors.push(`Unexpected file in releases/${relDir}/: ${ex}`);
    }

    for (const req of REQUIRED_FILES) {
      if (files.includes(req)) {
        const fp = path.join(relPath, req);
        validateH1(fp);
        if (req === "tasks.md") checkIdsInFile(fp, ID_PATTERNS.task, "TASK-NNN");
        if (req === "reviews.md") checkIdsInFile(fp, ID_PATTERNS.review, "REVIEW-NNN");
      }
    }
  }
}

function main() {
  if (!exists(workflowRoot)) {
    console.error(`Workflow directory not found: ${workflowRoot}`);
    process.exit(1);
  }

  const allowed = new Set(["roadmap", "milestones", "releases"]);
  for (const entry of fs.readdirSync(workflowRoot)) {
    const full = path.join(workflowRoot, entry);
    if (fs.statSync(full).isDirectory() && !allowed.has(entry)) {
      errors.push(`Unexpected folder in workflow/: ${entry}`);
    }
  }

  validateRoadmaps(workflowRoot);
  validateMilestones(workflowRoot);
  validateReleases(workflowRoot);

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

  console.log(`OK: ${workflowRoot}`);
  process.exit(0);
}

main();

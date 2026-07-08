import { existsSync } from "node:fs";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  SDD_WORKSPACE_DIR,
  SDD_WORKSPACE_LEGACY_MARKER_PATH,
  SDD_WORKSPACE_MARKER_PATH,
} from "../constants/sdd-workspace-path.js";
import { copyTemplateFile } from "../core/file-system.js";
import { resolveWorkspaceTemplatePath } from "../core/template-resolver.js";

export type MigrateWorkspaceOptions = {
  targetDir: string;
};

export type MigrateWorkspaceResult = {
  workspaceDir: string;
  migratedPaths: string[];
  removedPaths: string[];
  alreadyMigrated: boolean;
};

const BUSINESS_SPEC_CATEGORIES = [
  "domain",
  "relations",
  "capabilities",
  "flows",
  "rules",
  "security",
  "events",
] as const;

const TECHNICAL_SPEC_CATEGORIES = ["api", "ui", "testing"] as const;

const ENGINEERING_BRIEF_FILES = [
  "brief/technical/engineering-principles.md",
  "brief/technical/engineering-decisions.md",
  "brief/technical/engineering-conventions.md",
  "brief/technical/engineering-modeling.md",
] as const;

const STACK_FILES = [
  "frontend",
  "backend",
  "database",
  "infrastructure",
  "ai",
] as const;

const DEVELOPMENT_SECTIONS = new Set([
  "development model",
  "workflow methodology",
  "code organization",
  "repository strategy",
  "development conventions",
]);

const MODELING_SECTIONS = new Set(["architecture", "modeling"]);

const STACK_SECTION_MAP: Record<string, string> = {
  frontend: "frontend",
  backend: "backend",
  database: "database",
  assistant: "ai",
  language: "backend",
  framework: "frontend",
};

function parseMarkdownSections(content: string): Map<string, string> {
  const sections = new Map<string, string>();
  const parts = content.split(/^## /m);

  for (const part of parts.slice(1)) {
    const newlineIndex = part.indexOf("\n");
    if (newlineIndex === -1) {
      continue;
    }

    const title = part.slice(0, newlineIndex).trim().toLowerCase();
    const body = part.slice(newlineIndex + 1).trim();
    sections.set(title, body);
  }

  return sections;
}

async function ensureDir(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

async function moveIfExists(
  source: string,
  destination: string,
  migratedPaths: string[],
): Promise<void> {
  if (!existsSync(source)) {
    return;
  }

  await ensureDir(join(destination, ".."));
  await rename(source, destination);
  migratedPaths.push(destination);
}

async function moveSpecCategory(
  workspaceDir: string,
  category: string,
  perspective: "business" | "technical",
  migratedPaths: string[],
): Promise<void> {
  const source = join(workspaceDir, "spec", category);
  const destination = join(workspaceDir, "spec", perspective, category);

  if (!existsSync(source)) {
    return;
  }

  await ensureDir(join(destination, ".."));
  await rename(source, destination);
  migratedPaths.push(destination);
}

async function writeBriefFromTemplate(
  templateRelativePath: string,
  destination: string,
  migratedPaths: string[],
): Promise<string> {
  await copyTemplateFile(
    resolveWorkspaceTemplatePath(templateRelativePath),
    destination,
    { overwrite: true },
  );
  migratedPaths.push(destination);
  return await readFile(destination, "utf8");
}

function appendSection(
  sections: Map<string, string>,
  title: string,
  bucket: string[],
): void {
  const body = sections.get(title);
  if (!body || body === "TODO") {
    return;
  }

  bucket.push(
    `## ${title.replace(/\b\w/g, (char) => char.toUpperCase())}\n\n${body}`,
  );
}

async function writeEngineeringBriefTemplates(
  workspaceDir: string,
  migratedPaths: string[],
): Promise<void> {
  for (const relativePath of ENGINEERING_BRIEF_FILES) {
    await writeBriefFromTemplate(
      relativePath,
      join(workspaceDir, relativePath),
      migratedPaths,
    );
  }
}

async function buildEngineeringModelingMd(
  sections: Map<string, string>,
  destination: string,
  migratedPaths: string[],
): Promise<void> {
  const header = await writeBriefFromTemplate(
    "brief/technical/engineering-modeling.md",
    destination,
    migratedPaths,
  );
  const bodyParts: string[] = [];

  for (const title of sections.keys()) {
    if (MODELING_SECTIONS.has(title)) {
      appendSection(sections, title, bodyParts);
    }
  }

  if (bodyParts.length > 0) {
    const merged = `${header.trim()}\n\n${bodyParts.join("\n\n---\n\n")}\n`;
    await writeFile(destination, merged, "utf8");
  }
}

async function buildEngineeringStackMd(
  sections: Map<string, string>,
  stackDir: string,
  destination: string,
  migratedPaths: string[],
): Promise<void> {
  const bodyParts: string[] = ["# Engineering Stack", "", "## Overview", ""];

  for (const stackKey of STACK_FILES) {
    const stackPath = join(stackDir, `${stackKey}.md`);
    if (!existsSync(stackPath)) {
      continue;
    }

    const content = await readFile(stackPath, "utf8");
    if (!content.includes("TODO") || content.trim().length > 120) {
      bodyParts.push(`### ${stackKey}`, "", content.trim(), "");
    }
  }

  for (const [title, stackFile] of Object.entries(STACK_SECTION_MAP)) {
    const sectionParts: string[] = [];
    appendSection(sections, title, sectionParts);
    if (sectionParts.length > 0) {
      bodyParts.push(`### ${stackFile} (from legacy project.md)`, "");
      bodyParts.push(...sectionParts);
      bodyParts.push("");
    }
  }

  if (bodyParts.length <= 4) {
    return;
  }

  await writeFile(destination, `${bodyParts.join("\n").trimEnd()}\n`, "utf8");
  migratedPaths.push(destination);
}

async function migrateLegacyProjectMd(
  workspaceDir: string,
  projectContent: string,
  migratedPaths: string[],
): Promise<void> {
  const sections = parseMarkdownSections(projectContent);
  const modelingPath = join(
    workspaceDir,
    "brief/technical/engineering-modeling.md",
  );
  const stackPath = join(workspaceDir, "brief/technical/engineering-stack.md");

  await buildEngineeringModelingMd(sections, modelingPath, migratedPaths);
  await buildEngineeringStackMd(
    sections,
    join(workspaceDir, "brief/technical/stack"),
    stackPath,
    migratedPaths,
  );
}

async function migrateV05BriefLayout(
  workspaceDir: string,
  migratedPaths: string[],
  removedPaths: string[],
): Promise<void> {
  const modelingSource = join(workspaceDir, "brief/technical/modeling.md");
  const modelingDestination = join(
    workspaceDir,
    "brief/technical/engineering-modeling.md",
  );

  if (existsSync(modelingSource)) {
    if (!existsSync(modelingDestination)) {
      await moveIfExists(modelingSource, modelingDestination, migratedPaths);
    } else {
      const legacyContent = await readFile(modelingSource, "utf8");
      await writeFile(modelingDestination, legacyContent, "utf8");
      migratedPaths.push(modelingDestination);
      await rm(modelingSource);
      removedPaths.push(modelingSource);
    }
  } else if (!existsSync(modelingDestination)) {
    await writeBriefFromTemplate(
      "brief/technical/engineering-modeling.md",
      modelingDestination,
      migratedPaths,
    );
  }

  for (const relativePath of [
    "brief/technical/engineering-principles.md",
    "brief/technical/engineering-decisions.md",
    "brief/technical/engineering-conventions.md",
  ] as const) {
    const destination = join(workspaceDir, relativePath);
    if (!existsSync(destination)) {
      await writeBriefFromTemplate(relativePath, destination, migratedPaths);
    }
  }

  const stackDir = join(workspaceDir, "brief/technical/stack");
  const stackDestination = join(
    workspaceDir,
    "brief/technical/engineering-stack.md",
  );

  if (!existsSync(stackDestination) && existsSync(stackDir)) {
    await buildEngineeringStackMd(
      new Map(),
      stackDir,
      stackDestination,
      migratedPaths,
    );
  }

  const developmentPath = join(workspaceDir, "brief/technical/development.md");
  if (existsSync(developmentPath)) {
    await rm(developmentPath);
    removedPaths.push(developmentPath);
  }

  if (existsSync(stackDir)) {
    await rm(stackDir, { recursive: true, force: true });
    removedPaths.push(stackDir);
  }
}

function hasLegacyV05Layout(workspaceDir: string): boolean {
  return (
    existsSync(join(workspaceDir, "brief/technical/development.md")) ||
    existsSync(join(workspaceDir, "brief/technical/modeling.md")) ||
    existsSync(join(workspaceDir, "brief/technical/stack"))
  );
}

export async function migrateWorkspace(
  options: MigrateWorkspaceOptions,
): Promise<MigrateWorkspaceResult> {
  const workspaceDir = join(options.targetDir, SDD_WORKSPACE_DIR);
  const markerPath = join(options.targetDir, SDD_WORKSPACE_MARKER_PATH);
  const legacyMarkerPath = join(
    options.targetDir,
    SDD_WORKSPACE_LEGACY_MARKER_PATH,
  );
  const migratedPaths: string[] = [];
  const removedPaths: string[] = [];

  if (existsSync(markerPath) && !hasLegacyV05Layout(workspaceDir)) {
    return {
      workspaceDir,
      migratedPaths: [],
      removedPaths: [],
      alreadyMigrated: true,
    };
  }

  if (
    !existsSync(legacyMarkerPath) &&
    !hasLegacyV05Layout(workspaceDir) &&
    !existsSync(markerPath)
  ) {
    throw new Error(
      "No legacy SDD workspace found. Run `sdd-studio init` to create a new project.",
    );
  }

  await ensureDir(join(workspaceDir, "brief/business"));
  await ensureDir(join(workspaceDir, "brief/technical"));
  await ensureDir(join(workspaceDir, "spec/business"));
  await ensureDir(join(workspaceDir, "spec/technical/architecture"));
  await ensureDir(join(workspaceDir, "spec/technical/database"));

  if (existsSync(legacyMarkerPath)) {
    await moveIfExists(
      join(workspaceDir, "product-principles.md"),
      join(workspaceDir, "brief/business/product-principles.md"),
      migratedPaths,
    );
    await moveIfExists(
      join(workspaceDir, "product-guide.md"),
      join(workspaceDir, "brief/business/product-guide.md"),
      migratedPaths,
    );

    for (const category of BUSINESS_SPEC_CATEGORIES) {
      await moveSpecCategory(workspaceDir, category, "business", migratedPaths);
    }

    for (const category of TECHNICAL_SPEC_CATEGORIES) {
      await moveSpecCategory(
        workspaceDir,
        category,
        "technical",
        migratedPaths,
      );
    }

    const projectContent = await readFile(legacyMarkerPath, "utf8");
    await writeEngineeringBriefTemplates(workspaceDir, migratedPaths);
    await migrateLegacyProjectMd(workspaceDir, projectContent, migratedPaths);

    await rm(legacyMarkerPath);
    removedPaths.push(legacyMarkerPath);
  }

  if (hasLegacyV05Layout(workspaceDir)) {
    await migrateV05BriefLayout(workspaceDir, migratedPaths, removedPaths);
  }

  if (!existsSync(markerPath)) {
    await writeBriefFromTemplate(
      "brief/technical/engineering-principles.md",
      markerPath,
      migratedPaths,
    );
  }

  return {
    workspaceDir,
    migratedPaths,
    removedPaths,
    alreadyMigrated: false,
  };
}

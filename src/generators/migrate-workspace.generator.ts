import { existsSync } from "node:fs";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  SDD_WORKSPACE_DIR,
  SDD_WORKSPACE_LEGACY_MARKER_PATH,
} from "../constants/sdd-workspace-path.js";
import { copyTemplateFile } from "../core/file-system.js";
import { resolveWorkspaceTemplatePath } from "../core/template-resolver.js";
import { getManifestPath } from "../workspace/manifest.js";
import { migrateFlatBriefToVersioned } from "../workspace/technical-version.js";
import { hasSddWorkspace } from "../workspace/workspace-detection.js";

export type MigrateWorkspaceOptions = {
  targetDir: string;
};

export type MigrateWorkspaceResult = {
  workspaceDir: string;
  migratedPaths: string[];
  removedPaths: string[];
  alreadyMigrated: boolean;
  manifestPath?: string;
  briefVersion?: string;
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
  "brief/technical/engineering-frontend-patterns.md",
  "brief/technical/engineering-backend-patterns.md",
  "brief/technical/engineering-contribution-patterns.md",
] as const;

const STACK_FILES = [
  "frontend",
  "backend",
  "database",
  "infrastructure",
  "ai",
] as const;

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
): Promise<void> {
  await copyTemplateFile(
    resolveWorkspaceTemplatePath(templateRelativePath),
    destination,
    { overwrite: true },
  );
  migratedPaths.push(destination);
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
    const destination = join(workspaceDir, relativePath);
    if (!existsSync(destination)) {
      await writeBriefFromTemplate(relativePath, destination, migratedPaths);
    }
  }
}

async function archiveEngineeringModeling(
  workspaceDir: string,
  content: string,
  migratedPaths: string[],
): Promise<void> {
  const archivedDir = join(workspaceDir, "brief/technical/.archived");
  const destination = join(archivedDir, "engineering-modeling.md");
  await ensureDir(archivedDir);
  await writeFile(destination, content, "utf8");
  migratedPaths.push(destination);
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
  removedPaths: string[],
): Promise<void> {
  const sections = parseMarkdownSections(projectContent);
  const modelingParts: string[] = ["# Engineering Modeling (archived legacy)", ""];

  for (const title of ["architecture", "modeling"]) {
    appendSection(sections, title, modelingParts);
  }

  if (modelingParts.length > 2) {
    await archiveEngineeringModeling(
      workspaceDir,
      `${modelingParts.join("\n\n")}\n`,
      migratedPaths,
    );
  }

  const stackPath = join(workspaceDir, "brief/technical/engineering-stack.md");
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
  const legacyModeling = join(
    workspaceDir,
    "brief/technical/engineering-modeling.md",
  );

  if (existsSync(modelingSource)) {
    const content = await readFile(modelingSource, "utf8");
    await archiveEngineeringModeling(workspaceDir, content, migratedPaths);
    await rm(modelingSource);
    removedPaths.push(modelingSource);
  } else if (existsSync(legacyModeling)) {
    const content = await readFile(legacyModeling, "utf8");
    await archiveEngineeringModeling(workspaceDir, content, migratedPaths);
    await rm(legacyModeling);
    removedPaths.push(legacyModeling);
  }

  for (const relativePath of ENGINEERING_BRIEF_FILES) {
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

function hasVersionedBriefLayout(workspaceDir: string): boolean {
  return existsSync(getManifestPath(workspaceDir));
}

export async function migrateWorkspace(
  options: MigrateWorkspaceOptions,
): Promise<MigrateWorkspaceResult> {
  const workspaceDir = join(options.targetDir, SDD_WORKSPACE_DIR);
  const legacyMarkerPath = join(
    options.targetDir,
    SDD_WORKSPACE_LEGACY_MARKER_PATH,
  );
  const migratedPaths: string[] = [];
  const removedPaths: string[] = [];

  if (hasVersionedBriefLayout(workspaceDir)) {
    return {
      workspaceDir,
      migratedPaths: [],
      removedPaths: [],
      alreadyMigrated: true,
      manifestPath: getManifestPath(workspaceDir),
    };
  }

  if (
    !existsSync(legacyMarkerPath) &&
    !hasLegacyV05Layout(workspaceDir) &&
    !hasSddWorkspace(options.targetDir)
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
    await migrateLegacyProjectMd(
      workspaceDir,
      projectContent,
      migratedPaths,
      removedPaths,
    );

    await rm(legacyMarkerPath);
    removedPaths.push(legacyMarkerPath);
  }

  if (hasLegacyV05Layout(workspaceDir)) {
    await migrateV05BriefLayout(workspaceDir, migratedPaths, removedPaths);
  }

  if (!hasSddWorkspace(options.targetDir)) {
    await writeBriefFromTemplate(
      "brief/technical/engineering-principles.md",
      join(workspaceDir, "brief/technical/engineering-principles.md"),
      migratedPaths,
    );
  }

  const { manifestPath, version } = await migrateFlatBriefToVersioned(
    workspaceDir,
  );

  return {
    workspaceDir,
    migratedPaths,
    removedPaths,
    alreadyMigrated: false,
    manifestPath,
    briefVersion: version,
  };
}

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

const TECHNICAL_SPEC_CATEGORIES = [
  "api",
  "ui",
  "testing",
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

  bucket.push(`## ${title.replace(/\b\w/g, (char) => char.toUpperCase())}\n\n${body}`);
}

async function buildDevelopmentMd(
  sections: Map<string, string>,
  destination: string,
  migratedPaths: string[],
): Promise<void> {
  const header = await writeBriefFromTemplate(
    "brief/technical/development.md",
    destination,
    migratedPaths,
  );
  const bodyParts: string[] = [];

  for (const title of sections.keys()) {
    if (DEVELOPMENT_SECTIONS.has(title)) {
      appendSection(sections, title, bodyParts);
    }
  }

  if (bodyParts.length > 0) {
    const merged = `${header.trim()}\n\n${bodyParts.join("\n\n---\n\n")}\n`;
    await writeFile(destination, merged, "utf8");
  }
}

async function buildModelingMd(
  sections: Map<string, string>,
  destination: string,
  migratedPaths: string[],
): Promise<void> {
  const header = await writeBriefFromTemplate(
    "brief/technical/modeling.md",
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

async function buildStackFile(
  sections: Map<string, string>,
  stackKey: string,
  templateRelativePath: string,
  destination: string,
  migratedPaths: string[],
): Promise<void> {
  const header = await writeBriefFromTemplate(
    templateRelativePath,
    destination,
    migratedPaths,
  );
  const bodyParts: string[] = [];

  for (const [title, stackFile] of Object.entries(STACK_SECTION_MAP)) {
    if (stackFile !== stackKey) {
      continue;
    }

    appendSection(sections, title, bodyParts);
  }

  if (bodyParts.length > 0) {
    const merged = `${header.trim()}\n\n${bodyParts.join("\n\n---\n\n")}\n`;
    await writeFile(destination, merged, "utf8");
  }
}

export async function migrateWorkspace(
  options: MigrateWorkspaceOptions,
): Promise<MigrateWorkspaceResult> {
  const workspaceDir = join(options.targetDir, SDD_WORKSPACE_DIR);
  const markerPath = join(options.targetDir, SDD_WORKSPACE_MARKER_PATH);
  const legacyMarkerPath = join(options.targetDir, SDD_WORKSPACE_LEGACY_MARKER_PATH);
  const migratedPaths: string[] = [];
  const removedPaths: string[] = [];

  if (existsSync(markerPath)) {
    return {
      workspaceDir,
      migratedPaths: [],
      removedPaths: [],
      alreadyMigrated: true,
    };
  }

  if (!existsSync(legacyMarkerPath)) {
    throw new Error(
      "No legacy SDD workspace found. Run `sdd-studio init` to create a new project.",
    );
  }

  await ensureDir(join(workspaceDir, "brief/business"));
  await ensureDir(join(workspaceDir, "brief/technical/stack"));
  await ensureDir(join(workspaceDir, "spec/business"));
  await ensureDir(join(workspaceDir, "spec/technical/architecture"));
  await ensureDir(join(workspaceDir, "spec/technical/database"));

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
    await moveSpecCategory(workspaceDir, category, "technical", migratedPaths);
  }

  const projectContent = await readFile(legacyMarkerPath, "utf8");
  const sections = parseMarkdownSections(projectContent);

  const developmentPath = join(workspaceDir, "brief/technical/development.md");
  const modelingPath = join(workspaceDir, "brief/technical/modeling.md");
  const stackDir = join(workspaceDir, "brief/technical/stack");

  await buildDevelopmentMd(sections, developmentPath, migratedPaths);
  await buildModelingMd(sections, modelingPath, migratedPaths);

  for (const stackKey of [
    "frontend",
    "backend",
    "database",
    "infrastructure",
    "ai",
  ] as const) {
    await buildStackFile(
      sections,
      stackKey,
      `brief/technical/stack/${stackKey}.md`,
      join(stackDir, `${stackKey}.md`),
      migratedPaths,
    );
  }

  await rm(legacyMarkerPath);
  removedPaths.push(legacyMarkerPath);

  return {
    workspaceDir,
    migratedPaths,
    removedPaths,
    alreadyMigrated: false,
  };
}

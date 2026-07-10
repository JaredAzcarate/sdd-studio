import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  bumpMinorVersion,
  createDefaultManifest,
  DEFAULT_INITIAL_VERSION,
  getManifestPath,
  readManifest,
  writeManifest,
  type BriefManifest,
} from "./manifest.js";
import {
  resolveTechnicalBriefDirFromManifest,
} from "./brief-paths.js";

const TECHNICAL_BRIEF_FILES = [
  "engineering-principles.md",
  "engineering-decisions.md",
  "engineering-conventions.md",
  "engineering-frontend-patterns.md",
  "engineering-backend-patterns.md",
  "engineering-contribution-patterns.md",
  "engineering-stack.md",
] as const;

export type PrepareTechnicalTargetResult = {
  manifest: BriefManifest;
  targetVersion: string;
  targetDir: string;
};

export type CreateTechnicalTargetResult = PrepareTechnicalTargetResult & {
  copiedFiles: string[];
};

export type FinalizeTechnicalTargetResult = {
  copiedFiles: string[];
};

export async function prepareTechnicalTargetVersion(
  workspaceDir: string,
): Promise<PrepareTechnicalTargetResult> {
  const manifest = await readManifest(workspaceDir);

  if (!manifest) {
    throw new Error(
      "Missing brief manifest. Run Migrate to create versioned brief layout first.",
    );
  }

  let targetVersion = manifest.technical.target;

  if (targetVersion === null) {
    targetVersion = bumpMinorVersion(manifest.technical.current);
  }

  const targetDir = resolveTechnicalBriefDirFromManifest(
    workspaceDir,
    "target",
    {
      ...manifest,
      technical: { ...manifest.technical, target: targetVersion },
    },
  );

  await mkdir(targetDir, { recursive: true });

  const updatedManifest: BriefManifest = {
    ...manifest,
    technical: {
      ...manifest.technical,
      target: targetVersion,
    },
  };

  await writeManifest(workspaceDir, updatedManifest);

  return {
    manifest: updatedManifest,
    targetVersion,
    targetDir,
  };
}

export async function finalizeTechnicalTargetVersion(
  workspaceDir: string,
  modifiedFileNames: readonly string[] = [],
): Promise<FinalizeTechnicalTargetResult> {
  const manifest = await readManifest(workspaceDir);

  if (!manifest) {
    throw new Error(
      "Missing brief manifest. Run Migrate to create versioned brief layout first.",
    );
  }

  if (manifest.technical.target === null) {
    throw new Error("No technical target version to finalize.");
  }

  const currentDir = resolveTechnicalBriefDirFromManifest(
    workspaceDir,
    "current",
    manifest,
  );
  const targetDir = resolveTechnicalBriefDirFromManifest(
    workspaceDir,
    "target",
    manifest,
  );
  const modified = new Set(modifiedFileNames);
  const copiedFiles: string[] = [];

  for (const fileName of TECHNICAL_BRIEF_FILES) {
    if (modified.has(fileName)) {
      continue;
    }

    const destinationPath = join(targetDir, fileName);
    if (existsSync(destinationPath)) {
      continue;
    }

    const sourcePath = join(currentDir, fileName);
    if (!existsSync(sourcePath)) {
      continue;
    }

    await copyFile(sourcePath, destinationPath);
    copiedFiles.push(destinationPath);
  }

  return { copiedFiles };
}

/** @deprecated Prefer prepareTechnicalTargetVersion + finalizeTechnicalTargetVersion */
export async function createTechnicalTargetVersion(
  workspaceDir: string,
  options: { files?: readonly string[] } = {},
): Promise<CreateTechnicalTargetResult> {
  const prepared = await prepareTechnicalTargetVersion(workspaceDir);
  const manifest = prepared.manifest;
  const currentDir = resolveTechnicalBriefDirFromManifest(
    workspaceDir,
    "current",
    manifest,
  );

  const filesToCopy =
    options.files && options.files.length > 0
      ? options.files
      : TECHNICAL_BRIEF_FILES.filter((fileName) =>
          existsSync(join(currentDir, fileName)),
        );

  const copiedFiles: string[] = [];

  for (const fileName of filesToCopy) {
    const sourcePath = join(currentDir, fileName);
    const destinationPath = join(prepared.targetDir, fileName);

    if (!existsSync(sourcePath)) {
      continue;
    }

    await copyFile(sourcePath, destinationPath);
    copiedFiles.push(destinationPath);
  }

  return {
    ...prepared,
    copiedFiles,
  };
}

export type PromoteTechnicalTargetResult = {
  manifest: BriefManifest;
  previousCurrent: string;
  newCurrent: string;
};

export async function promoteTechnicalTarget(
  workspaceDir: string,
): Promise<PromoteTechnicalTargetResult> {
  const manifest = await readManifest(workspaceDir);

  if (!manifest) {
    throw new Error("Missing brief manifest.");
  }

  if (manifest.technical.target === null) {
    throw new Error("No technical target version to promote.");
  }

  const previousCurrent = manifest.technical.current;
  const newCurrent = manifest.technical.target;

  const updatedManifest: BriefManifest = {
    ...manifest,
    technical: {
      current: newCurrent,
      target: null,
      archived: [...manifest.technical.archived, previousCurrent],
    },
    spec: {
      aligned_with: {
        ...manifest.spec.aligned_with,
        technical: newCurrent,
      },
    },
  };

  await writeManifest(workspaceDir, updatedManifest);

  return {
    manifest: updatedManifest,
    previousCurrent,
    newCurrent,
  };
}

export async function migrateFlatBriefToVersioned(
  workspaceDir: string,
): Promise<{ manifestPath: string; version: string }> {
  const manifestPath = getManifestPath(workspaceDir);

  if (existsSync(manifestPath)) {
    return { manifestPath, version: DEFAULT_INITIAL_VERSION };
  }

  const version = DEFAULT_INITIAL_VERSION;
  const businessVersionDir = join(workspaceDir, "brief/business", version);
  const technicalVersionDir = join(workspaceDir, "brief/technical", version);
  const flatBusinessDir = join(workspaceDir, "brief/business");
  const flatTechnicalDir = join(workspaceDir, "brief/technical");

  await mkdir(businessVersionDir, { recursive: true });
  await mkdir(technicalVersionDir, { recursive: true });

  const businessFiles = existsSync(flatBusinessDir)
    ? (await readdir(flatBusinessDir)).filter((name) => name.endsWith(".md"))
    : [];

  for (const fileName of businessFiles) {
    const source = join(flatBusinessDir, fileName);
    const destination = join(businessVersionDir, fileName);
    if (existsSync(source)) {
      await copyFile(source, destination);
    }
  }

  const modelingPath = join(flatTechnicalDir, "engineering-modeling.md");
  const archivedDir = join(flatTechnicalDir, ".archived");

  if (existsSync(modelingPath)) {
    await mkdir(archivedDir, { recursive: true });
    const archivedDestination = join(archivedDir, "engineering-modeling.md");
    const modelingContent = await readFile(modelingPath, "utf8");
    await writeFile(archivedDestination, modelingContent, "utf8");
  }

  const technicalFiles = existsSync(flatTechnicalDir)
    ? (await readdir(flatTechnicalDir)).filter(
        (name) =>
          name.endsWith(".md") &&
          name !== "engineering-modeling.md" &&
          !name.startsWith("."),
      )
    : [];

  for (const fileName of technicalFiles) {
    const source = join(flatTechnicalDir, fileName);
    const destination = join(technicalVersionDir, fileName);
    if (existsSync(source)) {
      await copyFile(source, destination);
    }
  }

  await writeManifest(workspaceDir, createDefaultManifest(version));

  return { manifestPath, version };
}

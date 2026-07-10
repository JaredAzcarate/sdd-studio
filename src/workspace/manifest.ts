import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export const BRIEF_MANIFEST_RELATIVE_PATH = "brief/manifest.yaml";

const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;
export const DEFAULT_INITIAL_VERSION = "0.1.0";

export function bumpMinorVersion(version: string): string {
  validateVersionString(version, "version");
  const [major, minor] = version.split(".").map(Number);
  return `${major}.${minor + 1}.0`;
}

export type BriefPointer = "current" | "target";

export type BriefLane = "business" | "technical";

export type SpecAlignment = {
  business: string;
  technical: string;
};

export type BusinessLane = {
  current: string;
  target: string | null;
  archived: string[];
};

export type TechnicalLane = {
  current: string;
  target: string | null;
  archived: string[];
};

export type BriefManifest = {
  schema: 1;
  business: BusinessLane;
  technical: TechnicalLane;
  spec: {
    aligned_with: SpecAlignment;
  };
};

export class ManifestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ManifestValidationError";
  }
}

function assertRecord(
  value: unknown,
  fieldPath: string,
): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ManifestValidationError(`${fieldPath} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function validateVersionString(value: unknown, fieldPath: string): string {
  if (typeof value !== "string" || !SEMVER_PATTERN.test(value)) {
    throw new ManifestValidationError(
      `${fieldPath} must be a full semver string (x.y.z).`,
    );
  }

  return value;
}

function validateNullableVersion(
  value: unknown,
  fieldPath: string,
): string | null {
  if (value === null) {
    return null;
  }

  return validateVersionString(value, fieldPath);
}

function validateVersionList(value: unknown, fieldPath: string): string[] {
  if (!Array.isArray(value)) {
    throw new ManifestValidationError(`${fieldPath} must be an array.`);
  }

  return value.map((item, index) =>
    validateVersionString(item, `${fieldPath}[${index}]`),
  );
}

function validateLane(
  value: unknown,
  fieldPath: string,
): BusinessLane | TechnicalLane {
  const lane = assertRecord(value, fieldPath);

  return {
    current: validateVersionString(lane.current, `${fieldPath}.current`),
    target: validateNullableVersion(lane.target, `${fieldPath}.target`),
    archived: validateVersionList(lane.archived, `${fieldPath}.archived`),
  };
}

export function validateManifest(value: unknown): BriefManifest {
  const manifest = assertRecord(value, "manifest");

  if (manifest.schema !== 1) {
    throw new ManifestValidationError('manifest.schema must be 1.');
  }

  const spec = assertRecord(manifest.spec, "manifest.spec");
  const alignedWith = assertRecord(
    spec.aligned_with,
    "manifest.spec.aligned_with",
  );

  return {
    schema: 1,
    business: validateLane(manifest.business, "manifest.business") as BusinessLane,
    technical: validateLane(
      manifest.technical,
      "manifest.technical",
    ) as TechnicalLane,
    spec: {
      aligned_with: {
        business: validateVersionString(
          alignedWith.business,
          "manifest.spec.aligned_with.business",
        ),
        technical: validateVersionString(
          alignedWith.technical,
          "manifest.spec.aligned_with.technical",
        ),
      },
    },
  };
}

export function createDefaultManifest(
  initialVersion: string = DEFAULT_INITIAL_VERSION,
): BriefManifest {
  validateVersionString(initialVersion, "initialVersion");

  return {
    schema: 1,
    business: {
      current: initialVersion,
      target: null,
      archived: [],
    },
    technical: {
      current: initialVersion,
      target: null,
      archived: [],
    },
    spec: {
      aligned_with: {
        business: initialVersion,
        technical: initialVersion,
      },
    },
  };
}

export function getManifestPath(workspaceDir: string): string {
  return join(workspaceDir, BRIEF_MANIFEST_RELATIVE_PATH);
}

/**
 * Returns null when manifest.yaml is missing.
 * Callers that need versioned paths should use brief-paths helpers, which throw
 * with a clear message. Legacy workspaces without manifest.yaml but with flat
 * brief/business/ or brief/technical/ files are detected via isFlatBriefLayout().
 */
export async function readManifest(
  workspaceDir: string,
): Promise<BriefManifest | null> {
  const manifestPath = getManifestPath(workspaceDir);

  if (!existsSync(manifestPath)) {
    return null;
  }

  const raw = await readFile(manifestPath, "utf8");
  const parsed = parseYaml(raw);

  return validateManifest(parsed);
}

export async function writeManifest(
  workspaceDir: string,
  manifest: BriefManifest,
): Promise<string> {
  const validated = validateManifest(manifest);
  const manifestPath = getManifestPath(workspaceDir);
  await mkdir(dirname(manifestPath), { recursive: true });
  const content = stringifyYaml(validated, {
    indent: 2,
    lineWidth: 0,
  }).trimEnd();

  await writeFile(manifestPath, `${content}\n`, "utf8");

  return manifestPath;
}

export function isFlatBriefLayout(workspaceDir: string): boolean {
  const manifestPath = getManifestPath(workspaceDir);

  if (existsSync(manifestPath)) {
    return false;
  }

  const flatBusinessMarker = join(
    workspaceDir,
    "brief/business/product-principles.md",
  );
  const flatTechnicalMarker = join(
    workspaceDir,
    "brief/technical/engineering-principles.md",
  );

  return existsSync(flatBusinessMarker) || existsSync(flatTechnicalMarker);
}

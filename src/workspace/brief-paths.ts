import { join } from "node:path";
import {
  BRIEF_MANIFEST_RELATIVE_PATH,
  type BriefLane,
  type BriefManifest,
  type BriefPointer,
  type BusinessLane,
  type TechnicalLane,
  isFlatBriefLayout,
  readManifest,
} from "./manifest.js";

export const BRIEF_BUSINESS_SUBDIR = "brief/business";
export const BRIEF_TECHNICAL_SUBDIR = "brief/technical";

export class BriefPathResolutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BriefPathResolutionError";
  }
}

function resolveLaneVersion(
  lane: BusinessLane | TechnicalLane,
  laneName: BriefLane,
  pointer: BriefPointer,
): string {
  if (pointer === "current") {
    return lane.current;
  }

  if (lane.target === null) {
    throw new BriefPathResolutionError(
      `${laneName}.target is null; cannot resolve pointer "target".`,
    );
  }

  return lane.target;
}

async function loadManifestOrThrow(
  workspaceDir: string,
): Promise<BriefManifest> {
  const manifest = await readManifest(workspaceDir);

  if (manifest) {
    return manifest;
  }

  if (isFlatBriefLayout(workspaceDir)) {
    throw new BriefPathResolutionError(
      `Brief uses legacy flat layout without ${BRIEF_MANIFEST_RELATIVE_PATH}. Migrate to versioned brief first.`,
    );
  }

  throw new BriefPathResolutionError(
    `Missing manifest at ${join(workspaceDir, BRIEF_MANIFEST_RELATIVE_PATH)}.`,
  );
}

export function resolveBusinessBriefDirFromManifest(
  workspaceDir: string,
  pointer: BriefPointer,
  manifest: BriefManifest,
): string {
  const version = resolveLaneVersion(manifest.business, "business", pointer);
  return join(workspaceDir, BRIEF_BUSINESS_SUBDIR, version);
}

export function resolveTechnicalBriefDirFromManifest(
  workspaceDir: string,
  pointer: BriefPointer,
  manifest: BriefManifest,
): string {
  const version = resolveLaneVersion(manifest.technical, "technical", pointer);
  return join(workspaceDir, BRIEF_TECHNICAL_SUBDIR, version);
}

export async function resolveBusinessBriefDir(
  workspaceDir: string,
  pointer: BriefPointer,
): Promise<string> {
  const manifest = await loadManifestOrThrow(workspaceDir);
  return resolveBusinessBriefDirFromManifest(workspaceDir, pointer, manifest);
}

export async function resolveTechnicalBriefDir(
  workspaceDir: string,
  pointer: BriefPointer,
): Promise<string> {
  const manifest = await loadManifestOrThrow(workspaceDir);
  return resolveTechnicalBriefDirFromManifest(workspaceDir, pointer, manifest);
}

export function resolveBriefFilePathFromManifest(
  workspaceDir: string,
  lane: BriefLane,
  pointer: BriefPointer,
  filename: string,
  manifest: BriefManifest,
): string {
  const laneDir =
    lane === "business"
      ? resolveBusinessBriefDirFromManifest(workspaceDir, pointer, manifest)
      : resolveTechnicalBriefDirFromManifest(workspaceDir, pointer, manifest);

  return join(laneDir, filename);
}

export async function resolveBriefFilePath(
  workspaceDir: string,
  lane: BriefLane,
  pointer: BriefPointer,
  filename: string,
): Promise<string> {
  const manifest = await loadManifestOrThrow(workspaceDir);
  return resolveBriefFilePathFromManifest(
    workspaceDir,
    lane,
    pointer,
    filename,
    manifest,
  );
}

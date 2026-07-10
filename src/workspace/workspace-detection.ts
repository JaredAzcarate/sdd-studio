import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  SDD_WORKSPACE_DIR,
  SDD_WORKSPACE_LEGACY_MARKER_PATH,
  SDD_WORKSPACE_MANIFEST_PATH,
  SDD_WORKSPACE_MARKER_PATH,
} from "../constants/sdd-workspace-path.js";
import {
  resolveTechnicalBriefDir,
  resolveTechnicalBriefDirFromManifest,
} from "./brief-paths.js";
import { isFlatBriefLayout, readManifest } from "./manifest.js";

const WORKSPACE_MARKER_PATHS = [
  SDD_WORKSPACE_MANIFEST_PATH,
  SDD_WORKSPACE_MARKER_PATH,
  SDD_WORKSPACE_LEGACY_MARKER_PATH,
] as const;

export function getWorkspaceDir(targetDir: string): string {
  return join(targetDir, SDD_WORKSPACE_DIR);
}

export function hasSddWorkspace(targetDir: string): boolean {
  return WORKSPACE_MARKER_PATHS.some((markerPath) =>
    existsSync(join(targetDir, markerPath)),
  );
}

export function needsBriefVersioningMigration(targetDir: string): boolean {
  const workspaceDir = getWorkspaceDir(targetDir);
  return isFlatBriefLayout(workspaceDir);
}

export async function resolveWorkspaceTechnicalBriefDir(
  targetDir: string,
  pointer: "current" | "target" = "current",
): Promise<string> {
  const workspaceDir = getWorkspaceDir(targetDir);
  const manifest = await readManifest(workspaceDir);

  if (manifest) {
    return resolveTechnicalBriefDirFromManifest(
      workspaceDir,
      pointer,
      manifest,
    );
  }

  return join(workspaceDir, "brief", "technical");
}

export async function tryResolveWorkspaceTechnicalBriefDir(
  targetDir: string,
  pointer: "current" | "target" = "current",
): Promise<string | null> {
  try {
    return await resolveTechnicalBriefDir(
      getWorkspaceDir(targetDir),
      pointer,
    );
  } catch {
    if (needsBriefVersioningMigration(targetDir)) {
      return join(getWorkspaceDir(targetDir), "brief", "technical");
    }

    return null;
  }
}

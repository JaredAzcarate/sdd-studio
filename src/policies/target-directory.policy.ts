import { existsSync } from "node:fs";
import { join } from "node:path";
import { stdin } from "node:process";
import { getAssistantLayout, getAssistantSkillMarkers } from "../assistants/assistant-layout.js";
import {
  SDD_WORKSPACE_DIR,
  SDD_WORKSPACE_LEGACY_MARKER_PATH,
  SDD_WORKSPACE_MARKER_PATH,
} from "../constants/sdd-workspace-path.js";
import type { AssistantId } from "../types/init-context.js";

const WORKSPACE_MARKER_PATHS = [
  SDD_WORKSPACE_MARKER_PATH,
  SDD_WORKSPACE_LEGACY_MARKER_PATH,
];

function hasSddWorkspace(targetDir: string): boolean {
  return WORKSPACE_MARKER_PATHS.some((markerPath) =>
    existsSync(join(targetDir, markerPath)),
  );
}

export function assertInteractiveTerminal(): void {
  if (!stdin.isTTY) {
    throw new Error(
      "An interactive terminal is required. Use --yes to skip prompts.",
    );
  }
}

export function assertTargetDirectoryAvailable(targetDir: string): void {
  if (hasSddWorkspace(targetDir)) {
    throw new Error(
      `An SDD project already exists in ${targetDir}. Remove ${SDD_WORKSPACE_DIR}/ or use another directory.`,
    );
  }
}

export function assertSyncTargetEligible(
  targetDir: string,
  assistantId?: AssistantId,
): void {
  if (hasSddWorkspace(targetDir)) {
    return;
  }

  const markers = assistantId
    ? [getAssistantLayout(assistantId).skillsMarker]
    : getAssistantSkillMarkers();

  const hasAssistantSkills = markers.some((marker) =>
    existsSync(join(targetDir, marker)),
  );

  if (!hasAssistantSkills) {
    throw new Error(
      "No SDD project found. Run `sdd-studio init` first.",
    );
  }
}

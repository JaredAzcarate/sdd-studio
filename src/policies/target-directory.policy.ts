import { existsSync } from "node:fs";
import { join } from "node:path";
import { stdin } from "node:process";

const WORKSPACE_MARKER_PATH = join("workspace", "spec", "vision.md");

export function assertInteractiveTerminal(): void {
  if (!stdin.isTTY) {
    throw new Error(
      "An interactive terminal is required. Use --yes to skip prompts.",
    );
  }
}

export function assertTargetDirectoryAvailable(targetDir: string): void {
  const markerPath = join(targetDir, WORKSPACE_MARKER_PATH);

  if (existsSync(markerPath)) {
    throw new Error(
      `An SDD project already exists in ${targetDir}. Remove workspace/ or use another directory.`,
    );
  }
}

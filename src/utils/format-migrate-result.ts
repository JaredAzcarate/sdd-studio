import { relative } from "node:path";
import type { MigrateWorkspaceResult } from "../generators/migrate-workspace.generator.js";
import { SDD_WORKSPACE_DIR } from "../constants/sdd-workspace-path.js";

export function formatMigrateResult(
  targetDir: string,
  result: MigrateWorkspaceResult,
): string {
  if (result.alreadyMigrated) {
    return [
      "SDD workspace already uses the Brief / Specification structure.",
      "",
      `Marker: ${SDD_WORKSPACE_DIR}/brief/technical/development.md`,
    ].join("\n");
  }

  const migrated = result.migratedPaths
    .map((filePath) => relative(targetDir, filePath))
    .sort();

  const lines = [
    "SDD workspace migrated successfully.",
    "",
    "New structure:",
    `  ${SDD_WORKSPACE_DIR}/brief/business/`,
    `  ${SDD_WORKSPACE_DIR}/brief/technical/`,
    `  ${SDD_WORKSPACE_DIR}/spec/business/`,
    `  ${SDD_WORKSPACE_DIR}/spec/technical/`,
    "",
    `Migrated paths: ${migrated.length}`,
  ];

  if (result.removedPaths.length > 0) {
    lines.push(
      "",
      "Removed legacy files:",
      ...result.removedPaths.map((filePath) => `  ${relative(targetDir, filePath)}`),
    );
  }

  lines.push(
    "",
    "Next step: run **sdd-idea** to review the Brief, then **sdd-spec** if needed.",
  );

  return lines.join("\n");
}

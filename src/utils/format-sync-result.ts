import { relative } from "node:path";
import { getAssistantLayout } from "../assistants/assistant-layout.js";
import { SDD_WORKSPACE_DIR } from "../constants/sdd-workspace-path.js";
import type {
  AssistantInstallResult,
  AssistantSyncScope,
} from "../assistants/assistant.strategy.js";
import type { AssistantId } from "../types/init-context.js";

export function formatSyncResult(
  targetDir: string,
  assistantId: AssistantId,
  scope: AssistantSyncScope,
  result: AssistantInstallResult,
): string {
  const relativePaths = result.createdPaths
    .map((filePath) => relative(targetDir, filePath))
    .sort();

  const layout = getAssistantLayout(assistantId);
  const updatedPaths =
    scope === "skills" ? layout.syncLabels.skills : layout.syncLabels.all;

  const lines = [
    "SDD assistant files synced successfully.",
    "",
    scope === "skills" ? "Updated skills:" : "Updated:",
    ...updatedPaths,
    "",
    `Total files: ${relativePaths.length}`,
    "",
    `Your ${SDD_WORKSPACE_DIR}/ files were not modified.`,
  ];

  if (result.message) {
    lines.push("", result.message);
  }

  return lines.join("\n");
}

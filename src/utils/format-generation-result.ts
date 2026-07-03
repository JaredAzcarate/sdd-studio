import { relative } from "node:path";
import { getAssistantLayout } from "../assistants/assistant-layout.js";
import { SDD_WORKSPACE_DIR } from "../constants/sdd-workspace-path.js";
import type { AssistantId } from "../types/init-context.js";
import type { InitWorkspaceResult } from "../use-cases/init-workspace.use-case.js";

export function formatGenerationResult(
  targetDir: string,
  assistantId: AssistantId,
  result: InitWorkspaceResult,
): string {
  const relativePaths = result.createdPaths
    .map((filePath) => relative(targetDir, filePath))
    .sort();

  const layout = getAssistantLayout(assistantId);

  const lines = [
    "SDD project generated successfully.",
    "",
    "Main structure:",
    `  ${SDD_WORKSPACE_DIR}/project.md`,
    `  ${SDD_WORKSPACE_DIR}/product-guide.md`,
    `  ${SDD_WORKSPACE_DIR}/spec/`,
    `  ${SDD_WORKSPACE_DIR}/workflow/releases/release-001/`,
  ];

  if (result.assistant.installed) {
    if (layout.installedPaths.instructions) {
      lines.push(`  ${layout.installedPaths.instructions}`);
    }
    if (layout.installedPaths.rules) {
      lines.push(`  ${layout.installedPaths.rules}`);
    }
    for (const skill of layout.skillNames) {
      lines.push(`  ${layout.installedPaths.skills}${skill}/`);
    }
  }

  lines.push("", `Total files: ${relativePaths.length}`);

  if (result.assistant.message) {
    lines.push("", result.assistant.message);
  }

  if (result.assistant.installed) {
    lines.push(
      "",
      `Next step: run the **sdd-idea** skill in ${layout.nextStepLabel}.`,
    );
  }

  return lines.join("\n");
}

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
  const isFoundationOnly = !result.modules.spec && !result.modules.workflow;

  const lines = [
    isFoundationOnly
      ? "SDD foundation generated successfully."
      : "SDD project generated successfully.",
    "",
    "Main structure:",
    `  ${SDD_WORKSPACE_DIR}/brief/business/`,
    `  ${SDD_WORKSPACE_DIR}/brief/technical/`,
  ];

  if (result.modules.spec) {
    lines.push(
      `  ${SDD_WORKSPACE_DIR}/spec/business/`,
      `  ${SDD_WORKSPACE_DIR}/spec/technical/`,
    );
  }

  if (result.modules.workflow) {
    lines.push(`  ${SDD_WORKSPACE_DIR}/workflow/releases/release-001/`);
  }

  if (result.assistant.installed) {
    if (layout.installedPaths.instructions) {
      lines.push(`  ${layout.installedPaths.instructions}`);
    }
    if (layout.installedPaths.rules) {
      lines.push(`  ${layout.installedPaths.rules}`);
    }

    if (layout.skillFormat === "copilot") {
      for (const skill of layout.skillNames) {
        const agentFile = layout.skillAgentFiles?.[skill];
        const promptFile = layout.skillPromptFiles?.[skill];
        if (agentFile && layout.installedPaths.agents) {
          lines.push(`  ${layout.installedPaths.agents}${agentFile}`);
        }
        if (promptFile && layout.installedPaths.prompts) {
          lines.push(`  ${layout.installedPaths.prompts}${promptFile}`);
        }
      }
    } else if (layout.skillFormat === "command-file") {
      for (const skill of layout.skillNames) {
        const commandFile = layout.skillCommandFiles?.[skill];
        if (commandFile) {
          lines.push(`  ${layout.installedPaths.skills}${commandFile}`);
        }
      }
    } else {
      for (const skill of layout.skillNames) {
        lines.push(`  ${layout.installedPaths.skills}${skill}/`);
      }
    }
  }

  lines.push("", `Total files: ${relativePaths.length}`);

  if (result.assistant.message) {
    lines.push("", result.assistant.message);
  }

  if (result.assistant.installed) {
    lines.push(
      "",
      `Next step: run **sdd-studio configure** or the **sdd-idea** skill in ${layout.nextStepLabel}.`,
    );

    if (!result.modules.spec) {
      lines.push(
        "Spec scaffold: not created. Use **Create spec scaffold** in the TUI before **sdd-spec**.",
      );
    }
  }

  return lines.join("\n");
}

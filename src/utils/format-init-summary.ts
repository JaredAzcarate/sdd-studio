import { getAssistantLayout } from "../assistants/assistant-layout.js";
import type { InitWorkspaceResult } from "../use-cases/init-workspace.use-case.js";
import type { InitContextWithLabels } from "../types/init-context.js";

export function formatInitSummary(
  context: InitContextWithLabels,
  result?: InitWorkspaceResult,
): string {
  const lines = [
    "Configuration summary",
    "─────────────────────",
    `Directory:         ${context.targetDir}`,
    `Assistant:         ${context.labels.assistant}`,
    `Workflow module:   ${context.modules.workflow ? "enabled" : "disabled"}`,
  ];

  if (result?.assistant.installed) {
    const layout = getAssistantLayout(context.assistant);
    lines.push(
      "",
      `Next step: run the **sdd-idea** skill to complete product-principles.md, product-guide.md, and project.md in ${layout.nextStepLabel}.`,
    );
  } else if (result?.assistant.message) {
    lines.push("", result.assistant.message);
  }

  return lines.join("\n");
}

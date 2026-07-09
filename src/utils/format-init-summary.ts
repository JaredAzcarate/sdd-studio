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
    `Engineering Brief: ${
      context.engineering
        ? "configured"
        : result?.engineering
          ? "configured"
          : "stubs only (run sdd-studio configure)"
    }`,
  ];

  if (result?.assistant.installed) {
    const layout = getAssistantLayout(context.assistant);
    const engineeringReady =
      context.engineering || result.engineering;
    const nextSkill = engineeringReady
      ? "**sdd-idea** for the Business Brief, then **sdd-technical** to generate engineering-stack.md"
      : "**sdd-studio configure** to complete the Engineering Brief (or start with **sdd-idea** if you prefer defining the product first)";
    lines.push(
      "",
      `Next step: run ${nextSkill} in ${layout.nextStepLabel}.`,
    );
  } else if (result?.assistant.message) {
    lines.push("", result.assistant.message);
  }

  return lines.join("\n");
}

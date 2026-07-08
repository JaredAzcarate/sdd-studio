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
    const nextSkill = context.engineering || result.engineering
      ? "**sdd-technical** to generate engineering-stack.md, then **sdd-idea** for the Business Brief"
      : "**sdd-studio configure** (or **sdd-idea**) to complete the Brief under .workspace/brief/";
    lines.push(
      "",
      `Next step: run ${nextSkill} in ${layout.nextStepLabel}.`,
    );
  } else if (result?.assistant.message) {
    lines.push("", result.assistant.message);
  }

  return lines.join("\n");
}

export type FormatWorkflowResultOptions = {
  workflowConfigPath?: string;
};

export function formatWorkflowConfigureSummary(
  options: FormatWorkflowResultOptions = {},
): string[] {
  const configPath =
    options.workflowConfigPath ?? ".workspace/workflow/workflow-config.md";

  return [
    "Workflow configured",
    "───────────────────",
    "",
    "Updated files:",
    `  ${configPath}`,
    "",
    "Next step: run **sdd-spec** if specification is not complete, then **sdd-plan** to generate roadmaps and releases.",
  ];
}

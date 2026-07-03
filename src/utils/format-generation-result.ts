import { relative } from "node:path";
import type { InitWorkspaceResult } from "../use-cases/init-workspace.use-case.js";

export function formatGenerationResult(
  targetDir: string,
  result: InitWorkspaceResult,
): string {
  const relativePaths = result.createdPaths
    .map((filePath) => relative(targetDir, filePath))
    .sort();

  const lines = [
    "SDD project generated successfully.",
    "",
    "Main structure:",
    "  workspace/spec/vision.md",
    "  workspace/spec/",
    "  workspace/workflow/releases/release-001/",
  ];

  if (result.assistant.installed) {
    lines.push(
      "  .cursor/rules/sdd-studio.mdc",
      "  .cursor/skills/sdd-idea/",
      "  .cursor/skills/sdd-spec/",
      "  .cursor/skills/sdd-review/",
      "  .cursor/skills/sdd-plan/",
    );
  }

  lines.push("", `Total files: ${relativePaths.length}`);

  if (result.assistant.message) {
    lines.push("", result.assistant.message);
  }

  if (result.assistant.installed) {
    lines.push("", "Next step: run the **sdd-idea** skill in Cursor.");
  }

  return lines.join("\n");
}

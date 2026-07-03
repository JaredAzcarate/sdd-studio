import { relative } from "node:path";
import type {
  AssistantInstallResult,
  AssistantSyncScope,
} from "../assistants/assistant.strategy.js";

export function formatSyncResult(
  targetDir: string,
  scope: AssistantSyncScope,
  result: AssistantInstallResult,
): string {
  const relativePaths = result.createdPaths
    .map((filePath) => relative(targetDir, filePath))
    .sort();

  const updatedPaths =
    scope === "skills"
      ? [
          "  .cursor/skills/sdd-idea/",
          "  .cursor/skills/sdd-generate/",
          "  .cursor/skills/sdd-spec/",
          "  .cursor/skills/sdd-review/",
          "  .cursor/skills/sdd-plan/",
        ]
      : [
          "  .cursor/rules/sdd-studio.mdc",
          "  .cursor/skills/sdd-idea/",
          "  .cursor/skills/sdd-generate/",
          "  .cursor/skills/sdd-spec/",
          "  .cursor/skills/sdd-review/",
          "  .cursor/skills/sdd-plan/",
        ];

  const lines = [
    "SDD assistant files synced successfully.",
    "",
    scope === "skills" ? "Updated skills:" : "Updated:",
    ...updatedPaths,
    "",
    `Total files: ${relativePaths.length}`,
    "",
    "Your workspace/ files were not modified.",
  ];

  if (result.message) {
    lines.push("", result.message);
  }

  return lines.join("\n");
}

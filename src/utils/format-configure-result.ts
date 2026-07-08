import type { WriteEngineeringBriefResult } from "../engineering-config/generators/write-engineering-brief.js";

export function formatConfigureResult(
  targetDir: string,
  result: WriteEngineeringBriefResult,
): string {
  const relativePaths = result.writtenPaths.map((path) =>
    path.replace(`${targetDir}/`, ""),
  );

  const lines = [
    "Engineering Brief configured",
    "────────────────────────────",
    "",
    "Updated files:",
    ...relativePaths.map((path) => `  ${path}`),
    "",
    "Next step: run the **sdd-technical** skill to generate engineering-stack.md.",
  ];

  return lines.join("\n");
}

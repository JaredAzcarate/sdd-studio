export type FormatSpecScaffoldResultOptions = {
  alreadyExists?: boolean;
  fileCount?: number;
};

export function formatSpecScaffoldResult(
  options: FormatSpecScaffoldResultOptions = {},
): string[] {
  if (options.alreadyExists) {
    return [
      "Spec scaffold already exists",
      "────────────────────────────",
      "",
      "`.workspace/spec/business/` and `.workspace/spec/technical/` are already present.",
      "",
      "Next step: run **sdd-spec** when the Brief and engineering-stack.md are complete.",
    ];
  }

  const fileLine =
    options.fileCount !== undefined
      ? `Created ${options.fileCount} scaffold files under .workspace/spec/.`
      : "Spec scaffold created under .workspace/spec/.";

  return [
    "Spec scaffold created",
    "─────────────────────",
    "",
    fileLine,
    "",
    "Next step: run **sdd-spec** after the Brief and engineering-stack.md are complete.",
  ];
}

export function formatSpecScaffoldError(message: string): string[] {
  return [`Error: ${message}`];
}

export function formatSpecScaffoldMissingWorkspace(): string[] {
  return [
    "No SDD workspace found.",
    "",
    "Run **Create Business & Technical foundation** first (or `sdd-studio init`).",
  ];
}

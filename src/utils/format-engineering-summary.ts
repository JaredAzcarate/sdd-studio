const ENGINEERING_BRIEF_FILES = [
  ".workspace/brief/technical/engineering-principles.md",
  ".workspace/brief/technical/engineering-decisions.md",
  ".workspace/brief/technical/engineering-conventions.md",
  ".workspace/brief/technical/engineering-frontend-patterns.md",
  ".workspace/brief/technical/engineering-backend-patterns.md",
  ".workspace/brief/technical/engineering-contribution-patterns.md",
] as const;

export function formatEngineeringConfigureSummary(): string[] {
  return [
    "Engineering Brief configured",
    "────────────────────────────",
    "",
    "Updated files:",
    ...ENGINEERING_BRIEF_FILES.map((path) => `  ${path}`),
    "",
    "Next step: run **sdd-idea** for the Business Brief, then **sdd-technical** to generate engineering-stack.md.",
    "When the stack is ready: create the spec scaffold (TUI menu or `init --spec`), then run **sdd-spec**.",
  ];
}

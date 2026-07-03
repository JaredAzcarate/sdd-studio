export const WORKSPACE_PATHS = [
  "workspace/spec/vision.md",
  "workspace/spec/domain/.gitkeep",
  "workspace/spec/relations/.gitkeep",
  "workspace/spec/capabilities/.gitkeep",
  "workspace/spec/flows/.gitkeep",
  "workspace/spec/rules/.gitkeep",
  "workspace/spec/security/.gitkeep",
  "workspace/spec/events/.gitkeep",
  "workspace/spec/api/.gitkeep",
  "workspace/spec/ui/.gitkeep",
  "workspace/spec/testing/.gitkeep",
  "workspace/workflow/roadmap/.gitkeep",
  "workspace/workflow/milestones/.gitkeep",
  "workspace/workflow/releases/release-001/release.md",
  "workspace/workflow/releases/release-001/tasks.md",
  "workspace/workflow/releases/release-001/reviews.md",
  "workspace/workflow/releases/release-001/decisions.md",
] as const;

export const CURSOR_PATHS = [
  ".cursor/rules/sdd-studio.mdc",
  ".cursor/skills/sdd-idea/SKILL.md",
  ".cursor/skills/sdd-idea/STANDARDS.md",
  ".cursor/skills/sdd-idea/EXAMPLES.md",
  ".cursor/skills/sdd-spec/SKILL.md",
  ".cursor/skills/sdd-spec/STANDARDS.md",
  ".cursor/skills/sdd-spec/EXAMPLES.md",
  ".cursor/skills/sdd-spec/scripts/validate-spec.mjs",
  ".cursor/skills/sdd-review/SKILL.md",
  ".cursor/skills/sdd-review/STANDARDS.md",
  ".cursor/skills/sdd-review/EXAMPLES.md",
  ".cursor/skills/sdd-review/scripts/validate-spec.mjs",
  ".cursor/skills/sdd-plan/SKILL.md",
  ".cursor/skills/sdd-plan/STANDARDS.md",
  ".cursor/skills/sdd-plan/EXAMPLES.md",
  ".cursor/skills/sdd-plan/scripts/validate-workflow.mjs",
] as const;

export const ALL_CURSOR_INIT_PATHS = [
  ...WORKSPACE_PATHS,
  ...CURSOR_PATHS,
] as const;

export const NPM_PACK_REQUIRED_PATHS = [
  "package.json",
  "bin/sdd-studio.js",
  "dist/cli.js",
  "templates/workspace/spec/vision.md",
  "templates/assistants/cursor/rules/sdd-studio.mdc",
  "templates/assistants/cursor/skills/sdd-idea/SKILL.md",
] as const;

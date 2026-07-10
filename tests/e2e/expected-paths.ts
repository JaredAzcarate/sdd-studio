export const BRIEF_INITIAL_VERSION = "0.1.0";

export const WORKSPACE_FOUNDATION_PATHS = [
  ".workspace/brief/manifest.yaml",
  `.workspace/brief/business/${BRIEF_INITIAL_VERSION}/product-principles.md`,
  `.workspace/brief/business/${BRIEF_INITIAL_VERSION}/product-guide.md`,
  `.workspace/brief/technical/${BRIEF_INITIAL_VERSION}/engineering-principles.md`,
  `.workspace/brief/technical/${BRIEF_INITIAL_VERSION}/engineering-decisions.md`,
  `.workspace/brief/technical/${BRIEF_INITIAL_VERSION}/engineering-conventions.md`,
  `.workspace/brief/technical/${BRIEF_INITIAL_VERSION}/engineering-frontend-patterns.md`,
  `.workspace/brief/technical/${BRIEF_INITIAL_VERSION}/engineering-backend-patterns.md`,
  `.workspace/brief/technical/${BRIEF_INITIAL_VERSION}/engineering-contribution-patterns.md`,
] as const;

export const WORKSPACE_SPEC_PATHS = [
  ".workspace/spec/business/domain/.gitkeep",
  ".workspace/spec/business/relations/.gitkeep",
  ".workspace/spec/business/capabilities/.gitkeep",
  ".workspace/spec/business/flows/.gitkeep",
  ".workspace/spec/business/rules/.gitkeep",
  ".workspace/spec/business/security/.gitkeep",
  ".workspace/spec/business/events/.gitkeep",
  ".workspace/spec/business/decisions/.gitkeep",
  ".workspace/spec/technical/api/.gitkeep",
  ".workspace/spec/technical/ui/.gitkeep",
  ".workspace/spec/technical/testing/.gitkeep",
  ".workspace/spec/technical/architecture/.gitkeep",
  ".workspace/spec/technical/database/.gitkeep",
] as const;

export const WORKSPACE_BASE_PATHS = [
  ...WORKSPACE_FOUNDATION_PATHS,
  ...WORKSPACE_SPEC_PATHS,
] as const;

export const WORKFLOW_PATHS = [
  ".workspace/workflow/roadmap/.gitkeep",
  ".workspace/workflow/milestones/.gitkeep",
  ".workspace/workflow/workflow-config.md",
  ".workspace/workflow/releases/release-001/release.md",
  ".workspace/workflow/releases/release-001/tasks.md",
  ".workspace/workflow/releases/release-001/reviews.md",
] as const;

export const WORKSPACE_PATHS = [
  ...WORKSPACE_BASE_PATHS,
  ...WORKFLOW_PATHS,
] as const;

export const CURSOR_PATHS = [
  ".cursor/rules/sdd-studio.mdc",
  ".cursor/skills/sdd-idea/SKILL.md",
  ".cursor/skills/sdd-idea/STANDARDS.md",
  ".cursor/skills/sdd-idea/EXAMPLES.md",
  ".cursor/skills/sdd-technical/SKILL.md",
  ".cursor/skills/sdd-technical/STANDARDS.md",
  ".cursor/skills/sdd-technical/EXAMPLES.md",
  ".cursor/skills/sdd-find-skills/SKILL.md",
  ".cursor/skills/sdd-find-skills/STANDARDS.md",
  ".cursor/skills/sdd-find-skills/EXAMPLES.md",
  ".cursor/skills/sdd-generate/SKILL.md",
  ".cursor/skills/sdd-generate/STANDARDS.md",
  ".cursor/skills/sdd-generate/EXAMPLES.md",
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
  ...WORKSPACE_FOUNDATION_PATHS,
  ...CURSOR_PATHS,
] as const;

export const ALL_CURSOR_INIT_WITH_SPEC_PATHS = [
  ...WORKSPACE_BASE_PATHS,
  ...CURSOR_PATHS,
] as const;

export const ALL_CURSOR_INIT_WITH_WORKFLOW_PATHS = [
  ...WORKSPACE_FOUNDATION_PATHS,
  ...WORKFLOW_PATHS,
  ...CURSOR_PATHS,
] as const;

export const NPM_PACK_REQUIRED_PATHS = [
  "package.json",
  "bin/sdd-studio.js",
  "dist/cli.js",
  "templates/.workspace/brief/manifest.yaml",
  "templates/.workspace/brief/technical/engineering-principles.md",
  "templates/.workspace/brief/technical/engineering-frontend-patterns.md",
  "templates/.workspace/brief/technical/engineering-backend-patterns.md",
  "templates/.workspace/brief/technical/engineering-contribution-patterns.md",
  "templates/.workspace/brief/business/product-principles.md",
  "templates/.workspace/brief/business/product-guide.md",
  "templates/assistants/cursor/rules/sdd-studio.mdc",
  "templates/assistants/cursor/skills/sdd-idea/SKILL.md",
  "templates/assistants/cursor/skills/sdd-technical/SKILL.md",
  "templates/assistants/claude/CLAUDE.md",
  "templates/assistants/claude/skills/sdd-idea/SKILL.md",
  "templates/assistants/claude/skills/sdd-technical/SKILL.md",
  "templates/assistants/codex/AGENTS.md",
  "templates/assistants/codex/skills/sdd-idea/SKILL.md",
  "templates/assistants/codex/skills/sdd-idea/agents/openai.yaml",
  "templates/assistants/codex/skills/sdd-technical/SKILL.md",
  "templates/assistants/codex/skills/sdd-technical/agents/openai.yaml",
  "templates/assistants/opencode/commands/sdd-idea.md",
  "templates/assistants/opencode/commands/sdd-technical.md",
  "templates/assistants/opencode/assets/sdd-idea/STANDARDS.md",
  "templates/assistants/opencode/assets/sdd-technical/STANDARDS.md",
  "templates/assistants/copilot/agents/sdd-idea.agent.md",
  "templates/assistants/copilot/agents/sdd-technical.agent.md",
  "templates/assistants/copilot/prompts/sdd-idea.prompt.md",
  "templates/assistants/copilot/.github/copilot-instructions.md",
] as const;

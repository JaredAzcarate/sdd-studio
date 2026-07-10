import type { FooterShortcut } from "../types.js";
import type { EngineeringDashboardItemId } from "../../engineering-config/types.js";
import type { WorkflowSectionId } from "../../workflow-config/types.js";

export type MenuItem = {
  id: string;
  label: string;
  description: string;
  why: string;
  filesAffected: string[];
  estimatedTime: string;
  recommendedUsage: string;
};

export type EngineeringDashboardItem = MenuItem & {
  id: EngineeringDashboardItemId;
};

export type EngineeringPatternsItem = MenuItem & {
  id: "frontend-patterns" | "backend-patterns" | "contribution-patterns";
};

export type WorkflowDashboardItem = MenuItem & {
  id: WorkflowSectionId;
};

export const BROWNFIELD_MENU_ITEMS: MenuItem[] = [
  {
    id: "setup-foundation",
    label: "Create brief scaffold",
    description:
      "Versioned brief under .workspace/brief/ with manifest.yaml plus assistant SDD skills.",
    why: "Bootstrap brownfield documentation structure before sdd-generate.",
    filesAffected: [
      ".workspace/brief/manifest.yaml",
      ".workspace/brief/business/0.1.0/",
      ".workspace/brief/technical/0.1.0/",
      ".cursor/ or assistant-specific skills",
    ],
    estimatedTime: "2–5 min",
    recommendedUsage: "Existing codebases starting SDD alignment.",
  },
  {
    id: "create-spec-scaffold",
    label: "Create spec scaffold",
    description:
      "Empty .workspace/spec/business/ and .workspace/spec/technical/ folder structure.",
    why: "Prepare specification folders before running sdd-generate or sdd-spec.",
    filesAffected: [".workspace/spec/business/", ".workspace/spec/technical/"],
    estimatedTime: "< 1 min",
    recommendedUsage: "After brief scaffold exists.",
  },
  {
    id: "configure-refactor-engineering",
    label: "Configure Refactor Engineering",
    description:
      "Create a technical target version, configure sections one by one, then finalize to copy unchanged files from current.",
    why: "Prepare a semver target for stack or architecture changes before sdd-technical.",
    filesAffected: [
      "brief/manifest.yaml (technical.target)",
      "brief/technical/<target>/engineering-*.md",
    ],
    estimatedTime: "5–15 min",
    recommendedUsage:
      "When refactoring engineering decisions for a new version. Run sdd-technical on target, then Promote Engineering Target.",
  },
  {
    id: "promote-technical",
    label: "Promote Engineering Target",
    description:
      "Promote technical.target to current and archive the previous version in manifest.yaml.",
    why: "Publish the configured target brief as the active technical version.",
    filesAffected: ["brief/manifest.yaml"],
    estimatedTime: "< 1 min",
    recommendedUsage: "After Configure Refactor Engineering is complete.",
  },
  {
    id: "migrate",
    label: "Migrate",
    description:
      "Migrate legacy flat brief/spec layout to versioned brief with manifest.yaml.",
    why: "Required for workspaces created before semver brief folders.",
    filesAffected: [
      ".workspace/brief/manifest.yaml",
      ".workspace/brief/business/0.1.0/",
      ".workspace/brief/technical/0.1.0/",
    ],
    estimatedTime: "< 1 min",
    recommendedUsage: "Legacy SDD workspaces without manifest.yaml.",
  },
  {
    id: "sync",
    label: "Sync Assistant Files",
    description: "Update SDD skills from the installed sdd-studio package.",
    why: "Get the latest skills after upgrading sdd-studio.",
    filesAffected: ["Assistant skills, rules, or commands (not .workspace/)"],
    estimatedTime: "< 1 min",
    recommendedUsage: "After npm update sdd-studio.",
  },
  {
    id: "exit",
    label: "Exit",
    description: "Close SDD Studio.",
    why: "Leave the application.",
    filesAffected: [],
    estimatedTime: "—",
    recommendedUsage: "When you are done.",
  },
];

export function getVisibleBrownfieldMenuItems(): MenuItem[] {
  return BROWNFIELD_MENU_ITEMS;
}

export const PROJECT_TYPE_ITEMS: MenuItem[] = [
  {
    id: "greenfield",
    label: "Greenfield",
    description: "New product with no existing application code.",
    why: "Follow the SDD greenfield path from Brief to Specification.",
    filesAffected: [],
    estimatedTime: "—",
    recommendedUsage: "Starting a new SDD project.",
  },
  {
    id: "brownfield",
    label: "Brownfield",
    description: "Existing codebase to align with SDD documentation.",
    why: "Follow the SDD brownfield path with sdd-generate and versioned brief.",
    filesAffected: [],
    estimatedTime: "—",
    recommendedUsage: "Aligning an existing codebase with SDD.",
  },
];

export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    id: "setup-foundation",
    label: "Create brief scaffold",
    description:
      "Brief stubs under .workspace/brief/ plus assistant SDD skills. No spec or workflow.",
    why: "First step for a greenfield project — product and engineering context live in the Brief.",
    filesAffected: [
      ".workspace/brief/",
      ".cursor/ or assistant-specific skills",
    ],
    estimatedTime: "2–5 min",
    recommendedUsage: "New greenfield projects.",
  },
  {
    id: "create-spec-scaffold",
    label: "Create spec scaffold",
    description:
      "Empty .workspace/spec/business/ and .workspace/spec/technical/ folder structure.",
    why: "Prepare specification folders before running sdd-spec.",
    filesAffected: [".workspace/spec/business/", ".workspace/spec/technical/"],
    estimatedTime: "< 1 min",
    recommendedUsage: "After foundation exists, before sdd-spec.",
  },
  {
    id: "configure-engineering",
    label: "Configure Engineering",
    description:
      "Interactive Engineering Brief: principles, decisions, conventions, and patterns.",
    why: "Define technology-agnostic architecture and implementation patterns before generating the stack.",
    filesAffected: [
      "engineering-principles.md",
      "engineering-decisions.md",
      "engineering-conventions.md",
      "engineering-frontend-patterns.md",
      "engineering-backend-patterns.md",
      "engineering-contribution-patterns.md",
    ],
    estimatedTime: "5–15 min",
    recommendedUsage: "After foundation, before sdd-technical.",
  },
  {
    id: "configure-workflow",
    label: "Configure Workflow",
    description:
      "Interactive workflow setup: planning methodology and task conventions under .workspace/workflow/.",
    why: "Define how releases and tasks are planned before running sdd-plan.",
    filesAffected: ["workflow-config.md"],
    estimatedTime: "3–8 min",
    recommendedUsage: "After sdd-spec, before sdd-plan.",
  },
  {
    id: "sync",
    label: "Sync Assistant Files",
    description: "Update SDD skills from the installed sdd-studio package.",
    why: "Get the latest skills after upgrading sdd-studio.",
    filesAffected: ["Assistant skills, rules, or commands (not .workspace/)"],
    estimatedTime: "< 1 min",
    recommendedUsage: "After npm update sdd-studio.",
  },
  {
    id: "exit",
    label: "Exit",
    description: "Close SDD Studio.",
    why: "Leave the application.",
    filesAffected: [],
    estimatedTime: "—",
    recommendedUsage: "When you are done.",
  },
];

export function getVisibleMainMenuItems(): MenuItem[] {
  return MAIN_MENU_ITEMS;
}

export const ENGINEERING_SECTION_ITEMS: EngineeringDashboardItem[] = [
  {
    id: "principles",
    label: "Engineering Principles",
    description: "Technology-agnostic principles that guide what the system becomes.",
    why: "Defines product type, platform, backend strategy, and architectural priorities.",
    filesAffected: ["engineering-principles.md"],
    estimatedTime: "3–5 min",
    recommendedUsage: "Complete first — shapes all later decisions.",
  },
  {
    id: "decisions",
    label: "Engineering Decisions",
    description: "Architectural decisions that shape the future technology stack.",
    why: "Organization, modeling, routing, auth, testing, and deployment patterns.",
    filesAffected: ["engineering-decisions.md"],
    estimatedTime: "5–10 min",
    recommendedUsage: "After principles are defined.",
  },
  {
    id: "conventions",
    label: "Engineering Conventions",
    description: "Team conventions for code, documentation, and UX consistency.",
    why: "Establishes naming, docs style, and UX standards.",
    filesAffected: ["engineering-conventions.md"],
    estimatedTime: "1–2 min",
    recommendedUsage: "Last base section — does not affect stack generation.",
  },
  {
    id: "patterns",
    label: "Engineering Patterns",
    description:
      "Frontend and backend implementation patterns every feature and API must follow.",
    why: "Defines data flow, filters, pagination, loading UX, response envelopes, error shapes, and Git workflow.",
    filesAffected: [
      "engineering-frontend-patterns.md",
      "engineering-backend-patterns.md",
      "engineering-contribution-patterns.md",
    ],
    estimatedTime: "5–10 min",
    recommendedUsage: "After conventions — required before sdd-technical.",
  },
];

export const ENGINEERING_PATTERNS_ITEMS: EngineeringPatternsItem[] = [
  {
    id: "frontend-patterns",
    label: "Frontend Patterns",
    description:
      "Data flow, filters, search, pagination, async UI states, loading UX, and notifications.",
    why: "Ensures AI and developers implement lists, forms, and feedback consistently.",
    filesAffected: ["engineering-frontend-patterns.md"],
    estimatedTime: "2–4 min",
    recommendedUsage: "Complete when the product has a client UI.",
  },
  {
    id: "backend-patterns",
    label: "Backend Patterns",
    description:
      "Response envelopes, list metadata, error verbosity, and validation error shape.",
    why: "Ensures APIs return predictable JSON that frontends can parse uniformly.",
    filesAffected: ["engineering-backend-patterns.md"],
    estimatedTime: "2–3 min",
    recommendedUsage: "Complete when the product exposes a backend or API surface.",
  },
  {
    id: "contribution-patterns",
    label: "Contribution Patterns",
    description:
      "Branch workflow, environment promotion, commits, pull requests, and merge strategy.",
    why: "Ensures contributors and AI agents follow the same Git and PR conventions.",
    filesAffected: ["engineering-contribution-patterns.md"],
    estimatedTime: "2–4 min",
    recommendedUsage: "Complete for every team using Git — required before sdd-technical.",
  },
];

export const WORKFLOW_SECTION_ITEMS: WorkflowDashboardItem[] = [
  {
    id: "methodology",
    label: "Planning Methodology",
    description:
      "Planning approach, release cadence, and ceremony depth for delivery.",
    why: "Shapes how sdd-plan structures roadmaps, milestones, and releases.",
    filesAffected: ["workflow-config.md"],
    estimatedTime: "2–5 min",
    recommendedUsage: "Complete first — defines planning rhythm.",
  },
  {
    id: "task-conventions",
    label: "Task Conventions",
    description:
      "Task ID format, granularity, and definition style for workflow tasks.",
    why: "Ensures humans and AI agents write consistent, traceable tasks.",
    filesAffected: ["workflow-config.md"],
    estimatedTime: "2–4 min",
    recommendedUsage: "After methodology — required before sdd-plan.",
  },
];

export function defaultFooterShortcuts(): FooterShortcut[] {
  return [
    { keys: "↑↓", label: "Navigate" },
    { keys: "Enter", label: "Select" },
    { keys: "Esc", label: "Back" },
  ];
}

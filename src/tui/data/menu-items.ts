import type { FooterShortcut } from "../types.js";
import type { EngineeringDashboardItemId } from "../../engineering-config/types.js";

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
  id: "frontend-patterns" | "backend-patterns";
};

export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    id: "install-sdd",
    label: "Install SDD",
    description:
      "Full SDD setup: workspace scaffold, assistant skills, and optional Engineering Brief.",
    why: "Start a new SDD project with everything your AI assistant needs.",
    filesAffected: [
      ".workspace/brief/",
      ".workspace/spec/",
      ".cursor/ or assistant-specific skills",
    ],
    estimatedTime: "3–8 min",
    recommendedUsage: "New projects or first-time SDD adoption.",
  },
  {
    id: "create-workspace",
    label: "Create Workspace",
    description:
      "Scaffold only the .workspace/ folder (Brief + Specification structure).",
    why: "Add SDD documentation structure without reinstalling assistant files.",
    filesAffected: [".workspace/brief/", ".workspace/spec/"],
    estimatedTime: "1 min",
    recommendedUsage: "When assistant skills are already installed.",
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
    ],
    estimatedTime: "5–15 min",
    recommendedUsage: "After init, before running sdd-technical.",
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
    id: "migrate",
    label: "Migrate Workspace",
    description: "Migrate legacy SDD layouts to the Engineering Brief model.",
    why: "Upgrade projects from sdd-studio 0.4.x or 0.5.x.",
    filesAffected: [".workspace/brief/technical/"],
    estimatedTime: "< 1 min",
    recommendedUsage: "Existing projects with development.md or project.md.",
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
    why: "Defines data flow, filters, pagination, loading UX, response envelopes, and error shapes.",
    filesAffected: [
      "engineering-frontend-patterns.md",
      "engineering-backend-patterns.md",
    ],
    estimatedTime: "3–6 min",
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
];

export function defaultFooterShortcuts(): FooterShortcut[] {
  return [
    { keys: "↑↓", label: "Navigate" },
    { keys: "Enter", label: "Select" },
    { keys: "Esc", label: "Back" },
  ];
}

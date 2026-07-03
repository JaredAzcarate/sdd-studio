import { join } from "node:path";
import type { AssistantId } from "../types/init-context.js";

export type SkillInstallFormat = "directory" | "command-file";

export type AssistantLayout = {
  skillFormat: SkillInstallFormat;
  skillsMarker: string;
  skillNames: readonly string[];
  skillCommandFiles?: Readonly<Record<string, string>>;
  installedPaths: {
    instructions?: string;
    rules?: string;
    skills: string;
    assets?: string;
  };
  syncLabels: {
    all: readonly string[];
    skills: readonly string[];
  };
  nextStepLabel: string;
};

const SKILL_NAMES = [
  "sdd-idea",
  "sdd-generate",
  "sdd-spec",
  "sdd-review",
  "sdd-plan",
] as const;

function skillPaths(base: string): string[] {
  return SKILL_NAMES.map((name) => `  ${base}/${name}/`);
}

function opencodeCommandPaths(): string[] {
  return SKILL_NAMES.map((name) => `  .opencode/commands/${name}.md`);
}

function opencodeAssetPaths(): string[] {
  return SKILL_NAMES.map((name) => `  .opencode/sdd-studio/${name}/`);
}

export const ASSISTANT_LAYOUTS: Record<AssistantId, AssistantLayout> = {
  cursor: {
    skillFormat: "directory",
    skillsMarker: join(".cursor", "skills", "sdd-idea", "SKILL.md"),
    skillNames: SKILL_NAMES,
    installedPaths: {
      rules: ".cursor/rules/sdd-studio.mdc",
      skills: ".cursor/skills/",
    },
    syncLabels: {
      all: [".cursor/rules/sdd-studio.mdc", ...skillPaths(".cursor/skills")],
      skills: skillPaths(".cursor/skills"),
    },
    nextStepLabel: "Cursor",
  },
  claude: {
    skillFormat: "directory",
    skillsMarker: join(".claude", "skills", "sdd-idea", "SKILL.md"),
    skillNames: SKILL_NAMES,
    installedPaths: {
      instructions: "CLAUDE.md",
      skills: ".claude/skills/",
    },
    syncLabels: {
      all: ["CLAUDE.md", ...skillPaths(".claude/skills")],
      skills: skillPaths(".claude/skills"),
    },
    nextStepLabel: "Claude Code",
  },
  codex: {
    skillFormat: "directory",
    skillsMarker: join(".agents", "skills", "sdd-idea", "SKILL.md"),
    skillNames: SKILL_NAMES,
    installedPaths: {
      instructions: "AGENTS.md",
      skills: ".agents/skills/",
    },
    syncLabels: {
      all: ["AGENTS.md", ...skillPaths(".agents/skills")],
      skills: skillPaths(".agents/skills"),
    },
    nextStepLabel: "Codex",
  },
  opencode: {
    skillFormat: "command-file",
    skillsMarker: join(".opencode", "commands", "sdd-idea.md"),
    skillNames: SKILL_NAMES,
    skillCommandFiles: Object.fromEntries(
      SKILL_NAMES.map((name) => [name, `${name}.md`]),
    ),
    installedPaths: {
      skills: ".opencode/commands/",
      assets: ".opencode/sdd-studio/",
    },
    syncLabels: {
      all: [...opencodeCommandPaths(), ...opencodeAssetPaths()],
      skills: [...opencodeCommandPaths(), ...opencodeAssetPaths()],
    },
    nextStepLabel: "OpenCode",
  },
};

export function getAssistantLayout(assistantId: AssistantId): AssistantLayout {
  return ASSISTANT_LAYOUTS[assistantId];
}

export function getAssistantSkillMarkers(): string[] {
  return Object.values(ASSISTANT_LAYOUTS).map((layout) => layout.skillsMarker);
}

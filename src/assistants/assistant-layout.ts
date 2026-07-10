import { join } from "node:path";
import type { AssistantId } from "../types/init-context.js";

export type SkillInstallFormat = "directory" | "command-file" | "copilot";

export type AssistantLayout = {
  skillFormat: SkillInstallFormat;
  skillsMarker: string;
  skillNames: readonly string[];
  skillCommandFiles?: Readonly<Record<string, string>>;
  skillAgentFiles?: Readonly<Record<string, string>>;
  skillPromptFiles?: Readonly<Record<string, string>>;
  installedPaths: {
    instructions?: string;
    rules?: string;
    skills: string;
    agents?: string;
    prompts?: string;
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
  "sdd-technical",
  "sdd-find-skills",
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

function copilotAgentPaths(): string[] {
  return SKILL_NAMES.map((name) => `  .github/agents/${name}.agent.md`);
}

function copilotPromptPaths(): string[] {
  return SKILL_NAMES.map((name) => `  .github/prompts/${name}.prompt.md`);
}

function copilotAssetPaths(): string[] {
  return SKILL_NAMES.map((name) => `  .github/sdd-studio/${name}/`);
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
  copilot: {
    skillFormat: "copilot",
    skillsMarker: join(".github", "agents", "sdd-idea.agent.md"),
    skillNames: SKILL_NAMES,
    skillAgentFiles: Object.fromEntries(
      SKILL_NAMES.map((name) => [name, `${name}.agent.md`]),
    ),
    skillPromptFiles: Object.fromEntries(
      SKILL_NAMES.map((name) => [name, `${name}.prompt.md`]),
    ),
    installedPaths: {
      instructions: ".github/copilot-instructions.md",
      agents: ".github/agents/",
      prompts: ".github/prompts/",
      skills: ".github/agents/",
      assets: ".github/sdd-studio/",
    },
    syncLabels: {
      all: [
        ".github/copilot-instructions.md",
        ...copilotAgentPaths(),
        ...copilotPromptPaths(),
        ...copilotAssetPaths(),
      ],
      skills: [
        ...copilotAgentPaths(),
        ...copilotPromptPaths(),
        ...copilotAssetPaths(),
      ],
    },
    nextStepLabel: "GitHub Copilot",
  },
};

export function getAssistantLayout(assistantId: AssistantId): AssistantLayout {
  return ASSISTANT_LAYOUTS[assistantId];
}

export function getAssistantSkillMarkers(): string[] {
  return Object.values(ASSISTANT_LAYOUTS).map((layout) => layout.skillsMarker);
}

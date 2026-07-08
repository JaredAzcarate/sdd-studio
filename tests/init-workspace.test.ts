import { existsSync } from "node:fs";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { initWorkspace } from "../src/use-cases/init-workspace.use-case.js";
import type { InitContextWithLabels } from "../src/types/init-context.js";

function createContext(
  targetDir: string,
  modules: { workflow: boolean } = { workflow: false },
): InitContextWithLabels {
  return {
    targetDir,
    assistant: "cursor",
    modules,
    labels: {
      assistant: "Cursor",
    },
  };
}

const BASE_PATHS = [
  ".workspace/brief/business/product-principles.md",
  ".workspace/brief/business/product-guide.md",
  ".workspace/brief/technical/engineering-principles.md",
  ".workspace/brief/technical/engineering-decisions.md",
  ".workspace/brief/technical/engineering-conventions.md",
  ".workspace/brief/technical/engineering-modeling.md",
  ".workspace/spec/business/domain/.gitkeep",
  ".workspace/spec/business/relations/.gitkeep",
  ".workspace/spec/business/capabilities/.gitkeep",
  ".workspace/spec/business/flows/.gitkeep",
  ".workspace/spec/business/rules/.gitkeep",
  ".workspace/spec/business/security/.gitkeep",
  ".workspace/spec/business/events/.gitkeep",
  ".workspace/spec/technical/api/.gitkeep",
  ".workspace/spec/technical/ui/.gitkeep",
  ".workspace/spec/technical/testing/.gitkeep",
  ".workspace/spec/technical/architecture/.gitkeep",
  ".workspace/spec/technical/database/.gitkeep",
];

const WORKFLOW_PATHS = [
  ".workspace/workflow/roadmap/.gitkeep",
  ".workspace/workflow/milestones/.gitkeep",
  ".workspace/workflow/releases/release-001/release.md",
  ".workspace/workflow/releases/release-001/tasks.md",
  ".workspace/workflow/releases/release-001/reviews.md",
  ".workspace/workflow/releases/release-001/decisions.md",
];

const CURSOR_PATHS = [
  ".cursor/rules/sdd-studio.mdc",
  ".cursor/skills/sdd-idea/SKILL.md",
  ".cursor/skills/sdd-technical/SKILL.md",
  ".cursor/skills/sdd-generate/SKILL.md",
  ".cursor/skills/sdd-spec/SKILL.md",
  ".cursor/skills/sdd-review/SKILL.md",
  ".cursor/skills/sdd-plan/SKILL.md",
  ".cursor/skills/sdd-spec/scripts/validate-spec.mjs",
  ".cursor/skills/sdd-plan/scripts/validate-workflow.mjs",
];

describe("initWorkspace", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("generates the default SDD workspace tree without workflow", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-init-"));
    const context = createContext(tempDir);

    const result = await initWorkspace({ context });

    for (const relativePath of BASE_PATHS) {
      expect(existsSync(join(tempDir, relativePath)), relativePath).toBe(true);
    }

    for (const relativePath of WORKFLOW_PATHS) {
      expect(existsSync(join(tempDir, relativePath)), relativePath).toBe(false);
    }

    const engineeringPrinciplesMd = readFileSync(
      join(tempDir, ".workspace/brief/technical/engineering-principles.md"),
      "utf8",
    );
    const productGuideMd = readFileSync(
      join(tempDir, ".workspace/brief/business/product-guide.md"),
      "utf8",
    );

    expect(engineeringPrinciplesMd).toContain("# Engineering Principles");
    expect(engineeringPrinciplesMd).toContain("sdd-studio configure");
    expect(productGuideMd).toContain("# Product Guide");
    expect(productGuideMd).toContain("sdd-idea");
    expect(
      readFileSync(
        join(tempDir, ".workspace/brief/business/product-principles.md"),
        "utf8",
      ),
    ).toContain("# Product Principles");
    expect(result.assistant.installed).toBe(true);
    expect(result.modules.workflow).toBe(false);

    for (const relativePath of CURSOR_PATHS) {
      expect(existsSync(join(tempDir, relativePath)), relativePath).toBe(true);
    }

    expect(
      existsSync(join(tempDir, ".workspace/brief/technical/stack")),
      "legacy stack folder must not be generated",
    ).toBe(false);

    expect(result.createdPaths.length).toBeGreaterThanOrEqual(
      BASE_PATHS.length + CURSOR_PATHS.length,
    );
  });

  it("generates the workflow module when enabled", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-init-"));
    const context = createContext(tempDir, { workflow: true });

    const result = await initWorkspace({ context });

    for (const relativePath of [...BASE_PATHS, ...WORKFLOW_PATHS]) {
      expect(existsSync(join(tempDir, relativePath)), relativePath).toBe(true);
    }

    expect(result.modules.workflow).toBe(true);
  });

  it("installs claude assistant files when assistant is claude", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-init-"));
    const context = createContext(tempDir);
    context.assistant = "claude";
    context.labels.assistant = "Claude Code";

    const result = await initWorkspace({ context });

    expect(result.assistant.installed).toBe(true);
    expect(existsSync(join(tempDir, "CLAUDE.md"))).toBe(true);
    expect(existsSync(join(tempDir, ".claude/skills/sdd-idea/SKILL.md"))).toBe(
      true,
    );
    expect(existsSync(join(tempDir, ".cursor"))).toBe(false);
  });

  it("installs codex assistant files when assistant is codex", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-init-"));
    const context = createContext(tempDir);
    context.assistant = "codex";
    context.labels.assistant = "Codex CLI";

    const result = await initWorkspace({ context });

    expect(result.assistant.installed).toBe(true);
    expect(existsSync(join(tempDir, "AGENTS.md"))).toBe(true);
    expect(
      existsSync(join(tempDir, ".agents/skills/sdd-idea/SKILL.md")),
    ).toBe(true);
    expect(
      existsSync(
        join(tempDir, ".agents/skills/sdd-idea/agents/openai.yaml"),
      ),
    ).toBe(true);
    expect(existsSync(join(tempDir, ".cursor"))).toBe(false);
  });

  it("fails when workspace already exists", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-init-"));
    const context = createContext(tempDir);

    await initWorkspace({ context });

    await expect(initWorkspace({ context })).rejects.toThrow();
  });
});

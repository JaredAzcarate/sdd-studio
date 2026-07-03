import { existsSync } from "node:fs";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { initWorkspace } from "../src/use-cases/init-workspace.use-case.js";
import type { InitContextWithLabels } from "../src/types/init-context.js";

function createContext(targetDir: string): InitContextWithLabels {
  return {
    targetDir,
    assistant: "cursor",
    labels: {
      assistant: "Cursor",
    },
  };
}

const REQUIRED_PATHS = [
  "workspace/project.md",
  "workspace/user-manual.md",
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
];

const CURSOR_PATHS = [
  ".cursor/rules/sdd-studio.mdc",
  ".cursor/skills/sdd-idea/SKILL.md",
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

  it("generates the full SDD workspace tree in the target directory", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-init-"));
    const context = createContext(tempDir);

    const result = await initWorkspace({ context });

    for (const relativePath of REQUIRED_PATHS) {
      expect(existsSync(join(tempDir, relativePath)), relativePath).toBe(true);
    }

    const projectMd = readFileSync(
      join(tempDir, "workspace/project.md"),
      "utf8",
    );
    const userManualMd = readFileSync(
      join(tempDir, "workspace/user-manual.md"),
      "utf8",
    );

    expect(projectMd).toContain("# Project");
    expect(projectMd).toContain("sdd-idea");
    expect(userManualMd).toContain("# User Manual");
    expect(userManualMd).toContain("sdd-idea");
    expect(existsSync(join(tempDir, "workspace/spec/product.md"))).toBe(false);
    expect(existsSync(join(tempDir, "workspace/spec/vision.md"))).toBe(false);
    expect(result.assistant.installed).toBe(true);

    for (const relativePath of CURSOR_PATHS) {
      expect(existsSync(join(tempDir, relativePath)), relativePath).toBe(true);
    }

    expect(result.createdPaths.length).toBeGreaterThanOrEqual(
      REQUIRED_PATHS.length + CURSOR_PATHS.length,
    );
  });

  it("skips cursor setup when assistant is not cursor", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-init-"));
    const context = createContext(tempDir);
    context.assistant = "claude";
    context.labels.assistant = "Claude Code";

    const result = await initWorkspace({ context });

    expect(result.assistant.installed).toBe(false);
    expect(result.assistant.message).toContain("future release");
    expect(existsSync(join(tempDir, ".cursor"))).toBe(false);
  });

  it("fails when workspace already exists", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-init-"));
    const context = createContext(tempDir);

    await initWorkspace({ context });

    await expect(initWorkspace({ context })).rejects.toThrow();
  });
});

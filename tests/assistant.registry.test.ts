import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { installAssistant } from "../src/assistants/assistant.registry.js";

describe("installAssistant", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("installs claude skills and CLAUDE.md", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-claude-"));

    const result = await installAssistant("claude", tempDir);

    expect(result.installed).toBe(true);
    expect(result.createdPaths.length).toBeGreaterThan(0);
  });

  it("installs codex skills, AGENTS.md, and openai.yaml metadata", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-codex-"));

    const result = await installAssistant("codex", tempDir);

    expect(result.installed).toBe(true);
    expect(
      result.createdPaths.some((path) => path.endsWith("agents/openai.yaml")),
    ).toBe(true);
  });

  it("installs opencode commands and assets", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-opencode-"));

    const result = await installAssistant("opencode", tempDir);

    expect(result.installed).toBe(true);
    expect(
      result.createdPaths.some((path) =>
        path.endsWith(".opencode/commands/sdd-idea.md"),
      ),
    ).toBe(true);
    expect(
      result.createdPaths.some((path) =>
        path.endsWith(".opencode/sdd-studio/sdd-idea/STANDARDS.md"),
      ),
    ).toBe(true);
  });

  it("installs copilot agents, prompts, and instructions", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-copilot-"));

    const result = await installAssistant("copilot", tempDir);

    expect(result.installed).toBe(true);
    expect(
      result.createdPaths.some((path) =>
        path.endsWith(".github/agents/sdd-idea.agent.md"),
      ),
    ).toBe(true);
    expect(
      result.createdPaths.some((path) =>
        path.endsWith(".github/prompts/sdd-idea.prompt.md"),
      ),
    ).toBe(true);
    expect(
      result.createdPaths.some((path) =>
        path.endsWith(".github/copilot-instructions.md"),
      ),
    ).toBe(true);
  });
});

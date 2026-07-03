import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { copilotAssistantStrategy } from "../src/assistants/copilot.strategy.js";

describe("CopilotAssistantStrategy", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("installs agents, prompts, assets, and copilot-instructions", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-copilot-"));

    const result = await copilotAssistantStrategy.install(tempDir);

    expect(result.installed).toBe(true);
    expect(
      existsSync(join(tempDir, ".github/agents/sdd-idea.agent.md")),
    ).toBe(true);
    expect(
      existsSync(join(tempDir, ".github/prompts/sdd-idea.prompt.md")),
    ).toBe(true);
    expect(
      existsSync(join(tempDir, ".github/sdd-studio/sdd-idea/STANDARDS.md")),
    ).toBe(true);
    expect(
      existsSync(join(tempDir, ".github/copilot-instructions.md")),
    ).toBe(true);

    const agent = readFileSync(
      join(tempDir, ".github/agents/sdd-idea.agent.md"),
      "utf8",
    );
    expect(agent).toMatch(/^---\nname: sdd-idea/);
    expect(agent).toContain("disable-model-invocation: true");
    expect(agent).toContain(".github/sdd-studio/sdd-idea/STANDARDS.md");

    const prompt = readFileSync(
      join(tempDir, ".github/prompts/sdd-idea.prompt.md"),
      "utf8",
    );
    expect(prompt).toContain("agent: sdd-idea");
  });

  it("preserves unrelated agents and prompts", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-copilot-"));

    const agentsDir = join(tempDir, ".github/agents");
    const promptsDir = join(tempDir, ".github/prompts");
    mkdirSync(agentsDir, { recursive: true });
    mkdirSync(promptsDir, { recursive: true });
    writeFileSync(join(agentsDir, "my-custom.agent.md"), "# Custom agent");
    writeFileSync(join(promptsDir, "my-custom.prompt.md"), "# Custom prompt");

    await copilotAssistantStrategy.install(tempDir);

    expect(readFileSync(join(agentsDir, "my-custom.agent.md"), "utf8")).toBe(
      "# Custom agent",
    );
    expect(existsSync(join(agentsDir, "sdd-plan.agent.md"))).toBe(true);
  });

  it("sync overwrites existing SDD agents", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-copilot-"));

    await copilotAssistantStrategy.install(tempDir);

    const agentPath = join(tempDir, ".github/agents/sdd-idea.agent.md");
    writeFileSync(agentPath, "# Modified locally");

    await copilotAssistantStrategy.sync(tempDir);

    expect(readFileSync(agentPath, "utf8")).toContain("SDD Idea");
    expect(readFileSync(agentPath, "utf8")).not.toContain("# Modified locally");
  });
});

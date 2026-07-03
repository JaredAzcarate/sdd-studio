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
import { opencodeAssistantStrategy } from "../src/assistants/opencode.strategy.js";

describe("OpenCodeAssistantStrategy", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("installs SDD commands and assets into .opencode/", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-opencode-"));

    const result = await opencodeAssistantStrategy.install(tempDir);

    expect(result.installed).toBe(true);
    expect(existsSync(join(tempDir, ".opencode/commands/sdd-idea.md"))).toBe(
      true,
    );
    expect(
      existsSync(join(tempDir, ".opencode/sdd-studio/sdd-idea/STANDARDS.md")),
    ).toBe(true);
    expect(
      existsSync(
        join(tempDir, ".opencode/sdd-studio/sdd-spec/scripts/validate-spec.mjs"),
      ),
    ).toBe(true);

    const command = readFileSync(
      join(tempDir, ".opencode/commands/sdd-idea.md"),
      "utf8",
    );
    expect(command).toMatch(/^---\ndescription:/);
    expect(command).toContain("@.opencode/sdd-studio/sdd-idea/STANDARDS.md");
  });

  it("preserves unrelated commands in .opencode/commands/", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-opencode-"));

    const commandsDir = join(tempDir, ".opencode/commands");
    mkdirSync(commandsDir, { recursive: true });
    writeFileSync(join(commandsDir, "my-custom.md"), "# Custom command");

    await opencodeAssistantStrategy.install(tempDir);

    expect(readFileSync(join(commandsDir, "my-custom.md"), "utf8")).toBe(
      "# Custom command",
    );
    expect(existsSync(join(commandsDir, "sdd-plan.md"))).toBe(true);
  });

  it("sync overwrites existing SDD commands", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-opencode-"));

    await opencodeAssistantStrategy.install(tempDir);

    const commandPath = join(tempDir, ".opencode/commands/sdd-idea.md");
    writeFileSync(commandPath, "# Modified locally");

    await opencodeAssistantStrategy.sync(tempDir);

    expect(readFileSync(commandPath, "utf8")).toContain("SDD Idea");
    expect(readFileSync(commandPath, "utf8")).not.toContain("# Modified locally");
  });
});

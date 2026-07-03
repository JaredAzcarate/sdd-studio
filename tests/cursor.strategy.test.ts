import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cursorAssistantStrategy } from "../src/assistants/cursor.strategy.js";

describe("CursorAssistantStrategy", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("installs rules and all SDD skills into .cursor/", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-cursor-"));

    const result = await cursorAssistantStrategy.install(tempDir);

    expect(result.installed).toBe(true);
    expect(existsSync(join(tempDir, ".cursor/rules/sdd-studio.mdc"))).toBe(true);
    expect(existsSync(join(tempDir, ".cursor/skills/sdd-idea/SKILL.md"))).toBe(
      true,
    );
    expect(existsSync(join(tempDir, ".cursor/skills/sdd-generate/SKILL.md"))).toBe(
      true,
    );
    expect(existsSync(join(tempDir, ".cursor/skills/sdd-spec/SKILL.md"))).toBe(
      true,
    );
    expect(
      existsSync(join(tempDir, ".cursor/skills/sdd-review/SKILL.md")),
    ).toBe(true);
    expect(existsSync(join(tempDir, ".cursor/skills/sdd-plan/SKILL.md"))).toBe(
      true,
    );
    expect(
      existsSync(
        join(tempDir, ".cursor/skills/sdd-spec/scripts/validate-spec.mjs"),
      ),
    ).toBe(true);

    const rule = readFileSync(
      join(tempDir, ".cursor/rules/sdd-studio.mdc"),
      "utf8",
    );
    expect(rule).toContain("workspace/project.md");
    expect(rule).toContain("workspace/product-guide.md");
    expect(rule).toContain("sdd-idea");
  });

  it("fails when cursor skills are already installed", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-cursor-"));

    await cursorAssistantStrategy.install(tempDir);

    await expect(cursorAssistantStrategy.install(tempDir)).rejects.toThrow(
      /SDD Studio skills already exist/,
    );
  });

  it("sync overwrites existing skills and rules", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-cursor-"));

    await cursorAssistantStrategy.install(tempDir);

    const skillPath = join(tempDir, ".cursor/skills/sdd-idea/SKILL.md");
    writeFileSync(skillPath, "# Modified locally");

    const result = await cursorAssistantStrategy.sync(tempDir);

    expect(result.installed).toBe(true);
    expect(readFileSync(skillPath, "utf8")).toContain("SDD Idea");
    expect(readFileSync(skillPath, "utf8")).not.toContain("# Modified locally");
  });

  it("sync with skills scope updates only .cursor/skills/", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-cursor-"));

    await cursorAssistantStrategy.install(tempDir);

    const rulePath = join(tempDir, ".cursor/rules/sdd-studio.mdc");
    const originalRule = readFileSync(rulePath, "utf8");
    writeFileSync(rulePath, "# Modified rule");
    writeFileSync(
      join(tempDir, ".cursor/skills/sdd-idea/SKILL.md"),
      "# Modified skill",
    );

    await cursorAssistantStrategy.sync(tempDir, { scope: "skills" });

    expect(readFileSync(rulePath, "utf8")).toBe("# Modified rule");
    expect(
      readFileSync(join(tempDir, ".cursor/skills/sdd-idea/SKILL.md"), "utf8"),
    ).toContain("SDD Idea");
    expect(readFileSync(rulePath, "utf8")).not.toBe(originalRule);
  });
});

import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const cliBin = join(projectRoot, "bin/sdd-studio.js");

describe("cli sync e2e", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("runs sync after init and restores modified skills", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-sync-e2e-"));

    execSync(`node "${cliBin}" init --yes --assistant cursor`, {
      cwd: tempDir,
      stdio: ["pipe", "pipe", "pipe"],
    });

    const skillPath = join(tempDir, ".cursor/skills/sdd-idea/SKILL.md");
    writeFileSync(skillPath, "# Tampered skill");

    const output = execSync(`node "${cliBin}" sync`, {
      cwd: tempDir,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    expect(output).toContain("SDD assistant files synced successfully");
    expect(output).toContain(".workspace/ files were not modified");
    expect(readFileSync(skillPath, "utf8")).toContain("SDD Idea");
    expect(readFileSync(skillPath, "utf8")).not.toContain("# Tampered skill");
  });

  it("runs sync --skills without updating rules", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-sync-e2e-"));

    execSync(`node "${cliBin}" init --yes --assistant cursor`, {
      cwd: tempDir,
      stdio: ["pipe", "pipe", "pipe"],
    });

    const rulePath = join(tempDir, ".cursor/rules/sdd-studio.mdc");
    writeFileSync(rulePath, "# Tampered rule");
    writeFileSync(
      join(tempDir, ".cursor/skills/sdd-idea/SKILL.md"),
      "# Tampered skill",
    );

    const output = execSync(`node "${cliBin}" sync --skills`, {
      cwd: tempDir,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    expect(output).toContain("Updated skills:");
    expect(readFileSync(rulePath, "utf8")).toBe("# Tampered rule");
    expect(
      readFileSync(join(tempDir, ".cursor/skills/sdd-idea/SKILL.md"), "utf8"),
    ).toContain("SDD Idea");
  });

  it("fails sync when no SDD project exists", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-sync-e2e-"));

    expect(() =>
      execSync(`node "${cliBin}" sync`, {
        cwd: tempDir,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      }),
    ).toThrow(/No SDD project found/);
  });
});

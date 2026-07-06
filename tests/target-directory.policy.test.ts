import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  assertSyncTargetEligible,
  assertTargetDirectoryAvailable,
} from "../src/policies/target-directory.policy.js";

describe("assertTargetDirectoryAvailable", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("allows an empty target directory", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    expect(() => assertTargetDirectoryAvailable(tempDir)).not.toThrow();
  });

  it("blocks when .workspace/brief/technical/development.md already exists", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const markerPath = join(
      tempDir,
      ".workspace/brief/technical/development.md",
    );
    mkdirSync(join(markerPath, ".."), { recursive: true });
    writeFileSync(markerPath, "# Existing");

    expect(() => assertTargetDirectoryAvailable(tempDir)).toThrow(
      /An SDD project already exists/,
    );
  });

  it("blocks when legacy .workspace/project.md already exists", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const workspaceDir = join(tempDir, ".workspace");
    mkdirSync(workspaceDir, { recursive: true });
    writeFileSync(join(workspaceDir, "project.md"), "# Existing");

    expect(() => assertTargetDirectoryAvailable(tempDir)).toThrow(
      /An SDD project already exists/,
    );
  });
});

describe("assertSyncTargetEligible", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("allows a directory with .workspace/brief/technical/development.md", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const markerPath = join(
      tempDir,
      ".workspace/brief/technical/development.md",
    );
    mkdirSync(join(markerPath, ".."), { recursive: true });
    writeFileSync(markerPath, "# Existing");

    expect(() => assertSyncTargetEligible(tempDir)).not.toThrow();
  });

  it("allows a directory with legacy .workspace/project.md", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const workspaceDir = join(tempDir, ".workspace");
    mkdirSync(workspaceDir, { recursive: true });
    writeFileSync(join(workspaceDir, "project.md"), "# Existing");

    expect(() => assertSyncTargetEligible(tempDir)).not.toThrow();
  });

  it("allows a directory with only cursor skills installed", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const skillDir = join(tempDir, ".cursor", "skills", "sdd-idea");
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, "SKILL.md"), "# Skill");

    expect(() => assertSyncTargetEligible(tempDir, "cursor")).not.toThrow();
  });

  it("allows a directory with only claude skills installed", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const skillDir = join(tempDir, ".claude", "skills", "sdd-idea");
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, "SKILL.md"), "# Skill");

    expect(() => assertSyncTargetEligible(tempDir, "claude")).not.toThrow();
  });

  it("allows a directory with only codex skills installed", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const skillDir = join(tempDir, ".agents", "skills", "sdd-idea");
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, "SKILL.md"), "# Skill");

    expect(() => assertSyncTargetEligible(tempDir, "codex")).not.toThrow();
  });

  it("allows a directory with only opencode commands installed", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const commandsDir = join(tempDir, ".opencode", "commands");
    mkdirSync(commandsDir, { recursive: true });
    writeFileSync(join(commandsDir, "sdd-idea.md"), "# Command");

    expect(() => assertSyncTargetEligible(tempDir, "opencode")).not.toThrow();
  });

  it("allows a directory with only copilot agents installed", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const agentsDir = join(tempDir, ".github", "agents");
    mkdirSync(agentsDir, { recursive: true });
    writeFileSync(join(agentsDir, "sdd-idea.agent.md"), "# Agent");

    expect(() => assertSyncTargetEligible(tempDir, "copilot")).not.toThrow();
  });

  it("blocks when no SDD markers exist", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));

    expect(() => assertSyncTargetEligible(tempDir)).toThrow(
      /No SDD project found/,
    );
  });
});

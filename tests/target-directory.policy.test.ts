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

  it("blocks when workspace/project.md already exists", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const workspaceDir = join(tempDir, "workspace");
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

  it("allows a directory with workspace/project.md", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const workspaceDir = join(tempDir, "workspace");
    mkdirSync(workspaceDir, { recursive: true });
    writeFileSync(join(workspaceDir, "project.md"), "# Existing");

    expect(() => assertSyncTargetEligible(tempDir)).not.toThrow();
  });

  it("allows a directory with only cursor skills installed", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const skillDir = join(tempDir, ".cursor", "skills", "sdd-idea");
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, "SKILL.md"), "# Skill");

    expect(() => assertSyncTargetEligible(tempDir)).not.toThrow();
  });

  it("blocks when no SDD markers exist", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));

    expect(() => assertSyncTargetEligible(tempDir)).toThrow(
      /No SDD project found/,
    );
  });
});

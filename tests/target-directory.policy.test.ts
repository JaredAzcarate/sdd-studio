import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { assertTargetDirectoryAvailable } from "../src/policies/target-directory.policy.js";

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

  it("blocks when workspace/spec/vision.md already exists", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-"));
    const specDir = join(tempDir, "workspace", "spec");
    mkdirSync(specDir, { recursive: true });
    writeFileSync(join(specDir, "vision.md"), "# Existing");

    expect(() => assertTargetDirectoryAvailable(tempDir)).toThrow(
      /An SDD project already exists/,
    );
  });
});

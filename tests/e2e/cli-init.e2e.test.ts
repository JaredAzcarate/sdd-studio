import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { assertPathsExist } from "./assert-paths.js";
import { ALL_CURSOR_INIT_PATHS } from "./expected-paths.js";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const cliBin = join(projectRoot, "bin/sdd-studio.js");

describe("cli init e2e", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("runs init --yes and generates the full Cursor SDD tree", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-e2e-"));

    const output = execSync(
      `node "${cliBin}" init --yes --assistant cursor`,
      {
        cwd: tempDir,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    );

    assertPathsExist(tempDir, ALL_CURSOR_INIT_PATHS);

    const projectMd = readFileSync(
      join(tempDir, "workspace/project.md"),
      "utf8",
    );
    const productGuideMd = readFileSync(
      join(tempDir, "workspace/product-guide.md"),
      "utf8",
    );

    expect(projectMd).toContain("# Project");
    expect(productGuideMd).toContain("# Product Guide");
    expect(output).toContain("SDD project generated successfully");
    expect(output).toContain("sdd-idea");
  });

  it("prints version", () => {
    const version = execSync(`node "${cliBin}" --version`, {
      encoding: "utf8",
    }).trim();

    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

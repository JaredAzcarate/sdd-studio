import { execSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { assertPathsExist } from "./assert-paths.js";
import {
  ALL_CURSOR_INIT_PATHS,
  ALL_CURSOR_INIT_WITH_SPEC_PATHS,
  ALL_CURSOR_INIT_WITH_WORKFLOW_PATHS,
  WORKFLOW_PATHS,
} from "./expected-paths.js";

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

  it("runs init --yes and generates the default Cursor SDD tree without workflow", () => {
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

    for (const relativePath of WORKFLOW_PATHS) {
      expect(existsSync(join(tempDir, relativePath)), relativePath).toBe(false);
    }

    const engineeringPrinciplesMd = readFileSync(
      join(tempDir, ".workspace/brief/technical/engineering-principles.md"),
      "utf8",
    );
    const productPrinciplesMd = readFileSync(
      join(tempDir, ".workspace/brief/business/product-principles.md"),
      "utf8",
    );
    const productGuideMd = readFileSync(
      join(tempDir, ".workspace/brief/business/product-guide.md"),
      "utf8",
    );

    expect(engineeringPrinciplesMd).toContain("# Engineering Principles");
    expect(productPrinciplesMd).toContain("# Product Principles");
    expect(productGuideMd).toContain("# Product Guide");
    expect(output).toContain("SDD foundation generated successfully");
    expect(output).toContain("Spec scaffold: not created");
    expect(output).toContain("sdd-studio configure");
  });

  it("runs init --yes --workflow and includes the workflow module", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-e2e-"));

    execSync(`node "${cliBin}" init --yes --assistant cursor --workflow`, {
      cwd: tempDir,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    assertPathsExist(tempDir, ALL_CURSOR_INIT_WITH_WORKFLOW_PATHS);
  });

  it("runs init --yes --spec and includes the spec scaffold", () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-e2e-"));

    const output = execSync(
      `node "${cliBin}" init --yes --assistant cursor --spec`,
      {
        cwd: tempDir,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    );

    assertPathsExist(tempDir, ALL_CURSOR_INIT_WITH_SPEC_PATHS);

    for (const relativePath of WORKFLOW_PATHS) {
      expect(existsSync(join(tempDir, relativePath)), relativePath).toBe(false);
    }

    expect(output).toMatch(/Spec scaffold:\s+enabled/);
  });

  it("prints version", () => {
    const version = execSync(`node "${cliBin}" --version`, {
      encoding: "utf8",
    }).trim();

    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

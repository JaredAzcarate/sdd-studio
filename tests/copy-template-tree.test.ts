import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { copyTemplateTree } from "../src/core/file-system.js";

const fixturesDir = join(process.cwd(), "tests/fixtures/templates/sample");

describe("copyTemplateTree", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("copies static files and renders .hbs templates", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-copy-"));
    const targetDir = join(tempDir, "output");

    const { createdPaths } = await copyTemplateTree(fixturesDir, targetDir, {
      variables: { name: "World" },
    });

    expect(createdPaths).toContain(join(targetDir, "static.txt"));
    expect(createdPaths).toContain(join(targetDir, "greeting.md"));

    expect(readFileSync(join(targetDir, "static.txt"), "utf8")).toBe("plain file\n");
    expect(readFileSync(join(targetDir, "greeting.md"), "utf8")).toBe(
      "Hello World\n",
    );
  });

  it("fails when destination files already exist", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-copy-"));
    const targetDir = join(tempDir, "output");
    mkdirSync(targetDir, { recursive: true });

    await copyTemplateTree(fixturesDir, targetDir, {
      variables: { name: "World" },
    });

    await expect(
      copyTemplateTree(fixturesDir, targetDir, {
        variables: { name: "Again" },
      }),
    ).rejects.toThrow(/already exists/i);
  });
});

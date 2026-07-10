import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { initWorkspace } from "../src/use-cases/init-workspace.use-case.js";
import type { InitContextWithLabels } from "../src/types/init-context.js";
import {
  createTechnicalTargetVersion,
  finalizeTechnicalTargetVersion,
  prepareTechnicalTargetVersion,
  promoteTechnicalTarget,
} from "../src/workspace/technical-version.js";
import { readManifest } from "../src/workspace/manifest.js";

describe("technical version refactor", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("prepares a target version without copying files upfront", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-refactor-"));
    const context: InitContextWithLabels = {
      targetDir: tempDir,
      assistant: "cursor",
      modules: { workflow: false, spec: false },
      labels: { assistant: "Cursor" },
    };

    await initWorkspace({ context });
    const workspaceDir = join(tempDir, ".workspace");

    const prepareResult = await prepareTechnicalTargetVersion(workspaceDir);
    expect(prepareResult.targetVersion).toBe("0.2.0");
    expect(existsSync(prepareResult.targetDir)).toBe(true);
    expect(
      existsSync(
        join(
          workspaceDir,
          "brief/technical/0.2.0/engineering-principles.md",
        ),
      ),
    ).toBe(false);
  });

  it("finalizes by copying only unmodified files from current", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-refactor-"));
    const context: InitContextWithLabels = {
      targetDir: tempDir,
      assistant: "cursor",
      modules: { workflow: false, spec: false },
      labels: { assistant: "Cursor" },
    };

    await initWorkspace({ context });
    const workspaceDir = join(tempDir, ".workspace");

    await prepareTechnicalTargetVersion(workspaceDir);

    writeFileSync(
      join(
        workspaceDir,
        "brief/technical/0.2.0/engineering-principles.md",
      ),
      "# Updated principles\n",
    );

    const finalizeResult = await finalizeTechnicalTargetVersion(workspaceDir, [
      "engineering-principles.md",
    ]);

    expect(finalizeResult.copiedFiles.length).toBeGreaterThan(0);
    expect(
      existsSync(
        join(
          workspaceDir,
          "brief/technical/0.2.0/engineering-decisions.md",
        ),
      ),
    ).toBe(true);
    expect(
      readFileSync(
        join(
          workspaceDir,
          "brief/technical/0.2.0/engineering-principles.md",
        ),
        "utf8",
      ),
    ).toContain("# Updated principles");
  });

  it("creates a target version with full copy and promotes it to current", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-refactor-"));
    const context: InitContextWithLabels = {
      targetDir: tempDir,
      assistant: "cursor",
      modules: { workflow: false, spec: false },
      labels: { assistant: "Cursor" },
    };

    await initWorkspace({ context });
    const workspaceDir = join(tempDir, ".workspace");

    const createResult = await createTechnicalTargetVersion(workspaceDir);
    expect(createResult.targetVersion).toBe("0.2.0");
    expect(
      existsSync(
        join(
          workspaceDir,
          "brief/technical/0.2.0/engineering-principles.md",
        ),
      ),
    ).toBe(true);

    writeFileSync(
      join(
        workspaceDir,
        "brief/technical/0.2.0/engineering-principles.md",
      ),
      "# Updated principles\n",
    );

    const promoteResult = await promoteTechnicalTarget(workspaceDir);
    expect(promoteResult.newCurrent).toBe("0.2.0");
    expect(promoteResult.previousCurrent).toBe("0.1.0");

    const manifest = await readManifest(workspaceDir);
    expect(manifest?.technical.current).toBe("0.2.0");
    expect(manifest?.technical.target).toBe(null);
    expect(manifest?.technical.archived).toContain("0.1.0");

    expect(
      readFileSync(
        join(
          workspaceDir,
          "brief/technical/0.2.0/engineering-principles.md",
        ),
        "utf8",
      ),
    ).toContain("# Updated principles");
  });
});

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  BriefPathResolutionError,
  resolveBriefFilePath,
  resolveBusinessBriefDir,
  resolveTechnicalBriefDir,
} from "../src/workspace/brief-paths.js";
import {
  ManifestValidationError,
  createDefaultManifest,
  readManifest,
  validateManifest,
  writeManifest,
} from "../src/workspace/manifest.js";

describe("brief manifest", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  function createWorkspaceDir(): string {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-manifest-"));
    return tempDir;
  }

  it("creates a default manifest with semver 0.1.0", () => {
    const manifest = createDefaultManifest();

    expect(manifest).toEqual({
      schema: 1,
      business: {
        current: "0.1.0",
        target: null,
        archived: [],
      },
      technical: {
        current: "0.1.0",
        target: null,
        archived: [],
      },
      spec: {
        aligned_with: {
          business: "0.1.0",
          technical: "0.1.0",
        },
      },
    });
  });

  it("writes and reads manifest.yaml from the workspace", async () => {
    const workspaceDir = createWorkspaceDir();
    mkdirSync(join(workspaceDir, "brief"), { recursive: true });

    const manifest = createDefaultManifest();
    await writeManifest(workspaceDir, manifest);

    const loaded = await readManifest(workspaceDir);

    expect(loaded).toEqual(manifest);
  });

  it("returns null when manifest.yaml is missing", async () => {
    const workspaceDir = createWorkspaceDir();

    await expect(readManifest(workspaceDir)).resolves.toBeNull();
  });

  it("resolves business current and technical target paths", async () => {
    const workspaceDir = createWorkspaceDir();
    mkdirSync(join(workspaceDir, "brief"), { recursive: true });

    const manifest = createDefaultManifest();
    manifest.technical.target = "0.2.0";

    await writeManifest(workspaceDir, manifest);

    await expect(resolveBusinessBriefDir(workspaceDir, "current")).resolves.toBe(
      join(workspaceDir, "brief/business/0.1.0"),
    );
    await expect(resolveTechnicalBriefDir(workspaceDir, "target")).resolves.toBe(
      join(workspaceDir, "brief/technical/0.2.0"),
    );
    await expect(
      resolveBriefFilePath(
        workspaceDir,
        "technical",
        "target",
        "engineering-principles.md",
      ),
    ).resolves.toBe(
      join(
        workspaceDir,
        "brief/technical/0.2.0/engineering-principles.md",
      ),
    );
  });

  it("rejects invalid semver values during validation", () => {
    const manifest = createDefaultManifest();
    manifest.business.current = "v1";

    expect(() => validateManifest(manifest)).toThrow(ManifestValidationError);
    expect(() => validateManifest(manifest)).toThrow(/x\.y\.z/);
  });

  it("throws when resolving target while lane target is null", async () => {
    const workspaceDir = createWorkspaceDir();
    mkdirSync(join(workspaceDir, "brief"), { recursive: true });
    await writeManifest(workspaceDir, createDefaultManifest());

    await expect(resolveBusinessBriefDir(workspaceDir, "target")).rejects.toThrow(
      BriefPathResolutionError,
    );
    await expect(resolveBusinessBriefDir(workspaceDir, "target")).rejects.toThrow(
      /business\.target is null/,
    );
  });

  it("detects legacy flat layout when manifest is missing", async () => {
    const workspaceDir = createWorkspaceDir();
    mkdirSync(join(workspaceDir, "brief/business"), { recursive: true });
    writeFileSync(
      join(workspaceDir, "brief/business/product-principles.md"),
      "# Product Principles\n",
    );

    await expect(readManifest(workspaceDir)).resolves.toBeNull();
    await expect(resolveBusinessBriefDir(workspaceDir, "current")).rejects.toThrow(
      /legacy flat layout/,
    );
  });
});

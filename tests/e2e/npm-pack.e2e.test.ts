import { execSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { NPM_PACK_REQUIRED_PATHS } from "./expected-paths.js";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const packageJson = JSON.parse(
  readFileSync(join(projectRoot, "package.json"), "utf8"),
) as { version: string };

const tarballPath = join(projectRoot, `sdd-studio-${packageJson.version}.tgz`);

function createTarball(): string {
  if (existsSync(tarballPath)) {
    rmSync(tarballPath, { force: true });
  }

  execSync("npm pack", { cwd: projectRoot, stdio: "ignore" });

  if (!existsSync(tarballPath)) {
    throw new Error(`Tarball not found: ${tarballPath}`);
  }

  return tarballPath;
}

describe("npm pack e2e", () => {
  let packDir = "";

  afterEach(() => {
    if (existsSync(tarballPath)) {
      rmSync(tarballPath, { force: true });
    }
    if (packDir) {
      rmSync(packDir, { recursive: true, force: true });
      packDir = "";
    }
  });

  it("includes dist, bin, and templates in the published tarball", () => {
    createTarball();

    const listing = execSync(`tar -tzf "${tarballPath}"`, {
      encoding: "utf8",
    });

    for (const relativePath of NPM_PACK_REQUIRED_PATHS) {
      expect(listing).toContain(`package/${relativePath}`);
    }
  });

  it("installed package can run init --yes", () => {
    createTarball();

    packDir = mkdtempSync(join(tmpdir(), "sdd-studio-pack-install-"));

    execSync(`npm install "${tarballPath}"`, {
      cwd: packDir,
      stdio: "pipe",
    });

    const installedBin = join(
      packDir,
      "node_modules",
      "sdd-studio",
      "bin",
      "sdd-studio.js",
    );
    const targetDir = join(packDir, "demo");
    mkdirSync(targetDir);

    execSync(`node "${installedBin}" init --yes --assistant cursor`, {
      cwd: targetDir,
      stdio: "pipe",
    });

    const visionMd = readFileSync(
      join(targetDir, "workspace/spec/vision.md"),
      "utf8",
    );

    expect(visionMd).toContain("sdd-idea");
    expect(existsSync(join(targetDir, ".cursor/skills/sdd-idea/SKILL.md"))).toBe(
      true,
    );
  });
});

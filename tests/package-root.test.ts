import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getPackageRoot, getTemplatesDir } from "../src/utils/package-root.js";

describe("package-root", () => {
  it("resolves the sdd-studio package root", () => {
    const root = getPackageRoot();
    expect(existsSync(join(root, "package.json"))).toBe(true);
  });

  it("resolves the templates directory", () => {
    const templatesDir = getTemplatesDir();
    expect(existsSync(join(templatesDir, "assistants", "cursor", "skills"))).toBe(
      true,
    );
  });
});

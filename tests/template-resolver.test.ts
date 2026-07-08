import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  resolveAssistantTemplatePath,
  resolveTemplatePath,
  resolveWorkspaceTemplatePath,
} from "../src/core/template-resolver.js";

describe("template-resolver", () => {
  it("resolves bundled template paths", () => {
    const engineeringPrinciplesTemplate = resolveWorkspaceTemplatePath(
      "brief/technical/engineering-principles.md",
    );
    const productGuideTemplate = resolveWorkspaceTemplatePath(
      "brief/business/product-guide.md",
    );
    const cursorSkills = resolveAssistantTemplatePath(
      "cursor",
      "skills",
      "sdd-idea",
      "SKILL.md",
    );

    expect(existsSync(engineeringPrinciplesTemplate)).toBe(true);
    expect(existsSync(productGuideTemplate)).toBe(true);
    expect(existsSync(cursorSkills)).toBe(true);
    expect(resolveTemplatePath()).toContain("templates");
  });
});

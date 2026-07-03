import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  resolveAssistantTemplatePath,
  resolveTemplatePath,
  resolveWorkspaceTemplatePath,
} from "../src/core/template-resolver.js";

describe("template-resolver", () => {
  it("resolves bundled template paths", () => {
    const visionTemplate = resolveWorkspaceTemplatePath("spec", "vision.md");
    const cursorSkills = resolveAssistantTemplatePath(
      "cursor",
      "skills",
      "sdd-idea",
      "SKILL.md",
    );

    expect(existsSync(visionTemplate)).toBe(true);
    expect(existsSync(cursorSkills)).toBe(true);
    expect(resolveTemplatePath()).toContain("templates");
  });
});

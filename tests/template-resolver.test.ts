import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  resolveAssistantTemplatePath,
  resolveTemplatePath,
  resolveWorkspaceTemplatePath,
} from "../src/core/template-resolver.js";

describe("template-resolver", () => {
  it("resolves bundled template paths", () => {
    const userManualTemplate = resolveWorkspaceTemplatePath("user-manual.md");
    const projectTemplate = resolveWorkspaceTemplatePath("project.md");
    const cursorSkills = resolveAssistantTemplatePath(
      "cursor",
      "skills",
      "sdd-idea",
      "SKILL.md",
    );

    expect(existsSync(userManualTemplate)).toBe(true);
    expect(existsSync(projectTemplate)).toBe(true);
    expect(existsSync(cursorSkills)).toBe(true);
    expect(resolveTemplatePath()).toContain("templates");
  });
});

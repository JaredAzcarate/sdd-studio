import { describe, expect, it } from "vitest";
import { initContextSchema } from "../src/types/init-context.js";

describe("initContextSchema", () => {
  it("validates a complete init context", () => {
    const result = initContextSchema.parse({
      targetDir: "/tmp/project",
      assistant: "cursor",
      modules: { workflow: false, spec: false },
    });

    expect(result.assistant).toBe("cursor");
    expect(result.targetDir).toBe("/tmp/project");
    expect(result.modules.workflow).toBe(false);
  });

  it("rejects invalid assistant values", () => {
    expect(() =>
      initContextSchema.parse({
        targetDir: "/tmp/project",
        assistant: "vscode",
        modules: { workflow: false, spec: false },
      }),
    ).toThrow();
  });

  it("rejects empty targetDir", () => {
    expect(() =>
      initContextSchema.parse({
        targetDir: "",
        assistant: "cursor",
        modules: { workflow: false, spec: false },
      }),
    ).toThrow();
  });
});

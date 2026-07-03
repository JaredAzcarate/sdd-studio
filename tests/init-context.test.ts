import { describe, expect, it } from "vitest";
import { initContextSchema } from "../src/types/init-context.js";

describe("initContextSchema", () => {
  it("validates a complete init context", () => {
    const result = initContextSchema.parse({
      targetDir: "/tmp/project",
      assistant: "cursor",
    });

    expect(result.assistant).toBe("cursor");
    expect(result.targetDir).toBe("/tmp/project");
  });

  it("rejects invalid assistant values", () => {
    expect(() =>
      initContextSchema.parse({
        targetDir: "/tmp/project",
        assistant: "vscode",
      }),
    ).toThrow();
  });

  it("rejects empty targetDir", () => {
    expect(() =>
      initContextSchema.parse({
        targetDir: "",
        assistant: "cursor",
      }),
    ).toThrow();
  });
});

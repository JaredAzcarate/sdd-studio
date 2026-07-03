import { describe, expect, it } from "vitest";
import {
  INIT_CONTEXT_DEFAULTS,
  buildInitContext,
} from "../src/utils/build-init-context.js";

describe("buildInitContext", () => {
  it("uses defaults when only targetDir is provided", () => {
    const context = buildInitContext({ targetDir: "/tmp/demo" });

    expect(context.assistant).toBe(INIT_CONTEXT_DEFAULTS.assistant);
    expect(context.labels.assistant).toBe("Cursor");
  });

  it("applies assistant override", () => {
    const context = buildInitContext({
      targetDir: "/tmp/demo",
      assistant: "claude",
    });

    expect(context.assistant).toBe("claude");
    expect(context.labels.assistant).toBe("Claude Code");
  });
});

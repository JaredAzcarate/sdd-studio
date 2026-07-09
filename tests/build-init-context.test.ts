import { describe, expect, it } from "vitest";
import {
  INIT_CONTEXT_DEFAULTS,
  buildInitContext,
} from "../src/utils/build-init-context.js";

describe("buildInitContext", () => {
  it("uses defaults when only targetDir is provided", () => {
    const context = buildInitContext({ targetDir: "/tmp/demo" });

    expect(context.assistant).toBe(INIT_CONTEXT_DEFAULTS.assistant);
    expect(context.modules.workflow).toBe(INIT_CONTEXT_DEFAULTS.modules.workflow);
    expect(context.modules.spec).toBe(INIT_CONTEXT_DEFAULTS.modules.spec);
    expect(context.labels.assistant).toBe("Cursor");
  });

  it("applies spec module override", () => {
    const context = buildInitContext({
      targetDir: "/tmp/demo",
      modules: { spec: true },
    });

    expect(context.modules.spec).toBe(true);
  });

  it("applies workflow module override", () => {
    const context = buildInitContext({
      targetDir: "/tmp/demo",
      modules: { workflow: true },
    });

    expect(context.modules.workflow).toBe(true);
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

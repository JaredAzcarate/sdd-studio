import { describe, expect, it } from "vitest";
import { formatInitSummary } from "../src/utils/format-init-summary.js";
import type { InitContextWithLabels } from "../src/types/init-context.js";
import type { InitWorkspaceResult } from "../src/use-cases/init-workspace.use-case.js";

const sampleContext: InitContextWithLabels = {
  targetDir: "/tmp/demo",
  assistant: "cursor",
  modules: { workflow: false },
  labels: {
    assistant: "Cursor",
  },
};

const cursorResult: InitWorkspaceResult = {
  workspaceDir: "/tmp/demo/workspace",
  createdPaths: [],
  modules: { workflow: false },
  assistant: { assistantId: "cursor", installed: true, createdPaths: [] },
};

describe("formatInitSummary", () => {
  it("shows assistant and next step for cursor", () => {
    const summary = formatInitSummary(sampleContext, cursorResult);

    expect(summary).toContain("Cursor");
    expect(summary).toContain("Brief under .workspace/brief/");
    expect(summary).toContain("Workflow module:   disabled");
  });

  it("shows next step for claude when installed", () => {
    const summary = formatInitSummary(
      { ...sampleContext, assistant: "claude", labels: { assistant: "Claude Code" } },
      {
        ...cursorResult,
        assistant: { assistantId: "claude", installed: true, createdPaths: [] },
      },
    );

    expect(summary).toContain("Claude Code");
    expect(summary).toContain("Brief under .workspace/brief/");
  });
});

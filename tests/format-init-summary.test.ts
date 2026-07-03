import { describe, expect, it } from "vitest";
import { formatInitSummary } from "../src/utils/format-init-summary.js";
import type { InitContextWithLabels } from "../src/types/init-context.js";
import type { InitWorkspaceResult } from "../src/use-cases/init-workspace.use-case.js";

const sampleContext: InitContextWithLabels = {
  targetDir: "/tmp/demo",
  assistant: "cursor",
  labels: {
    assistant: "Cursor",
  },
};

const cursorResult: InitWorkspaceResult = {
  workspaceDir: "/tmp/demo/workspace",
  createdPaths: [],
  assistant: { assistantId: "cursor", installed: true, createdPaths: [] },
};

describe("formatInitSummary", () => {
  it("shows assistant and next step for cursor", () => {
    const summary = formatInitSummary(sampleContext, cursorResult);

    expect(summary).toContain("Cursor");
    expect(summary).toContain("project.md and product-guide.md");
    expect(summary).not.toContain("Organization");
  });

  it("shows skip message for unsupported assistants", () => {
    const summary = formatInitSummary(sampleContext, {
      ...cursorResult,
      assistant: {
        assistantId: "claude",
        installed: false,
        createdPaths: [],
        message: "Assistant will be available in a future release.",
      },
    });

    expect(summary).toContain("future release");
  });
});

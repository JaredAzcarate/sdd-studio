import { describe, expect, it } from "vitest";
import { DEFAULT_ENGINEERING_ANSWERS } from "../src/engineering-config/catalog/index.js";
import { parseMultiAnswer } from "../src/engineering-config/catalog/question-utils.js";
import { formatConfigureResult } from "../src/utils/format-configure-result.js";
import { formatEngineeringConfigureSummary } from "../src/utils/format-engineering-summary.js";
import { formatSpecScaffoldResult } from "../src/utils/format-spec-scaffold-result.js";
import { formatWorkflowConfigureSummary } from "../src/utils/format-workflow-result.js";

describe("formatEngineeringConfigureSummary", () => {
  it("lists engineering brief files and next steps", () => {
    const lines = formatEngineeringConfigureSummary();
    const text = lines.join("\n");

    expect(text).toContain("engineering-frontend-patterns.md");
    expect(text).toContain("sdd-idea");
    expect(text).toContain("sdd-spec");
  });
});

describe("formatConfigureResult", () => {
  it("mentions sdd-idea before sdd-technical", () => {
    const text = formatConfigureResult("/tmp/demo", {
      writtenPaths: ["/tmp/demo/.workspace/brief/technical/engineering-principles.md"],
      answers: {},
      customNotes: {},
    });

    expect(text).toContain("sdd-idea");
    expect(text).toContain("sdd-technical");
  });
});

describe("formatWorkflowConfigureSummary", () => {
  it("points to sdd-plan after workflow config", () => {
    const text = formatWorkflowConfigureSummary().join("\n");

    expect(text).toContain("workflow-config.md");
    expect(text).toContain("sdd-plan");
  });
});

describe("formatSpecScaffoldResult", () => {
  it("reports created file count", () => {
    const text = formatSpecScaffoldResult({ fileCount: 12 }).join("\n");

    expect(text).toContain("12");
    expect(text).toContain("sdd-spec");
  });

  it("handles existing scaffold", () => {
    const text = formatSpecScaffoldResult({ alreadyExists: true }).join("\n");

    expect(text).toContain("already exists");
  });
});

describe("DEFAULT_ENGINEERING_ANSWERS multiselect defaults", () => {
  it("pre-selects async UI states", () => {
    const selected = parseMultiAnswer(
      DEFAULT_ENGINEERING_ANSWERS["async-ui-states"],
    );

    expect(selected).toEqual(
      expect.arrayContaining(["loading", "error", "success", "empty"]),
    );
  });

  it("pre-selects PR conventions", () => {
    const selected = parseMultiAnswer(
      DEFAULT_ENGINEERING_ANSWERS["pr-conventions"],
    );

    expect(selected).toContain("delete-branch-on-merge");
    expect(selected).toContain("linked-task-required");
  });
});

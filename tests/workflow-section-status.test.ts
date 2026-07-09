import { describe, expect, it } from "vitest";
import { WORKFLOW_SECTIONS } from "../src/workflow-config/catalog/index.js";
import {
  countCompletedWorkflowSections,
  getWorkflowSectionStatus,
  statusIcon,
} from "../src/workflow-config/state/workflow-section-status.js";

describe("workflow section status", () => {
  it("reports not-started when no answers exist", () => {
    expect(getWorkflowSectionStatus("methodology", {})).toBe("not-started");
    expect(statusIcon("not-started")).toBe("○");
  });

  it("reports in-progress when some answers exist", () => {
    const section = WORKFLOW_SECTIONS.find((item) => item.id === "methodology")!;
    const answers = {
      [section.questions[0].id]: section.questions[0].options[0].id,
    };

    expect(getWorkflowSectionStatus("methodology", answers)).toBe("in-progress");
    expect(statusIcon("in-progress")).toBe("◐");
  });

  it("reports completed when all section answers exist", () => {
    const section = WORKFLOW_SECTIONS.find(
      (item) => item.id === "task-conventions",
    )!;
    const answers = Object.fromEntries(
      section.questions.map((question) => [
        question.id,
        question.options[0].id,
      ]),
    );

    expect(getWorkflowSectionStatus("task-conventions", answers)).toBe(
      "completed",
    );
    expect(countCompletedWorkflowSections(answers)).toBe(1);
    expect(statusIcon("completed")).toBe("✔");
  });
});

import { describe, expect, it } from "vitest";
import { ENGINEERING_SECTIONS } from "../src/engineering-config/catalog/index.js";
import {
  countCompletedSections,
  getSectionStatus,
  statusIcon,
} from "../src/engineering-config/state/engineering-section-status.js";

describe("engineering section status", () => {
  it("reports not-started when no answers exist", () => {
    expect(getSectionStatus("principles", {})).toBe("not-started");
    expect(statusIcon("not-started")).toBe("○");
  });

  it("reports in-progress when some answers exist", () => {
    const section = ENGINEERING_SECTIONS.find((item) => item.id === "principles")!;
    const answers = {
      [section.questions[0].id]: section.questions[0].options[0].id,
    };

    expect(getSectionStatus("principles", answers)).toBe("in-progress");
    expect(statusIcon("in-progress")).toBe("◐");
  });

  it("reports completed when all section answers exist", () => {
    const section = ENGINEERING_SECTIONS.find((item) => item.id === "conventions")!;
    const answers = Object.fromEntries(
      section.questions.map((question) => [
        question.id,
        question.options[0].id,
      ]),
    );

    expect(getSectionStatus("conventions", answers)).toBe("completed");
    expect(countCompletedSections(answers)).toBe(1);
    expect(statusIcon("completed")).toBe("✔");
  });
});

import { describe, expect, it } from "vitest";
import {
  renderTemplateString,
} from "../src/core/template-engine.js";

describe("template-engine", () => {
  it("renders a template string", () => {
    const output = renderTemplateString("assistant: {{assistant}}", {
      assistant: "Cursor",
    });

    expect(output).toBe("assistant: Cursor");
  });
});

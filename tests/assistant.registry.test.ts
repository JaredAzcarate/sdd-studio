import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { installAssistant } from "../src/assistants/assistant.registry.js";

describe("installAssistant", () => {
  it("returns a skip message for unsupported assistants", async () => {
    const result = await installAssistant("claude", "/tmp/unused");

    expect(result.installed).toBe(false);
    expect(result.message).toContain("future release");
  });
});

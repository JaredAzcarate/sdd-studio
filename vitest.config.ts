import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "tests/e2e/**/*.e2e.test.ts"],
    testTimeout: 30000,
  },
});

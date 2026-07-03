import { existsSync } from "node:fs";
import { join } from "node:path";

export function assertPathsExist(
  rootDir: string,
  relativePaths: readonly string[],
): void {
  const missing = relativePaths.filter(
    (relativePath) => !existsSync(join(rootDir, relativePath)),
  );

  if (missing.length > 0) {
    throw new Error(`Missing paths:\n${missing.map((p) => `  - ${p}`).join("\n")}`);
  }
}

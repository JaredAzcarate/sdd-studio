import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_NAME = "sdd-studio";

export function getPackageRoot(): string {
  let dir = dirname(fileURLToPath(import.meta.url));

  while (dir !== dirname(dir)) {
    const packageJsonPath = join(dir, "package.json");

    if (existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
          name?: string;
        };

        if (pkg.name === PACKAGE_NAME) {
          return dir;
        }
      } catch {
        // Continue searching parent directories.
      }
    }

    dir = dirname(dir);
  }

  throw new Error(`Could not find ${PACKAGE_NAME} package root`);
}

export function getTemplatesDir(): string {
  return join(getPackageRoot(), "templates");
}

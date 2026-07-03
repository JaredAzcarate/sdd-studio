import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const distEntry = join(projectRoot, "dist/cli.js");

export default async function globalSetup(): Promise<void> {
  if (!existsSync(distEntry)) {
    execSync("npm run build", { cwd: projectRoot, stdio: "inherit" });
  }
}

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { createInitCommand } from "./commands/init.command.js";
import { createMigrateCommand } from "./commands/migrate.command.js";
import { createSyncCommand } from "./commands/sync.command.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(currentDir, "..", "package.json");
const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
  version: string;
};

const program = new Command();

program
  .name("sdd-studio")
  .description("Bootstrap a Specification Driven Development workspace")
  .version(pkg.version);

program.addCommand(createInitCommand());
program.addCommand(createMigrateCommand());
program.addCommand(createSyncCommand());

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
});

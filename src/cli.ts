import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { createConfigureCommand } from "./commands/configure.command.js";
import { createConfigureWorkflowCommand } from "./commands/configure-workflow.command.js";
import { createInitCommand } from "./commands/init.command.js";
import { createMigrateCommand } from "./commands/migrate.command.js";
import { createSyncCommand } from "./commands/sync.command.js";
import { assertInteractiveTerminal } from "./policies/target-directory.policy.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(currentDir, "..", "package.json");
const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
  version: string;
};

const program = new Command();
const args = process.argv.slice(2);
const shouldLaunchTui =
  args.length === 0 || args[0] === "tui" || args[0] === "ui";

program
  .name("sdd-studio")
  .description("Bootstrap a Specification Driven Development workspace")
  .version(pkg.version);

program.addCommand(createInitCommand(pkg.version));
program.addCommand(createConfigureCommand(pkg.version));
program.addCommand(createConfigureWorkflowCommand(pkg.version));
program.addCommand(createMigrateCommand());
program.addCommand(createSyncCommand());

try {
  if (shouldLaunchTui) {
    assertInteractiveTerminal();
    const { runTui } = await import("./tui/run-tui.js");
    await runTui({
      targetDir: cwd(),
      version: pkg.version,
    });
    process.exit(0);
  }

  await program.parseAsync(process.argv);
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}

import { cwd } from "node:process";
import { Command } from "commander";
import { migrateWorkspace } from "../generators/migrate-workspace.generator.js";
import { formatMigrateResult } from "../utils/format-migrate-result.js";

export function createMigrateCommand(): Command {
  return new Command("migrate")
    .description(
      "Migrate a legacy SDD workspace to the Brief / Specification structure",
    )
    .action(async () => {
      const targetDir = cwd();
      const result = await migrateWorkspace({ targetDir });

      console.log("");
      console.log(formatMigrateResult(targetDir, result));
      console.log("");
    });
}

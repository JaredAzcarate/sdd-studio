import { cwd } from "node:process";
import { Command } from "commander";
import { assertSyncTargetEligible } from "../policies/target-directory.policy.js";
import { syncAssistant } from "../use-cases/sync-assistant.use-case.js";
import { assistantIdSchema } from "../types/init-context.js";
import { INIT_CONTEXT_DEFAULTS } from "../utils/build-init-context.js";
import { formatSyncResult } from "../utils/format-sync-result.js";

type SyncCommandOptions = {
  skills?: boolean;
  assistant?: string;
};

export function createSyncCommand(): Command {
  return new Command("sync")
    .description(
      "Update assistant files (.cursor/) from the installed package without modifying workspace/",
    )
    .option("--skills", "Sync only .cursor/skills/, not rules")
    .option(
      "--assistant <assistant>",
      "Assistant ID: cursor, claude, codex",
      INIT_CONTEXT_DEFAULTS.assistant,
    )
    .action(async (options: SyncCommandOptions) => {
      const targetDir = cwd();
      assertSyncTargetEligible(targetDir);

      const assistant = assistantIdSchema.parse(options.assistant);
      const scope = options.skills ? "skills" : "all";

      const result = await syncAssistant({
        targetDir,
        assistant,
        scope,
      });

      if (!result.installed) {
        throw new Error(
          result.message ??
            `Assistant "${assistant}" is not available for sync.`,
        );
      }

      console.log("");
      console.log(formatSyncResult(targetDir, scope, result));
      console.log("");
    });
}

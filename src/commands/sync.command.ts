import { cwd } from "node:process";
import { Command } from "commander";
import { SDD_WORKSPACE_DIR } from "../constants/sdd-workspace-path.js";
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
      `Update assistant files from the installed package without modifying ${SDD_WORKSPACE_DIR}/`,
    )
    .option("--skills", "Sync only skills, not project instructions or rules")
    .option(
      "--assistant <assistant>",
      "Assistant ID: cursor, claude, codex, opencode, copilot",
      INIT_CONTEXT_DEFAULTS.assistant,
    )
    .action(async (options: SyncCommandOptions) => {
      const targetDir = cwd();
      const assistant = assistantIdSchema.parse(options.assistant);
      assertSyncTargetEligible(targetDir, assistant);

      const scope = options.skills ? "skills" : "all";

      const result = await syncAssistant({
        targetDir,
        assistant,
        scope,
      });

      console.log("");
      console.log(formatSyncResult(targetDir, assistant, scope, result));
      console.log("");
    });
}

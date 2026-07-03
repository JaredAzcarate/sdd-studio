import { cwd } from "node:process";
import { Command } from "commander";
import {
  assertInteractiveTerminal,
  assertTargetDirectoryAvailable,
} from "../policies/target-directory.policy.js";
import { runInitPrompts } from "../prompts/run-init-prompts.js";
import { initWorkspace } from "../use-cases/init-workspace.use-case.js";
import { assistantIdSchema } from "../types/init-context.js";
import { buildInitContext } from "../utils/build-init-context.js";
import { formatGenerationResult } from "../utils/format-generation-result.js";
import { formatInitSummary } from "../utils/format-init-summary.js";

type InitCommandOptions = {
  yes?: boolean;
  assistant?: string;
};

export function createInitCommand(): Command {
  return new Command("init")
    .description("Initialize an SDD workspace in the current directory")
    .option("--yes", "Skip prompts and use defaults")
    .option(
      "--assistant <assistant>",
      "Assistant ID: cursor, claude, codex, opencode",
    )
    .action(async (options: InitCommandOptions) => {
      const targetDir = cwd();
      assertTargetDirectoryAvailable(targetDir);

      const context = options.yes
        ? buildInitContext({
            targetDir,
            assistant: options.assistant
              ? assistantIdSchema.parse(options.assistant)
              : undefined,
          })
        : await (() => {
            assertInteractiveTerminal();
            return runInitPrompts(targetDir);
          })();

      const result = await initWorkspace({ context });

      console.log("");
      console.log(formatInitSummary(context, result));
      console.log("");
      console.log(formatGenerationResult(targetDir, context.assistant, result));
      console.log("");
    });
}

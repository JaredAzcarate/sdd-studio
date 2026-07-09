import { cwd } from "node:process";
import { Command } from "commander";
import {
  assertInteractiveTerminal,
  assertTargetDirectoryAvailable,
} from "../policies/target-directory.policy.js";
import { initWorkspace } from "../use-cases/init-workspace.use-case.js";
import { getDefaultEngineeringAnswers } from "../engineering-config/catalog/index.js";
import { assistantIdSchema } from "../types/init-context.js";
import { buildInitContext } from "../utils/build-init-context.js";
import { formatGenerationResult } from "../utils/format-generation-result.js";
import { formatInitSummary } from "../utils/format-init-summary.js";

type InitCommandOptions = {
  yes?: boolean;
  assistant?: string;
  workflow?: boolean;
  spec?: boolean;
  engineering?: boolean;
};

export function createInitCommand(version: string): Command {
  return new Command("init")
    .description("Initialize an SDD workspace in the current directory")
    .option("--yes", "Skip prompts and use defaults")
    .option(
      "--assistant <assistant>",
      "Assistant ID: cursor, claude, codex, opencode, copilot",
    )
    .option(
      "--workflow",
      "Include the SDD workflow module (roadmap, milestones, releases)",
    )
    .option(
      "--spec",
      "Include the specification scaffold under .workspace/spec/",
    )
    .option(
      "--engineering",
      "Apply default Engineering Brief answers (non-interactive; use with --yes)",
    )
    .action(async (options: InitCommandOptions) => {
      const targetDir = cwd();
      assertTargetDirectoryAvailable(targetDir);

      if (options.yes) {
        const context = buildInitContext({
          targetDir,
          assistant: options.assistant
            ? assistantIdSchema.parse(options.assistant)
            : undefined,
          modules: {
            workflow: options.workflow ?? false,
            spec: options.spec ?? false,
          },
          engineering: options.engineering
            ? { answers: getDefaultEngineeringAnswers() }
            : undefined,
        });

        const result = await initWorkspace({ context });

        console.log("");
        console.log(formatInitSummary(context, result));
        console.log("");
        console.log(formatGenerationResult(targetDir, context.assistant, result));
        console.log("");
        return;
      }

      assertInteractiveTerminal();
      const { runTui } = await import("../tui/run-tui.js");
      await runTui({
        targetDir,
        version,
        initialScreen: { name: "project-type" },
      });
    });
}

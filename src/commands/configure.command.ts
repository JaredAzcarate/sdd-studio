import { cwd } from "node:process";
import { join } from "node:path";
import { Command } from "commander";
import { assertInteractiveTerminal } from "../policies/target-directory.policy.js";
import { SDD_WORKSPACE_DIR } from "../constants/sdd-workspace-path.js";
import { hasSddWorkspace } from "../workspace/workspace-detection.js";

export function createConfigureCommand(version: string): Command {
  return new Command("configure")
    .description(
      "Configure the Engineering Brief (principles, decisions, conventions)",
    )
    .action(async () => {
      const targetDir = cwd();

      if (!hasSddWorkspace(targetDir)) {
        throw new Error(
          `No SDD workspace found at ${join(targetDir, SDD_WORKSPACE_DIR)}. Run sdd-studio init first.`,
        );
      }

      assertInteractiveTerminal();
      const { runTui } = await import("../tui/run-tui.js");
      await runTui({
        targetDir,
        version,
        initialScreen: { name: "engineering-dashboard" },
      });
    });
}

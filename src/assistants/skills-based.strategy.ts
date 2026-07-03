import { join } from "node:path";
import type { AssistantId } from "../types/init-context.js";
import type {
  AssistantInstallResult,
  AssistantStrategy,
  AssistantSyncOptions,
} from "./assistant.strategy.js";
import { copySddAssistantFiles } from "./copy-sdd-assistant-files.js";

export type SkillsBasedAssistantConfig = {
  id: AssistantId;
  skillsDir: string;
  instructionsFile: string;
};

export function createSkillsBasedAssistantStrategy(
  config: SkillsBasedAssistantConfig,
): AssistantStrategy {
  return {
    id: config.id,

    async install(
      targetDir: string,
      overwrite = false,
    ): Promise<AssistantInstallResult> {
      const createdPaths = await copySddAssistantFiles(config.id, targetDir, {
        overwrite,
        includeProjectInstructions: true,
      });

      return {
        assistantId: config.id,
        installed: true,
        createdPaths,
      };
    },

    async sync(
      targetDir: string,
      options: AssistantSyncOptions = {},
    ): Promise<AssistantInstallResult> {
      const scope = options.scope ?? "all";
      const createdPaths = await copySddAssistantFiles(config.id, targetDir, {
        overwrite: true,
        includeProjectInstructions: scope === "all",
      });

      return {
        assistantId: config.id,
        installed: true,
        createdPaths,
      };
    },
  };
}

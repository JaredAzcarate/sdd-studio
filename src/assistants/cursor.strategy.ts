import type {
  AssistantInstallResult,
  AssistantStrategy,
  AssistantSyncOptions,
} from "./assistant.strategy.js";
import { copySddAssistantFiles } from "./copy-sdd-assistant-files.js";

export class CursorAssistantStrategy implements AssistantStrategy {
  readonly id = "cursor";

  async install(
    targetDir: string,
    overwrite = false,
  ): Promise<AssistantInstallResult> {
    const createdPaths = await copySddAssistantFiles(this.id, targetDir, {
      overwrite,
      includeProjectInstructions: true,
    });

    return {
      assistantId: this.id,
      installed: true,
      createdPaths,
    };
  }

  async sync(
    targetDir: string,
    options: AssistantSyncOptions = {},
  ): Promise<AssistantInstallResult> {
    const scope = options.scope ?? "all";
    const createdPaths = await copySddAssistantFiles(this.id, targetDir, {
      overwrite: true,
      includeProjectInstructions: scope === "all",
    });

    return {
      assistantId: this.id,
      installed: true,
      createdPaths,
    };
  }
}

export const cursorAssistantStrategy = new CursorAssistantStrategy();

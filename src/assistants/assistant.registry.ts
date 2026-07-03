import type { AssistantId } from "../types/init-context.js";
import type {
  AssistantInstallResult,
  AssistantStrategy,
  AssistantSyncOptions,
} from "./assistant.strategy.js";
import { cursorAssistantStrategy } from "./cursor.strategy.js";

const STRATEGIES: Record<AssistantId, AssistantStrategy | null> = {
  cursor: cursorAssistantStrategy,
  claude: null,
  codex: null,
};

export function getAssistantStrategy(
  assistantId: AssistantId,
): AssistantStrategy | null {
  return STRATEGIES[assistantId] ?? null;
}

export async function installAssistant(
  assistantId: AssistantId,
  targetDir: string,
  overwrite = false,
): Promise<AssistantInstallResult> {
  const strategy = getAssistantStrategy(assistantId);

  if (!strategy) {
    return {
      assistantId,
      installed: false,
      createdPaths: [],
      message: `Assistant "${assistantId}" will be available in a future release.`,
    };
  }

  return strategy.install(targetDir, overwrite);
}

export async function syncAssistant(
  assistantId: AssistantId,
  targetDir: string,
  options: AssistantSyncOptions = {},
): Promise<AssistantInstallResult> {
  const strategy = getAssistantStrategy(assistantId);

  if (!strategy) {
    return {
      assistantId,
      installed: false,
      createdPaths: [],
      message: `Assistant "${assistantId}" will be available in a future release.`,
    };
  }

  return strategy.sync(targetDir, options);
}

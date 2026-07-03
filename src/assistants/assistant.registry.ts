import type { AssistantId } from "../types/init-context.js";
import type {
  AssistantInstallResult,
  AssistantStrategy,
  AssistantSyncOptions,
} from "./assistant.strategy.js";
import { claudeAssistantStrategy } from "./claude.strategy.js";
import { codexAssistantStrategy } from "./codex.strategy.js";
import { copilotAssistantStrategy } from "./copilot.strategy.js";
import { cursorAssistantStrategy } from "./cursor.strategy.js";
import { opencodeAssistantStrategy } from "./opencode.strategy.js";

const STRATEGIES: Record<AssistantId, AssistantStrategy> = {
  cursor: cursorAssistantStrategy,
  claude: claudeAssistantStrategy,
  codex: codexAssistantStrategy,
  opencode: opencodeAssistantStrategy,
  copilot: copilotAssistantStrategy,
};

export function getAssistantStrategy(
  assistantId: AssistantId,
): AssistantStrategy {
  return STRATEGIES[assistantId];
}

export async function installAssistant(
  assistantId: AssistantId,
  targetDir: string,
  overwrite = false,
): Promise<AssistantInstallResult> {
  const strategy = getAssistantStrategy(assistantId);
  return strategy.install(targetDir, overwrite);
}

export async function syncAssistant(
  assistantId: AssistantId,
  targetDir: string,
  options: AssistantSyncOptions = {},
): Promise<AssistantInstallResult> {
  const strategy = getAssistantStrategy(assistantId);
  return strategy.sync(targetDir, options);
}

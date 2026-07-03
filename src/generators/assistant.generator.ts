import type { AssistantId } from "../types/init-context.js";
import { installAssistant } from "../assistants/assistant.registry.js";
import type { AssistantInstallResult } from "../assistants/assistant.strategy.js";

export async function generateAssistantSetup(
  assistantId: AssistantId,
  targetDir: string,
  overwrite = false,
): Promise<AssistantInstallResult> {
  return installAssistant(assistantId, targetDir, overwrite);
}

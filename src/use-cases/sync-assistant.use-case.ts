import { syncAssistant as syncAssistantFromRegistry } from "../assistants/assistant.registry.js";
import type {
  AssistantInstallResult,
  AssistantSyncScope,
} from "../assistants/assistant.strategy.js";
import type { AssistantId } from "../types/init-context.js";

export type SyncAssistantInput = {
  targetDir: string;
  assistant: AssistantId;
  scope: AssistantSyncScope;
};

export async function syncAssistant(
  input: SyncAssistantInput,
): Promise<AssistantInstallResult> {
  return syncAssistantFromRegistry(input.assistant, input.targetDir, {
    scope: input.scope,
  });
}

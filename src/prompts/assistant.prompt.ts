import { select } from "@inquirer/prompts";
import { ASSISTANTS } from "../registries/assistants.registry.js";
import type { AssistantId } from "../types/init-context.js";

export async function promptAssistant(): Promise<AssistantId> {
  return select<AssistantId>({
    message: "Which AI assistant do you use?",
    choices: ASSISTANTS.map((item) => ({
      name: item.label,
      value: item.id,
    })),
  });
}

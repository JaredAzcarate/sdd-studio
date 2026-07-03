import { getAssistantLabel } from "../registries/assistants.registry.js";
import {
  initContextSchema,
  type AssistantId,
  type InitContextWithLabels,
} from "../types/init-context.js";

export type BuildInitContextInput = {
  targetDir: string;
  assistant?: AssistantId;
};

export const INIT_CONTEXT_DEFAULTS = {
  assistant: "cursor" as const,
};

export function buildInitContext(
  input: BuildInitContextInput,
): InitContextWithLabels {
  const context = initContextSchema.parse({
    targetDir: input.targetDir,
    assistant: input.assistant ?? INIT_CONTEXT_DEFAULTS.assistant,
  });

  return {
    ...context,
    labels: {
      assistant: getAssistantLabel(context.assistant),
    },
  };
}

import { getAssistantLabel } from "../registries/assistants.registry.js";
import {
  initContextSchema,
  type AssistantId,
  type InitContextWithLabels,
  type WorkspaceModules,
} from "../types/init-context.js";

export type BuildInitContextInput = {
  targetDir: string;
  assistant?: AssistantId;
  modules?: Partial<WorkspaceModules>;
};

export const INIT_CONTEXT_DEFAULTS = {
  assistant: "cursor" as const,
  modules: {
    workflow: false,
  } satisfies WorkspaceModules,
};

export function buildInitContext(
  input: BuildInitContextInput,
): InitContextWithLabels {
  const context = initContextSchema.parse({
    targetDir: input.targetDir,
    assistant: input.assistant ?? INIT_CONTEXT_DEFAULTS.assistant,
    modules: {
      workflow:
        input.modules?.workflow ?? INIT_CONTEXT_DEFAULTS.modules.workflow,
    },
  });

  return {
    ...context,
    labels: {
      assistant: getAssistantLabel(context.assistant),
    },
  };
}

import type { AssistantInstallResult } from "../assistants/assistant.strategy.js";
import { generateAssistantSetup } from "../generators/assistant.generator.js";
import type {
  InitContextWithLabels,
  WorkspaceModules,
} from "../types/init-context.js";
import { generateWorkspace } from "../generators/workspace.generator.js";

export type InitWorkspaceOptions = {
  context: InitContextWithLabels;
  overwrite?: boolean;
};

export type InitWorkspaceResult = {
  workspaceDir: string;
  createdPaths: string[];
  modules: WorkspaceModules;
  assistant: AssistantInstallResult;
};

export async function initWorkspace(
  options: InitWorkspaceOptions,
): Promise<InitWorkspaceResult> {
  const { context, overwrite = false } = options;
  const targetDir = context.targetDir;

  const workspace = await generateWorkspace({
    targetDir,
    overwrite,
    modules: context.modules,
  });

  const assistant = await generateAssistantSetup(
    context.assistant,
    targetDir,
    overwrite,
  );

  return {
    workspaceDir: workspace.workspaceDir,
    createdPaths: [...workspace.createdPaths, ...assistant.createdPaths],
    modules: workspace.modules,
    assistant,
  };
}

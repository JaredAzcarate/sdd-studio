import type { AssistantInstallResult } from "../assistants/assistant.strategy.js";
import { generateAssistantSetup } from "../generators/assistant.generator.js";
import { writeEngineeringBrief } from "../engineering-config/generators/write-engineering-brief.js";
import type {
  EngineeringConfig,
  InitContextWithLabels,
  WorkspaceModules,
} from "../types/init-context.js";
import { generateWorkspace } from "../generators/workspace.generator.js";
import { resolveTechnicalBriefDirFromManifest } from "../workspace/brief-paths.js";
import { readManifest } from "../workspace/manifest.js";

export type InitWorkspaceOptions = {
  context: InitContextWithLabels;
  overwrite?: boolean;
};

export type InitWorkspaceResult = {
  workspaceDir: string;
  createdPaths: string[];
  modules: WorkspaceModules;
  assistant: AssistantInstallResult;
  engineering?: EngineeringConfig;
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

  let engineering: EngineeringConfig | undefined;

  if (context.engineering) {
    const manifest = await readManifest(workspace.workspaceDir);

    if (!manifest) {
      throw new Error(
        `Missing brief manifest in ${workspace.workspaceDir} after workspace generation.`,
      );
    }

    const engineeringResult = await writeEngineeringBrief({
      workspaceTechnicalDir: resolveTechnicalBriefDirFromManifest(
        workspace.workspaceDir,
        "current",
        manifest,
      ),
      answers: context.engineering.answers,
      customNotes: context.engineering.customNotes,
    });

    engineering = { answers: engineeringResult.answers };

    return {
      workspaceDir: workspace.workspaceDir,
      createdPaths: [
        ...workspace.createdPaths,
        ...assistant.createdPaths,
        ...engineeringResult.writtenPaths,
      ],
      modules: workspace.modules,
      assistant,
      engineering,
    };
  }

  return {
    workspaceDir: workspace.workspaceDir,
    createdPaths: [...workspace.createdPaths, ...assistant.createdPaths],
    modules: workspace.modules,
    assistant,
  };
}

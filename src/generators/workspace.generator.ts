import { join } from "node:path";
import { copyTemplateTree } from "../core/file-system.js";
import { resolveWorkspaceTemplatePath } from "../core/template-resolver.js";

export type GenerateWorkspaceOptions = {
  targetDir: string;
  overwrite?: boolean;
};

export type GenerateWorkspaceResult = {
  workspaceDir: string;
  createdPaths: string[];
};

export async function generateWorkspace(
  options: GenerateWorkspaceOptions,
): Promise<GenerateWorkspaceResult> {
  const workspaceTarget = join(options.targetDir, "workspace");

  const { createdPaths } = await copyTemplateTree(
    resolveWorkspaceTemplatePath(),
    workspaceTarget,
    {
      overwrite: options.overwrite ?? false,
    },
  );

  const visionMdPath = join(workspaceTarget, "spec", "vision.md");

  if (!createdPaths.includes(visionMdPath)) {
    throw new Error(`Failed to generate ${visionMdPath}`);
  }

  return {
    workspaceDir: workspaceTarget,
    createdPaths,
  };
}

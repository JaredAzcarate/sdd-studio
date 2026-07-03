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

  const projectMdPath = join(workspaceTarget, "project.md");
  const userManualPath = join(workspaceTarget, "user-manual.md");

  if (!createdPaths.includes(projectMdPath)) {
    throw new Error(`Failed to generate ${projectMdPath}`);
  }

  if (!createdPaths.includes(userManualPath)) {
    throw new Error(`Failed to generate ${userManualPath}`);
  }

  return {
    workspaceDir: workspaceTarget,
    createdPaths,
  };
}

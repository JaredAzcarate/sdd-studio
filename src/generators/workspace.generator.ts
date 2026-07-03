import { join } from "node:path";
import { copyTemplateTree } from "../core/file-system.js";
import { SDD_WORKSPACE_DIR } from "../constants/sdd-workspace-path.js";
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
  const workspaceTarget = join(options.targetDir, SDD_WORKSPACE_DIR);

  const { createdPaths } = await copyTemplateTree(
    resolveWorkspaceTemplatePath(),
    workspaceTarget,
    {
      overwrite: options.overwrite ?? false,
    },
  );

  const projectMdPath = join(workspaceTarget, "project.md");
  const productGuidePath = join(workspaceTarget, "product-guide.md");

  if (!createdPaths.includes(projectMdPath)) {
    throw new Error(`Failed to generate ${projectMdPath}`);
  }

  if (!createdPaths.includes(productGuidePath)) {
    throw new Error(`Failed to generate ${productGuidePath}`);
  }

  return {
    workspaceDir: workspaceTarget,
    createdPaths,
  };
}

import { join } from "node:path";
import { copyTemplateFile, copyTemplateTree } from "../core/file-system.js";
import { SDD_WORKSPACE_DIR } from "../constants/sdd-workspace-path.js";
import { resolveWorkspaceTemplatePath } from "../core/template-resolver.js";
import type { WorkspaceModules } from "../types/init-context.js";

export type GenerateWorkspaceOptions = {
  targetDir: string;
  overwrite?: boolean;
  modules?: WorkspaceModules;
};

export type GenerateWorkspaceResult = {
  workspaceDir: string;
  createdPaths: string[];
  modules: WorkspaceModules;
};

export async function generateWorkspace(
  options: GenerateWorkspaceOptions,
): Promise<GenerateWorkspaceResult> {
  const modules = options.modules ?? { workflow: false };
  const overwrite = options.overwrite ?? false;
  const workspaceTarget = join(options.targetDir, SDD_WORKSPACE_DIR);
  const createdPaths: string[] = [];

  for (const fileName of [
    "product-principles.md",
    "product-guide.md",
    "project.md",
  ] as const) {
    const { createdPaths: filePaths } = await copyTemplateFile(
      resolveWorkspaceTemplatePath(fileName),
      join(workspaceTarget, fileName),
      { overwrite, skipIfExists: !overwrite },
    );
    createdPaths.push(...filePaths);
  }

  const { createdPaths: specPaths } = await copyTemplateTree(
    resolveWorkspaceTemplatePath("spec"),
    join(workspaceTarget, "spec"),
    { overwrite },
  );
  createdPaths.push(...specPaths);

  if (modules.workflow) {
    const { createdPaths: workflowPaths } = await copyTemplateTree(
      resolveWorkspaceTemplatePath("workflow"),
      join(workspaceTarget, "workflow"),
      { overwrite },
    );
    createdPaths.push(...workflowPaths);
  }

  const projectMdPath = join(workspaceTarget, "project.md");
  const productGuidePath = join(workspaceTarget, "product-guide.md");
  const productPrinciplesPath = join(workspaceTarget, "product-principles.md");

  if (!createdPaths.includes(projectMdPath)) {
    throw new Error(`Failed to generate ${projectMdPath}`);
  }

  if (!createdPaths.includes(productGuidePath)) {
    throw new Error(`Failed to generate ${productGuidePath}`);
  }

  if (!createdPaths.includes(productPrinciplesPath)) {
    throw new Error(`Failed to generate ${productPrinciplesPath}`);
  }

  return {
    workspaceDir: workspaceTarget,
    createdPaths,
    modules,
  };
}

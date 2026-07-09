import { join } from "node:path";
import { copyTemplateTree } from "../core/file-system.js";
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

const REQUIRED_BRIEF_FILES = [
  "brief/business/product-principles.md",
  "brief/business/product-guide.md",
  "brief/technical/engineering-principles.md",
  "brief/technical/engineering-decisions.md",
  "brief/technical/engineering-conventions.md",
  "brief/technical/engineering-frontend-patterns.md",
  "brief/technical/engineering-backend-patterns.md",
  "brief/technical/engineering-contribution-patterns.md",
  "brief/technical/engineering-modeling.md",
] as const;

export async function generateWorkspace(
  options: GenerateWorkspaceOptions,
): Promise<GenerateWorkspaceResult> {
  const modules = options.modules ?? { workflow: false };
  const overwrite = options.overwrite ?? false;
  const workspaceTarget = join(options.targetDir, SDD_WORKSPACE_DIR);
  const createdPaths: string[] = [];

  const { createdPaths: briefPaths } = await copyTemplateTree(
    resolveWorkspaceTemplatePath("brief"),
    join(workspaceTarget, "brief"),
    { overwrite },
  );
  createdPaths.push(...briefPaths);

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

  for (const relativePath of REQUIRED_BRIEF_FILES) {
    const absolutePath = join(workspaceTarget, relativePath);
    if (!createdPaths.includes(absolutePath)) {
      throw new Error(`Failed to generate ${absolutePath}`);
    }
  }

  return {
    workspaceDir: workspaceTarget,
    createdPaths,
    modules,
  };
}

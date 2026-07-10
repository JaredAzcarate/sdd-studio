import { join } from "node:path";
import { copyTemplateFile, copyTemplateTree } from "../core/file-system.js";
import { SDD_WORKSPACE_DIR } from "../constants/sdd-workspace-path.js";
import { resolveWorkspaceTemplatePath } from "../core/template-resolver.js";
import type { WorkspaceModules } from "../types/init-context.js";
import {
  createDefaultManifest,
  DEFAULT_INITIAL_VERSION,
  writeManifest,
} from "../workspace/manifest.js";

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

const TECHNICAL_BRIEF_TEMPLATE_FILES = [
  "engineering-principles.md",
  "engineering-decisions.md",
  "engineering-conventions.md",
  "engineering-frontend-patterns.md",
  "engineering-backend-patterns.md",
  "engineering-contribution-patterns.md",
] as const;

function versionedBriefPath(
  lane: "business" | "technical",
  fileName: string,
  version: string = DEFAULT_INITIAL_VERSION,
): string {
  return `brief/${lane}/${version}/${fileName}`;
}

const REQUIRED_BRIEF_FILES = [
  "brief/manifest.yaml",
  versionedBriefPath("business", "product-principles.md"),
  versionedBriefPath("business", "product-guide.md"),
  ...TECHNICAL_BRIEF_TEMPLATE_FILES.map((fileName) =>
    versionedBriefPath("technical", fileName),
  ),
] as const;

const REQUIRED_SPEC_MARKERS = [
  "spec/business/domain/.gitkeep",
  "spec/business/relations/.gitkeep",
  "spec/business/capabilities/.gitkeep",
  "spec/business/flows/.gitkeep",
  "spec/business/rules/.gitkeep",
  "spec/business/security/.gitkeep",
  "spec/business/events/.gitkeep",
  "spec/business/decisions/.gitkeep",
  "spec/technical/api/.gitkeep",
  "spec/technical/ui/.gitkeep",
  "spec/technical/testing/.gitkeep",
  "spec/technical/architecture/.gitkeep",
  "spec/technical/database/.gitkeep",
] as const;

export const DEFAULT_WORKSPACE_MODULES: WorkspaceModules = {
  workflow: false,
  spec: false,
};

async function copyVersionedBriefTemplates(
  workspaceTarget: string,
  overwrite: boolean,
): Promise<string[]> {
  const version = DEFAULT_INITIAL_VERSION;
  const createdPaths: string[] = [];

  const manifestPath = await writeManifest(
    workspaceTarget,
    createDefaultManifest(version),
  );
  createdPaths.push(manifestPath);

  const { createdPaths: businessPaths } = await copyTemplateTree(
    resolveWorkspaceTemplatePath("brief", "business"),
    join(workspaceTarget, "brief", "business", version),
    { overwrite },
  );
  createdPaths.push(...businessPaths);

  for (const fileName of TECHNICAL_BRIEF_TEMPLATE_FILES) {
    const { createdPaths: filePaths } = await copyTemplateFile(
      resolveWorkspaceTemplatePath("brief", "technical", fileName),
      join(workspaceTarget, "brief", "technical", version, fileName),
      { overwrite },
    );
    createdPaths.push(...filePaths);
  }

  return createdPaths;
}

export async function generateWorkspace(
  options: GenerateWorkspaceOptions,
): Promise<GenerateWorkspaceResult> {
  const modules = {
    ...DEFAULT_WORKSPACE_MODULES,
    ...options.modules,
  };
  const overwrite = options.overwrite ?? false;
  const workspaceTarget = join(options.targetDir, SDD_WORKSPACE_DIR);
  const createdPaths: string[] = [];

  const briefPaths = await copyVersionedBriefTemplates(
    workspaceTarget,
    overwrite,
  );
  createdPaths.push(...briefPaths);

  if (modules.spec) {
    const { createdPaths: specPaths } = await copyTemplateTree(
      resolveWorkspaceTemplatePath("spec"),
      join(workspaceTarget, "spec"),
      { overwrite },
    );
    createdPaths.push(...specPaths);
  }

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

  if (modules.spec) {
    for (const relativePath of REQUIRED_SPEC_MARKERS) {
      const absolutePath = join(workspaceTarget, relativePath);
      if (!createdPaths.includes(absolutePath)) {
        throw new Error(`Failed to generate ${absolutePath}`);
      }
    }
  }

  return {
    workspaceDir: workspaceTarget,
    createdPaths,
    modules,
  };
}

export type GenerateSpecScaffoldOptions = {
  targetDir: string;
  overwrite?: boolean;
};

const REQUIRED_WORKFLOW_MARKERS = [
  "workflow/roadmap/.gitkeep",
  "workflow/milestones/.gitkeep",
  "workflow/releases/release-001/release.md",
  "workflow/releases/release-001/tasks.md",
  "workflow/releases/release-001/reviews.md",
  "workflow/workflow-config.md",
] as const;

export type GenerateWorkflowScaffoldOptions = {
  targetDir: string;
  overwrite?: boolean;
};

export async function generateWorkflowScaffold(
  options: GenerateWorkflowScaffoldOptions,
): Promise<GenerateWorkspaceResult> {
  const overwrite = options.overwrite ?? false;
  const workspaceTarget = join(options.targetDir, SDD_WORKSPACE_DIR);
  const createdPaths: string[] = [];

  const { createdPaths: workflowPaths } = await copyTemplateTree(
    resolveWorkspaceTemplatePath("workflow"),
    join(workspaceTarget, "workflow"),
    { overwrite },
  );
  createdPaths.push(...workflowPaths);

  for (const relativePath of REQUIRED_WORKFLOW_MARKERS) {
    const absolutePath = join(workspaceTarget, relativePath);
    if (!createdPaths.includes(absolutePath)) {
      throw new Error(`Failed to generate ${absolutePath}`);
    }
  }

  return {
    workspaceDir: workspaceTarget,
    createdPaths,
    modules: { workflow: true, spec: false },
  };
}

export async function generateSpecScaffold(
  options: GenerateSpecScaffoldOptions,
): Promise<GenerateWorkspaceResult> {
  const overwrite = options.overwrite ?? false;
  const workspaceTarget = join(options.targetDir, SDD_WORKSPACE_DIR);
  const createdPaths: string[] = [];

  const { createdPaths: specPaths } = await copyTemplateTree(
    resolveWorkspaceTemplatePath("spec"),
    join(workspaceTarget, "spec"),
    { overwrite },
  );
  createdPaths.push(...specPaths);

  for (const relativePath of REQUIRED_SPEC_MARKERS) {
    const absolutePath = join(workspaceTarget, relativePath);
    if (!createdPaths.includes(absolutePath)) {
      throw new Error(`Failed to generate ${absolutePath}`);
    }
  }

  return {
    workspaceDir: workspaceTarget,
    createdPaths,
    modules: { workflow: false, spec: true },
  };
}

import { join } from "node:path";
import { copyTemplateFile, copyTemplateTree } from "../core/file-system.js";
import { resolveAssistantTemplatePath } from "../core/template-resolver.js";
import { getAssistantLayout } from "./assistant-layout.js";
import type { AssistantId } from "../types/init-context.js";

export type CopySddAssistantFilesOptions = {
  overwrite: boolean;
  includeProjectInstructions: boolean;
};

export async function copySddAssistantFiles(
  assistantId: AssistantId,
  targetDir: string,
  options: CopySddAssistantFilesOptions,
): Promise<string[]> {
  const layout = getAssistantLayout(assistantId);
  const createdPaths: string[] = [];
  const skipIfExists = !options.overwrite;

  for (const skillName of layout.skillNames) {
    if (layout.skillFormat === "copilot") {
      const agentFile = layout.skillAgentFiles?.[skillName];
      const promptFile = layout.skillPromptFiles?.[skillName];

      if (!agentFile || !promptFile) {
        throw new Error(
          `Missing agent or prompt mapping for skill "${skillName}" (${assistantId}).`,
        );
      }

      if (!layout.installedPaths.agents || !layout.installedPaths.prompts) {
        throw new Error(
          `Missing agents or prompts install path for assistant "${assistantId}".`,
        );
      }

      const { createdPaths: agentPaths } = await copyTemplateFile(
        resolveAssistantTemplatePath(assistantId, "agents", agentFile),
        join(targetDir, layout.installedPaths.agents, agentFile),
        { overwrite: options.overwrite, skipIfExists },
      );
      createdPaths.push(...agentPaths);

      const { createdPaths: promptPaths } = await copyTemplateFile(
        resolveAssistantTemplatePath(assistantId, "prompts", promptFile),
        join(targetDir, layout.installedPaths.prompts, promptFile),
        { overwrite: options.overwrite, skipIfExists },
      );
      createdPaths.push(...promptPaths);

      if (layout.installedPaths.assets) {
        const { createdPaths: assetPaths } = await copyTemplateTree(
          resolveAssistantTemplatePath(assistantId, "assets", skillName),
          join(targetDir, layout.installedPaths.assets, skillName),
          { overwrite: options.overwrite, skipIfExists },
        );
        createdPaths.push(...assetPaths);
      }

      continue;
    }

    if (layout.skillFormat === "command-file") {
      const commandFile = layout.skillCommandFiles?.[skillName];

      if (!commandFile) {
        throw new Error(
          `Missing command file mapping for skill "${skillName}" (${assistantId}).`,
        );
      }

      const { createdPaths: commandPaths } = await copyTemplateFile(
        resolveAssistantTemplatePath(assistantId, "commands", commandFile),
        join(targetDir, layout.installedPaths.skills, commandFile),
        { overwrite: options.overwrite, skipIfExists },
      );
      createdPaths.push(...commandPaths);

      if (layout.installedPaths.assets) {
        const { createdPaths: assetPaths } = await copyTemplateTree(
          resolveAssistantTemplatePath(assistantId, "assets", skillName),
          join(targetDir, layout.installedPaths.assets, skillName),
          { overwrite: options.overwrite, skipIfExists },
        );
        createdPaths.push(...assetPaths);
      }

      continue;
    }

    const { createdPaths: skillPaths } = await copyTemplateTree(
      resolveAssistantTemplatePath(assistantId, "skills", skillName),
      join(targetDir, layout.installedPaths.skills, skillName),
      { overwrite: options.overwrite, skipIfExists },
    );
    createdPaths.push(...skillPaths);
  }

  if (options.includeProjectInstructions) {
    if (layout.installedPaths.rules) {
      const rulesTarget = join(targetDir, layout.installedPaths.rules);
      const { createdPaths: rulePaths } = await copyTemplateFile(
        resolveAssistantTemplatePath(
          assistantId,
          "rules",
          "sdd-studio.mdc",
        ),
        rulesTarget,
        { overwrite: options.overwrite, skipIfExists },
      );
      createdPaths.push(...rulePaths);
    }

    if (layout.installedPaths.instructions) {
      const instructionsTarget = join(
        targetDir,
        layout.installedPaths.instructions,
      );
      const { createdPaths: instructionPaths } = await copyTemplateFile(
        resolveAssistantTemplatePath(
          assistantId,
          layout.installedPaths.instructions,
        ),
        instructionsTarget,
        { overwrite: options.overwrite, skipIfExists },
      );
      createdPaths.push(...instructionPaths);
    }
  }

  return createdPaths;
}

import { existsSync } from "node:fs";
import { join } from "node:path";
import { copyTemplateTree } from "../core/file-system.js";
import { resolveAssistantTemplatePath } from "../core/template-resolver.js";
import type {
  AssistantInstallResult,
  AssistantStrategy,
} from "./assistant.strategy.js";

const CURSOR_SKILLS_MARKER = join(
  ".cursor",
  "skills",
  "sdd-idea",
  "SKILL.md",
);

export class CursorAssistantStrategy implements AssistantStrategy {
  readonly id = "cursor";

  async install(
    targetDir: string,
    overwrite = false,
  ): Promise<AssistantInstallResult> {
    const markerPath = join(targetDir, CURSOR_SKILLS_MARKER);

    if (!overwrite && existsSync(markerPath)) {
      throw new Error(
        `SDD Studio skills already exist in ${join(targetDir, ".cursor")}.`,
      );
    }

    const cursorTarget = join(targetDir, ".cursor");
    const { createdPaths } = await copyTemplateTree(
      resolveAssistantTemplatePath("cursor"),
      cursorTarget,
      { overwrite },
    );

    return {
      assistantId: this.id,
      installed: true,
      createdPaths,
    };
  }
}

export const cursorAssistantStrategy = new CursorAssistantStrategy();

import { promptAssistant } from "./assistant.prompt.js";
import { promptWorkflowModule } from "./workflow-module.prompt.js";
import { promptEngineeringConfiguration } from "../engineering-config/prompts/run-engineering-config-wizard.js";
import type { InitContextWithLabels } from "../types/init-context.js";
import { buildInitContext } from "../utils/build-init-context.js";

export async function runInitPrompts(
  targetDir: string,
): Promise<InitContextWithLabels> {
  console.log("");
  console.log("sdd-studio — SDD project setup");
  console.log("");

  const assistant = await promptAssistant();
  const engineering = await promptEngineeringConfiguration();
  const workflow = await promptWorkflowModule();

  return buildInitContext({
    targetDir,
    assistant,
    modules: { workflow },
    engineering: engineering.enabled
      ? {
          answers: engineering.answers!,
          customNotes: engineering.customNotes,
        }
      : undefined,
  });
}

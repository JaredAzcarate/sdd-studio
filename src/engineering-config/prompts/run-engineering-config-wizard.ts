import { confirm } from "@inquirer/prompts";
import { ENGINEERING_SECTIONS } from "../catalog/index.js";
import { detailSelect } from "./detail-select.prompt.js";
import type { EngineeringConfigAnswers } from "../types.js";

export async function runEngineeringConfigWizard(): Promise<EngineeringConfigAnswers> {
  const answers: EngineeringConfigAnswers = {};

  for (const section of ENGINEERING_SECTIONS) {
    console.log("");
    console.log(section.title);
    console.log(section.description);
    console.log("");

    for (const question of section.questions) {
      const answerId = await detailSelect({
        sectionTitle: section.title,
        sectionDescription: section.description,
        questionDescription: question.description,
        message: question.question,
        options: question.options,
      });

      answers[question.id] = answerId;
    }
  }

  return answers;
}

export async function promptEngineeringConfiguration(): Promise<{
  enabled: boolean;
  answers?: EngineeringConfigAnswers;
}> {
  const enabled = await confirm({
    message:
      "Configure the Engineering Brief now (principles, decisions, conventions)?",
    default: true,
  });

  if (!enabled) {
    return { enabled: false };
  }

  const answers = await runEngineeringConfigWizard();
  return { enabled: true, answers };
}

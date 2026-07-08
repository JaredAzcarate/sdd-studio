import { checkbox, confirm, input } from "@inquirer/prompts";
import { ENGINEERING_SECTIONS } from "../catalog/index.js";
import {
  formatMultiAnswer,
  getVisibleQuestions,
} from "../catalog/question-utils.js";
import { detailSelect } from "./detail-select.prompt.js";
import type { EngineeringConfigAnswers, EngineeringQuestion } from "../types.js";

async function promptCustomNote(question: EngineeringQuestion): Promise<string> {
  const text = await input({
    message: "Describe your custom choice:",
    validate: (value) => value.trim().length > 0 || "Required",
  });

  return text.trim();
}

async function promptQuestionAnswer(
  question: EngineeringQuestion,
  sectionTitle: string,
  sectionDescription: string,
): Promise<{ answerId: string; customNote?: string }> {
  if (question.selectionMode === "multi") {
    const selected = await checkbox({
      message: `${sectionTitle}\n${question.question}`,
      choices: question.options.map((option) => ({
        name: option.label,
        value: option.id,
      })),
      validate: (value) => value.length > 0 || "Select at least one option",
    });

    if (selected.includes("custom")) {
      const customNote = await promptCustomNote(question);
      return {
        answerId: formatMultiAnswer(selected),
        customNote,
      };
    }

    return { answerId: formatMultiAnswer(selected) };
  }

  const answerId = await detailSelect({
    sectionTitle,
    sectionDescription,
    questionDescription: question.description,
    message: question.question,
    options: question.options,
  });

  if (answerId === "custom") {
    const customNote = await promptCustomNote(question);
    return { answerId, customNote };
  }

  return { answerId };
}

export async function runEngineeringConfigWizard(): Promise<{
  answers: EngineeringConfigAnswers;
  customNotes: Record<string, string>;
}> {
  const answers: EngineeringConfigAnswers = {};
  const customNotes: Record<string, string> = {};

  for (const section of ENGINEERING_SECTIONS) {
    console.log("");
    console.log(section.title);
    console.log(section.description);
    console.log("");

    for (const question of getVisibleQuestions(section, answers)) {
      const result = await promptQuestionAnswer(
        question,
        section.title,
        section.description,
      );

      answers[question.id] = result.answerId;
      if (result.customNote) {
        customNotes[question.id] = result.customNote;
      }

      if (
        question.id === "target-platforms" &&
        !result.answerId.split(",").includes("mobile-native")
      ) {
        delete answers["mobile-platforms"];
        delete customNotes["mobile-platforms"];
      }
    }
  }

  return { answers, customNotes };
}

export async function promptEngineeringConfiguration(): Promise<{
  enabled: boolean;
  answers?: EngineeringConfigAnswers;
  customNotes?: Record<string, string>;
}> {
  const enabled = await confirm({
    message:
      "Configure the Engineering Brief now (principles, decisions, conventions)?",
    default: true,
  });

  if (!enabled) {
    return { enabled: false };
  }

  const result = await runEngineeringConfigWizard();
  return {
    enabled: true,
    answers: result.answers,
    customNotes: result.customNotes,
  };
}

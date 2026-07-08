import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { ENGINEERING_SECTIONS } from "../catalog/index.js";
import {
  formatMultiAnswer,
  getVisibleQuestions,
  parseMultiAnswer,
} from "../catalog/question-utils.js";
import type {
  EngineeringConfigAnswers,
  EngineeringCustomNotes,
  EngineeringSectionId,
} from "../types.js";

export type SectionStatus = "not-started" | "in-progress" | "completed";

const SECTION_FILES: Record<EngineeringSectionId, string> = {
  principles: "engineering-principles.md",
  decisions: "engineering-decisions.md",
  conventions: "engineering-conventions.md",
};

function parseAnswersFromMarkdown(content: string): {
  answers: EngineeringConfigAnswers;
  customNotes: EngineeringCustomNotes;
} {
  const answers: EngineeringConfigAnswers = {};
  const customNotes: EngineeringCustomNotes = {};
  const answerPattern = /\*\*Answer:\*\*\s*(.+)/g;
  const questionPattern = /\*\*Question:\*\*\s*(.+)/g;

  const questions = [...content.matchAll(questionPattern)].map((match) =>
    match[1].trim(),
  );
  const answerLabels = [...content.matchAll(answerPattern)].map((match) =>
    match[1].trim(),
  );

  for (const section of ENGINEERING_SECTIONS) {
    for (const question of section.questions) {
      const questionIndex = questions.indexOf(question.question);
      if (questionIndex === -1) {
        continue;
      }

      const label = answerLabels[questionIndex];
      if (!label || label === "TODO") {
        continue;
      }

      if (label.startsWith("Custom — ") || label.startsWith("Otra — ")) {
        const prefix = label.startsWith("Custom — ")
          ? "Custom — "
          : "Otra — ";
        answers[question.id] = "custom";
        customNotes[question.id] = label.slice(prefix.length);
        continue;
      }

      if (question.selectionMode === "multi") {
        const parts = label.split(",").map((part) => part.trim());
        const optionIds: string[] = [];

        for (const part of parts) {
          if (part.startsWith("Otra — ")) {
            optionIds.push("custom");
            customNotes[question.id] = part.slice("Otra — ".length);
            continue;
          }

          if (part.startsWith("Custom — ")) {
            optionIds.push("custom");
            customNotes[question.id] = part.slice("Custom — ".length);
            continue;
          }

          const option = question.options.find((item) => item.label === part);
          if (option) {
            optionIds.push(option.id);
          }
        }

        if (optionIds.length > 0) {
          answers[question.id] = formatMultiAnswer(optionIds);
        }
        continue;
      }

      const option = question.options.find((item) => item.label === label);
      if (option) {
        answers[question.id] = option.id;
      }
    }
  }

  return { answers, customNotes };
}

export async function loadEngineeringAnswersFromWorkspace(
  workspaceTechnicalDir: string,
): Promise<{
  answers: EngineeringConfigAnswers;
  customNotes: EngineeringCustomNotes;
}> {
  const mergedAnswers: EngineeringConfigAnswers = {};
  const mergedCustomNotes: EngineeringCustomNotes = {};

  for (const fileName of Object.values(SECTION_FILES)) {
    const filePath = join(workspaceTechnicalDir, fileName);
    if (!existsSync(filePath)) {
      continue;
    }

    const content = await readFile(filePath, "utf8");
    const { answers, customNotes } = parseAnswersFromMarkdown(content);
    Object.assign(mergedAnswers, answers);
    Object.assign(mergedCustomNotes, customNotes);
  }

  return { answers: mergedAnswers, customNotes: mergedCustomNotes };
}

export function getSectionStatus(
  sectionId: EngineeringSectionId,
  answers: EngineeringConfigAnswers,
): SectionStatus {
  const section = ENGINEERING_SECTIONS.find((item) => item.id === sectionId);
  if (!section) {
    return "not-started";
  }

  const visibleQuestions = getVisibleQuestions(section, answers);
  const answered = visibleQuestions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;

  if (answered === 0) {
    return "not-started";
  }

  if (answered === visibleQuestions.length) {
    return "completed";
  }

  return "in-progress";
}

export function countCompletedSections(
  answers: EngineeringConfigAnswers,
): number {
  return (["principles", "decisions", "conventions"] as const).filter(
    (sectionId) => getSectionStatus(sectionId, answers) === "completed",
  ).length;
}

export function getSectionFileName(sectionId: EngineeringSectionId): string {
  return SECTION_FILES[sectionId];
}

export function statusIcon(status: SectionStatus): string {
  switch (status) {
    case "completed":
      return "✔";
    case "in-progress":
      return "◐";
    default:
      return "○";
  }
}

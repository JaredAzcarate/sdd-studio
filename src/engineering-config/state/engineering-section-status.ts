import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { ENGINEERING_SECTIONS } from "../catalog/index.js";
import type {
  EngineeringConfigAnswers,
  EngineeringSectionId,
} from "../types.js";

export type SectionStatus = "not-started" | "in-progress" | "completed";

const SECTION_FILES: Record<EngineeringSectionId, string> = {
  principles: "engineering-principles.md",
  decisions: "engineering-decisions.md",
  conventions: "engineering-conventions.md",
};

function parseAnswersFromMarkdown(content: string): EngineeringConfigAnswers {
  const answers: EngineeringConfigAnswers = {};
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

      const option = question.options.find((item) => item.label === label);
      if (option) {
        answers[question.id] = option.id;
      }
    }
  }

  return answers;
}

export async function loadEngineeringAnswersFromWorkspace(
  workspaceTechnicalDir: string,
): Promise<EngineeringConfigAnswers> {
  const merged: EngineeringConfigAnswers = {};

  for (const fileName of Object.values(SECTION_FILES)) {
    const filePath = join(workspaceTechnicalDir, fileName);
    if (!existsSync(filePath)) {
      continue;
    }

    const content = await readFile(filePath, "utf8");
    Object.assign(merged, parseAnswersFromMarkdown(content));
  }

  return merged;
}

export function getSectionStatus(
  sectionId: EngineeringSectionId,
  answers: EngineeringConfigAnswers,
): SectionStatus {
  const section = ENGINEERING_SECTIONS.find((item) => item.id === sectionId);
  if (!section) {
    return "not-started";
  }

  const answered = section.questions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;

  if (answered === 0) {
    return "not-started";
  }

  if (answered === section.questions.length) {
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

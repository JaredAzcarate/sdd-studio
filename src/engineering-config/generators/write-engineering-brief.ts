import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  ENGINEERING_SECTIONS,
  getDefaultEngineeringAnswers,
} from "../catalog/index.js";
import { formatAnswerValue, isQuestionVisible } from "../catalog/question-utils.js";
import type {
  EngineeringConfigAnswers,
  EngineeringCustomNotes,
  EngineeringSectionId,
} from "../types.js";

const OUTPUT_FILES: Record<EngineeringSectionId, string> = {
  principles: "engineering-principles.md",
  decisions: "engineering-decisions.md",
  conventions: "engineering-conventions.md",
};

function renderSectionDocument(
  sectionId: EngineeringSectionId,
  answers: EngineeringConfigAnswers,
  customNotes: EngineeringCustomNotes = {},
): string {
  const section = ENGINEERING_SECTIONS.find((item) => item.id === sectionId);

  if (!section) {
    throw new Error(`Unknown engineering section "${sectionId}".`);
  }

  const lines: string[] = [
    `# ${section.title}`,
    "",
    `> ${section.description}`,
    "",
  ];

  let visibleIndex = 0;

  section.questions.forEach((question) => {
    if (!isQuestionVisible(question, answers)) {
      return;
    }

    const answerValue = answers[question.id];
    if (!answerValue) {
      throw new Error(
        `Missing answer for engineering question "${question.id}".`,
      );
    }

    visibleIndex += 1;
    const answerLabel = formatAnswerValue(
      question,
      answerValue,
      customNotes[question.id],
    );

    lines.push(`## ${visibleIndex}. ${question.title}`);
    lines.push("");
    lines.push(`**Question:** ${question.question}`);
    lines.push("");
    lines.push(`**Answer:** ${answerLabel}`);
    lines.push("");
    lines.push(question.description);
    lines.push("");
    lines.push("---");
    lines.push("");
  });

  return `${lines.join("\n").trimEnd()}\n`;
}

export type WriteEngineeringBriefOptions = {
  workspaceTechnicalDir: string;
  answers?: EngineeringConfigAnswers;
  customNotes?: EngineeringCustomNotes;
};

export type WriteEngineeringBriefResult = {
  writtenPaths: string[];
  answers: EngineeringConfigAnswers;
  customNotes: EngineeringCustomNotes;
};

export async function writeEngineeringSection(
  options: WriteEngineeringBriefOptions & { sectionId: EngineeringSectionId },
): Promise<{
  filePath: string;
  answers: EngineeringConfigAnswers;
  customNotes: EngineeringCustomNotes;
}> {
  const answers = options.answers ?? getDefaultEngineeringAnswers();
  const customNotes = options.customNotes ?? {};
  const fileName = OUTPUT_FILES[options.sectionId];
  const filePath = join(options.workspaceTechnicalDir, fileName);
  const content = renderSectionDocument(
    options.sectionId,
    answers,
    customNotes,
  );

  await writeFile(filePath, content, "utf8");

  return { filePath, answers, customNotes };
}

export async function writeEngineeringBrief(
  options: WriteEngineeringBriefOptions,
): Promise<WriteEngineeringBriefResult> {
  const answers = options.answers ?? getDefaultEngineeringAnswers();
  const customNotes = options.customNotes ?? {};
  const writtenPaths: string[] = [];

  for (const sectionId of Object.keys(OUTPUT_FILES) as EngineeringSectionId[]) {
    const fileName = OUTPUT_FILES[sectionId];
    const filePath = join(options.workspaceTechnicalDir, fileName);
    const content = renderSectionDocument(sectionId, answers, customNotes);

    await writeFile(filePath, content, "utf8");
    writtenPaths.push(filePath);
  }

  return { writtenPaths, answers, customNotes };
}

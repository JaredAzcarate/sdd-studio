import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  ENGINEERING_SECTIONS,
  getDefaultEngineeringAnswers,
} from "../catalog/index.js";
import type {
  EngineeringConfigAnswers,
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

  section.questions.forEach((question, index) => {
    const answerId = answers[question.id];
    const selected = question.options.find((option) => option.id === answerId);

    if (!selected) {
      throw new Error(
        `Missing answer for engineering question "${question.id}".`,
      );
    }

    lines.push(`## ${index + 1}. ${question.title}`);
    lines.push("");
    lines.push(`**Question:** ${question.question}`);
    lines.push("");
    lines.push(`**Answer:** ${selected.label}`);
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
};

export type WriteEngineeringBriefResult = {
  writtenPaths: string[];
  answers: EngineeringConfigAnswers;
};

export async function writeEngineeringSection(
  options: WriteEngineeringBriefOptions & { sectionId: EngineeringSectionId },
): Promise<{ filePath: string; answers: EngineeringConfigAnswers }> {
  const answers = options.answers ?? getDefaultEngineeringAnswers();
  const fileName = OUTPUT_FILES[options.sectionId];
  const filePath = join(options.workspaceTechnicalDir, fileName);
  const content = renderSectionDocument(options.sectionId, answers);

  await writeFile(filePath, content, "utf8");

  return { filePath, answers };
}

export async function writeEngineeringBrief(
  options: WriteEngineeringBriefOptions,
): Promise<WriteEngineeringBriefResult> {
  const answers = options.answers ?? getDefaultEngineeringAnswers();
  const writtenPaths: string[] = [];

  for (const sectionId of Object.keys(OUTPUT_FILES) as EngineeringSectionId[]) {
    const fileName = OUTPUT_FILES[sectionId];
    const filePath = join(options.workspaceTechnicalDir, fileName);
    const content = renderSectionDocument(sectionId, answers);

    await writeFile(filePath, content, "utf8");
    writtenPaths.push(filePath);
  }

  return { writtenPaths, answers };
}

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  WORKFLOW_SECTIONS,
  getDefaultWorkflowAnswers,
} from "../catalog/index.js";
import {
  formatAnswerValue,
  getVisibleQuestions,
  isQuestionVisible,
} from "../catalog/index.js";
import type {
  WorkflowConfigAnswers,
  WorkflowCustomNotes,
  WorkflowSectionId,
} from "../types.js";

const OUTPUT_FILE = "workflow-config.md";

function sectionIsComplete(
  sectionId: WorkflowSectionId,
  answers: WorkflowConfigAnswers,
): boolean {
  const section = WORKFLOW_SECTIONS.find((item) => item.id === sectionId);
  if (!section) {
    return false;
  }

  const visibleQuestions = getVisibleQuestions(section, answers);
  return visibleQuestions.every((question) => answers[question.id] !== undefined);
}

function renderWorkflowConfigDocument(
  answers: WorkflowConfigAnswers,
  customNotes: WorkflowCustomNotes = {},
): string {
  const lines: string[] = [
    "# Workflow Configuration",
    "",
    "> Methodology and task conventions for SDD planning under `.workspace/workflow/`.",
    "",
  ];

  for (const section of WORKFLOW_SECTIONS) {
    if (!sectionIsComplete(section.id, answers)) {
      continue;
    }

    lines.push(`# ${section.title}`);
    lines.push("");
    lines.push(`> ${section.description}`);
    lines.push("");

    let visibleIndex = 0;

    section.questions.forEach((question) => {
      if (!isQuestionVisible(question, answers)) {
        return;
      }

      const answerValue = answers[question.id];
      if (!answerValue) {
        return;
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
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

export type WriteWorkflowConfigOptions = {
  workspaceWorkflowDir: string;
  sectionId: WorkflowSectionId;
  answers?: WorkflowConfigAnswers;
  customNotes?: WorkflowCustomNotes;
};

export async function writeWorkflowSection(
  options: WriteWorkflowConfigOptions,
): Promise<{
  filePath: string;
  answers: WorkflowConfigAnswers;
  customNotes: WorkflowCustomNotes;
}> {
  const answers = options.answers ?? getDefaultWorkflowAnswers();
  const customNotes = options.customNotes ?? {};
  const section = WORKFLOW_SECTIONS.find((item) => item.id === options.sectionId);

  if (!section) {
    throw new Error(`Unknown workflow section "${options.sectionId}".`);
  }

  if (!sectionIsComplete(options.sectionId, answers)) {
    throw new Error(
      `Workflow section "${options.sectionId}" is incomplete — save after answering all questions.`,
    );
  }

  const filePath = join(options.workspaceWorkflowDir, OUTPUT_FILE);
  const content = renderWorkflowConfigDocument(answers, customNotes);

  await writeFile(filePath, content, "utf8");

  return { filePath, answers, customNotes };
}

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";
import {
  WORKFLOW_LEAF_SECTION_IDS,
  WORKFLOW_SECTIONS,
} from "../catalog/index.js";
import {
  formatMultiAnswer,
  getVisibleQuestions,
  parseMultiAnswer,
} from "../catalog/index.js";
import type {
  WorkflowConfigAnswers,
  WorkflowCustomNotes,
  WorkflowSectionId,
} from "../types.js";

export type SectionStatus = "not-started" | "in-progress" | "completed";

const CONFIG_FILE = "workflow-config.md";

function parseAnswersFromMarkdown(content: string): {
  answers: WorkflowConfigAnswers;
  customNotes: WorkflowCustomNotes;
} {
  const answers: WorkflowConfigAnswers = {};
  const customNotes: WorkflowCustomNotes = {};
  const answerPattern = /\*\*Answer:\*\*\s*(.+)/g;
  const questionPattern = /\*\*Question:\*\*\s*(.+)/g;

  const questions = [...content.matchAll(questionPattern)].map((match) =>
    match[1].trim(),
  );
  const answerLabels = [...content.matchAll(answerPattern)].map((match) =>
    match[1].trim(),
  );

  for (const section of WORKFLOW_SECTIONS) {
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

export async function loadWorkflowAnswersFromWorkspace(
  workspaceWorkflowDir: string,
): Promise<{
  answers: WorkflowConfigAnswers;
  customNotes: WorkflowCustomNotes;
}> {
  const filePath = join(workspaceWorkflowDir, CONFIG_FILE);
  if (!existsSync(filePath)) {
    return { answers: {}, customNotes: {} };
  }

  const content = await readFile(filePath, "utf8");
  return parseAnswersFromMarkdown(content);
}

export function getWorkflowSectionStatus(
  sectionId: WorkflowSectionId,
  answers: WorkflowConfigAnswers,
): SectionStatus {
  const section = WORKFLOW_SECTIONS.find((item) => item.id === sectionId);
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

export function countCompletedWorkflowSections(
  answers: WorkflowConfigAnswers,
): number {
  return WORKFLOW_LEAF_SECTION_IDS.filter(
    (sectionId) => getWorkflowSectionStatus(sectionId, answers) === "completed",
  ).length;
}

export { statusIcon } from "../../engineering-config/state/engineering-section-status.js";

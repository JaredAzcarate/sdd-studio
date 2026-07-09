import { workflowMethodologySection } from "./methodology.js";
import { workflowTaskConventionsSection } from "./task-conventions.js";
import type {
  WorkflowConfigAnswers,
  WorkflowSection,
  WorkflowSectionId,
} from "../types.js";

export const WORKFLOW_LEAF_SECTION_IDS = [
  "methodology",
  "task-conventions",
] as const satisfies readonly WorkflowSectionId[];

export const WORKFLOW_LEAF_SECTION_COUNT = WORKFLOW_LEAF_SECTION_IDS.length;

export const WORKFLOW_SECTIONS: WorkflowSection[] = [
  workflowMethodologySection,
  workflowTaskConventionsSection,
];

export const DEFAULT_WORKFLOW_ANSWERS: WorkflowConfigAnswers = Object.fromEntries(
  WORKFLOW_SECTIONS.flatMap((section) =>
    section.questions
      .filter((question) => !question.showWhen)
      .map((question) => [question.id, question.options[0]!.id]),
  ),
);

export function getDefaultWorkflowAnswers(): WorkflowConfigAnswers {
  return { ...DEFAULT_WORKFLOW_ANSWERS };
}

export {
  workflowMethodologySection,
  workflowTaskConventionsSection,
};

export {
  formatAnswerValue,
  formatMultiAnswer,
  findNextVisibleQuestionIndex,
  findPreviousVisibleQuestionIndex,
  getVisibleQuestions,
  isQuestionVisible,
  parseMultiAnswer,
} from "../../engineering-config/catalog/question-utils.js";

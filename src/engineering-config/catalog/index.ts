import { engineeringConventionsSection } from "./conventions.js";
import { engineeringDecisionsSection } from "./decisions.js";
import { engineeringPrinciplesSection } from "./principles.js";
import type {
  EngineeringConfigAnswers,
  EngineeringSection,
} from "../types.js";

export const ENGINEERING_SECTIONS: EngineeringSection[] = [
  engineeringPrinciplesSection,
  engineeringDecisionsSection,
  engineeringConventionsSection,
];

export const DEFAULT_ENGINEERING_ANSWERS: EngineeringConfigAnswers =
  Object.fromEntries(
    ENGINEERING_SECTIONS.flatMap((section) =>
      section.questions
        .filter((question) => !question.showWhen)
        .map((question) => [
          question.id,
          question.selectionMode === "multi"
            ? question.options[0]!.id
            : question.options[0]!.id,
        ]),
    ),
  );

export function getDefaultEngineeringAnswers(): EngineeringConfigAnswers {
  return { ...DEFAULT_ENGINEERING_ANSWERS };
}

export {
  engineeringConventionsSection,
  engineeringDecisionsSection,
  engineeringPrinciplesSection,
};
export {
  formatAnswerValue,
  formatMultiAnswer,
  findNextVisibleQuestionIndex,
  findPreviousVisibleQuestionIndex,
  getVisibleQuestions,
  isQuestionVisible,
  parseMultiAnswer,
} from "./question-utils.js";

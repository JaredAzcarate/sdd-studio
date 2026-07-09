import { engineeringContributionPatternsSection } from "./contribution-patterns.js";
import { engineeringBackendPatternsSection } from "./backend-patterns.js";
import { engineeringConventionsSection } from "./conventions.js";
import { engineeringDecisionsSection } from "./decisions.js";
import { engineeringFrontendPatternsSection } from "./frontend-patterns.js";
import { engineeringPrinciplesSection } from "./principles.js";
import type {
  EngineeringConfigAnswers,
  EngineeringSection,
  EngineeringSectionId,
} from "../types.js";

export const ENGINEERING_LEAF_SECTION_IDS = [
  "principles",
  "decisions",
  "conventions",
  "frontend-patterns",
  "backend-patterns",
  "contribution-patterns",
] as const satisfies readonly EngineeringSectionId[];

export const ENGINEERING_LEAF_SECTION_COUNT = ENGINEERING_LEAF_SECTION_IDS.length;

export const ENGINEERING_PATTERNS_SECTION_IDS = [
  "frontend-patterns",
  "backend-patterns",
  "contribution-patterns",
] as const satisfies readonly EngineeringSectionId[];

export const ENGINEERING_SECTIONS: EngineeringSection[] = [
  engineeringPrinciplesSection,
  engineeringDecisionsSection,
  engineeringConventionsSection,
  engineeringFrontendPatternsSection,
  engineeringBackendPatternsSection,
  engineeringContributionPatternsSection,
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
  engineeringBackendPatternsSection,
  engineeringConventionsSection,
  engineeringDecisionsSection,
  engineeringFrontendPatternsSection,
  engineeringContributionPatternsSection,
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

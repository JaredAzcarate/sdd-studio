import type {
  EngineeringConfigAnswers,
  EngineeringQuestion,
  EngineeringSection,
} from "../types.js";

export function parseMultiAnswer(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatMultiAnswer(optionIds: string[]): string {
  return [...new Set(optionIds)].join(",");
}

export function isQuestionVisible(
  question: EngineeringQuestion,
  answers: EngineeringConfigAnswers,
): boolean {
  if (!question.showWhen) {
    return true;
  }

  const parentValue = answers[question.showWhen.questionId];
  return parseMultiAnswer(parentValue).includes(question.showWhen.includes);
}

export function getVisibleQuestions(
  section: EngineeringSection,
  answers: EngineeringConfigAnswers,
): EngineeringQuestion[] {
  return section.questions.filter((question) =>
    isQuestionVisible(question, answers),
  );
}

export function findNextVisibleQuestionIndex(
  section: EngineeringSection,
  fromIndex: number,
  answers: EngineeringConfigAnswers,
): number {
  for (let index = fromIndex + 1; index < section.questions.length; index++) {
    if (isQuestionVisible(section.questions[index]!, answers)) {
      return index;
    }
  }

  return -1;
}

export function findPreviousVisibleQuestionIndex(
  section: EngineeringSection,
  fromIndex: number,
  answers: EngineeringConfigAnswers,
): number {
  for (let index = fromIndex - 1; index >= 0; index--) {
    if (isQuestionVisible(section.questions[index]!, answers)) {
      return index;
    }
  }

  return -1;
}

export function formatAnswerValue(
  question: EngineeringQuestion,
  answerValue: string,
  customNote?: string,
): string {
  if (question.selectionMode === "multi") {
    const labels = parseMultiAnswer(answerValue).map((optionId) => {
      if (optionId === "custom") {
        return customNote ? `Otra — ${customNote}` : "Otra";
      }

      return (
        question.options.find((option) => option.id === optionId)?.label ??
        optionId
      );
    });

    return labels.join(", ");
  }

  const selected = question.options.find((option) => option.id === answerValue);
  if (!selected) {
    return answerValue;
  }

  if (selected.id === "custom" && customNote) {
    return `Otra — ${customNote}`;
  }

  return selected.label;
}

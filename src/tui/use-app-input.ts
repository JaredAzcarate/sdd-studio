import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { join } from "node:path";
import type { Key } from "ink";
import { SDD_WORKSPACE_DIR } from "../constants/sdd-workspace-path.js";
import {
  ENGINEERING_LEAF_SECTION_COUNT,
  ENGINEERING_SECTIONS,
} from "../engineering-config/catalog/index.js";
import {
  WORKFLOW_LEAF_SECTION_COUNT,
  WORKFLOW_SECTIONS,
} from "../workflow-config/catalog/index.js";
import {
  findNextVisibleQuestionIndex,
  findPreviousVisibleQuestionIndex,
  formatMultiAnswer,
  getVisibleQuestions,
  parseMultiAnswer,
} from "../engineering-config/catalog/question-utils.js";
import { writeEngineeringSection } from "../engineering-config/generators/write-engineering-brief.js";
import { writeWorkflowSection } from "../workflow-config/generators/write-workflow-config.js";
import { ASSISTANTS } from "../registries/assistants.registry.js";
import {
  ENGINEERING_PATTERNS_ITEMS,
  ENGINEERING_SECTION_ITEMS,
  WORKFLOW_SECTION_ITEMS,
  getVisibleMainMenuItems,
  PROJECT_TYPE_ITEMS,
} from "./data/menu-items.js";
import { countCompletedSections } from "../engineering-config/state/engineering-section-status.js";
import { countCompletedWorkflowSections } from "../workflow-config/state/workflow-section-status.js";
import type { AppScreen, AppState, TuiExitResult } from "./types.js";
import type {
  EngineeringConfigAnswers,
  EngineeringCustomNotes,
  EngineeringQuestion,
  EngineeringSection,
  EngineeringSectionId,
} from "../engineering-config/types.js";
import type {
  WorkflowConfigAnswers,
  WorkflowCustomNotes,
  WorkflowQuestion,
  WorkflowSection,
  WorkflowSectionId,
} from "../workflow-config/types.js";
import type { AssistantId } from "../types/init-context.js";

export type EngineeringSession = {
  sectionId: EngineeringSectionId;
  questionIndex: number;
  optionIndex: number;
  selectedOptionIds: string[];
  answers: AppState["engineeringAnswers"];
  customNotes: EngineeringCustomNotes;
  customEntry: { questionId: string; text: string } | null;
  saving: boolean;
};

export type WorkflowSession = {
  sectionId: WorkflowSectionId;
  questionIndex: number;
  optionIndex: number;
  selectedOptionIds: string[];
  answers: AppState["workflowAnswers"];
  customNotes: WorkflowCustomNotes;
  customEntry: { questionId: string; text: string } | null;
  saving: boolean;
};

export type AppInputActions = {
  navigate: (screen: AppScreen) => void;
  goBack: () => void;
  onFinish: (result: TuiExitResult) => void;
  openEngineeringDashboard: () => Promise<void>;
  openWorkflowDashboard: () => Promise<void>;
  runMigrate: () => Promise<void>;
  runSync: (assistantId: AssistantId) => Promise<void>;
  runInit: (options: {
    assistantId: AssistantId;
    includeSpec?: boolean;
    includeWorkflow?: boolean;
  }) => Promise<void>;
  runSpecScaffold: () => Promise<void>;
  runWorkflowScaffold: () => Promise<boolean>;
  setAssistant: (assistant: AssistantId) => void;
  setEngineeringAnswers: (answers: AppState["engineeringAnswers"]) => void;
  setEngineeringCustomNotes: (notes: EngineeringCustomNotes) => void;
  setEngineeringSession: (session: EngineeringSession | null) => void;
  setWorkflowAnswers: (answers: AppState["workflowAnswers"]) => void;
  setWorkflowCustomNotes: (notes: WorkflowCustomNotes) => void;
  setWorkflowSession: (session: WorkflowSession | null) => void;
  resetToMainMenu: () => void;
};

export type AppInputContext = {
  state: AppState;
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  engineeringSession: EngineeringSession | null;
  workflowSession: WorkflowSession | null;
  actions: AppInputActions;
};

function sessionStateForQuestion(
  question: EngineeringQuestion,
  answers: EngineeringConfigAnswers,
): Pick<EngineeringSession, "optionIndex" | "selectedOptionIds"> {
  if (question.selectionMode === "multi") {
    return {
      optionIndex: 0,
      selectedOptionIds: parseMultiAnswer(answers[question.id]),
    };
  }

  const optionIndex = question.options.findIndex(
    (option) => option.id === answers[question.id],
  );

  return {
    optionIndex: optionIndex === -1 ? 0 : optionIndex,
    selectedOptionIds: [],
  };
}

function cleanupAnswersAfterQuestion(
  questionId: string,
  answers: EngineeringConfigAnswers,
  customNotes: EngineeringCustomNotes,
): {
  answers: EngineeringConfigAnswers;
  customNotes: EngineeringCustomNotes;
} {
  const nextAnswers = { ...answers };
  const nextCustomNotes = { ...customNotes };

  if (questionId === "target-platforms") {
    const targets = parseMultiAnswer(nextAnswers["target-platforms"]);
    if (!targets.includes("mobile-native")) {
      delete nextAnswers["mobile-platforms"];
      delete nextCustomNotes["mobile-platforms"];
    }
    if (!targets.includes("custom")) {
      delete nextCustomNotes["target-platforms"];
    }
  }

  return { answers: nextAnswers, customNotes: nextCustomNotes };
}

function saveEngineeringSection(
  engineeringSession: EngineeringSession,
  nextAnswers: EngineeringConfigAnswers,
  nextCustomNotes: EngineeringCustomNotes,
  targetDir: string,
  actions: AppInputActions,
): void {
  actions.setEngineeringSession({
    ...engineeringSession,
    answers: nextAnswers,
    customNotes: nextCustomNotes,
    customEntry: null,
    saving: true,
  });

  void writeEngineeringSection({
    workspaceTechnicalDir: join(
      targetDir,
      SDD_WORKSPACE_DIR,
      "brief",
      "technical",
    ),
    sectionId: engineeringSession.sectionId,
    answers: nextAnswers,
    customNotes: nextCustomNotes,
  }).then(() => {
    actions.setEngineeringAnswers(nextAnswers);
    actions.setEngineeringCustomNotes(nextCustomNotes);
    actions.setEngineeringSession(null);

    if (countCompletedSections(nextAnswers) === ENGINEERING_LEAF_SECTION_COUNT) {
      actions.navigate({ name: "engineering-summary" });
      return;
    }

    actions.goBack();
  });
}

function advanceEngineeringAnswer(
  engineeringSession: EngineeringSession,
  section: EngineeringSection,
  questionId: string,
  answerId: string,
  nextCustomNotes: EngineeringCustomNotes,
  targetDir: string,
  actions: AppInputActions,
): void {
  const nextAnswers = {
    ...engineeringSession.answers,
    [questionId]: answerId,
  };
  const { answers: cleanedAnswers, customNotes: cleanedCustomNotes } =
    cleanupAnswersAfterQuestion(questionId, nextAnswers, nextCustomNotes);

  const nextIndex = findNextVisibleQuestionIndex(
    section,
    engineeringSession.questionIndex,
    cleanedAnswers,
  );

  if (nextIndex !== -1) {
    const nextQuestion = section.questions[nextIndex]!;
    const nextState = sessionStateForQuestion(nextQuestion, cleanedAnswers);

    actions.setEngineeringSession({
      sectionId: engineeringSession.sectionId,
      questionIndex: nextIndex,
      optionIndex: nextState.optionIndex,
      selectedOptionIds: nextState.selectedOptionIds,
      answers: cleanedAnswers,
      customNotes: cleanedCustomNotes,
      customEntry: null,
      saving: false,
    });
    return;
  }

  saveEngineeringSection(
    engineeringSession,
    cleanedAnswers,
    cleanedCustomNotes,
    targetDir,
    actions,
  );
}

function sessionStateForWorkflowQuestion(
  question: WorkflowQuestion,
  answers: WorkflowConfigAnswers,
): Pick<WorkflowSession, "optionIndex" | "selectedOptionIds"> {
  if (question.selectionMode === "multi") {
    return {
      optionIndex: 0,
      selectedOptionIds: parseMultiAnswer(answers[question.id]),
    };
  }

  const optionIndex = question.options.findIndex(
    (option) => option.id === answers[question.id],
  );

  return {
    optionIndex: optionIndex === -1 ? 0 : optionIndex,
    selectedOptionIds: [],
  };
}

function saveWorkflowSection(
  workflowSession: WorkflowSession,
  nextAnswers: WorkflowConfigAnswers,
  nextCustomNotes: WorkflowCustomNotes,
  targetDir: string,
  actions: AppInputActions,
): void {
  actions.setWorkflowSession({
    ...workflowSession,
    answers: nextAnswers,
    customNotes: nextCustomNotes,
    customEntry: null,
    saving: true,
  });

  void writeWorkflowSection({
    workspaceWorkflowDir: join(targetDir, SDD_WORKSPACE_DIR, "workflow"),
    sectionId: workflowSession.sectionId,
    answers: nextAnswers,
    customNotes: nextCustomNotes,
  }).then(() => {
    actions.setWorkflowAnswers(nextAnswers);
    actions.setWorkflowCustomNotes(nextCustomNotes);
    actions.setWorkflowSession(null);

    if (
      countCompletedWorkflowSections(nextAnswers) === WORKFLOW_LEAF_SECTION_COUNT
    ) {
      actions.navigate({ name: "workflow-summary" });
      return;
    }

    actions.goBack();
  });
}

function advanceWorkflowAnswer(
  workflowSession: WorkflowSession,
  section: WorkflowSection,
  questionId: string,
  answerId: string,
  nextCustomNotes: WorkflowCustomNotes,
  targetDir: string,
  actions: AppInputActions,
): void {
  const nextAnswers = {
    ...workflowSession.answers,
    [questionId]: answerId,
  };

  const nextIndex = findNextVisibleQuestionIndex(
    section,
    workflowSession.questionIndex,
    nextAnswers,
  );

  if (nextIndex !== -1) {
    const nextQuestion = section.questions[nextIndex]!;
    const nextState = sessionStateForWorkflowQuestion(nextQuestion, nextAnswers);

    actions.setWorkflowSession({
      sectionId: workflowSession.sectionId,
      questionIndex: nextIndex,
      optionIndex: nextState.optionIndex,
      selectedOptionIds: nextState.selectedOptionIds,
      answers: nextAnswers,
      customNotes: nextCustomNotes,
      customEntry: null,
      saving: false,
    });
    return;
  }

  saveWorkflowSection(
    workflowSession,
    nextAnswers,
    nextCustomNotes,
    targetDir,
    actions,
  );
}

export function useAppInput(context: AppInputContext): (input: string, key: Key) => void {
  const contextRef = useRef(context);
  contextRef.current = context;

  useEffect(() => {
    contextRef.current.setSelectedIndex(0);
  }, [context.state.screen.name, context.state.screen]);

  return (input: string, key: Key) => {
    const {
      state,
      selectedIndex,
      setSelectedIndex,
      engineeringSession,
      workflowSession,
      actions,
    } = contextRef.current;
    const { screen } = state;

    if (
      screen.name === "action-running" ||
      engineeringSession?.saving ||
      workflowSession?.saving
    ) {
      return;
    }

    const mainMenuItems = getVisibleMainMenuItems();

    if (screen.name === "project-type") {
      const selected = PROJECT_TYPE_ITEMS[selectedIndex];
      if (key.upArrow) {
        setSelectedIndex(
          (current) =>
            (current - 1 + PROJECT_TYPE_ITEMS.length) % PROJECT_TYPE_ITEMS.length,
        );
        return;
      }
      if (key.downArrow) {
        setSelectedIndex(
          (current) => (current + 1) % PROJECT_TYPE_ITEMS.length,
        );
        return;
      }
      if (key.escape) {
        actions.onFinish({ type: "exit" });
        return;
      }
      if (!key.return) {
        return;
      }

      if (selected.id === "greenfield") {
        actions.navigate({ name: "main-menu" });
        return;
      }
      actions.navigate({ name: "brownfield-notice" });
      return;
    }

    if (screen.name === "brownfield-notice") {
      if (key.return || key.escape) {
        actions.navigate({ name: "project-type" });
      }
      return;
    }

    if (screen.name === "main-menu") {
      const selected = mainMenuItems[selectedIndex];
      if (key.upArrow) {
        setSelectedIndex(
          (current) =>
            (current - 1 + mainMenuItems.length) % mainMenuItems.length,
        );
        return;
      }
      if (key.downArrow) {
        setSelectedIndex((current) => (current + 1) % mainMenuItems.length);
        return;
      }
      if (key.escape) {
        actions.onFinish({ type: "exit" });
        return;
      }
      if (!key.return) {
        return;
      }

      switch (selected.id) {
        case "setup-foundation":
          actions.navigate({ name: "setup-foundation-assistant" });
          break;
        case "create-spec-scaffold":
          void actions.runSpecScaffold();
          break;
        case "configure-engineering":
          void actions.openEngineeringDashboard();
          break;
        case "configure-workflow":
          void actions.openWorkflowDashboard();
          break;
        case "sync":
          actions.navigate({ name: "sync-assistant" });
          break;
        case "exit":
          actions.onFinish({ type: "exit" });
          break;
      }
      return;
    }

    if (screen.name === "setup-foundation-assistant") {
      if (key.upArrow) {
        setSelectedIndex(
          (current) => (current - 1 + ASSISTANTS.length) % ASSISTANTS.length,
        );
        return;
      }
      if (key.downArrow) {
        setSelectedIndex((current) => (current + 1) % ASSISTANTS.length);
        return;
      }
      if (key.escape) {
        actions.goBack();
        return;
      }
      if (key.return) {
        const assistantId = ASSISTANTS[selectedIndex].id;
        actions.setAssistant(assistantId);
        void actions.runInit({ assistantId });
      }
      return;
    }

    if (screen.name === "sync-assistant") {
      if (key.upArrow) {
        setSelectedIndex(
          (current) => (current - 1 + ASSISTANTS.length) % ASSISTANTS.length,
        );
        return;
      }
      if (key.downArrow) {
        setSelectedIndex((current) => (current + 1) % ASSISTANTS.length);
        return;
      }
      if (key.escape) {
        actions.goBack();
        return;
      }
      if (key.return) {
        void actions.runSync(ASSISTANTS[selectedIndex].id);
      }
      return;
    }

    if (screen.name === "engineering-summary") {
      if (key.escape) {
        actions.goBack();
        return;
      }
      if (key.return) {
        actions.resetToMainMenu();
      }
      return;
    }

    if (screen.name === "workflow-summary") {
      if (key.escape) {
        actions.goBack();
        return;
      }
      if (key.return) {
        actions.resetToMainMenu();
      }
      return;
    }

    if (screen.name === "workflow-dashboard") {
      const completed = countCompletedWorkflowSections(state.workflowAnswers);
      const selected = WORKFLOW_SECTION_ITEMS[selectedIndex];

      if (key.upArrow) {
        setSelectedIndex(
          (current) =>
            (current - 1 + WORKFLOW_SECTION_ITEMS.length) %
            WORKFLOW_SECTION_ITEMS.length,
        );
        return;
      }
      if (key.downArrow) {
        setSelectedIndex(
          (current) => (current + 1) % WORKFLOW_SECTION_ITEMS.length,
        );
        return;
      }
      if (key.escape) {
        actions.goBack();
        return;
      }
      if (completed === WORKFLOW_LEAF_SECTION_COUNT && input === "s") {
        actions.navigate({ name: "workflow-summary" });
        return;
      }
      if (!key.return) {
        return;
      }

      const sectionId = selected.id;
      const section = WORKFLOW_SECTIONS.find((item) => item.id === sectionId)!;
      const visibleQuestions = getVisibleQuestions(
        section,
        state.workflowAnswers,
      );
      const firstUnansweredQuestion =
        visibleQuestions.find(
          (item) => state.workflowAnswers[item.id] === undefined,
        ) ?? visibleQuestions[0];

      if (!firstUnansweredQuestion) {
        return;
      }

      const questionIndex = section.questions.findIndex(
        (item) => item.id === firstUnansweredQuestion.id,
      );
      const question = section.questions[questionIndex]!;
      const sessionState = sessionStateForWorkflowQuestion(
        question,
        state.workflowAnswers,
      );

      actions.setWorkflowSession({
        sectionId,
        questionIndex,
        optionIndex: sessionState.optionIndex,
        selectedOptionIds: sessionState.selectedOptionIds,
        answers: { ...state.workflowAnswers },
        customNotes: { ...state.workflowCustomNotes },
        customEntry: null,
        saving: false,
      });
      actions.navigate({ name: "workflow-section", sectionId });
      return;
    }

    if (screen.name === "workflow-section" && workflowSession) {
      const section = WORKFLOW_SECTIONS.find(
        (item) => item.id === workflowSession.sectionId,
      )!;
      const question = section.questions[workflowSession.questionIndex];

      if (workflowSession.customEntry) {
        if (key.escape || key.leftArrow) {
          actions.setWorkflowSession({
            ...workflowSession,
            customEntry: null,
          });
          return;
        }
        if (key.backspace || key.delete) {
          actions.setWorkflowSession({
            ...workflowSession,
            customEntry: {
              ...workflowSession.customEntry,
              text: workflowSession.customEntry.text.slice(0, -1),
            },
          });
          return;
        }
        if (key.return) {
          const text = workflowSession.customEntry.text.trim();
          if (!text) {
            return;
          }

          const nextCustomNotes = {
            ...workflowSession.customNotes,
            [question.id]: text,
          };

          const answerId =
            question.selectionMode === "multi"
              ? formatMultiAnswer(workflowSession.selectedOptionIds)
              : "custom";

          advanceWorkflowAnswer(
            workflowSession,
            section,
            question.id,
            answerId,
            nextCustomNotes,
            state.targetDir,
            actions,
          );
          return;
        }
        if (input && !key.ctrl && !key.meta) {
          actions.setWorkflowSession({
            ...workflowSession,
            customEntry: {
              ...workflowSession.customEntry,
              text: workflowSession.customEntry.text + input,
            },
          });
        }
        return;
      }

      if (key.leftArrow) {
        const previousIndex = findPreviousVisibleQuestionIndex(
          section,
          workflowSession.questionIndex,
          workflowSession.answers,
        );

        if (previousIndex !== -1) {
          const previousQuestion = section.questions[previousIndex]!;
          const previousState = sessionStateForWorkflowQuestion(
            previousQuestion,
            workflowSession.answers,
          );

          actions.setWorkflowSession({
            ...workflowSession,
            questionIndex: previousIndex,
            optionIndex: previousState.optionIndex,
            selectedOptionIds: previousState.selectedOptionIds,
            customEntry: null,
          });
        }
        return;
      }

      if (key.upArrow) {
        actions.setWorkflowSession({
          ...workflowSession,
          optionIndex:
            (workflowSession.optionIndex - 1 + question.options.length) %
            question.options.length,
        });
        return;
      }
      if (key.downArrow) {
        actions.setWorkflowSession({
          ...workflowSession,
          optionIndex:
            (workflowSession.optionIndex + 1) % question.options.length,
        });
        return;
      }
      if (key.escape) {
        actions.goBack();
        return;
      }

      if (
        question.selectionMode === "multi" &&
        input === " " &&
        !key.return
      ) {
        const optionId = question.options[workflowSession.optionIndex]!.id;
        const selected = workflowSession.selectedOptionIds;
        const nextSelected = selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId];

        actions.setWorkflowSession({
          ...workflowSession,
          selectedOptionIds: nextSelected,
        });
        return;
      }

      if (!key.return) {
        return;
      }

      if (question.selectionMode === "multi") {
        if (workflowSession.selectedOptionIds.length === 0) {
          return;
        }

        if (
          workflowSession.selectedOptionIds.includes("custom") &&
          !workflowSession.customNotes[question.id]
        ) {
          actions.setWorkflowSession({
            ...workflowSession,
            customEntry: {
              questionId: question.id,
              text: workflowSession.customNotes[question.id] ?? "",
            },
          });
          return;
        }

        advanceWorkflowAnswer(
          workflowSession,
          section,
          question.id,
          formatMultiAnswer(workflowSession.selectedOptionIds),
          workflowSession.customNotes,
          state.targetDir,
          actions,
        );
        return;
      }

      const selectedOption = question.options[workflowSession.optionIndex];

      if (selectedOption.id === "custom") {
        actions.setWorkflowSession({
          ...workflowSession,
          customEntry: {
            questionId: question.id,
            text: workflowSession.customNotes[question.id] ?? "",
          },
        });
        return;
      }

      advanceWorkflowAnswer(
        workflowSession,
        section,
        question.id,
        selectedOption.id,
        workflowSession.customNotes,
        state.targetDir,
        actions,
      );
      return;
    }

    if (screen.name === "engineering-dashboard") {
      const completed = countCompletedSections(state.engineeringAnswers);
      const selected = ENGINEERING_SECTION_ITEMS[selectedIndex];

      if (key.upArrow) {
        setSelectedIndex(
          (current) =>
            (current - 1 + ENGINEERING_SECTION_ITEMS.length) %
            ENGINEERING_SECTION_ITEMS.length,
        );
        return;
      }
      if (key.downArrow) {
        setSelectedIndex(
          (current) => (current + 1) % ENGINEERING_SECTION_ITEMS.length,
        );
        return;
      }
      if (key.escape) {
        actions.goBack();
        return;
      }
      if (completed === ENGINEERING_LEAF_SECTION_COUNT && input === "s") {
        actions.navigate({ name: "engineering-summary" });
        return;
      }
      if (!key.return) {
        return;
      }

      if (selected.id === "patterns") {
        actions.navigate({ name: "engineering-patterns-dashboard" });
        return;
      }

      const sectionId = selected.id;
      const section = ENGINEERING_SECTIONS.find((item) => item.id === sectionId)!;
      const visibleQuestions = getVisibleQuestions(
        section,
        state.engineeringAnswers,
      );
      const firstUnansweredQuestion =
        visibleQuestions.find(
          (item) => state.engineeringAnswers[item.id] === undefined,
        ) ?? visibleQuestions[0];

      if (!firstUnansweredQuestion) {
        return;
      }

      const questionIndex = section.questions.findIndex(
        (item) => item.id === firstUnansweredQuestion.id,
      );
      const question = section.questions[questionIndex]!;
      const sessionState = sessionStateForQuestion(
        question,
        state.engineeringAnswers,
      );

      actions.setEngineeringSession({
        sectionId,
        questionIndex,
        optionIndex: sessionState.optionIndex,
        selectedOptionIds: sessionState.selectedOptionIds,
        answers: { ...state.engineeringAnswers },
        customNotes: { ...state.engineeringCustomNotes },
        customEntry: null,
        saving: false,
      });
      actions.navigate({ name: "engineering-section", sectionId });
      return;
    }

    if (screen.name === "engineering-patterns-dashboard") {
      const selected = ENGINEERING_PATTERNS_ITEMS[selectedIndex];

      if (key.upArrow) {
        setSelectedIndex(
          (current) =>
            (current - 1 + ENGINEERING_PATTERNS_ITEMS.length) %
            ENGINEERING_PATTERNS_ITEMS.length,
        );
        return;
      }
      if (key.downArrow) {
        setSelectedIndex(
          (current) => (current + 1) % ENGINEERING_PATTERNS_ITEMS.length,
        );
        return;
      }
      if (key.escape) {
        actions.goBack();
        return;
      }
      if (!key.return) {
        return;
      }

      const sectionId = selected.id;
      const section = ENGINEERING_SECTIONS.find((item) => item.id === sectionId)!;
      const visibleQuestions = getVisibleQuestions(
        section,
        state.engineeringAnswers,
      );
      const firstUnansweredQuestion =
        visibleQuestions.find(
          (item) => state.engineeringAnswers[item.id] === undefined,
        ) ?? visibleQuestions[0];

      if (!firstUnansweredQuestion) {
        return;
      }

      const questionIndex = section.questions.findIndex(
        (item) => item.id === firstUnansweredQuestion.id,
      );
      const question = section.questions[questionIndex]!;
      const sessionState = sessionStateForQuestion(
        question,
        state.engineeringAnswers,
      );

      actions.setEngineeringSession({
        sectionId,
        questionIndex,
        optionIndex: sessionState.optionIndex,
        selectedOptionIds: sessionState.selectedOptionIds,
        answers: { ...state.engineeringAnswers },
        customNotes: { ...state.engineeringCustomNotes },
        customEntry: null,
        saving: false,
      });
      actions.navigate({ name: "engineering-section", sectionId });
      return;
    }

    if (screen.name === "engineering-section" && engineeringSession) {
      const section = ENGINEERING_SECTIONS.find(
        (item) => item.id === engineeringSession.sectionId,
      )!;
      const question = section.questions[engineeringSession.questionIndex];

      if (engineeringSession.customEntry) {
        if (key.escape || key.leftArrow) {
          actions.setEngineeringSession({
            ...engineeringSession,
            customEntry: null,
          });
          return;
        }
        if (key.backspace || key.delete) {
          actions.setEngineeringSession({
            ...engineeringSession,
            customEntry: {
              ...engineeringSession.customEntry,
              text: engineeringSession.customEntry.text.slice(0, -1),
            },
          });
          return;
        }
        if (key.return) {
          const text = engineeringSession.customEntry.text.trim();
          if (!text) {
            return;
          }

          const nextCustomNotes = {
            ...engineeringSession.customNotes,
            [question.id]: text,
          };

          const answerId =
            question.selectionMode === "multi"
              ? formatMultiAnswer(engineeringSession.selectedOptionIds)
              : "custom";

          advanceEngineeringAnswer(
            engineeringSession,
            section,
            question.id,
            answerId,
            nextCustomNotes,
            state.targetDir,
            actions,
          );
          return;
        }
        if (input && !key.ctrl && !key.meta) {
          actions.setEngineeringSession({
            ...engineeringSession,
            customEntry: {
              ...engineeringSession.customEntry,
              text: engineeringSession.customEntry.text + input,
            },
          });
        }
        return;
      }

      if (key.leftArrow) {
        const previousIndex = findPreviousVisibleQuestionIndex(
          section,
          engineeringSession.questionIndex,
          engineeringSession.answers,
        );

        if (previousIndex !== -1) {
          const previousQuestion = section.questions[previousIndex]!;
          const previousState = sessionStateForQuestion(
            previousQuestion,
            engineeringSession.answers,
          );

          actions.setEngineeringSession({
            ...engineeringSession,
            questionIndex: previousIndex,
            optionIndex: previousState.optionIndex,
            selectedOptionIds: previousState.selectedOptionIds,
            customEntry: null,
          });
        }
        return;
      }

      if (key.upArrow) {
        actions.setEngineeringSession({
          ...engineeringSession,
          optionIndex:
            (engineeringSession.optionIndex - 1 + question.options.length) %
            question.options.length,
        });
        return;
      }
      if (key.downArrow) {
        actions.setEngineeringSession({
          ...engineeringSession,
          optionIndex:
            (engineeringSession.optionIndex + 1) % question.options.length,
        });
        return;
      }
      if (key.escape) {
        actions.goBack();
        return;
      }

      if (
        question.selectionMode === "multi" &&
        input === " " &&
        !key.return
      ) {
        const optionId = question.options[engineeringSession.optionIndex]!.id;
        const selected = engineeringSession.selectedOptionIds;
        const nextSelected = selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId];

        actions.setEngineeringSession({
          ...engineeringSession,
          selectedOptionIds: nextSelected,
        });
        return;
      }

      if (!key.return) {
        return;
      }

      if (question.selectionMode === "multi") {
        if (engineeringSession.selectedOptionIds.length === 0) {
          return;
        }

        if (
          engineeringSession.selectedOptionIds.includes("custom") &&
          !engineeringSession.customNotes[question.id]
        ) {
          actions.setEngineeringSession({
            ...engineeringSession,
            customEntry: {
              questionId: question.id,
              text: engineeringSession.customNotes[question.id] ?? "",
            },
          });
          return;
        }

        advanceEngineeringAnswer(
          engineeringSession,
          section,
          question.id,
          formatMultiAnswer(engineeringSession.selectedOptionIds),
          engineeringSession.customNotes,
          state.targetDir,
          actions,
        );
        return;
      }

      const selectedOption = question.options[engineeringSession.optionIndex];

      if (selectedOption.id === "custom") {
        actions.setEngineeringSession({
          ...engineeringSession,
          customEntry: {
            questionId: question.id,
            text: engineeringSession.customNotes[question.id] ?? "",
          },
        });
        return;
      }

      advanceEngineeringAnswer(
        engineeringSession,
        section,
        question.id,
        selectedOption.id,
        engineeringSession.customNotes,
        state.targetDir,
        actions,
      );
      return;
    }

    if (screen.name === "action-result") {
      if (key.return || key.escape) {
        actions.resetToMainMenu();
      }
    }
  };
}

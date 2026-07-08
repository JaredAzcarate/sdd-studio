import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { join } from "node:path";
import type { Key } from "ink";
import { SDD_WORKSPACE_DIR } from "../constants/sdd-workspace-path.js";
import { ENGINEERING_SECTIONS } from "../engineering-config/catalog/index.js";
import { writeEngineeringSection } from "../engineering-config/generators/write-engineering-brief.js";
import { ASSISTANTS } from "../registries/assistants.registry.js";
import {
  ENGINEERING_SECTION_ITEMS,
  MAIN_MENU_ITEMS,
} from "./data/menu-items.js";
import { countCompletedSections } from "../engineering-config/state/engineering-section-status.js";
import type { AppScreen, AppState, TuiExitResult } from "./types.js";
import type { EngineeringSectionId } from "../engineering-config/types.js";
import type { AssistantId } from "../types/init-context.js";

export type EngineeringSession = {
  sectionId: EngineeringSectionId;
  questionIndex: number;
  optionIndex: number;
  answers: AppState["engineeringAnswers"];
  saving: boolean;
};

export type AppInputActions = {
  navigate: (screen: AppScreen) => void;
  goBack: () => void;
  onFinish: (result: TuiExitResult) => void;
  openEngineeringDashboard: () => Promise<void>;
  runMigrate: () => Promise<void>;
  runSync: (assistantId: AssistantId) => Promise<void>;
  runInit: (options: {
    assistantId: AssistantId;
    includeAssistant: boolean;
    includeEngineering: boolean;
    includeWorkflow: boolean;
  }) => Promise<void>;
  setAssistant: (assistant: AssistantId) => void;
  setInstallEngineering: (value: boolean) => void;
  setWorkflow: (value: boolean) => void;
  setEngineeringAnswers: (answers: AppState["engineeringAnswers"]) => void;
  setEngineeringSession: (session: EngineeringSession | null) => void;
  resetToMainMenu: () => void;
  continueInstallAfterEngineering: () => void;
};

export type AppInputContext = {
  state: AppState;
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  engineeringSession: EngineeringSession | null;
  actions: AppInputActions;
};

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
      actions,
    } = contextRef.current;
    const { screen } = state;

    if (screen.name === "action-running" || engineeringSession?.saving) {
      return;
    }

    if (screen.name === "main-menu") {
      const selected = MAIN_MENU_ITEMS[selectedIndex];
      if (key.upArrow) {
        setSelectedIndex(
          (current) =>
            (current - 1 + MAIN_MENU_ITEMS.length) % MAIN_MENU_ITEMS.length,
        );
        return;
      }
      if (key.downArrow) {
        setSelectedIndex((current) => (current + 1) % MAIN_MENU_ITEMS.length);
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
        case "install-sdd":
          actions.navigate({ name: "install-sdd-assistant" });
          break;
        case "create-workspace":
          actions.navigate({ name: "create-workspace-workflow" });
          break;
        case "configure-engineering":
          void actions.openEngineeringDashboard();
          break;
        case "sync":
          actions.navigate({ name: "sync-assistant" });
          break;
        case "migrate":
          void actions.runMigrate();
          break;
        case "exit":
          actions.onFinish({ type: "exit" });
          break;
      }
      return;
    }

    if (screen.name === "install-sdd-assistant") {
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
        actions.setAssistant(ASSISTANTS[selectedIndex].id);
        actions.navigate({ name: "install-sdd-engineering" });
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

    if (screen.name === "install-sdd-engineering") {
      if (key.upArrow || key.downArrow) {
        setSelectedIndex((current) => (current === 0 ? 1 : 0));
        return;
      }
      if (key.escape) {
        actions.goBack();
        return;
      }
      if (!key.return) {
        return;
      }

      const value = selectedIndex === 0;
      actions.setInstallEngineering(value);
      if (value) {
        void actions.openEngineeringDashboard();
        return;
      }
      actions.navigate({ name: "install-sdd-workflow" });
      return;
    }

    if (
      screen.name === "install-sdd-workflow" ||
      screen.name === "create-workspace-workflow"
    ) {
      if (key.upArrow || key.downArrow) {
        setSelectedIndex((current) => (current === 0 ? 1 : 0));
        return;
      }
      if (key.escape) {
        actions.goBack();
        return;
      }
      if (!key.return) {
        return;
      }

      const includeWorkflow = selectedIndex === 0;
      actions.setWorkflow(includeWorkflow);

      if (screen.name === "create-workspace-workflow") {
        void actions.runInit({
          assistantId: state.assistant ?? "cursor",
          includeAssistant: false,
          includeEngineering: false,
          includeWorkflow,
        });
        return;
      }

      if (!state.assistant) {
        actions.onFinish({ type: "exit" });
        return;
      }

      void actions.runInit({
        assistantId: state.assistant,
        includeAssistant: true,
        includeEngineering: state.installEngineering,
        includeWorkflow,
      });
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
      if (completed === 3 && input === "s") {
        actions.navigate({ name: "engineering-summary" });
        return;
      }
      if (!key.return) {
        return;
      }

      const sectionId = selected.id as EngineeringSectionId;
      const section = ENGINEERING_SECTIONS.find((item) => item.id === sectionId)!;
      const firstUnanswered = section.questions.findIndex(
        (question) => state.engineeringAnswers[question.id] === undefined,
      );
      const questionIndex = firstUnanswered === -1 ? 0 : firstUnanswered;
      const question = section.questions[questionIndex];
      const optionIndex = Math.max(
        0,
        question.options.findIndex(
          (option) => option.id === state.engineeringAnswers[question.id],
        ),
      );

      actions.setEngineeringSession({
        sectionId,
        questionIndex,
        optionIndex: optionIndex === -1 ? 0 : optionIndex,
        answers: { ...state.engineeringAnswers },
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
      if (!key.return) {
        return;
      }

      const nextAnswers = {
        ...engineeringSession.answers,
        [question.id]: question.options[engineeringSession.optionIndex].id,
      };

      if (engineeringSession.questionIndex < section.questions.length - 1) {
        const nextQuestion =
          section.questions[engineeringSession.questionIndex + 1];
        const nextOptionIndex = nextQuestion.options.findIndex(
          (option) => option.id === nextAnswers[nextQuestion.id],
        );

        actions.setEngineeringSession({
          sectionId: engineeringSession.sectionId,
          questionIndex: engineeringSession.questionIndex + 1,
          optionIndex: nextOptionIndex === -1 ? 0 : nextOptionIndex,
          answers: nextAnswers,
          saving: false,
        });
        return;
      }

      actions.setEngineeringSession({
        ...engineeringSession,
        answers: nextAnswers,
        saving: true,
      });

      void writeEngineeringSection({
        workspaceTechnicalDir: join(
          state.targetDir,
          SDD_WORKSPACE_DIR,
          "brief",
          "technical",
        ),
        sectionId: engineeringSession.sectionId,
        answers: nextAnswers,
      }).then(() => {
        actions.setEngineeringAnswers(nextAnswers);
        actions.setEngineeringSession(null);
        actions.goBack();
      });
      return;
    }

    if (screen.name === "engineering-summary") {
      if (key.escape) {
        actions.goBack();
        return;
      }
      if (key.return) {
        actions.continueInstallAfterEngineering();
      }
      return;
    }

    if (screen.name === "action-result") {
      if (key.return || key.escape) {
        actions.resetToMainMenu();
      }
    }
  };
}

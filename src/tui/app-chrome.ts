import type { AppScreen, AppState, FooterShortcut } from "./types.js";
import { defaultFooterShortcuts } from "./data/menu-items.js";
import { countCompletedSections } from "../engineering-config/state/engineering-section-status.js";
import { ENGINEERING_SECTIONS } from "../engineering-config/catalog/index.js";
import { findPreviousVisibleQuestionIndex } from "../engineering-config/catalog/question-utils.js";
import type { EngineeringSession } from "./use-app-input.js";

export function getSectionTitle(screen: AppScreen): string {
  switch (screen.name) {
    case "main-menu":
      return "Main Menu";
    case "install-sdd-assistant":
      return "Install SDD";
    case "sync-assistant":
      return "Sync Assistant Files";
    case "install-sdd-engineering":
      return "Install SDD";
    case "install-sdd-workflow":
      return "Install SDD";
    case "create-workspace-workflow":
      return "Create Workspace";
    case "engineering-dashboard":
      return "Configure Engineering";
    case "engineering-section":
      return (
        ENGINEERING_SECTIONS.find((item) => item.id === screen.sectionId)
          ?.title ?? "Engineering"
      );
    case "engineering-summary":
      return "Engineering Brief Complete";
    case "action-running":
      return "Working";
    case "action-result":
      return screen.title;
    default:
      return "SDD Studio";
  }
}

export function getFooterShortcuts(
  screen: AppScreen,
  engineeringAnswers: AppState["engineeringAnswers"],
  engineeringSession?: EngineeringSession | null,
): FooterShortcut[] {
  if (screen.name === "action-running") {
    return [];
  }

  if (screen.name === "engineering-dashboard") {
    const completed = countCompletedSections(engineeringAnswers);
    const shortcuts: FooterShortcut[] = [
      { keys: "↑↓", label: "Navigate" },
      { keys: "Enter", label: "Open section" },
      { keys: "Esc", label: "Main menu" },
    ];
    if (completed === 3) {
      shortcuts.push({ keys: "s", label: "Summary" });
    }
    return shortcuts;
  }

  if (screen.name === "engineering-section") {
    if (engineeringSession?.customEntry) {
      return [
        { keys: "Enter", label: "Save" },
        { keys: "Esc", label: "Cancel" },
      ];
    }

    const section = engineeringSession
      ? ENGINEERING_SECTIONS.find(
          (item) => item.id === engineeringSession.sectionId,
        )
      : undefined;
    const question = section?.questions[engineeringSession!.questionIndex];
    const hasPrevious =
      engineeringSession &&
      section &&
      findPreviousVisibleQuestionIndex(
        section,
        engineeringSession.questionIndex,
        engineeringSession.answers,
      ) !== -1;

    const shortcuts: FooterShortcut[] =
      question?.selectionMode === "multi"
        ? [
            { keys: "↑↓", label: "Navigate" },
            { keys: "Space", label: "Toggle" },
            { keys: "Enter", label: "Confirm" },
            { keys: "Esc", label: "Dashboard" },
          ]
        : [
            { keys: "↑↓", label: "Navigate" },
            { keys: "Enter", label: "Confirm" },
            { keys: "Esc", label: "Dashboard" },
          ];

    if (hasPrevious) {
      shortcuts.unshift({ keys: "←", label: "Previous" });
    }

    return shortcuts;
  }

  if (screen.name === "engineering-summary") {
    return [
      { keys: "Enter", label: "Main menu" },
      { keys: "Esc", label: "Dashboard" },
    ];
  }

  if (screen.name === "action-result") {
    return [
      { keys: "Enter", label: "Done" },
      { keys: "Esc", label: "Main menu" },
    ];
  }

  return defaultFooterShortcuts();
}

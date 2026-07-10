import type { AppScreen, AppState, FooterShortcut } from "./types.js";
import { defaultFooterShortcuts } from "./data/menu-items.js";
import { ENGINEERING_LEAF_SECTION_COUNT } from "../engineering-config/catalog/index.js";
import { WORKFLOW_LEAF_SECTION_COUNT } from "../workflow-config/catalog/index.js";
import { countCompletedSections } from "../engineering-config/state/engineering-section-status.js";
import {
  countCompletedWorkflowSections,
} from "../workflow-config/state/workflow-section-status.js";
import { ENGINEERING_SECTIONS } from "../engineering-config/catalog/index.js";
import { WORKFLOW_SECTIONS } from "../workflow-config/catalog/index.js";
import { findPreviousVisibleQuestionIndex } from "../engineering-config/catalog/question-utils.js";
import type { EngineeringSession, WorkflowSession } from "./use-app-input.js";

export function getSectionTitle(
  screen: AppScreen,
  projectMode: AppState["projectMode"] = "greenfield",
): string {
  switch (screen.name) {
    case "project-type":
      return "Project Type";
    case "brownfield-main-menu":
      return "Brownfield Menu";
    case "main-menu":
      return "Greenfield Menu";
    case "setup-foundation-assistant":
      return "Create brief scaffold";
    case "sync-assistant":
      return "Sync Assistant Files";
    case "engineering-dashboard":
      return "Configure Engineering";
    case "engineering-patterns-dashboard":
      return "Engineering Patterns";
    case "engineering-section":
      return (
        ENGINEERING_SECTIONS.find((item) => item.id === screen.sectionId)
          ?.title ?? "Engineering"
      );
    case "engineering-refactor-prompt":
      return "Refactor Engineering";
    case "engineering-summary":
      return "Engineering Brief Complete";
    case "workflow-dashboard":
      return "Configure Workflow";
    case "workflow-section":
      return (
        WORKFLOW_SECTIONS.find((item) => item.id === screen.sectionId)
          ?.title ?? "Workflow"
      );
    case "workflow-summary":
      return "Workflow Configuration Complete";
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
  workflowAnswers: AppState["workflowAnswers"] = {},
  workflowSession?: WorkflowSession | null,
  projectMode: AppState["projectMode"] = "greenfield",
  engineeringPointer: AppState["engineeringPointer"] = "current",
): FooterShortcut[] {
  if (screen.name === "action-running") {
    return [];
  }

  if (screen.name === "brownfield-notice") {
    return [
      { keys: "Enter", label: "Back" },
      { keys: "Esc", label: "Back" },
    ];
  }

  if (screen.name === "engineering-dashboard") {
    const completed = countCompletedSections(engineeringAnswers);
    const shortcuts: FooterShortcut[] = [
      { keys: "↑↓", label: "Navigate" },
      { keys: "Enter", label: "Open section" },
      { keys: "Esc", label: "Main menu" },
    ];
    if (completed === ENGINEERING_LEAF_SECTION_COUNT) {
      shortcuts.push({ keys: "s", label: "Summary" });
      if (projectMode === "brownfield" && engineeringPointer === "target") {
        shortcuts.push({ keys: "p", label: "Promote target" });
      }
    }
    if (projectMode === "brownfield" && engineeringPointer === "target") {
      shortcuts.push({ keys: "f", label: "Finalize refactor" });
    }
    return shortcuts;
  }

  if (screen.name === "engineering-refactor-prompt") {
    return [
      { keys: "↑↓", label: "Navigate" },
      { keys: "Enter", label: "Select" },
      { keys: "Esc", label: "Dashboard" },
    ];
  }

  if (screen.name === "engineering-patterns-dashboard") {
    return [
      { keys: "↑↓", label: "Navigate" },
      { keys: "Enter", label: "Open area" },
      { keys: "Esc", label: "Sections" },
    ];
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
    const shortcuts: FooterShortcut[] = [
      { keys: "Enter", label: "Main menu" },
      { keys: "Esc", label: "Dashboard" },
    ];
    if (projectMode === "brownfield" && engineeringPointer === "target") {
      shortcuts.unshift({ keys: "p", label: "Promote target" });
    }
    return shortcuts;
  }

  if (screen.name === "workflow-dashboard") {
    const completed = countCompletedWorkflowSections(workflowAnswers);
    const shortcuts: FooterShortcut[] = [
      { keys: "↑↓", label: "Navigate" },
      { keys: "Enter", label: "Open section" },
      { keys: "Esc", label: "Main menu" },
    ];
    if (completed === WORKFLOW_LEAF_SECTION_COUNT) {
      shortcuts.push({ keys: "s", label: "Summary" });
    }
    return shortcuts;
  }

  if (screen.name === "workflow-section") {
    if (workflowSession?.customEntry) {
      return [
        { keys: "Enter", label: "Save" },
        { keys: "Esc", label: "Cancel" },
      ];
    }

    const section = workflowSession
      ? WORKFLOW_SECTIONS.find(
          (item) => item.id === workflowSession.sectionId,
        )
      : undefined;
    const question = section?.questions[workflowSession!.questionIndex];
    const hasPrevious =
      workflowSession &&
      section &&
      findPreviousVisibleQuestionIndex(
        section,
        workflowSession.questionIndex,
        workflowSession.answers,
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

  if (screen.name === "workflow-summary") {
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

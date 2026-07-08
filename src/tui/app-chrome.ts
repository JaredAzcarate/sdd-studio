import type { AppScreen, AppState, FooterShortcut } from "./types.js";
import { defaultFooterShortcuts } from "./data/menu-items.js";
import { countCompletedSections } from "../engineering-config/state/engineering-section-status.js";
import { ENGINEERING_SECTIONS } from "../engineering-config/catalog/index.js";

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
    return [
      { keys: "↑↓", label: "Navigate" },
      { keys: "Enter", label: "Confirm" },
      { keys: "Esc", label: "Back" },
    ];
  }

  if (screen.name === "engineering-summary") {
    return [
      { keys: "Enter", label: "Done" },
      { keys: "Esc", label: "Back to dashboard" },
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

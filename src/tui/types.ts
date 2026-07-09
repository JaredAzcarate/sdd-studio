import type { AssistantId } from "../types/init-context.js";
import type { EngineeringConfigAnswers, EngineeringCustomNotes } from "../engineering-config/types.js";
import type { InitContextWithLabels } from "../types/init-context.js";
import type { EngineeringSectionId } from "../engineering-config/types.js";

export type AppScreen =
  | { name: "main-menu" }
  | { name: "install-sdd-assistant" }
  | { name: "install-sdd-engineering" }
  | { name: "install-sdd-workflow" }
  | { name: "create-workspace-workflow" }
  | { name: "engineering-dashboard" }
  | { name: "engineering-patterns-dashboard" }
  | { name: "engineering-section"; sectionId: EngineeringSectionId }
  | { name: "engineering-summary" }
  | { name: "sync-assistant" }
  | { name: "action-running"; label: string }
  | { name: "action-result"; title: string; lines: string[] };

export type TuiExitResult =
  | { type: "exit" }
  | { type: "init"; context: InitContextWithLabels }
  | { type: "configure"; answers: EngineeringConfigAnswers }
  | { type: "sync"; assistant: AssistantId }
  | { type: "migrate" }
  | { type: "workspace-only"; workflow: boolean };

export type AppState = {
  screen: AppScreen;
  targetDir: string;
  projectName: string;
  version: string;
  assistant?: AssistantId;
  workflow?: boolean;
  engineeringAnswers: EngineeringConfigAnswers;
  engineeringCustomNotes: EngineeringCustomNotes;
  installEngineering: boolean;
  history: AppScreen[];
};

export type FooterShortcut = {
  keys: string;
  label: string;
};

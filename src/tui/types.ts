import type { AssistantId } from "../types/init-context.js";
import type { EngineeringConfigAnswers, EngineeringCustomNotes } from "../engineering-config/types.js";
import type { InitContextWithLabels } from "../types/init-context.js";
import type { EngineeringSectionId } from "../engineering-config/types.js";
import type { WorkflowConfigAnswers, WorkflowCustomNotes } from "../workflow-config/types.js";
import type { WorkflowSectionId } from "../workflow-config/types.js";

export type AppScreen =
  | { name: "project-type" }
  | { name: "brownfield-main-menu" }
  | { name: "main-menu" }
  | { name: "setup-foundation-assistant" }
  | { name: "engineering-dashboard" }
  | { name: "engineering-patterns-dashboard" }
  | { name: "engineering-section"; sectionId: EngineeringSectionId }
  | { name: "engineering-refactor-prompt" }
  | { name: "engineering-summary" }
  | { name: "workflow-dashboard" }
  | { name: "workflow-section"; sectionId: WorkflowSectionId }
  | { name: "workflow-summary" }
  | { name: "sync-assistant" }
  | { name: "action-running"; label: string }
  | { name: "action-result"; title: string; lines: string[] };

export type TuiExitResult =
  | { type: "exit" }
  | { type: "init"; context: InitContextWithLabels }
  | { type: "configure"; answers: EngineeringConfigAnswers }
  | { type: "configure-workflow"; answers: WorkflowConfigAnswers }
  | { type: "sync"; assistant: AssistantId }
  | { type: "migrate" }
  | { type: "promote-technical" };

export type AppState = {
  screen: AppScreen;
  targetDir: string;
  projectName: string;
  version: string;
  projectMode: "greenfield" | "brownfield";
  engineeringPointer: "current" | "target";
  assistant?: AssistantId;
  engineeringAnswers: EngineeringConfigAnswers;
  engineeringCustomNotes: EngineeringCustomNotes;
  workflowAnswers: WorkflowConfigAnswers;
  workflowCustomNotes: WorkflowCustomNotes;
  history: AppScreen[];
  engineeringBriefDir: string | null;
  refactorModifiedSections: EngineeringSectionId[];
};

export type FooterShortcut = {
  keys: string;
  label: string;
};

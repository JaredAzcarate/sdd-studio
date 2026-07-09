import type {
  EngineeringConfigAnswers,
  EngineeringCustomNotes,
  EngineeringQuestion,
  EngineeringSection,
  OptionDetail,
} from "../engineering-config/types.js";

export type { OptionDetail };

export type WorkflowSectionId = "methodology" | "task-conventions";

export type WorkflowQuestion = EngineeringQuestion;

export type WorkflowSection = EngineeringSection & {
  id: WorkflowSectionId;
};

export type WorkflowConfigAnswers = EngineeringConfigAnswers;

export type WorkflowCustomNotes = EngineeringCustomNotes;

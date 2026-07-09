import { defineOption } from "./helpers.js";
import type { WorkflowSection } from "../types.js";

export const workflowTaskConventionsSection: WorkflowSection = {
  id: "task-conventions",
  title: "Task Conventions",
  description:
    "How tasks are identified, sized, and written so humans and AI agents execute consistently.",
  questions: [
    {
      id: "task-id-format",
      title: "Task ID Format",
      description: "Defines how task identifiers appear in workflow files and commits.",
      question: "Which task ID format should the project use?",
      options: [
        defineOption("task-nnn", "TASK-NNN", {
          whatIsIt:
            "Sequential three-digit IDs prefixed with TASK — the SDD Studio default.",
          example: "TASK-001, TASK-042 referenced in tasks.md and commit messages.",
          bestFor:
            "Greenfield SDD projects using sdd-plan generated workflow files.",
          considerations:
            "IDs are workspace-local; sync with external trackers via relations if needed.",
          recommendation:
            "Choose TASK-NNN when using SDD Studio workflow validation scripts.",
          learnMore:
            "validate-workflow.mjs expects TASK-NNN pattern in task definitions.",
        }),
        defineOption("release-prefixed", "Release-prefixed", {
          whatIsIt:
            "Task IDs include the release number for traceability across releases.",
          example: "R001-T01, R001-T02 grouped under release-001/tasks.md.",
          bestFor:
            "Teams running parallel releases or long-lived maintenance tracks.",
          considerations:
            "Slightly more verbose; document the pattern in workflow-config for agents.",
          recommendation:
            "Choose Release-prefixed when multiple active releases overlap.",
          learnMore:
            "Prefixing reduces ID collisions when copying tasks between releases.",
        }),
      ],
    },
    {
      id: "task-granularity",
      title: "Task Granularity",
      description: "How large each task should be before it is considered done.",
      question: "What granularity should tasks target?",
      options: [
        defineOption("vertical-slice", "Vertical slice", {
          whatIsIt:
            "Each task delivers a thin end-to-end user-visible slice across layers.",
          example:
            "TASK-005 'User can export invoice PDF' spans API, UI, and test updates.",
          bestFor:
            "Product teams optimizing for demoable increments and fast feedback.",
          considerations:
            "Slices may touch multiple domains; coordinate via release tasks.md ordering.",
          recommendation:
            "Choose Vertical slice for user-facing product work under SDD spec.",
          learnMore:
            "Vertical slices align with capabilities and flows in the business spec.",
        }),
        defineOption("layer-slice", "Layer slice", {
          whatIsIt:
            "Tasks split by technical layer — API, UI, database — within a feature.",
          example:
            "TASK-010 API endpoints, TASK-011 UI screen, TASK-012 migration script.",
          bestFor:
            "Teams with strict layer ownership or parallel specialist workstreams.",
          considerations:
            "Integration tasks are needed to avoid orphaned layer work.",
          recommendation:
            "Choose Layer slice when specialists own layers and integration is scheduled.",
          learnMore:
            "Add explicit integration tasks linking layer slices in tasks.md.",
        }),
      ],
    },
    {
      id: "task-definition-style",
      title: "Task Definition Style",
      description: "How much context each task carries for implementers and reviewers.",
      question: "How should tasks be written in tasks.md?",
      options: [
        defineOption("spec-linked", "Spec-linked", {
          whatIsIt:
            "Each task references spec files (capabilities, flows, api, ui) as acceptance source.",
          example:
            "TASK-003 implements billing-capabilities.md § Invoice export with api/billing-api.md contract.",
          bestFor:
            "SDD projects where spec is the source of truth for behavior.",
          considerations:
            "Spec must stay current or task links become stale.",
          recommendation:
            "Choose Spec-linked as the default for SDD Studio greenfield projects.",
          learnMore:
            "sdd-plan generates tasks from spec; linking reinforces traceability.",
        }),
        defineOption("outcome-focused", "Outcome-focused", {
          whatIsIt:
            "Tasks describe user or business outcomes without mandatory spec file references.",
          example:
            "TASK-007 Reduce checkout abandonment by enabling saved payment methods.",
          bestFor:
            "Early discovery phases or products where spec is still evolving.",
          considerations:
            "Reviewers need clear done criteria since spec links may be absent.",
          recommendation:
            "Choose Outcome-focused when spec coverage is incomplete but planning must proceed.",
          learnMore:
            "Migrate to spec-linked tasks once domains are fully specified.",
        }),
      ],
    },
  ],
};

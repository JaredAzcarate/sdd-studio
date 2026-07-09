import { defineOption } from "./helpers.js";
import type { WorkflowSection } from "../types.js";

export const workflowMethodologySection: WorkflowSection = {
  id: "methodology",
  title: "Planning Methodology",
  description:
    "How the team organizes work from specification to delivery — cadence, ceremonies, and release rhythm.",
  questions: [
    {
      id: "planning-methodology",
      title: "Planning Methodology",
      description: "Defines how work is discovered, prioritized, and delivered.",
      question: "Which planning methodology should the project follow?",
      options: [
        defineOption("kanban", "Kanban", {
          whatIsIt:
            "Continuous flow with WIP limits, explicit policies, and cycle-time metrics instead of fixed sprints.",
          example:
            "A single board with columns Backlog → Ready → In Progress → Review → Done and WIP limits per column.",
          bestFor:
            "Teams with variable intake, support work mixed with features, or ops-heavy products.",
          considerations:
            "Without WIP limits and explicit policies, Kanban boards become unmanaged to-do lists.",
          recommendation:
            "Choose Kanban when delivery is continuous and sprint boundaries add little value.",
          learnMore:
            "Kanban emphasizes flow efficiency; pair with SERVICE classes for expedited vs standard work.",
        }),
        defineOption("scrum", "Scrum", {
          whatIsIt:
            "Time-boxed sprints with planning, daily sync, review, and retrospective ceremonies.",
          example:
            "Two-week sprints, sprint backlog groomed from a product backlog, velocity tracked per sprint.",
          bestFor:
            "Cross-functional teams that benefit from regular inspection and predictable iteration length.",
          considerations:
            "Scrum overhead is wasted if ceremonies are skipped or the product owner role is unclear.",
          recommendation:
            "Choose Scrum when the team commits to full ceremony participation and sprint goals.",
          learnMore:
            "Scrum works best with stable teams and a dedicated product owner for backlog ordering.",
        }),
        defineOption("shape-up", "Shape Up", {
          whatIsIt:
            "Six-week cycles with shaping, betting, and building phases; appetite replaces estimates.",
          example:
            "A shaped pitch for 'invoice export' with a six-week appetite and clear rabbit holes.",
          bestFor:
            "Small product teams that want fixed cycles without sprint micromanagement.",
          considerations:
            "Requires strong shaping skills and willingness to cut scope when appetite is exceeded.",
          recommendation:
            "Choose Shape Up when you want cycle-based delivery with explicit scope betting.",
          learnMore:
            "Shape Up pairs well with SDD releases when each cycle maps to a release folder.",
        }),
      ],
    },
    {
      id: "release-cadence",
      title: "Release Cadence",
      description: "How often integrated work ships to users or staging environments.",
      question: "How often should the team target releases?",
      options: [
        defineOption("continuous", "Continuous", {
          whatIsIt:
            "Trunk-based flow with frequent merges and deploys when CI passes.",
          example:
            "Merge to main multiple times per day; production deploys behind feature flags.",
          bestFor: "Web products with strong CI/CD and feature-flag infrastructure.",
          considerations:
            "Requires automated testing and rollback paths; not ideal for app-store gatekeeping.",
          recommendation:
            "Choose Continuous when deploy automation and test coverage are mature.",
          learnMore:
            "Continuous delivery reduces batch size and integration risk across domains.",
        }),
        defineOption("sprint-based", "Sprint-based", {
          whatIsIt:
            "Releases align with sprint boundaries — typically one deploy per sprint.",
          example:
            "Sprint 12 ends Friday; release-012 folder captures tasks and review notes.",
          bestFor: "Scrum teams with a defined sprint length and release train.",
          considerations:
            "Hotfixes may need an out-of-band patch process between sprints.",
          recommendation:
            "Choose Sprint-based when methodology is Scrum or fixed iteration length.",
          learnMore:
            "Map workflow/releases/release-NNN.md to sprint or cycle numbers for traceability.",
        }),
        defineOption("milestone-driven", "Milestone-driven", {
          whatIsIt:
            "Releases ship when a milestone goal is met, not on a fixed calendar.",
          example:
            "Milestone M2 'Billing v1' completes when all TASK items in release-002 pass review.",
          bestFor:
            "Products with large coordinated features or regulatory release windows.",
          considerations:
            "Milestone scope creep delays releases; define exit criteria upfront.",
          recommendation:
            "Choose Milestone-driven when outcome milestones matter more than calendar cadence.",
          learnMore:
            "Pair with workflow/milestones/milestone-NNN.md for explicit exit criteria.",
        }),
      ],
    },
    {
      id: "ceremony-depth",
      title: "Ceremony Depth",
      description: "How much formal ceremony the team maintains during planning.",
      question: "How formal should planning ceremonies be?",
      options: [
        defineOption("lightweight", "Lightweight", {
          whatIsIt:
            "Minimal standing meetings — async updates and ad-hoc syncs when blocked.",
          example:
            "Weekly planning doc plus daily async standup in the issue tracker.",
          bestFor: "Small teams, senior contributors, or remote-first async cultures.",
          considerations:
            "Risk of misalignment grows as team size or domain count increases.",
          recommendation:
            "Choose Lightweight for teams under five with strong written communication.",
          learnMore:
            "SDD workflow files replace some ceremony artifacts with durable written plans.",
        }),
        defineOption("standard", "Standard", {
          whatIsIt:
            "Regular planning, review, and retrospective meetings with documented outcomes.",
          example:
            "Bi-weekly planning, weekly review, retrospective notes in release reviews.md.",
          bestFor: "Most product teams balancing alignment with meeting overhead.",
          considerations:
            "Meetings must produce updates to workflow/ or they become shelf-ware.",
          recommendation:
            "Choose Standard as the default for cross-functional product teams.",
          learnMore:
            "Capture ceremony outcomes in workflow/releases/release-NNN/reviews.md.",
        }),
      ],
    },
  ],
};

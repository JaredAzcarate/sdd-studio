import { defineOption } from "./helpers.js";
import type { EngineeringSection } from "../types.js";

export const engineeringConventionsSection: EngineeringSection = {
  id: "conventions",
  title: "Engineering Conventions",
  description:
    "Team standards for naming, documentation, and UX consistency that do not change core architecture.",
  questions: [
    {
      id: "file-naming",
      title: "File Naming",
      description: "Defines how source files are named across the codebase.",
      question: "Which file naming convention should the project follow?",
      options: [
        defineOption("sdd-studio", "SDD Studio", {
          whatIsIt:
            "Files follow SDD Studio conventions: kebab-case filenames, predictable suffixes for components and hooks, and folder names aligned with feature boundaries.",
          example:
            "user-profile-card.tsx, use-session-timeout.ts, and billing/invoice-list/ grouping related modules together.",
          bestFor:
            "Teams using SDD Studio workflows who want generated briefs, skills, and scaffolding to align with repository layout.",
          considerations:
            "Contributors unfamiliar with SDD Studio rules need a short onboarding reference to avoid mixing styles.",
          recommendation:
            "Choose SDD Studio when this project is managed through SDD Studio tooling and you want conventions to match generated guidance.",
          learnMore:
            "Consistent file naming reduces cognitive load during search and review; SDD Studio conventions tie filenames to architectural slices.",
        }),
        defineOption("community-standard", "Community Standard", {
          whatIsIt:
            "Files adopt widely used ecosystem conventions such as PascalCase for components, camelCase for utilities, and framework-idiomatic placement.",
          example:
            "UserProfileCard.tsx in a components folder and formatCurrency.ts alongside other helpers.",
          bestFor:
            "Teams integrating with open-source ecosystems, hiring from broad talent pools, and matching existing community templates.",
          considerations:
            "SDD Studio generators may need mapping layers if community names diverge from studio defaults.",
          recommendation:
            "Choose Community Standard when aligning with public tutorials, libraries, and hires matters more than SDD Studio-specific layout.",
          learnMore:
            "Community standards vary by stack; document the chosen variant in a short CONTRIBUTING section to keep PRs consistent.",
        }),
      ],
    },
    {
      id: "documentation-style",
      title: "Documentation Style",
      description: "Defines how technical documentation is written and maintained.",
      question: "How should technical documentation be written?",
      options: [
        defineOption("sdd-studio", "SDD Studio", {
          whatIsIt:
            "Documentation follows SDD Studio brief structure: principles, decisions, conventions, and feature-level flow docs with consistent headings and traceability to requirements.",
          example:
            "Engineering briefs in .workspace/brief/technical/ plus per-feature flow markdown linked from the modeling artifact.",
          bestFor:
            "Projects orchestrated through SDD Studio where documentation feeds downstream skills and automated planning.",
          considerations:
            "Teams must keep briefs updated when decisions change or generated guidance will drift from reality.",
          recommendation:
            "Choose SDD Studio when documentation is an input to SDD Studio skills and should mirror studio templates.",
          learnMore:
            "SDD Studio documentation treats briefs as living contracts; update them in the same PRs that change architectural assumptions.",
        }),
        defineOption("minimal", "Minimal", {
          whatIsIt:
            "Documentation stays lean: README essentials, inline code comments for non-obvious logic, and ADRs only for irreversible decisions.",
          example:
            "A README with setup steps, environment variables, and a /docs/adr folder with three records for major forks.",
          bestFor:
            "Small teams, fast-moving MVPs, and codebases where the code itself is the primary specification.",
          considerations:
            "Onboarding slows and tribal knowledge accumulates unless you periodically promote repeated questions into docs.",
          recommendation:
            "Choose Minimal when speed outweighs formal knowledge bases and the team colocates frequently.",
          learnMore:
            "Minimal documentation still needs a trustworthy README and ADRs for decisions you cannot afford to relitigate silently.",
        }),
        defineOption("enterprise", "Enterprise", {
          whatIsIt:
            "Documentation includes architecture overviews, runbooks, API references, test plans, and change logs maintained under review like production code.",
          example:
            "Versioned docs site with onboarding paths, on-call runbooks, and RFC templates for cross-team proposals.",
          bestFor:
            "Large teams, regulated environments, and vendors subject to customer audit of engineering practices.",
          considerations:
            "Documentation debt becomes compliance risk; assign owners and freshness SLAs or docs rot faster than code.",
          recommendation:
            "Choose Enterprise when auditors, customers, or distributed teams depend on written procedures to operate safely.",
          learnMore:
            "Enterprise documentation links requirements to tests and deployments; treat doc PRs with the same review rigor as feature work.",
        }),
      ],
    },
    {
      id: "ux-rules",
      title: "UX Rules",
      description: "Defines the user experience standards the product must follow.",
      question: "Which UX standard should the project follow?",
      options: [
        defineOption("standard", "Standard", {
          whatIsIt:
            "The product follows baseline usability practices: clear labels, consistent spacing, accessible contrast, and predictable navigation patterns.",
          example:
            "Primary actions visually emphasized, form errors announced inline, and focus states visible on interactive elements.",
          bestFor:
            "General-purpose business applications where users expect familiar patterns without heavy guidance.",
          considerations:
            "Complex domains may still confuse users unless supplemented with contextual help on demanding screens.",
          recommendation:
            "Choose Standard when the audience is tech-comfortable and workflows map to common software metaphors.",
          learnMore:
            "Standard UX anchors on accessibility basics and consistency; establish a small component checklist reused across features.",
        }),
        defineOption("guided", "Guided", {
          whatIsIt:
            "The experience emphasizes onboarding tours, empty states with next steps, progressive disclosure, and inline coaching for complex tasks.",
          example:
            "First-time workspace setup with a checklist, tooltips on advanced filters, and celebratory confirmation after key milestones.",
          bestFor:
            "Products with occasional users, multi-step domains, and goals to reduce support tickets through self-serve education.",
          considerations:
            "Over-guidance can annoy power users; provide dismiss paths and shortcuts for repeat visitors.",
          recommendation:
            "Choose Guided when user success depends on understanding infrequent workflows without training sessions.",
          learnMore:
            "Guided UX measures completion of onboarding steps and iterates on drop-off points with measurable experiments.",
        }),
        defineOption("enterprise", "Enterprise", {
          whatIsIt:
            "UX standards cover density modes, keyboard-first navigation, audit-friendly confirmations, localization readiness, and role-tailored interfaces.",
          example:
            "Compact data-dense tables with full keyboard shortcuts, destructive action confirmations logged for compliance, and locale-aware formats.",
          bestFor:
            "B2B buyers, power users in operations roles, and contracts referencing accessibility or language coverage.",
          considerations:
            "Higher design and engineering investment per screen; customization per tenant may be requested.",
          recommendation:
            "Choose Enterprise when buyers evaluate UX on efficiency, accessibility certifications, and multinational rollout requirements.",
          learnMore:
            "Enterprise UX documents patterns for density, permissions-aware UI, and localization hooks validated with representative customer workflows.",
        }),
      ],
    },
    {
      id: "code-comments",
      title: "Code Comments",
      description:
        "Defines when and how inline code comments are written (language follows project rules).",
      question: "What code commenting standard should the project follow?",
      options: [
        defineOption("minimal", "Minimal (non-obvious logic only)", {
          whatIsIt:
            "Comments explain why, not what; avoid restating readable code.",
          example:
            "// Retry once — upstream rate-limits burst saves.",
          bestFor:
            "Teams preferring self-documenting code and small functions.",
          considerations:
            "Complex domain rules still need brief context.",
          recommendation:
            "Choose when code clarity is prioritized over inline prose.",
          learnMore:
            "Use with schema-based validation to reduce redundant comments.",
        }),
        defineOption("tsdoc-public-api", "TSDoc/JSDoc on public APIs", {
          whatIsIt:
            "Exported functions, hooks, and components document params and return values.",
          example:
            "/** @param filters - URL-synced task filters */ on exported hooks.",
          bestFor:
            "Shared libraries, design systems, and cross-team modules.",
          considerations:
            "Keep TSDoc in sync with types; stale docs mislead.",
          recommendation:
            "Choose when many consumers import from package boundaries.",
          learnMore:
            "Do not TSDoc every private helper — focus on public surface.",
        }),
        defineOption("why-not-what", "Why-not-what comments", {
          whatIsIt:
            "Comments capture decisions, invariants, and business constraints—not literal code behavior.",
          example:
            "// Invoice totals must match tax service rounding — do not use local Math.round.",
          bestFor:
            "Domains with non-obvious rules and regulatory constraints.",
          considerations:
            "Requires reviewers to enforce comment quality in PRs.",
          recommendation:
            "Choose when business logic is easy to misread without context.",
          learnMore:
            "Pair with engineering-modeling.md for domain references.",
        }),
        defineOption("custom", "Custom", {
          whatIsIt:
            "A documented commenting policy in CONTRIBUTING.md.",
          example:
            "File headers, TODO format, or required @see links to spec files.",
          bestFor: "Teams with existing lint rules for comments.",
          considerations: "Document examples of good vs bad comments.",
          recommendation: "Choose Custom only with written standards.",
          learnMore:
            "Language for comments follows project README, not this wizard.",
        }),
      ],
    },
  ],
};

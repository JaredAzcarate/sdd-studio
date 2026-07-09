import { defineOption } from "./helpers.js";
import type { EngineeringSection } from "../types.js";

export const engineeringContributionPatternsSection: EngineeringSection = {
  id: "contribution-patterns",
  title: "Engineering Contribution Patterns",
  description:
    "Git workflow, branch strategy, environment promotion, and pull request conventions for the team.",
  questions: [
    {
      id: "branch-workflow",
      title: "Branch Workflow",
      description:
        "Defines how individual contributors branch, name work, and integrate changes.",
      question: "How should feature and fix work branch from the main line?",
      options: [
        defineOption(
          "feature-fix-from-main",
          "Short-lived feature/fix branches from main",
          {
            whatIsIt:
              "Each task gets a branch from main named by type and scope; merge back via pull request.",
            example:
              "feature/task-filters, fix/login-redirect-error — one branch per TASK or ticket.",
            bestFor:
              "Trunk-based teams shipping frequently with review before merge.",
            considerations:
              "Branch names should follow a documented prefix table (feature/, fix/, chore/).",
            recommendation:
              "Choose for most web and mobile products using GitHub/GitLab PRs.",
            learnMore:
              "Keep branches small and short-lived; rebase or update from main before merge.",
          },
        ),
        defineOption("develop-integration", "Integration branch (develop)", {
          whatIsIt:
            "Features merge into develop first; release branches promote to main.",
          example:
            "feature/auth → develop → release/1.4 → main.",
          bestFor:
            "Scheduled releases and teams batching QA on develop.",
          considerations:
            "develop can drift; require regular sync and clear release ownership.",
          recommendation:
            "Choose when QA and release trains are centralized on develop.",
          learnMore:
            "Document who cuts release branches and how hotfixes reach main.",
        }),
        defineOption("trunk-flags", "Trunk with flags / small PRs", {
          whatIsIt:
            "Very short branches or direct commits to main behind feature flags.",
          example:
            "PRs under 400 lines; incomplete work hidden behind flags.",
          bestFor:
            "Mature CI/CD and strong automated test coverage.",
          considerations:
            "Requires discipline on flags and incremental delivery.",
          recommendation:
            "Choose only when CI and flags infrastructure are already reliable.",
          learnMore:
            "Pair with environment promotion rules for safe partial releases.",
        }),
        defineOption("custom", "Custom", {
          whatIsIt:
            "A documented branching model specific to your organization.",
          example:
            "Branches per domain team with RFC naming, or fork-based external contributions.",
          bestFor: "Legacy or regulated workflows with written standards.",
          considerations:
            "Without docs, custom models confuse contributors and AI agents.",
          recommendation:
            "Choose Custom only if rules are written in CONTRIBUTING.md.",
          learnMore:
            "Describe branch prefixes, lifetime, and who may push where.",
        }),
      ],
    },
    {
      id: "branch-naming",
      title: "Branch Naming",
      description: "Defines the expected branch name pattern for new work.",
      question: "Which branch naming pattern should contributors follow?",
      options: [
        defineOption(
          "type-slash-slug",
          "type/short-slug (feature/, fix/, chore/)",
          {
            whatIsIt:
              "Prefix by change type, then a kebab-case slug derived from the task or scope.",
            example: "feature/query-param-filters, fix/toast-on-save-error.",
            bestFor: "Clear PR titles and automation from branch names.",
            considerations:
              "Align slug with TASK IDs when workflow uses TASK-NNN.",
            recommendation:
              "Choose when branch names should be readable in CI and dashboards.",
            learnMore:
              "Optional: feature/TASK-123-query-filters when tasks drive work.",
          },
        ),
        defineOption("task-id-slug", "TASK-NNN/short-slug", {
          whatIsIt:
            "Lead with the workflow task id, then a short descriptive slug.",
          example: "TASK-042/modal-query-params.",
          bestFor: "SDD workflow projects linking branches to TASK-NNN.",
          considerations:
            "Requires task ids to exist before branching.",
          recommendation:
            "Choose when sdd-plan tasks are the source of work items.",
          learnMore:
            "Pair with commit messages that repeat TASK-NNN.",
        }),
        defineOption("custom", "Custom", {
          whatIsIt: "A team-specific branch naming scheme.",
          example: "team/domain/description or dated release branches.",
          bestFor: "Organizations with existing enforced conventions.",
          considerations: "Document examples for feature vs fix vs chore.",
          recommendation: "Choose Custom only with written naming rules.",
          learnMore:
            "AI agents and CI should parse the same pattern you document.",
        }),
      ],
    },
    {
      id: "environment-promotion",
      title: "Environment Promotion",
      description:
        "Defines how changes move across dev, staging, and production environments.",
      question:
        "How should code flow across environments (dev → stage → main/production)?",
      options: [
        defineOption(
          "dev-stage-main",
          "dev → stage → main (promotion PRs)",
          {
            whatIsIt:
              "Work merges to dev for integration; stage validates; main is production via promotion PRs.",
            example:
              "PR to dev → deploy dev → PR dev→stage → QA → PR stage→main → production.",
            bestFor:
              "Teams with distinct QA on staging before production.",
            considerations:
              "Requires clear ownership of promotion PRs and rollback on main.",
            recommendation:
              "Choose when staging must mirror production before release.",
            learnMore:
              "Document which branches auto-deploy to which environment.",
          },
        ),
        defineOption("preview-main", "PR previews + main only", {
          whatIsIt:
            "Each PR gets a preview environment; main deploys to production after merge.",
          example:
            "Vercel/Netlify preview URLs per PR; merge to main → production.",
          bestFor:
            "SaaS with strong preview infra and fast trunk-based delivery.",
          considerations:
            "No long-lived stage branch; QA happens on previews.",
          recommendation:
            "Choose when preview deployments replace a permanent stage branch.",
          learnMore:
            "Tag production releases on main for traceability.",
        }),
        defineOption("direct-main", "Direct to main (single production line)", {
          whatIsIt:
            "Short-lived branches merge to main; main is the only long-lived line.",
          example:
            "feature/x → PR → main → production deploy on green CI.",
          bestFor: "Small teams and early-stage products.",
          considerations:
            "Requires confidence in CI tests and feature flags for risk.",
          recommendation:
            "Choose when staging is unnecessary or handled via previews only.",
          learnMore:
            "Hotfixes branch from main and return via PR the same day.",
        }),
        defineOption("custom", "Custom", {
          whatIsIt:
            "A bespoke promotion path across environments.",
          example:
            "Multiple staging rings, regional prod branches, or scheduled release trains.",
          bestFor: "Enterprise or regulated release processes.",
          considerations:
            "Must be documented step-by-step for contributors and agents.",
          recommendation:
            "Choose Custom only with a runbook for promotions.",
          learnMore:
            "Include who approves stage→main and how rollbacks work.",
        }),
      ],
    },
    {
      id: "commit-format",
      title: "Commit Format",
      description: "Defines how commit messages are written.",
      question: "Which commit message format should the project use?",
      options: [
        defineOption("conventional-commits", "Conventional Commits", {
          whatIsIt:
            "Messages use type(scope): description — feat, fix, chore, docs, etc.",
          example: "feat(tasks): add query-param filters to task list.",
          bestFor:
            "Changelogs, semantic release, and readable history.",
          considerations:
            "Enforce with commitlint or PR title rules if needed.",
          recommendation:
            "Choose for most open-source and product engineering teams.",
          learnMore:
            "https://www.conventionalcommits.org/",
        }),
        defineOption(
          "conventional-with-task",
          "Conventional Commits + task id",
          {
            whatIsIt:
              "Conventional format plus TASK or ticket id in scope or body.",
            example:
              "feat(tasks): add filters (TASK-042) or fix: login redirect [TASK-017].",
            bestFor: "SDD workflow and issue-tracker traceability.",
            considerations:
              "Align with branch naming and PR templates.",
            recommendation:
              "Choose when every commit must link to TASK-NNN.",
            learnMore:
              "Keep task id in scope or footer consistently.",
          },
        ),
        defineOption("imperative-short", "Imperative short subject", {
          whatIsIt:
            "Single-line imperative subject without type prefixes.",
          example: "Add task filter query params.",
          bestFor: "Small teams preferring minimal ceremony.",
          considerations:
            "Harder to automate changelogs from history.",
          recommendation:
            "Choose when tooling does not depend on commit types.",
          learnMore:
            "Still use present tense imperative in the subject line.",
        }),
        defineOption("custom", "Custom", {
          whatIsIt: "A team-specific commit template.",
          example: "Jira keys in subject, signed commits, or bilingual bodies.",
          bestFor: "Organizations with existing enforced policies.",
          considerations: "Document in CONTRIBUTING.md with examples.",
          recommendation: "Choose Custom only with copy-paste examples.",
          learnMore:
            "AI agents should read CONTRIBUTING before suggesting messages.",
        }),
      ],
    },
    {
      id: "pr-merge-strategy",
      title: "Pull Requests & Merges",
      description: "Defines how pull requests are titled, reviewed, and merged.",
      question: "How should pull requests be merged into the main line?",
      options: [
        defineOption("squash-merge", "Squash merge (one commit per PR)", {
          whatIsIt:
            "All PR commits squash into one commit on the target branch.",
          example:
            "PR #42 squash → single feat(tasks): add filters on main.",
          bestFor: "Clean main history and feature-oriented traceability.",
          considerations:
            "Lose granular commit history from the branch.",
          recommendation:
            "Choose for most product repos using PR-centric workflow.",
          learnMore:
            "PR title often becomes the squash commit subject.",
        }),
        defineOption("merge-commit", "Merge commit (preserve branch commits)", {
          whatIsIt:
            "A merge commit retains all commits from the feature branch.",
          example:
            "Merge pull request #42 with 5 commits preserved on main.",
          bestFor:
            "Teams wanting full branch archaeology on main.",
          considerations:
            "Main history can become noisy without discipline.",
          recommendation:
            "Choose when individual commits on the branch matter legally or technically.",
          learnMore:
            "Require linear PR commits or rebase before merge if needed.",
        }),
        defineOption("rebase-merge", "Rebase merge (linear history)", {
          whatIsIt:
            "PR commits replay on top of main without a merge commit.",
          example:
            "Rebase and merge → linear main as if commits were made directly.",
          bestFor: "Strict linear history policies.",
          considerations:
            "Rewrites commit SHAs; coordinate with stacked PRs carefully.",
          recommendation:
            "Choose when main must stay linear without squash grouping.",
          learnMore:
            "Document whether contributors should squash locally first.",
        }),
        defineOption("custom", "Custom", {
          whatIsIt: "Repository-specific merge rules.",
          example:
            "Squash for features, merge commit for release branches only.",
          bestFor: "Complex release trains or monorepo policies.",
          considerations: "Document per branch target if rules differ.",
          recommendation: "Choose Custom with branch-target matrix in docs.",
          learnMore:
            "Include required reviewers and status checks per path.",
        }),
      ],
    },
    {
      id: "pr-conventions",
      title: "PR Conventions",
      description:
        "Additional pull request conventions beyond merge strategy.",
      question: "Which pull request conventions apply?",
      selectionMode: "multi",
      options: [
        defineOption("pr-title-matches-commits", "PR title follows commit format", {
          whatIsIt:
            "The PR title uses the same conventional or task-linked format as commits.",
          example: "feat(tasks): add query-param filters.",
          bestFor: "Squash merges where PR title becomes the commit message.",
          considerations: "Enforce with PR template or bot.",
          recommendation: "Include when using squash merge.",
          learnMore:
            "Keeps main history readable after squash.",
        }),
        defineOption("linked-task-required", "Link TASK or ticket in PR", {
          whatIsIt:
            "Every PR references TASK-NNN or an issue id in title or body.",
          example: "Closes TASK-042 in PR description.",
          bestFor: "SDD workflow and traceability to spec tasks.",
          considerations: "Tasks must exist before PR opens.",
          recommendation: "Include when using sdd-plan workflow.",
          learnMore:
            "Pair with branch naming that includes task ids.",
        }),
        defineOption("delete-branch-on-merge", "Delete branch after merge", {
          whatIsIt:
            "Remote feature branches are removed after successful merge.",
          example: "GitHub Delete branch button enabled by default.",
          bestFor: "Avoiding stale branch clutter.",
          considerations: "Long-running branches need tags if preserved.",
          recommendation: "Include for most teams.",
          learnMore:
            "Restore from main if work needs to continue.",
        }),
      ],
    },
  ],
};

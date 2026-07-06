---
description: Reads the entire .workspace/brief/ and validated .workspace/spec/ to generate or update .workspace/workflow/ with roadmaps, milestones, releases, tasks, reviews, and decisions per SDD Studio conventions. Use when planning from spec or when the user invokes /sdd-plan. Never modifies .workspace/brief/ or .workspace/spec/.
---

# SDD Plan

Read the Brief and validated specification, then generate or update `.workspace/workflow/`.

## Required documents

Before planning, read:

- @.opencode/sdd-studio/sdd-plan/STANDARDS.md — workflow naming and IDs
- @.opencode/sdd-studio/sdd-plan/EXAMPLES.md — reference release-001

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read all of `.workspace/brief/` and `.workspace/spec/` | Modify `.workspace/brief/` or `.workspace/spec/` |
| Create/update `.workspace/workflow/` | Write code in `src/` |
| Ask the user questions | Change rules or domains in spec |
| Run validation script | Patch spec or brief when gaps exist |

## Pre-execution

1. Read `.workspace/brief/business/product-principles.md`.
2. Read `.workspace/brief/business/product-guide.md`.
3. Read `.workspace/brief/technical/development.md`, `modeling.md`, and `stack/*.md`.
4. Read all of `.workspace/spec/business/` and `.workspace/spec/technical/`.
5. Read @.opencode/sdd-studio/sdd-plan/STANDARDS.md and @.opencode/sdd-studio/sdd-plan/EXAMPLES.md.
6. Verify substantial spec (domains with 12 files each).
7. If critical `TODO:` items exist, stop and suggest **sdd-spec** or **sdd-review**.
8. Inventory existing `.workspace/workflow/`.

## Flow

### Phase 1 — Synthesis (read-only)

From brief/ and spec/, extract:

- Technical constraints (stack, architecture, methodology from `brief/technical/`)
- Product constraints (user journeys and experiences from `brief/business/product-guide.md`)
- Domains and dependencies (`*-relations.md`)
- Priority capabilities and flows
- Gaps that block planning

If critical gaps exist, report and suggest **sdd-review**; do not modify brief or spec files.

### Phase 2 — Questions

1. Roadmap horizon
2. External deadlines
3. Priority: time-to-market, quality, or balance
4. First release scope (MVP), aligned with `product-guide.md` journeys
5. New release or update existing?

### Phase 3 — Roadmap and milestones

Create or update:

- `workflow/roadmap/roadmap-NNN.md`
- `workflow/milestones/milestone-NNN.md`

Sequential 3-digit numbering: `001`, `002`, ...

### Phase 4 — Release

Create or update `workflow/releases/release-NNN/` with exactly:

- `release.md`
- `tasks.md`
- `reviews.md`
- `decisions.md`

No additional files.

### Phase 5 — Tasks

Derive tasks from spec capabilities and flows. Each task in `tasks.md` with mandatory fields (see @.opencode/sdd-studio/sdd-plan/STANDARDS.md).

IDs: `TASK-001`, `TASK-002`, ... (never reuse).

### Phase 6 — Validation

```bash
node .cursor/skills/sdd-plan/scripts/validate-workflow.mjs .workspace/workflow
```

Fix errors and re-run until `OK`.

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] brief/ and spec/ read (not modified)
- [ ] roadmap-NNN.md and milestone-NNN.md created/updated
- [ ] release-NNN/ with exactly 4 files
- [ ] validate-workflow.mjs passes with no errors
```

## Report

1. Release (`RELEASE-NNN`) created or updated
2. Task and milestone counts
3. Recorded decisions
4. Planning risks
5. Next step: implement according to `tasks.md`

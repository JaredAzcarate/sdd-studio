---
name: sdd-plan
description: Reads validated workspace/spec/ and generates or updates workspace/workflow/ with roadmaps, milestones, releases, tasks, reviews, and decisions per SDD Studio conventions. Use when planning from spec or when the user invokes /sdd-plan. Never modifies workspace/spec/.
disable-model-invocation: true
---

# SDD Plan

Read the validated specification and generate or update `workspace/workflow/`.

## Required documents

Before planning, read:

- [STANDARDS.md](STANDARDS.md) — workflow naming and IDs
- [EXAMPLES.md](EXAMPLES.md) — reference release-001

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read all of `workspace/spec/` | Modify any file in `workspace/spec/` |
| Create/update `workspace/workflow/` | Write code in `src/` |
| Ask the user questions | Change rules or domains in spec |
| Run validation script | Patch spec when gaps exist |

## Pre-execution

1. Read `workspace/spec/vision.md` and the rest of `workspace/spec/`.
2. Read [STANDARDS.md](STANDARDS.md) and [EXAMPLES.md](EXAMPLES.md).
3. Verify substantial spec (domains with 10 files each).
4. If critical `TODO:` items exist, stop and suggest **sdd-spec** or **sdd-review**.
5. Inventory existing `workspace/workflow/`.

## Flow

### Phase 1 — Synthesis (read-only)

From spec, extract:

- Domains and dependencies (`*-relations.md`)
- Priority capabilities and flows
- Constraints from `vision.md`
- Gaps that block planning

If critical gaps exist, report and suggest **sdd-review**; do not modify spec.

### Phase 2 — Questions

1. Roadmap horizon
2. External deadlines
3. Priority: time-to-market, quality, or balance
4. First release scope (MVP)
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

Derive tasks from spec capabilities and flows. Each task in `tasks.md` with mandatory fields (see [STANDARDS.md](STANDARDS.md)).

IDs: `TASK-001`, `TASK-002`, ... (never reuse).

### Phase 6 — Validation

```bash
node .cursor/skills/sdd-plan/scripts/validate-workflow.mjs workspace/workflow
```

Fix errors and re-run until `OK`.

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] Spec read (not modified)
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

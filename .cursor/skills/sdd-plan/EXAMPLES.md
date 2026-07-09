# EXAMPLES — sdd-plan

First release example for the `task` domain in TaskFlow.

## workflow/roadmap/roadmap-001.md

```markdown
# Roadmap 001

## Identifier

ROADMAP-001

---

## Objective

Deliver task management MVP for small teams in 8 weeks.

---

## Scope

- Complete Task domain
- Basic web board
- OAuth authentication

---

## Priorities

1. Task CRUD
2. Board by status
3. Basic notifications

---

## Associated Releases

- RELEASE-001
```

## workflow/milestones/milestone-001.md

```markdown
# Milestone 001 — MVP

## Identifier

MILESTONE-001

---

## Name

MVP

---

## Objective

Pilot team manages 100% of tasks in TaskFlow.

---

## Completion Criteria

- RELEASE-001 in done status
- 2 weeks of continuous use by pilot team

---

## Related Releases

- RELEASE-001
```

## workflow/releases/release-001/release.md

```markdown
# Release 001 — Task MVP

## Identifier

RELEASE-001

---

## Version

0.1.0

---

## Name

Task MVP

---

## Objective

Implement full task lifecycle: create, assign, complete.

---

## Status

planned

---

## Related Milestone

MILESTONE-001

---

## Scope

### Included

- Create, update, complete task
- Task board UI
- POST/PATCH /tasks

### Excluded

- Comments
- Native mobile app

---

## Dates

- Target start: 2026-07-10
- Target end: 2026-08-28
```

## workflow/releases/release-001/tasks.md

```markdown
# Tasks — Release 001

## Summary

| Total | Pending | In Progress | Done | Blocked |
| ----- | ------- | ----------- | ---- | ------- |
| 4     | 4       | 0           | 0    | 0       |

---

## Task List

| ID | Title | Description | Epic | Priority | Status | Owner | Dependencies |
| -- | ----- | ----------- | ---- | -------- | ------ | ----- | ------------ |
| TASK-001 | Task domain model | Implement Task entity and states | Core | high | pending | — | — |
| TASK-002 | Task API | POST/PATCH /tasks per spec | API | high | pending | — | TASK-001 |
| TASK-003 | Task board UI | Board with columns by status | UI | medium | pending | — | TASK-002 |
| TASK-004 | Task events | Emit Task Created and Task Completed | Events | medium | pending | — | TASK-001 |

---

## Spec References

- `spec/business/domain/task-domain.md`
- `spec/technical/api/task-api.md`
- `spec/technical/ui/task-ui.md`
- `spec/business/events/task-events.md`
```

## workflow/releases/release-001/reviews.md

```markdown
# Reviews — Release 001

| ID | Related Task | Reviewer | Result | Notes |
| -- | ------------ | -------- | ------ | ----- |
| REVIEW-001 | TASK-001 | — | pending | Spec alignment check |
| REVIEW-002 | TASK-002 | — | pending | API contract review |
| REVIEW-003 | TASK-003 | — | pending | UI acceptance |
```

## workflow/releases/release-001/decisions.md

```markdown
# Decisions — Release 001

## DECISION-001 — Kanban board over list view

**Context:** MVP needs fastest path to visibility.

**Decision:** Ship kanban board as primary UI.

**Justification:** Matches user mental model; spec/technical/ui/task-ui.md defines columns by status.

**Impact:** List view deferred to RELEASE-002.
```

## Anti-example — Incorrect

```text
workflow/roadmap/index.md                              # use roadmap-001.md
workflow/releases/release-001/T-01.md                # tasks go in tasks.md
.workspace/spec/business/domain/task-domain.md         # sdd-plan does not touch spec
.workspace/brief/business/product-guide.md             # sdd-plan does not touch brief
```

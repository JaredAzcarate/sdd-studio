# EXAMPLES — sdd-idea

Valid example of `workspace/spec/vision.md`.

## Full example

```markdown
# TaskFlow

## Vision

TaskFlow lets small teams manage tasks without enterprise-tool complexity, prioritizing clarity and fast adoption.

---

## Problem

Teams of 3–10 people use spreadsheets or scattered notes to coordinate work. They lose visibility into real status, duplicate effort, and lack a reliable decision history.

---

## Objectives

- Reduce weekly coordination time by 30%
- Centralize the status of all team tasks in one place
- Onboard a new member in under 15 minutes

---

## Scope

### In Scope

- Task creation, assignment, and completion
- Board view by status
- Basic notifications on status changes

### Out of Scope

- Billing and budgets
- ERP integrations
- Native mobile app (web responsive only)

---

## Context

- **Name:** TaskFlow
- **Language:** TypeScript
- **Architecture:** Clean Architecture
- **Code Organization:** Feature First
- **Modeling:** Domain Driven Design
- **Assistant:** Cursor

---

## Assumptions

- The team has internet access at all times
- Maximum 50 concurrent users in the first version
- Authentication delegated to an existing OAuth provider

---

## Risks

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| Low adoption due to migration friction | High | CSV import in MVP |
| Scope creep toward full project management | Medium | Keep out of scope explicit |

---

## Success Criteria

- A pilot team manages 100% of their tasks in TaskFlow for 2 weeks
- Average task creation time under 30 seconds

---

## Next Step

Run **sdd-spec** to discover domains and generate the specification.
```

## Anti-examples

**Incorrect — includes domains:**

```markdown
## Domains

- Task
- User
```

Domains are defined in **sdd-spec**, not in `vision.md`.

**Incorrect — includes tasks:**

```markdown
## Tasks

- TASK-001: Implement login
```

Tasks live in `workspace/workflow/`, not in `vision.md`.

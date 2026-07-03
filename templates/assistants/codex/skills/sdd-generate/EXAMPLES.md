# EXAMPLES — sdd-generate

## Example 1 — Empty spec, existing Express API

**Context:** `src/routes/tasks.ts`, `package.json` shows TypeScript + Express + PostgreSQL. `.workspace/product-guide.md` and `project.md` are stubs.

### Analysis (excerpt)

```markdown
# SDD Generate — Analysis

## Summary

Task CRUD API exists; workspace has no domain spec. Product intent partially visible from routes and README.

## Gaps

| Item | Severity | Notes |
| ---- | -------- | ----- |
| project.md | high | Stub only |
| product-guide.md | high | Stub only |
| task domain (×10) | high | No domain files |

## Open questions

1. Is TaskFlow aimed only at internal teams or external customers?
2. Should cancelled tasks be a documented state (code has no cancel route)?
```

### Proposal (excerpt)

```markdown
# SDD Generate — Proposal

## Spec files

| File | Action | Summary |
| ---- | ------ | ------- |
| .workspace/project.md | update | TypeScript, Express, PostgreSQL, Clean Architecture inferred |
| .workspace/product-guide.md | update | Task management for small teams (narrative, confirm scope) |
| .workspace/spec/domain/task-*.md | create | 10 files from code analysis |

## Implementation alignment (recommendation only)

| Step | Area | Description |
| ---- | ---- | ----------- |
| 1 | — | No code changes until spec approved |
```

**User:** `approved`

→ Skill writes files, runs `validate-spec.mjs`, reports remaining `TODO:` items.

---

## Example 2 — Drift: spec vs code

**Context:** `spec/api/task-api.md` documents `DELETE /tasks/:id`. Code has no delete handler.

### Analysis inconsistency row

| ID | Spec says | Code does | Suggested handling |
| -- | --------- | --------- | ------------------ |
| INC-001 | DELETE /tasks/:id | Not implemented | Ask: update spec or implement? |

**Conservative response:** ask user before updating spec or listing implementation steps.

**User:** "Spec is correct; we need to implement delete."

→ Final report includes implementation proposal only (no spec change, no `src/` edits by this skill).

---

## Example 3 — Wrong file boundary (anti-pattern)

**Incorrect** — language in `product-guide.md`:

```markdown
## Features

Built with TypeScript and PostgreSQL.
```

**Correct** — move to `project.md` under Language / Database sections.

---

## Example 4 — Writing without approval (anti-pattern)

**Incorrect:** generating `task-domain.md` immediately after reading `src/`.

**Correct:** complete Phases 1–3, wait for **approved**, then Phase 4.

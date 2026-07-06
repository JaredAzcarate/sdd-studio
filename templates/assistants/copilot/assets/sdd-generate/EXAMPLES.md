# EXAMPLES — sdd-generate

## Example 1 — Empty spec, existing Express API

**Context:** `src/routes/tasks.ts`, `package.json` shows TypeScript + Express + PostgreSQL. `.workspace/brief/` files are stubs.

### Analysis (excerpt)

```markdown
# SDD Generate — Analysis

## Summary

Task CRUD API exists; workspace has no domain spec. Product intent partially visible from routes and README.

## Gaps

| Item | Severity | Notes |
| ---- | -------- | ----- |
| brief/business/product-guide.md | high | Stub only |
| brief/technical/development.md | high | Stub only |
| brief/technical/stack/backend.md | high | Stub only |
| task domain (×12) | high | No domain files |

## Open questions

1. Is TaskFlow aimed only at internal teams or external customers?
2. Should cancelled tasks be a documented state (code has no cancel route)?
```

### Proposal (excerpt)

```markdown
# SDD Generate — Proposal

## Brief files

| File | Action | Summary |
| ---- | ------ | ------- |
| .workspace/brief/business/product-guide.md | update | Task management for small teams (narrative, confirm scope) |
| .workspace/brief/technical/development.md | update | SDD, Clean Architecture conventions inferred |
| .workspace/brief/technical/modeling.md | update | DDD with Task aggregate inferred |
| .workspace/brief/technical/stack/backend.md | update | TypeScript, Express inferred |
| .workspace/brief/technical/stack/database.md | update | PostgreSQL inferred |

## Spec files

| File | Action | Summary |
| ---- | ------ | ------- |
| .workspace/spec/business/domain/task-*.md | create | 7 business files from code analysis |
| .workspace/spec/technical/api/task-*.md | create | 5 technical files from code analysis |

## Implementation alignment (recommendation only)

| Step | Area | Description |
| ---- | ---- | ----------- |
| 1 | — | No code changes until spec approved |
```

**User:** `approved`

→ Skill writes files, runs `validate-spec.mjs`, reports remaining `TODO:` items.

---

## Example 2 — Drift: spec vs code

**Context:** `spec/technical/api/task-api.md` documents `DELETE /tasks/:id`. Code has no delete handler.

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

**Correct** — move to `brief/technical/stack/backend.md` and `brief/technical/stack/database.md`.

---

## Example 4 — Writing without approval (anti-pattern)

**Incorrect:** generating `task-domain.md` immediately after reading `src/`.

**Correct:** complete Phases 1–3, wait for **approved**, then Phase 4.

---

## Example 5 — Orchestrator repo + product submodule (polyrepo)

**Context:** Workspace root is `numo-orchestrator` (only `.workspace/`, skills, workflow). `brief/technical/development.md` documents:

- **Repository Strategy:** two repos; product code in Git submodule `numo-app/`
- **Code Organization:** `numo-app/src/domains/<domain>/` with `domain/`, `application/`, `infrastructure/` layers

### Pre-execution (excerpt)

1. Read `development.md` → product code root = `numo-app/`
2. Explore `numo-app/src/domains/`, not `./src/` at orchestrator root
3. Read `stack/backend.md` → Server Actions primary; Route Handlers for OAuth/webhooks only

### Analysis (excerpt)

```markdown
## Summary

Orchestrator has no product code at root; domains found under `numo-app/src/domains/task/`. Spec stubs exist; API files should follow Server Actions model per stack/backend.md.

## Gaps

| Item | Severity | Notes |
| ---- | -------- | ----- |
| task-api.md | medium | Still REST template; needs Server Actions alignment |
```

**Incorrect:** searching `src/modules/task/` at orchestrator root because a generic template said so.

**Correct:** `Inferred from numo-app/src/domains/task/` per Brief Code Organization.

# STANDARDS — sdd-generate

Mandatory rules for exploring the codebase and generating or aligning SDD workspace files.

## Purpose

**sdd-generate** bridges existing implementation and the SDD workspace:

- Reads **code** and **workspace**
- Compares them
- Reports gaps and inconsistencies
- Writes Brief and spec **only after user approval** (conservative interference)

## Conservative interference level

| Level | Behavior |
| ----- | -------- |
| **Default** | Read-only → analysis → proposal → approval → write |
| **Never** | Silent rewrites, inventing product scope, coding in `src/` |
| **Always** | Ask when business intent is unclear; prefer `TODO:` over guessing |

If the user says "generate everything without asking", still present a one-page proposal summary and wait for a single explicit "approved" before writing.

## Modes

### Mode A — Empty or stub spec

Triggers: only Brief TODOs, no domain files.

1. Infer technical context → draft `brief/technical/development.md`, `modeling.md`, and `stack/*.md`
2. Infer product from README, naming, features → draft `brief/business/product-guide.md` (mark low-confidence items `TODO:`)
3. Propose domains from code structure
4. After approval, generate domain files per **sdd-spec** STANDARDS

### Mode B — Partial spec

Triggers: some domain files exist; others missing or placeholder.

1. Map existing spec vs code
2. Propose only missing or outdated files
3. Do not rewrite complete files unless approved

### Mode C — Compare / drift

Triggers: spec and code both exist.

1. Report mismatches (spec vs implementation)
2. Classify each item:

| Class | Meaning | Default action |
| ----- | ------- | -------------- |
| `spec-outdated` | Code evolved; spec is behind | Propose spec update |
| `code-drift` | Spec is source of truth; code diverged | Propose implementation plan |
| `ambiguous` | Cannot determine | Ask user |

3. Do not change spec or recommend code edits until user picks direction per item or group

## Read scope (codebase)

Explore as applicable:

- `package.json`, lockfile, README
- `src/`, `app/`, `lib/`, `packages/` (monorepos)
- API routes, controllers, handlers
- Domain models, entities, schemas, migrations
- Tests (acceptance signals)
- Frontend routes and components
- Environment examples (not secrets)

Do not read `.env` or credential files.

## Write scope (workspace)

| Path | When |
| ---- | ---- |
| `.workspace/brief/business/product-principles.md` | Missing, stub, or approved conceptual update |
| `.workspace/brief/business/product-guide.md` | Missing, stub, or approved product guide update |
| `.workspace/brief/technical/development.md` | Missing, stub, or approved development model update |
| `.workspace/brief/technical/modeling.md` | Missing, stub, or approved modeling update |
| `.workspace/brief/technical/stack/*.md` | Missing, stub, or approved stack update |
| `.workspace/spec/business/<category>/<domain>-*.md` | Approved domain generation or update |
| `.workspace/spec/technical/<category>/<domain>-*.md` | Approved domain generation or update |

**Never write:** `.workspace/workflow/`, `src/`, `tests/` (application tests).

## Business Brief vs Technical Brief (strict)

Same separation as **sdd-idea**:

- `brief/business/product-principles.md` — conceptual foundations only
- `brief/business/product-guide.md` — narrative user-facing manual only (no technical content)
- `brief/technical/development.md` — development model and conventions (no specific technologies)
- `brief/technical/modeling.md` — modeling approach and DDD context
- `brief/technical/stack/*.md` — technology choices per layer

When inferring from code:

- Framework, language, DB → `brief/technical/stack/*.md`
- Architecture patterns, DDD → `brief/technical/modeling.md`
- Development workflow, conventions → `brief/technical/development.md`
- User-facing purpose → `brief/business/product-guide.md` (confirm with user if unclear)

## Domain generation

Follow **sdd-spec** STANDARDS exactly:

- 12 files per domain: 7 business (`domain`, `relations`, `capabilities`, `flows`, `rules`, `security`, `events`) + 5 technical (`api`, `ui`, `testing`, `architecture`, `database`)
- Naming: `<domain>-<category>.md`
- One question per document

Infer domain content from code but **label inference**:

```markdown
## Notes

Inferred from `src/modules/task/` — confirm with product owner.
```

## Analysis report format

```markdown
# SDD Generate — Analysis

## Summary

[2–4 sentences]

## SDD compliance

- [What is aligned]
- [What is not]

## Gaps

| Item | Severity | Notes |
| ---- | -------- | ----- |

## Inconsistencies

| ID | Spec says | Code does | Suggested handling |
| -- | --------- | --------- | ------------------ |

## Open questions

1. ...

## Proposed next step

[Wait for user input before proposal]
```

## Proposal format

```markdown
# SDD Generate — Proposal

## Approved scope confirmation

Reply **approved** or list changes before writes.

## Brief files

| File | Action | Summary |
| ---- | ------ | ------- |

## Spec files

| File | Action | Summary |
| ---- | ------ | ------- |

## Implementation alignment (recommendation only)

| Step | Area | Description |
| ---- | ---- | ----------- |

## Deferred / not in scope

- ...
```

## Implementation proposals

When the user wants alignment with spec:

- Describe **what** should change (files, modules, behaviors)
- Reference spec paths (`spec/technical/api/task-api.md`, etc.)
- Do **not** edit application code in this skill
- Order steps by dependency
- Flag breaking changes

## Validation

After any write:

```bash
node .cursor/skills/sdd-spec/scripts/validate-spec.mjs .workspace/spec
```

## Handoffs

| After generate | Next skill |
| -------------- | ---------- |
| Spec complete, no drift | **sdd-plan** |
| Targeted spec fixes | **sdd-review** |
| Product unknown | Ask user (may overlap **sdd-idea** questions) |
| Planning only | **sdd-plan** (never from generate directly editing workflow) |

## Prohibitions

- No writes before approved proposal
- No application code changes
- No workflow files
- No tasks or releases in spec
- No mixing technical content into `brief/business/product-guide.md`
- No duplicating full templates from sdd-spec inside generated domain files — use correct section structure

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

1. Infer domain modeling from code structure and `engineering-decisions.md` (Business Modeling section)
2. Infer product from README, naming, features → draft `brief/business/<current>/product-guide.md` (mark low-confidence items `TODO:`)
3. Propose domains from code structure
4. After approval, generate domain files per **sdd-spec** STANDARDS

If engineering principles, decisions, or conventions are missing, recommend `sdd-studio configure`. If `engineering-stack.md` is missing, recommend **sdd-technical**.

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

### Step 1 — Resolve code root from the Engineering Brief (mandatory)

Before exploring application code, read:

- `.workspace/brief/technical/engineering-decisions.md` — **Project Organization** (repository layout, domain folder convention)
- `.workspace/brief/technical/engineering-stack.md` — **Architecture Summary**, **Backend**, and **API** sections (if present)

Derive from those documents:

- **Product code root** — where application source lives (repo root, submodule path, monorepo package)
- **Domain path pattern** — how domains map to folders (e.g. `<code-root>/domains/<domain>/`)

> Before exploring application code, read `brief/technical/engineering-decisions.md` (Project Organization) and `engineering-stack.md` (Architecture Summary). Resolve the product code root from those documents (e.g. submodule path, monorepo app package, or repo root). Do not invent `packages/` or `src/modules/` unless documented there.

**Polyrepo / orchestrator repos:** the workspace root may contain only `.workspace/`, skills, and workflow — **zero product code at root**. Do not fail or assume missing `src/`; follow the Brief to locate the product repo or submodule.

If the Brief does not define layout, use generic heuristics (`src/`, `app/`, `lib/`) and mark `TODO:` — **never** assume monorepo or `packages/` by default.

Also read `brief/technical/engineering-stack.md` (Backend + API sections) for API surface conventions (Server Actions vs REST Route Handlers).

### Step 2 — Explore resolved paths

Explore as applicable under the **resolved product code root**:

- `package.json`, lockfile, README (product repo or package)
- Domain folders per **Project Organization** in the Brief
- Server Actions, route handlers, controllers (per `engineering-stack.md` Backend + API sections)
- Domain models, entities, schemas, migrations
- Tests (acceptance signals)
- Frontend routes and components
- Environment examples (not secrets)

Do not read `.env` or credential files.

## Brief-driven principles

| Principle | Rule |
| --------- | ---- |
| Brief over convention | `brief/technical/engineering-decisions.md` (Project Organization) wins over default folder names |
| Stack over REST default | Read `brief/technical/engineering-stack.md` (Backend + API) for API surface (Server Actions vs REST) |
| Polyrepo-aware | Orchestrator repos may have zero product code at root |
| Evidence label | Inferred paths must cite resolved code root from Brief, not generic templates |

## Brief path resolution (versioned)

Read `.workspace/brief/manifest.yaml` and resolve semver folders before any read or write.

| Path pattern | Pointer |
| ------------ | ------- |
| `brief/business/<business.current>/` | Business brief |
| `brief/technical/<technical.current>/` | Technical brief (reads) |
| `brief/technical/<technical.target>/` | Refactor draft (when set) |

Legacy flat layout requires `sdd-studio migrate` first.

## Write scope (workspace)

| Path | When |
| ---- | ---- |
| `brief/business/<current>/product-principles.md` | Missing, stub, or approved conceptual update |
| `brief/business/<current>/product-guide.md` | Missing, stub, or approved product guide update |
| `brief/technical/<current>/engineering-inventory.md` | Brownfield codebase inventory (Phase B only; not scaffold) |
| `spec/business/<category>/<domain>-*.md` | Approved domain generation or update |
| `spec/technical/<category>/<domain>-*.md` | Approved domain generation or update |

**Do not write:** `engineering-principles.md`, `engineering-decisions.md`, `engineering-conventions.md`, `engineering-*-patterns.md` (use `sdd-studio configure`), `engineering-stack.md` (use **sdd-technical**), `engineering-modeling.md` (legacy), `.workspace/workflow/`, `src/`, application `tests/`.

## Business Brief vs Technical Brief (strict)

Same separation as **sdd-idea**:

- `brief/business/<current>/product-principles.md` — conceptual foundations only
- `brief/business/<current>/product-guide.md` — narrative user-facing manual only
- `brief/technical/<current>/engineering-inventory.md` — factual codebase inventory (brownfield)

When inferring from code:

- Framework, language, DB → recommend **sdd-technical** to update `engineering-stack.md`
- Architecture patterns, DDD → `engineering-decisions.md` (Business Modeling) via configure, or spec domain files
- Engineering principles, decisions, conventions, patterns → recommend `sdd-studio configure`
- User-facing purpose → `brief/business/<current>/product-guide.md` (confirm with user if unclear)

## Domain generation

Follow **sdd-spec** STANDARDS exactly:

- **13 files per domain**: 8 business (`domain`, `relations`, `capabilities`, `flows`, `rules`, `security`, `events`, `decisions`) + 5 technical (`api`, `ui`, `testing`, `architecture`, `database`)
- Naming: `<domain>-<category>.md`
- One question per document

Infer domain content from code but **label inference** with the resolved path from the Brief:

```markdown
## Notes

Inferred from `<resolved-code-root>/domains/task/` — confirm with product owner.
```

Never cite `src/modules/` or `packages/` unless that path appears in `brief/technical/engineering-decisions.md` (Project Organization).

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
| Engineering Brief incomplete | `sdd-studio configure` or **sdd-technical** |
| Planning only | **sdd-plan** (never from generate directly editing workflow) |

## Prohibitions

- No writes before approved proposal
- No application code changes
- No workflow files
- No tasks or releases in spec
- No mixing technical content into `brief/business/product-guide.md`
- No duplicating full templates from sdd-spec inside generated domain files — use correct section structure
- No writing engineering input files or `engineering-stack.md`

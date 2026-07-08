---
name: sdd-review
description: Analyzes change requests against the entire .workspace/brief/ and .workspace/spec/, detects impacts and inconsistencies, updates Brief and Specification files per SDD Studio standards, and validates with validate-spec.mjs. Use when reviewing spec changes or when the user invokes /sdd-review. Never modifies .workspace/workflow/.
disable-model-invocation: true
---

# SDD Review

Analyze change requests and update `.workspace/brief/` and/or `.workspace/spec/` as needed. Never touch `.workspace/workflow/`.

## Required documents

Before editing, read:

- [STANDARDS.md](STANDARDS.md) — review rules and naming
- [EXAMPLES.md](EXAMPLES.md) — reference change scenarios
- `../sdd-spec/STANDARDS.md` — templates for `*-api.md` and `*-architecture.md` (mandatory when editing technical spec)

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read all of `.workspace/brief/` and `.workspace/spec/` | Modify `.workspace/workflow/` |
| Update `.workspace/brief/business/` for functional or user-facing changes | Write or modify application code |
| Update `.workspace/brief/technical/` when technical context changes | Generate tasks, releases, or milestones |
| Update files in `.workspace/spec/business/` and `.workspace/spec/technical/` | Change product-guide scope without explicit approval |
| Ask the user questions | |
| Run validation script | |

## Pre-execution

1. Read `.workspace/brief/business/product-principles.md`.
2. Read `.workspace/brief/business/product-guide.md`.
3. Read `.workspace/brief/technical/engineering-decisions.md`, `engineering-modeling.md`, and `engineering-stack.md`.
4. Resolve `<resolved-code-root>` and domain folder pattern from `engineering-decisions.md` Project Organization (for any technical spec edit).
5. Read all of `.workspace/spec/business/` and `.workspace/spec/technical/`.
6. Read [STANDARDS.md](STANDARDS.md), [EXAMPLES.md](EXAMPLES.md), and `../sdd-spec/STANDARDS.md` when API or architecture files are in scope.
7. Inventory spec files and note current state of all Brief and Specification documents.
8. Identify the change request; if ambiguous, ask before analyzing.

## Flow

### Step 1 — Understand the change

- What to change, add, or remove
- Type: user journey, experience, technical config, rule, API, UI, new domain, security, event, architecture, database
- Whether it affects **Business Brief** (`brief/business/`), **Technical Brief** (`brief/technical/`), or **domains** (spec files)
- Priority and requester

### Step 2 — Impact analysis

Map against existing files. Identify:

- Directly affected spec files (`<domain>-<category>.md`)
- Whether `brief/business/` or `brief/technical/` files must change
- Dependent domains via `*-relations.md`
- Inconsistencies between Brief and domain files
- Information gaps

### Step 3 — Questions

If there is ambiguity, inconsistency, or high impact, ask before editing (max 3–5 per turn).

### Step 4 — Proposal

Present a summary with files to create/update/delete. Wait for confirmation if impact is high.

### Step 5 — Apply changes

Follow [STANDARDS.md](STANDARDS.md):

- Functional or user-facing changes → `.workspace/brief/business/product-guide.md` (journey narrative)
- Conceptual changes → `.workspace/brief/business/product-principles.md`
- Technical context changes → `.workspace/brief/technical/engineering-modeling.md` (or recommend `sdd-studio configure` / **sdd-technical** for other engineering files)
- Domain changes → files under `.workspace/spec/business/` and `.workspace/spec/technical/`
- Keep `<domain>-<category>.md` naming and section templates from **sdd-spec** STANDARDS
- For `*-api.md` and `*-architecture.md`: use paths from `engineering-decisions.md` (Project Organization) and format from `engineering-stack.md` (Backend + API)
- When adding a domain: create all 12 files (7 business + 5 technical)
- When removing a domain: delete all 12 files
- Propagate changes to `relations`, `rules`, `api`, `ui`, `architecture`, `database` as needed
- Keep Brief and spec aligned after functional changes

### Step 6 — Validation

```bash
node .cursor/skills/sdd-review/scripts/validate-spec.mjs .workspace/spec
```

Fix errors and re-run until `OK`.

## Checklist

```
- [ ] STANDARDS.md, EXAMPLES.md, and sdd-spec STANDARDS (if technical spec) read
- [ ] engineering-decisions.md and engineering-stack.md consulted for api/architecture edits
- [ ] brief/ and spec/ reviewed
- [ ] Impact documented and confirmed if applicable
- [ ] Only brief/ and/or spec/ modified
- [ ] validate-spec.mjs passes with no errors
- [ ] workflow/ untouched
```

## Report

1. Change applied or blocked
2. Modified files
3. Resolved and open inconsistencies
4. If replanning is needed: **sdd-plan**
5. If Brief discovery is needed: **sdd-idea**

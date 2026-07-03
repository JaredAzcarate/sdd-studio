---
name: sdd-review
description: Analyzes change requests against .workspace/product-guide.md, .workspace/project.md, and .workspace/spec/, detects impacts and inconsistencies, updates product-guide and specification files per SDD Studio standards, and validates with validate-spec.mjs. Use when reviewing spec changes or when the user invokes /sdd-review. Never modifies .workspace/workflow/.
disable-model-invocation: true
---

# SDD Review

Analyze change requests and update `.workspace/product-guide.md`, `.workspace/project.md`, and/or `.workspace/spec/` as needed. Never touch `.workspace/workflow/`.

## Required documents

Before editing, read:

- [STANDARDS.md](STANDARDS.md) — review rules and naming
- [EXAMPLES.md](EXAMPLES.md) — reference change scenarios

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read `.workspace/product-guide.md`, `.workspace/project.md`, and all of `.workspace/spec/` | Modify `.workspace/workflow/` |
| Update `.workspace/product-guide.md` for functional or user-facing changes | Write or modify application code |
| Update `.workspace/project.md` when technical context changes | Generate tasks, releases, or milestones |
| Update files in `.workspace/spec/` | Change product-guide scope without explicit approval |
| Ask the user questions | |
| Run validation script | |

## Pre-execution

1. Read `.workspace/product-guide.md`.
2. Read `.workspace/project.md`.
3. Read all of `.workspace/spec/`.
4. Read [STANDARDS.md](STANDARDS.md) and [EXAMPLES.md](EXAMPLES.md).
5. Inventory `.workspace/spec/` and note current state of all root documents.
6. Identify the change request; if ambiguous, ask before analyzing.

## Flow

### Step 1 — Understand the change

- What to change, add, or remove
- Type: user journey, experience, technical config, rule, API, UI, new domain, security, event
- Whether it affects **product guide** (`product-guide.md`), **project** (`project.md`), or **domains** (spec files)
- Priority and requester

### Step 2 — Impact analysis

Map against existing files. Identify:

- Directly affected spec files (`<domain>-<category>.md`)
- Whether `product-guide.md` or `project.md` must change
- Dependent domains via `*-relations.md`
- Inconsistencies between `product-guide.md`, `project.md`, and domain files
- Information gaps

### Step 3 — Questions

If there is ambiguity, inconsistency, or high impact, ask before editing (max 3–5 per turn).

### Step 4 — Proposal

Present a summary with files to create/update/delete. Wait for confirmation if impact is high.

### Step 5 — Apply changes

Follow [STANDARDS.md](STANDARDS.md):

- Functional or user-facing changes → `.workspace/product-guide.md` (journey narrative)
- Technical changes → `.workspace/project.md` only
- Domain changes → files under `.workspace/spec/`
- Keep `<domain>-<category>.md` naming and section templates
- When adding a domain: create all 10 files
- When removing a domain: delete all 10 files
- Propagate changes to `relations`, `rules`, `api`, `ui` as needed
- Keep product guide and spec aligned after functional changes

### Step 6 — Validation

```bash
node .cursor/skills/sdd-review/scripts/validate-spec.mjs .workspace/spec
```

Fix errors and re-run until `OK`.

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] product-guide.md, project.md, and spec/ reviewed
- [ ] Impact documented and confirmed if applicable
- [ ] Only product-guide.md, project.md, and/or .workspace/spec/ modified
- [ ] validate-spec.mjs passes with no errors
- [ ] workflow/ untouched
```

## Report

1. Change applied or blocked
2. Modified files
3. Resolved and open inconsistencies
4. If replanning is needed: **sdd-plan**
5. If product or project discovery is needed: **sdd-idea**

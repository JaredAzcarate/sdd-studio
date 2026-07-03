---
name: sdd-review
description: Analyzes change requests against workspace/spec/, detects impacts and inconsistencies, asks clarifying questions, updates only the specification per SDD Studio standards, and validates with validate-spec.mjs. Use when reviewing spec changes or when the user invokes /sdd-review. Never modifies workspace/workflow/.
disable-model-invocation: true
---

# SDD Review

Analyze change requests and update **only** `workspace/spec/`.

## Required documents

Before editing, read:

- [STANDARDS.md](STANDARDS.md) — review rules and naming
- [EXAMPLES.md](EXAMPLES.md) — reference change scenarios

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read all of `workspace/spec/` | Modify `workspace/workflow/` |
| Update files in `workspace/spec/` | Write or modify code |
| Ask the user questions | Generate tasks, releases, or milestones |
| Run validation script | Change `vision.md` without explicit approval |

## Pre-execution

1. Read `workspace/spec/vision.md` and the rest of `workspace/spec/`.
2. Read [STANDARDS.md](STANDARDS.md) and [EXAMPLES.md](EXAMPLES.md).
3. Inventory `workspace/spec/`.
4. Identify the change request; if ambiguous, ask before analyzing.

## Flow

### Step 1 — Understand the change

- What to change, add, or remove
- Type: scope, rule, API, UI, new domain, security, event
- Priority and requester

### Step 2 — Impact analysis

Map against existing spec. Identify:

- Directly affected files (`<domain>-<category>.md` format)
- Dependent domains via `*-relations.md`
- Inconsistencies with `vision.md` or other domains
- Information gaps

### Step 3 — Questions

If there is ambiguity, inconsistency, or high impact, ask before editing (max 3–5 per turn).

### Step 4 — Proposal

Present a summary with files to create/update/delete. Wait for confirmation if impact is high.

### Step 5 — Apply changes

Follow [STANDARDS.md](STANDARDS.md):

- Keep `<domain>-<category>.md` naming
- Keep section templates
- When adding a domain: create all 10 files
- When removing a domain: delete all 10 files
- Propagate changes to `relations`, `rules`, `api`, `ui` as needed

### Step 6 — Validation

```bash
node .cursor/skills/sdd-review/scripts/validate-spec.mjs workspace/spec
```

Fix errors and re-run until `OK`.

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] Impact documented and confirmed if applicable
- [ ] Only workspace/spec/ modified
- [ ] validate-spec.mjs passes with no errors
- [ ] workflow/ untouched
```

## Report

1. Change applied or blocked
2. Modified files
3. Resolved and open inconsistencies
4. If replanning is needed: **sdd-plan**
5. If a new vision is needed: **sdd-idea**

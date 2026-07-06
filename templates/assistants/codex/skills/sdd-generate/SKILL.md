---
name: sdd-generate
description: Explores the codebase and workspace brief/spec, compares implementation against SDD conventions, proposes gaps and inconsistencies, and generates or updates .workspace/brief/ and domain spec files with conservative user approval. Use for existing projects, missing spec, spec drift, or when the user invokes /sdd-generate.
disable-model-invocation: true
---

# SDD Generate

Explore the project, compare code with `.workspace/`, and generate or align the Brief and specification — **conservative mode**: ask first, write only after approval.

## When to use

| Situation | Action |
| --------- | ------ |
| No spec or only stubs | Infer from codebase; propose full Brief and domain files |
| Partial spec | Identify gaps; propose additions |
| Spec exists + code exists | Compare; report drift, inconsistencies, and misalignment with SDD |
| User asks to align code with spec | Propose implementation plan (do not write application code) |

For **greenfield** projects with no code yet, prefer **sdd-idea** then **sdd-spec**.

## Required documents

Before any write, read:

- [STANDARDS.md](STANDARDS.md) — conservative rules and output structure
- [EXAMPLES.md](EXAMPLES.md) — analysis and proposal examples
- `../sdd-idea/STANDARDS.md` — Brief templates (business + technical)
- `../sdd-spec/STANDARDS.md` — domain file templates and naming

## Scope

| Allowed | Forbidden |
| --------- | ----------- |
| Read application code at the **resolved product code root** (from `brief/technical/development.md`) | Modify `.workspace/workflow/` |
| Read and write files under `.workspace/brief/` | Write or modify application code |
| Create/update domain files in `.workspace/spec/business/` and `.workspace/spec/technical/` | Implement features in `src/` |
| Ask the user; propose implementation plans | Generate tasks, releases, or roadmap |
| Run `validate-spec.mjs` after approved writes | Write files without explicit approval |
| | Invent business rules or product scope without evidence or confirmation |
| | Narrative content inside `.workspace/spec/` |

## Conservative interference (mandatory)

1. **Read-only first** — no file writes until the user approves the proposal.
2. **Ask before inferring** — mark uncertainty with `TODO:` and ask (max 3–5 questions per turn).
3. **Separate Business Brief from Technical Brief** — user-facing content only in `brief/business/`; technical content only in `brief/technical/`.
4. **Evidence-based** — tie each spec claim to code, config, or explicit user answer.
5. **Proposal gate** — present a structured proposal; wait for approval before Phase 4 (writes).
6. **Minimal diff** — update only files listed in the approved proposal.

## Pre-execution

1. Read [STANDARDS.md](STANDARDS.md) and [EXAMPLES.md](EXAMPLES.md).
2. Read `.workspace/brief/technical/development.md` and resolve the **product code root** (Repository Strategy, Code Organization). Read `brief/technical/stack/backend.md` for API conventions.
3. Inventory `.workspace/brief/`, `.workspace/spec/`, and `.workspace/workflow/` (read-only).
4. Inventory codebase under the resolved code root: `package.json`, README, domain folders, tests, handlers/actions per stack/backend.md.
5. Determine mode: empty spec, partial spec, or compare/drift.
6. If `.workspace/` is missing, stop and suggest `npx sdd-studio init`.

## Flow

### Phase 1 — Exploration (read-only)

Document:

- Resolved product code root and domain path pattern (from `brief/technical/development.md`)
- Stack and structure from code and `brief/technical/`
- API surface per `brief/technical/stack/backend.md` (Server Actions, Route Handlers, etc.)
- User-facing signals from README, UI copy, help text (for `product-guide.md` draft)
- Existing spec files and their completeness
- Domains inferred from Brief Code Organization, modules, folders, entities, or bounded contexts

Do not write any workspace files in this phase.

### Phase 2 — Analysis

Produce an **Analysis Report** with:

1. **SDD compliance** — what matches or violates SDD Studio conventions
2. **Gaps** — missing Brief files, domain files, or sections
3. **Inconsistencies** — spec says X, code does Y; Business Brief vs Technical Brief boundary violations
4. **Open questions** — ambiguous business rules, unclear scope, missing context
5. **Risks** — high-impact assumptions if proceeding without answers

Stop and ask the user how to handle open questions before proposing writes.

### Phase 3 — Proposal

Present a **Proposal** (no writes yet):

| File / area | Action | Reason |
| ----------- | ------ | ------ |
| ... | create / update / skip | ... |

Include:

- **Brief changes** — files to create or update under `.workspace/brief/`
- **Spec changes** — files to create or update under `.workspace/spec/`
- **Implementation alignment** (optional) — high-level steps to align code with approved spec (no code edits)

Wait for explicit user approval. If the user adjusts the proposal, revise and confirm again.

### Phase 4 — Generation (approved scope only)

Write only approved files:

- `.workspace/brief/business/product-principles.md` — per **sdd-idea** STANDARDS
- `.workspace/brief/business/product-guide.md` — per **sdd-idea** STANDARDS (narrative, no technical content)
- `.workspace/brief/technical/development.md` — per **sdd-idea** STANDARDS
- `.workspace/brief/technical/modeling.md` — per **sdd-idea** STANDARDS
- `.workspace/brief/technical/stack/*.md` — infer stack from code (frontend, backend, database, infrastructure, ai)
- Domain files — per **sdd-spec** STANDARDS (12 files per approved domain)

Use `TODO:` for anything not confirmed.

### Phase 5 — Validation

```bash
node .cursor/skills/sdd-spec/scripts/validate-spec.mjs .workspace/spec
```

Fix validation errors within approved scope. Re-run until exit code 0.

### Phase 6 — Final report

1. Files created or updated
2. Remaining gaps and `TODO:` items
3. Unresolved inconsistencies (if any)
4. **Implementation proposal** — ordered steps to align code with spec (if requested)
5. Next step: **sdd-review**, **sdd-plan**, or user-driven implementation

## Checklist

```
- [ ] STANDARDS.md, EXAMPLES.md, sdd-idea/sdd-spec STANDARDS read
- [ ] Codebase and workspace inventoried (read-only phases complete)
- [ ] Analysis report delivered
- [ ] Open questions answered or explicitly deferred
- [ ] Proposal approved by user
- [ ] Only approved files written
- [ ] validate-spec.mjs passes
- [ ] workflow/ and src/ untouched
```

---
name: sdd-generate
description: Explores the codebase and workspace spec, compares implementation against SDD conventions, proposes gaps and inconsistencies, and generates or updates project.md, product-guide.md, and domain spec files with conservative user approval. Use for existing projects, missing spec, spec drift, or when the user invokes /sdd-generate.
---

# SDD Generate

Explore the project, compare code with `.workspace/`, and generate or align the specification — **conservative mode**: ask first, write only after approval.

## When to use

| Situation | Action |
| --------- | ------ |
| No spec or only stubs | Infer from codebase; propose full `project.md`, `product-guide.md`, and domain files |
| Partial spec | Identify gaps; propose additions |
| Spec exists + code exists | Compare; report drift, inconsistencies, and misalignment with SDD |
| User asks to align code with spec | Propose implementation plan (do not write application code) |

For **greenfield** projects with no code yet, prefer **sdd-idea** then **sdd-spec**.

## Required documents

Before any write, read:

- [STANDARDS.md](STANDARDS.md) — conservative rules and output structure
- [EXAMPLES.md](EXAMPLES.md) — analysis and proposal examples
- `../sdd-idea/STANDARDS.md` — `project.md` and `product-guide.md` templates
- `../sdd-spec/STANDARDS.md` — domain file templates and naming

## Scope

| Allowed | Forbidden |
| --------- | ----------- |
| Read application code (`src/`, `app/`, `lib/`, tests, configs) | Modify `.workspace/workflow/` |
| Read and write `.workspace/project.md` | Write or modify application code |
| Read and write `.workspace/product-guide.md` | Implement features in `src/` |
| Create/update domain files in `.workspace/spec/` | Generate tasks, releases, or roadmap |
| Ask the user; propose implementation plans | Write files without explicit approval |
| Run `validate-spec.mjs` after approved writes | Invent business rules or product scope without evidence or confirmation |
| | Narrative content inside `.workspace/spec/` |

## Conservative interference (mandatory)

1. **Read-only first** — no file writes until the user approves the proposal.
2. **Ask before inferring** — mark uncertainty with `TODO:` and ask (max 3–5 questions per turn).
3. **Separate product guide from project** — user-facing content only in `product-guide.md`; technical content only in `project.md`.
4. **Evidence-based** — tie each spec claim to code, config, or explicit user answer.
5. **Proposal gate** — present a structured proposal; wait for approval before Phase 4 (writes).
6. **Minimal diff** — update only files listed in the approved proposal.

## Pre-execution

1. Read [STANDARDS.md](STANDARDS.md) and [EXAMPLES.md](EXAMPLES.md).
2. Inventory `.workspace/project.md`, `.workspace/product-guide.md`, `.workspace/spec/`, and `.workspace/workflow/` (read-only).
3. Inventory codebase: `package.json`, README, `src/` (or equivalent), tests, API routes, DB schemas if present.
4. Determine mode: empty spec, partial spec, or compare/drift.
5. If `.workspace/` is missing, stop and suggest `npx sdd-studio init`.

## Flow

### Phase 1 — Exploration (read-only)

Document:

- Stack and structure from code and `project.md`
- User-facing signals from README, UI copy, help text (for `product-guide.md` draft)
- Existing spec files and their completeness
- Domains inferred from modules, folders, entities, or bounded contexts

Do not write any workspace files in this phase.

### Phase 2 — Analysis

Produce an **Analysis Report** with:

1. **SDD compliance** — what matches or violates SDD Studio conventions
2. **Gaps** — missing `project.md`, `product-guide.md`, domain files, or sections
3. **Inconsistencies** — spec says X, code does Y; product guide vs project boundary violations
4. **Open questions** — ambiguous business rules, unclear scope, missing context
5. **Risks** — high-impact assumptions if proceeding without answers

Stop and ask the user how to handle open questions before proposing writes.

### Phase 3 — Proposal

Present a **Proposal** (no writes yet):

| File / area | Action | Reason |
| ----------- | ------ | ------ |
| ... | create / update / skip | ... |

Include:

- **Spec changes** — files to create or update under `.workspace/`
- **Implementation alignment** (optional) — high-level steps to align code with approved spec (no code edits)

Wait for explicit user approval. If the user adjusts the proposal, revise and confirm again.

### Phase 4 — Generation (approved scope only)

Write only approved files:

- `.workspace/project.md` — per **sdd-idea** STANDARDS
- `.workspace/product-guide.md` — per **sdd-idea** STANDARDS (narrative, no technical content)
- Domain files — per **sdd-spec** STANDARDS (10 files per approved domain)

Use `TODO:` for anything not confirmed.

### Phase 5 — Validation

```bash
node .claude/skills/sdd-spec/scripts/validate-spec.mjs .workspace/spec
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

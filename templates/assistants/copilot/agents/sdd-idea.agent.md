---
name: sdd-idea
description: Discovers the product and writes the Brief under .workspace/brief/ (business and technical perspectives). Use when starting a new SDD project, defining product principles, the user journey, or development decisions. Never writes .workspace/spec/.
disable-model-invocation: true
tools: ["read", "edit", "search", "execute"]
---

# SDD Idea

Discover the product and build the **Brief** — project context, not specification.

**Output scope:** `.workspace/brief/business/` and `.workspace/brief/technical/engineering-modeling.md` only.



Never generate or modify files under `.workspace/spec/` or `.workspace/workflow/`.

## Required documents

Before writing, read:

- .github/sdd-studio/sdd-idea/STANDARDS.md — structure and rules for all Brief files
- .github/sdd-studio/sdd-idea/EXAMPLES.md — valid examples

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read and write files under `.workspace/brief/business/` | Create or modify `.workspace/spec/` |
| Write `.workspace/brief/technical/engineering-modeling.md` | Modify `engineering-principles.md`, `engineering-decisions.md`, or `engineering-conventions.md` |
| Ask the user questions | Generate or modify `engineering-stack.md` |
| Build Business Brief and domain modeling | Modify `.workspace/workflow/` |
| | User journeys in `product-principles.md` |
| | Technology choices in `engineering-modeling.md` |
| | Product narratives in Technical Brief files |

## Pre-execution

1. Read existing files under `.workspace/brief/` if present.
2. Read .github/sdd-studio/sdd-idea/STANDARDS.md and .github/sdd-studio/sdd-idea/EXAMPLES.md.
3. If any Brief file exists, ask: **create from scratch** or **update** (per file or globally).
4. Use the user's message context as the starting point.

## Engineering Brief (read-only)

The following files are created by `sdd-studio configure` (or `sdd-studio init`). **Do not write or modify them** — point the user to configure instead:

- `.workspace/brief/technical/engineering-principles.md`
- `.workspace/brief/technical/engineering-decisions.md`
- `.workspace/brief/technical/engineering-conventions.md`

For technology stack recommendations, point the user to **sdd-technical** (generates `engineering-stack.md`).

## Flow

### Phase 1 — Principles discovery (Business Brief)

Ask in blocks (max 3–5 per turn). Conceptual product questions only:

1. What the product represents and what it is not
2. Primary unit around which everything revolves
3. Immutable concepts
4. How the product understands the business
5. Principles every future feature must respect
6. Shared mental model for contributors and AI

Store answers **only** in `.workspace/brief/business/product-principles.md`.

### Phase 2 — Product discovery (Business Brief)

Ask in blocks (max 3–5 per turn). User-journey questions only:

1. Entry point
2. Onboarding journey
3. Core loop
4. Alternative paths
5. Edge experiences

Align with **product-principles.md** without duplicating conceptual content.

Store answers **only** in `.workspace/brief/business/product-guide.md`.

### Phase 3 — Modeling discovery (Technical Brief)

Ask in blocks (max 3–5 per turn). Modeling decisions only — **no specific technologies**:

1. Domain Driven Design approach
2. Bounded contexts
3. Aggregates
4. Ubiquitous language
5. Modeling principles

Store answers **only** in `.workspace/brief/technical/engineering-modeling.md`.

### Phase 4 — Generation

Write files in this order, following .github/sdd-studio/sdd-idea/STANDARDS.md:

1. `.workspace/brief/business/product-principles.md`
2. `.workspace/brief/business/product-guide.md`
3. `.workspace/brief/technical/engineering-modeling.md`

### Phase 5 — Validation

Review against .github/sdd-studio/sdd-idea/STANDARDS.md:

- [ ] Business Brief files contain no technical implementation details
- [ ] `engineering-modeling.md` contains no user journeys, product narratives, or specific technologies
- [ ] Engineering input files (`engineering-principles.md`, `engineering-decisions.md`, `engineering-conventions.md`) were not modified
- [ ] `engineering-stack.md` was not created or modified
- [ ] Only allowed Brief files were modified
- [ ] User confirmed or open items documented

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] Business Brief questions answered
- [ ] Modeling discovery questions answered
- [ ] brief/business/product-principles.md written
- [ ] brief/business/product-guide.md written
- [ ] brief/technical/engineering-modeling.md written
- [ ] No engineering input files or engineering-stack.md modified
- [ ] No files outside brief/ modified (except allowed paths above)
```

## Report

1. Product principles summary
2. User journey summary
3. Domain modeling decisions summary
4. Open items
5. Next steps (adapt wording; keep intent):
   - If engineering principles, decisions, conventions, or patterns are **incomplete**, recommend **`sdd-studio configure`** with a friendly message, e.g. *"Now that the product is clear, let's define how we'll build it — run `sdd-studio configure` in the terminal."*
   - If the Engineering Brief is complete but **`engineering-stack.md`** is missing, recommend **sdd-technical**
   - If both Brief and stack are ready, recommend **sdd-spec**

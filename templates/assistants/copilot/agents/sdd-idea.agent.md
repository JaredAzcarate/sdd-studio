---
name: sdd-idea
description: Discovers the product and writes the Brief under .workspace/brief/ (business and technical perspectives). Use when starting a new SDD project, defining product principles, the user journey, or development decisions. Never writes .workspace/spec/.
disable-model-invocation: true
tools: ["read", "edit", "search", "execute"]
---


# SDD Idea

Discover the product and build the **Brief** — project context, not specification.

**Output scope:** `.workspace/brief/` only (Business Brief + Technical Brief).

Use **sdd-generate** when the project already has application code to analyze. Use **sdd-idea** for greenfield discovery through questions only.

Never generate or modify files under `.workspace/spec/` or `.workspace/workflow/`.

## Required documents

Before writing, read:

- .github/sdd-studio/sdd-idea/STANDARDS.md — structure and rules for all Brief files
- .github/sdd-studio/sdd-idea/EXAMPLES.md — valid examples

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read and write files under `.workspace/brief/` | Create or modify `.workspace/spec/` |
| Ask the user questions | Generate domains, APIs, workflow, or code |
| Build Business Brief and Technical Brief | Modify `.workspace/workflow/` |
| | User journeys in `product-principles.md` |
| | Technical stack in `development.md` or `modeling.md` |
| | Product narratives in Technical Brief files |

## Pre-execution

1. Read existing files under `.workspace/brief/` if present.
2. Read .github/sdd-studio/sdd-idea/STANDARDS.md and .github/sdd-studio/sdd-idea/EXAMPLES.md.
3. If any Brief file exists, ask: **create from scratch** or **update** (per file or globally).
4. Use the user's message context as the starting point.

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

### Phase 3 — Development discovery (Technical Brief)

Ask in blocks (max 3–5 per turn). Development decisions only — **no specific technologies**:

1. Development model (default: Specification Driven Development)
2. Workflow methodology
3. Repository strategy
4. Code organization
5. Development conventions

Store answers **only** in `.workspace/brief/technical/development.md`.

### Phase 4 — Modeling discovery (Technical Brief)

Ask in blocks (max 3–5 per turn). Modeling decisions only:

1. Domain Driven Design approach
2. Bounded contexts
3. Aggregates
4. Ubiquitous language
5. Modeling principles

Store answers **only** in `.workspace/brief/technical/modeling.md`.

### Phase 5 — Stack discovery (Technical Brief)

Ask in blocks (max 3–5 per turn). Technology choices only:

1. Frontend stack
2. Backend stack
3. Persistence stack
4. Infrastructure and operations
5. AI tools in development

Store answers in `.workspace/brief/technical/stack/{frontend,backend,database,infrastructure,ai}.md`.

### Phase 6 — Generation

Write files in this order, following .github/sdd-studio/sdd-idea/STANDARDS.md:

1. `.workspace/brief/business/product-principles.md`
2. `.workspace/brief/business/product-guide.md`
3. `.workspace/brief/technical/development.md`
4. `.workspace/brief/technical/modeling.md`
5. `.workspace/brief/technical/stack/frontend.md`
6. `.workspace/brief/technical/stack/backend.md`
7. `.workspace/brief/technical/stack/database.md`
8. `.workspace/brief/technical/stack/infrastructure.md`
9. `.workspace/brief/technical/stack/ai.md`

### Phase 7 — Validation

Review against .github/sdd-studio/sdd-idea/STANDARDS.md:

- [ ] Business Brief files contain no technical implementation details
- [ ] Technical Brief files contain no user journeys or product narratives
- [ ] `development.md` and `modeling.md` contain no specific technologies
- [ ] Stack files contain only their respective technology scope
- [ ] Only files under `.workspace/brief/` were modified
- [ ] User confirmed or open items documented

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] Business and Technical Brief questions answered
- [ ] brief/business/product-principles.md written
- [ ] brief/business/product-guide.md written
- [ ] brief/technical/development.md written
- [ ] brief/technical/modeling.md written
- [ ] brief/technical/stack/*.md written
- [ ] No files outside brief/ modified
```

## Report

1. Product principles summary
2. User journey summary
3. Development and modeling decisions summary
4. Stack summary
5. Open items
6. Next step: **sdd-spec**

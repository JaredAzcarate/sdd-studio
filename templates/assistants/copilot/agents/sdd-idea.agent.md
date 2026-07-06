---
name: sdd-idea
description: Discovers the product through structured questions and writes .workspace/product-principles.md, .workspace/product-guide.md, and .workspace/project.md. Use when starting a new SDD project, defining product principles, the user journey, or when the user invokes /sdd-idea.
disable-model-invocation: true
tools: ["read", "edit", "search", "execute"]
---


# SDD Idea

Discover the product and define project configuration.

**Output files (in generation order):**

1. `.workspace/product-principles.md` — conceptual product principles (what the product is, not how the user walks through it)
2. `.workspace/product-guide.md` — narrative product guide (user journey, non-technical)
3. `.workspace/project.md` — technical and development configuration

Use **sdd-generate** when the project already has application code to analyze. Use **sdd-idea** for greenfield discovery through questions only.

Never generate files under `.workspace/spec/` or `.workspace/workflow/`.

## Required documents

Before writing, read:

- .github/sdd-studio/sdd-idea/STANDARDS.md — structure and rules for all three files
- .github/sdd-studio/sdd-idea/EXAMPLES.md — valid examples

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read `.workspace/product-principles.md`, `.workspace/product-guide.md`, and `.workspace/project.md` (if they exist) | Create or modify files in `.workspace/spec/` |
| Ask the user questions | Generate domains, APIs, workflow, or code |
| Write the three output files above | Modify `.workspace/workflow/` |
| | User journeys or screens in `product-principles.md` |
| | Technical content in `product-guide.md` or `product-principles.md` |
| | Principles or journeys in `project.md` |

## Pre-execution

1. Read existing `.workspace/product-principles.md`, `.workspace/product-guide.md`, and `.workspace/project.md` if present.
2. Read .github/sdd-studio/sdd-idea/STANDARDS.md and .github/sdd-studio/sdd-idea/EXAMPLES.md.
3. If any output file exists, ask: **create from scratch** or **update** (per file or globally, as appropriate).
4. Use the user's message context as the starting point.

## Flow

### Phase 1 — Principles discovery (Product Principles)

Ask in blocks (max 3–5 per turn). Conceptual product questions only:

1. **What the product represents:** what problem space it owns and what it is not
2. **Primary unit:** the central concept everything revolves around (e.g. task, order, patient, document)
3. **Immutable concepts:** names and meanings that must stay stable across versions
4. **Business understanding:** how the product interprets value, customers, and success
5. **Guiding principles:** rules every future feature must respect
6. **Shared mental model:** what every contributor should assume before designing or building

Do not ask about screens, clicks, onboarding steps, APIs, or stack.

Store answers **only** in `.workspace/product-principles.md`. Use clear, durable language. Never put user journeys or technical details here.

### Phase 2 — Product discovery (Product Guide)

Ask in blocks (max 3–5 per turn). Product and user-journey questions only:

1. **Entry point:** how users first encounter the product
2. **Onboarding journey:** ordered experiences from signup to first value
3. **Core loop:** recurring experiences after onboarding
4. **Alternative paths:** different user types, signup methods, roles, or flows
5. **Edge experiences:** errors, empty states, permissions, invitations

Align the journey with **product-principles.md** without duplicating its conceptual content.

Map answers into a **continuous user journey**. Each experience becomes one H2 section in `product-guide.md`.

Store answers **only** in `.workspace/product-guide.md`. Use narrative, professional language. Never put technical details or abstract principles here.

### Phase 3 — Project discovery

Ask in blocks (max 3–5 per turn). Technical and development questions only:

1. **Name and description**
2. **Development model** (default: Specification Driven Development)
3. **Workflow methodology** (e.g. Kanban, Scrum)
4. **Architecture** (e.g. Clean, Hexagonal, monolith, modular)
5. **Modeling** (e.g. DDD, anemic domain)
6. **Code organization** (e.g. feature-first, layer-first)
7. **Language, framework, backend, frontend, database**
8. **AI assistant** and SDD conventions

Store answers **only** in `.workspace/project.md`. Never put product journeys, principles, or user behavior here.

If a business rule is unclear, **ask**; do not infer.

### Phase 4 — Generation

Write files in this order, following .github/sdd-studio/sdd-idea/STANDARDS.md exactly:

1. `.workspace/product-principles.md`
2. `.workspace/product-guide.md`
3. `.workspace/project.md`

### Phase 5 — Validation

Review manually against .github/sdd-studio/sdd-idea/STANDARDS.md:

- [ ] Product Principles starts with the mandatory header blockquote
- [ ] Principles are conceptual only (no screens, journeys, or technical content)
- [ ] Product Guide starts with the mandatory header blockquote
- [ ] Product Guide organized by user journey, not domains or feature lists
- [ ] Each experience follows the narrative structure
- [ ] Alternative paths described where applicable
- [ ] No technical content in `product-principles.md` or `product-guide.md`
- [ ] No product content in `project.md`
- [ ] Only the three output files were modified
- [ ] User confirmed or open items documented

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] Principles, product, and project questions answered
- [ ] .workspace/product-principles.md written
- [ ] .workspace/product-guide.md written
- [ ] .workspace/project.md written
- [ ] No other files modified
```

## Report

1. Product principles summary (primary unit and immutable concepts)
2. User journey summary (ordered experiences)
3. Alternative paths identified
4. Technical stack summary (from project.md)
5. Open items
6. Next step: **sdd-spec**

---
name: sdd-idea
description: Discovers the product through structured questions and writes .workspace/project.md and .workspace/product-guide.md. Use when starting a new SDD project, defining the user journey, or when the user invokes /sdd-idea.
disable-model-invocation: true
tools: ["read", "edit", "search", "execute"]
---


# SDD Idea

Discover the product and define project configuration.

**Output files:**

- `.workspace/product-guide.md` — narrative product guide (user journey, non-technical)
- `.workspace/project.md` — technical and development configuration

Use **sdd-generate** when the project already has application code to analyze. Use **sdd-idea** for greenfield discovery through questions only.

Never generate files under `.workspace/spec/` or `.workspace/workflow/`.

## Required documents

Before writing, read:

- .github/sdd-studio/sdd-idea/STANDARDS.md — structure and rules for both files
- .github/sdd-studio/sdd-idea/EXAMPLES.md — valid examples

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read `.workspace/project.md` and `.workspace/product-guide.md` (if they exist) | Create or modify files in `.workspace/spec/` |
| Ask the user questions | Generate domains, APIs, workflow, or code |
| Write `.workspace/project.md` and `.workspace/product-guide.md` | Modify `.workspace/workflow/` |

## Pre-execution

1. Read existing `.workspace/project.md` and `.workspace/product-guide.md` if present.
2. Read .github/sdd-studio/sdd-idea/STANDARDS.md and .github/sdd-studio/sdd-idea/EXAMPLES.md.
3. If either file exists, ask: **create from scratch** or **update**.
4. Use the user's message context as the starting point.

## Flow

### Phase 1 — Product discovery (Product Guide)

Ask in blocks (max 3–5 per turn). Product and user-journey questions only:

1. **Entry point:** how users first encounter the product
2. **Onboarding journey:** ordered experiences from signup to first value
3. **Core loop:** recurring experiences after onboarding
4. **Alternative paths:** different user types, signup methods, roles, or flows
5. **Edge experiences:** errors, empty states, permissions, invitations

Map answers into a **continuous user journey**. Each experience becomes one H2 section in `product-guide.md`.

Store answers **only** in `.workspace/product-guide.md`. Use narrative, professional language. Never put technical details here.

### Phase 2 — Project discovery

Ask in blocks (max 3–5 per turn). Technical and development questions only:

1. **Name and description**
2. **Development model** (default: Specification Driven Development)
3. **Workflow methodology** (e.g. Kanban, Scrum)
4. **Architecture** (e.g. Clean, Hexagonal, monolith, modular)
5. **Modeling** (e.g. DDD, anemic domain)
6. **Code organization** (e.g. feature-first, layer-first)
7. **Language, framework, backend, frontend, database**
8. **AI assistant** and SDD conventions

Store answers **only** in `.workspace/project.md`. Never put product journeys or user behavior here.

If a business rule is unclear, **ask**; do not infer.

### Phase 3 — Generation

Write both files following .github/sdd-studio/sdd-idea/STANDARDS.md exactly.

### Phase 4 — Validation

Review manually against .github/sdd-studio/sdd-idea/STANDARDS.md:

- [ ] Product Guide starts with the mandatory header blockquote
- [ ] Organized by user journey, not domains or feature lists
- [ ] Each experience follows the narrative structure
- [ ] Alternative paths described where applicable
- [ ] No technical content in `product-guide.md`
- [ ] No product content in `project.md`
- [ ] Only `project.md` and `product-guide.md` were modified
- [ ] User confirmed or open items documented

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] Product and project questions answered
- [ ] .workspace/product-guide.md written
- [ ] .workspace/project.md written
- [ ] No other files modified
```

## Report

1. User journey summary (ordered experiences)
2. Alternative paths identified
3. Technical stack summary (from project.md)
4. Open items
5. Next step: **sdd-spec**

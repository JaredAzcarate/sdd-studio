---
name: sdd-idea
description: Discovers the product idea through structured questions and writes workspace/project.md and workspace/user-manual.md. Use when starting a new SDD project, defining how the product works for users, or when the user invokes /sdd-idea.
disable-model-invocation: true
---

# SDD Idea

Discover the product idea and define project configuration.

**Output files:**

- `workspace/user-manual.md` — user-facing product manual (narrative, non-technical)
- `workspace/project.md` — technical and development configuration

Use **sdd-generate** when the project already has application code to analyze. Use **sdd-idea** for greenfield discovery through questions only.

Never generate files under `workspace/spec/` or `workspace/workflow/`.

## Required documents

Before writing, read:

- [STANDARDS.md](STANDARDS.md) — structure and rules for both files
- [EXAMPLES.md](EXAMPLES.md) — valid examples

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read `workspace/project.md` and `workspace/user-manual.md` (if they exist) | Create or modify files in `workspace/spec/` |
| Ask the user questions | Generate domains, APIs, workflow, or code |
| Write `workspace/project.md` and `workspace/user-manual.md` | Modify `workspace/workflow/` |

## Pre-execution

1. Read existing `workspace/project.md` and `workspace/user-manual.md` if present.
2. Read [STANDARDS.md](STANDARDS.md) and [EXAMPLES.md](EXAMPLES.md).
3. If either file exists, ask: **create from scratch** or **update**.
4. Use the user's message context as the starting point.

## Flow

### Phase 1 — Product discovery (User Manual)

Ask in blocks (max 3–5 per turn). Product and user-facing questions only:

1. **Introduction:** what the product is and why it exists
2. **Problem:** what pain it solves
3. **Who is this product for?:** target users and their goals
4. **Core Concepts:** key ideas a user must understand
5. **Getting Started:** how a new user begins
6. **Features:** what the product lets users do
7. **Typical User Scenarios:** end-to-end stories
8. **FAQ and Glossary** (as needed)

Store answers **only** in `workspace/user-manual.md`. Use simple, narrative language. Never put technical details here.

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

Store answers **only** in `workspace/project.md`. Never put product behavior or user-facing content here.

If a business rule is unclear, **ask**; do not infer.

### Phase 3 — Generation

Write both files following [STANDARDS.md](STANDARDS.md) exactly.

### Phase 4 — Validation

Review manually against [STANDARDS.md](STANDARDS.md):

- [ ] Single H1 per file
- [ ] Required sections present in each file
- [ ] User Manual starts with the mandatory header blockquote
- [ ] No technical content in `user-manual.md`
- [ ] No product content in `project.md`
- [ ] Only `project.md` and `user-manual.md` were modified
- [ ] User confirmed or open items documented

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] Product and project questions answered
- [ ] workspace/user-manual.md written
- [ ] workspace/project.md written
- [ ] No other files modified
```

## Report

1. Core problem and users
2. Key features and scenarios
3. Technical stack summary (from project.md)
4. Open items
5. Next step: **sdd-spec**

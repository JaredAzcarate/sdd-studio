---
name: sdd-idea
description: Discovers the product problem through structured questions and writes workspace/spec/vision.md. Use when starting a new SDD project, defining vision, exploring the problem space, or when the user invokes /sdd-idea.
disable-model-invocation: true
---

# SDD Idea

Discover the problem and define the product vision.

**Single output file:** `workspace/spec/vision.md`

## Required documents

Before writing, read:

- [STANDARDS.md](STANDARDS.md) — structure and rules for `vision.md`
- [EXAMPLES.md](EXAMPLES.md) — valid examples

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read `workspace/spec/vision.md` (if it exists) | Create or modify other files in `workspace/spec/` |
| Ask the user questions | Generate domains, APIs, workflow, or code |
| Write `workspace/spec/vision.md` | Modify `workspace/workflow/` |

## Pre-execution

1. If `workspace/spec/vision.md` exists, read it; otherwise it will be created in this skill.
2. Read [STANDARDS.md](STANDARDS.md) and [EXAMPLES.md](EXAMPLES.md).
3. If `workspace/spec/vision.md` exists, ask: **create from scratch** or **update**.
4. Use the user's message context as the starting point.

## Flow

### Phase 1 — Discovery

Ask in blocks (max 3–5 per turn). Do not proceed without sufficient answers.

1. **Problem:** what it solves, who suffers from it, why now
2. **Users and value:** actors, expected outcome, success metrics
3. **Scope:** in / out, constraints
4. **Context:** stack, architecture, code organization, and modeling (e.g. DDD) — ask the user
5. **Assumptions and risks:** what we assume, what to validate before specifying

If a business rule is unclear, **ask**; do not infer.

### Phase 2 — Generation

Write `workspace/spec/vision.md` following [STANDARDS.md](STANDARDS.md) exactly.

### Phase 3 — Validation

Review manually against [STANDARDS.md](STANDARDS.md):

- [ ] Single H1
- [ ] Required H2 sections present
- [ ] Only `vision.md` was modified
- [ ] User confirmed or open items documented

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] Problem, objectives, scope, and context documented
- [ ] Only workspace/spec/vision.md modified
```

## Report

1. Core problem
2. Key users
3. In/out scope
4. Open items
5. Next step: **sdd-spec**

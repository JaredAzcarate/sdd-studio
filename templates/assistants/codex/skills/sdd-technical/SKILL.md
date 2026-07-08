---
name: sdd-technical
description: Analyzes the Engineering Brief under .workspace/brief/technical/ and generates engineering-stack.md with a coherent, justified technology stack. Acts as Software Architect. Use when the engineering brief is complete and technologies must be recommended, or when the user invokes /sdd-technical. Never modifies engineering input files or writes .workspace/spec/.
disable-model-invocation: true
---

# SDD Technical

Analyze the Engineering Brief and recommend a coherent technology stack.

**Output scope:** `.workspace/brief/technical/engineering-stack.md` only.

Does **not** generate specification, modify engineering decisions, or change input brief files.

## Required documents

Before recommending, read:

- [STANDARDS.md](STANDARDS.md) — analysis rules and output structure
- [EXAMPLES.md](EXAMPLES.md) — reference stack output

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read `.workspace/brief/technical/engineering-*.md` | Modify `engineering-principles.md`, `engineering-decisions.md`, `engineering-conventions.md`, or `engineering-modeling.md` |
| Generate or update `engineering-stack.md` | Create or modify `.workspace/spec/` or `.workspace/workflow/` |
| Ask the user to resolve contradictions | Use hardcoded technology mappings |
| Explain reasoning for every recommendation | Recommend technologies because they are popular |

## Pre-execution

1. Read `.workspace/brief/technical/engineering-principles.md`.
2. Read `.workspace/brief/technical/engineering-decisions.md`.
3. Read `.workspace/brief/technical/engineering-conventions.md`.
4. Read `.workspace/brief/technical/engineering-modeling.md` (if present).
5. Read [STANDARDS.md](STANDARDS.md) and [EXAMPLES.md](EXAMPLES.md).
6. Do not ask the user to repeat information already present in the Engineering Brief.

## Flow

### Phase 1 — Engineering analysis (read-only)

From the Engineering Brief, determine:

- What kind of system is being built
- Architectural priorities and scalability requirements
- Product constraints and long-term evolution
- Team conventions and domain complexity

Think about architecture first. Do not think about technologies first.

### Phase 2 — Architectural review

Detect:

- Contradictory principles
- Conflicting decisions
- Architectural inconsistencies
- Missing critical information
- Unrealistic combinations

If inconsistencies exist: **stop**, explain the issues, and ask the user to resolve them. Do **not** generate a partial stack.

### Phase 3 — Stack recommendation

For every layer (see [STANDARDS.md](STANDARDS.md)):

1. Understand the architectural requirement
2. Infer the technical capabilities required
3. Evaluate possible technologies
4. Select the most coherent solution for the whole stack
5. Explain why it was selected
6. When appropriate, explain why common alternatives were not selected

Every recommendation must be traceable to one or more Engineering Principles or Engineering Decisions.

### Phase 4 — Generate output

Create or update `.workspace/brief/technical/engineering-stack.md` per [STANDARDS.md](STANDARDS.md) and [EXAMPLES.md](EXAMPLES.md).

Conclude with an **Architecture Summary** describing how the technologies work together as one ecosystem.

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] All engineering input files read (not modified)
- [ ] Contradictions checked — stopped if found
- [ ] engineering-stack.md generated with justified recommendations
- [ ] Architecture Summary explains ecosystem coherence
```

## Report

1. Whether `engineering-stack.md` was created or updated
2. Key architectural themes that drove the stack
3. Any sections omitted because the brief does not require them
4. Contradictions found (if stopped)
5. Next step: **sdd-spec** or **sdd-review** as appropriate

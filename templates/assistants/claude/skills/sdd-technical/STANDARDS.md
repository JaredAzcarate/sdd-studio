# STANDARDS — sdd-technical

Mandatory rules for analyzing the Engineering Brief and generating `engineering-stack.md`.

## Principle

Act as an experienced Software Architect. Reason from engineering principles. Optimize the architecture as a whole — never individual technologies in isolation.

**sdd-technical reads the Engineering Brief and writes only `engineering-stack.md`.** Never create or modify `.workspace/spec/` or `.workspace/workflow/`.

## Input (read-only)

Read all of the following from `.workspace/brief/technical/`:

| File | Purpose |
| ---- | ------- |
| `engineering-principles.md` | Technology-agnostic principles that guide what the system should become |
| `engineering-decisions.md` | Architectural decisions already made |
| `engineering-conventions.md` | Development conventions and team practices |
| `engineering-modeling.md` | Modeling approach and domain structure (if present) |

These documents are the single source of truth. Do not ask the user to repeat information already present.

## Output (write-only)

Generate **only**:

```text
.workspace/brief/technical/engineering-stack.md
```

Never modify:

- `engineering-principles.md`
- `engineering-decisions.md`
- `engineering-conventions.md`
- `engineering-modeling.md`

## Recommendation philosophy

Do **not** use hardcoded technology mappings.

Do **not** assume technologies (React, Next.js, PostgreSQL, Prisma, etc.) unless they naturally emerge from the Engineering Brief.

Do **not** recommend technologies because they are popular.

Instead:

1. Analyze the Engineering Brief
2. Infer the capabilities required by the project
3. Evaluate possible technologies
4. Recommend technologies that best satisfy the project's needs
5. Justify every recommendation

The stack must feel like one coherent engineering ecosystem.

## Pre-generation review

Before generating the stack, detect:

- Contradictory principles
- Conflicting decisions
- Architectural inconsistencies
- Missing critical information
- Unrealistic combinations

If inconsistencies exist: **stop**, explain the issues, and ask the user to resolve them. Do **not** generate a partial stack.

## Selection criteria

Prioritize technologies that provide:

- Long-term maintainability
- Mature ecosystems and active communities
- Excellent documentation and stability
- Scalability and strong developer experience
- Compatibility with the rest of the stack

Avoid obsolete, deprecated, or poorly maintained technologies unless there is a strong architectural reason. Popularity alone is never a valid reason.

## Document structure

`engineering-stack.md` must follow this structure. Omit sections that do not apply to the project; do not invent requirements.

```markdown
# Engineering Stack

## Overview

Briefly describe the proposed stack and explain why it fits the project.

---

## Frontend

Recommended technology.

Reasoning.

---

## Backend

...

(continue for each applicable section below)

---

## Architecture Summary

Narrative explanation of how the selected technologies work together.
Explain how the stack satisfies the Engineering Principles and Engineering Decisions.
Do not simply list technologies.
```

### Stack sections

Include each section that applies to the project. Every section must contain a **recommended technology** and **reasoning** separated by `---`:

| Section | When to include |
| ------- | --------------- |
| Frontend | Client UI is in scope |
| Backend | Server-side logic is in scope |
| API | External or internal API surface is in scope |
| Database | Persistent storage is in scope |
| ORM / Data Layer | Data access abstraction is needed |
| Authentication | User identity is in scope |
| Authorization | Access control is in scope |
| File Storage | File or object storage is in scope |
| Realtime | Live updates or streaming is in scope |
| State Management | Client state complexity warrants it |
| Forms | Form-heavy UI is in scope |
| Validation | Input validation strategy is needed |
| Tables | Data tables or grids are in scope |
| UI Components | Component library choice is relevant |
| Accessibility | A11y tooling or patterns are relevant |
| Styling | CSS or styling approach is in scope |
| Icons | Icon system is in scope |
| Animations | Motion or animation library is relevant |
| AI | AI/ML capabilities are in scope |
| Testing | Test stack is in scope |
| Monitoring | Observability is in scope |
| Analytics | Product analytics is in scope |
| Deployment | Hosting or CI/CD is in scope |
| Package Manager | Relevant for the chosen ecosystem |
| Monorepo | Multi-package repository is in scope |

## Format

1. One H1 (`# Engineering Stack`)
2. H2 for each section
3. Do not skip heading levels
4. Separate sections with `---`
5. Every recommendation must reference at least one Engineering Principle or Engineering Decision

## Quality standards

The generated stack must be:

- Architecturally coherent and internally consistent
- Scalable and maintainable
- Modern and well justified
- Traceable to the Engineering Brief

The final document should read like the work of an experienced Software Architect designing the foundation of a long-term software product.

## Prohibitions

- Do not modify engineering input files
- Do not generate `.workspace/spec/` or `.workspace/workflow/`
- Do not use hardcoded technology mappings
- Do not generate a partial stack when contradictions exist
- Do not recommend without explaining the reasoning

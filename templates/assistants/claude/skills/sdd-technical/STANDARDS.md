# STANDARDS — sdd-technical

Mandatory rules for interactive stack selection and generating `engineering-stack.md`.

## Principle

Act as an experienced Software Architect. Reason from engineering principles. Optimize the architecture as a whole — never individual technologies in isolation.

**Chat** = recommendations, alternatives, trade-offs, user choices.

**`engineering-stack.md`** = **confirmed selections only** — the defined stack, not a recommendation report.

**sdd-technical reads the Engineering Brief and writes only `engineering-stack.md`.** Never create or modify `.workspace/spec/` or `.workspace/workflow/`.

## Input (read-only) — mandatory before suggestions

**The agent must read the Engineering Brief before recommending or listing any technology option.** No suggestions without context.

Read all of the following from `.workspace/brief/technical/` using the Read tool:

| File | Purpose | If missing |
| ---- | ------- | ---------- |
| `engineering-principles.md` | Technology-agnostic principles | **Stop** — user must run `sdd-studio configure` |
| `engineering-decisions.md` | Architectural decisions already made | **Stop** |
| `engineering-conventions.md` | Development conventions and team practices | **Stop** |
| `engineering-modeling.md` | Modeling approach and domain structure | Optional; read if present |

These documents are the **only** source for:

- Which stack sections apply
- What to recommend
- Which alternatives are viable
- What to reject

Do not ask the user to repeat information already present. Do not fill gaps with assumed technologies.

After reading, summarize constraints in a **Brief digest** (chat) before interactive selection.

## Brief-grounded suggestions

Every recommendation and every multiple-choice option must:

1. Be **compatible** with `engineering-principles.md`, `engineering-decisions.md`, and `engineering-conventions.md`
2. Cite at least one **specific** Principle or Decision (section name or § reference)
3. **Not** contradict a locked decision (e.g. if Decision says App Router, do not offer SPA-only stacks as equal options without noting the conflict)
4. **Not** be chosen because it is popular, trendy, or your default stack

If the Brief does not constrain a layer enough to narrow options, say so explicitly and ask **one** targeted question — still do not invent a full stack from defaults.

## Anti-inference (structural patterns)

Do **not** infer structural or organizational patterns from broad Engineering Principles alone.

Examples of **structural** decisions (require Brief explicit statement OR Phase 1b user confirmation):

- Single repository vs multiple repositories vs orchestrator + independent repositories
- Multi-package layout vs single-package layout
- Which platforms get dedicated artifacts vs shared UI shells
- Deployment topology (single unit vs multiple deployables)

Broad principles such as multi-platform, maximum code sharing, integrated backend, or clean architecture describe **constraints**, not **repository layout**. They narrow options; they do not select a default.

If the Brief does not define a structural dimension, **ask in Phase 1b** — do not auto-include a stack section for it in Phase 1.

## Output (write-only)

Generate **only** after the user confirms every applicable section:

```text
.workspace/brief/technical/engineering-stack.md
```

Never modify:

- `engineering-principles.md`
- `engineering-decisions.md`
- `engineering-conventions.md`
- `engineering-modeling.md`

## Interactive selection (chat only)

For each applicable stack section:

1. Re-read the relevant Brief constraints for that layer (from your digest).
2. Explain the requirement from the Brief.
3. State your recommendation and why — **with Brief citation**.
4. Present multiple choice: **recommended option + 2–3 Brief-compatible alternatives + Other**.
5. Wait for the user's selection before continuing.
6. Record the user's choice internally; do not write the file yet.

**Other:** always available. Accept custom technology names; ask one clarifying question if needed.

**Do not** write `engineering-stack.md` until all sections are confirmed and the user approves the final summary.

## Recommendation philosophy

Do **not** use hardcoded technology mappings.

Do **not** assume technologies unless they naturally emerge from the Engineering Brief.

Do **not** recommend technologies because they are popular.

Recommendations live **in chat**. The file records **user choices** (which may match or differ from your recommendation).

## Pre-generation review

Before starting section selection, detect:

- Contradictory principles
- Conflicting decisions
- Architectural inconsistencies
- Missing critical information
- Unrealistic combinations

If inconsistencies exist: **stop**, explain the issues, and ask the user to resolve them.

## Document structure

`engineering-stack.md` must follow this structure. Omit sections that do not apply; do not invent requirements.

```markdown
# Engineering Stack

## Overview

Brief description of the **selected** stack and how it fits the project.

Traceability: …

---

## Frontend

**Selected:** <user-confirmed technology>

<Short rationale — why this choice fits the Brief; 2–4 sentences max.>

Traceability: Engineering Principles §…, Engineering Decisions §…

---

## Backend

**Selected:** …

…

---

## Architecture Summary

Narrative of how the **selected** technologies work together as one ecosystem.
Reference Engineering Principles and Decisions. Do not list rejected alternatives.
```

### Stack section types

Every section must be classified before inclusion in the Phase 1 list:

| Type | Label | When to include |
| ---- | ----- | --------------- |
| **A — Brief-locked** | `[Brief-locked]` | Engineering Principles or Decisions explicitly require this capability (e.g. relational DB, social auth, schema validation, realtime) |
| **B — User-elicited** | `[User-elicited]` | Brief does not define; MUST be resolved in Phase 1b before Phase 3 (e.g. target platforms, repository organization) |
| **C — Dependent** | `[Dependent on: X]` | Only after section X is confirmed (e.g. native shell layer depends on client platform choice; package manager depends on ecosystem) |
| **D — Optional** | `[Optional]` | Not required by Brief; include only if user agrees or a prior choice clearly implies it |

**Rules:**

- Type **B** sections MUST NOT appear as the first Phase 3 prompt.
- Type **B** sections MUST NOT be included based on agent inference alone.
- Omit any row below that does not apply; do not invent requirements.

### Stack sections reference

| Section | Default type | When to include |
| ------- | ------------ | --------------- |
| Repository Organization | **B — User-elicited** | Always ask in Phase 1b unless Brief defines it. Records single repo, polyrepo, orchestrator + independent repos, etc. — NOT a specific tool. |
| Target Platforms | **B — User-elicited** | Always ask in Phase 1b unless Brief defines platforms explicitly. |
| Frontend | A or C | Client UI in scope; type C if dependent on platform strategy |
| Backend | A | Server-side logic in scope (Brief: integrated backend) |
| API | A or C | Communication surface in scope |
| Database | A | Persistent storage in scope (Brief: relational) |
| ORM / Data Layer | A or C | Data access abstraction needed |
| Authentication | A | User identity in scope (Brief: social) |
| Authorization | A | Access control in scope (Brief: role based) |
| File Storage | A | Files/media in scope |
| Realtime | A | Live updates in scope |
| State Management | A | Cached server state (Brief decision) |
| Forms | A | Advanced forms (Brief decision) |
| Validation | A | Schema based (Brief decision) |
| Tables | A | Advanced tables (Brief decision) |
| UI Components | C or D | Relevant after client/platform confirmed |
| Styling | C or D | Relevant after client confirmed |
| Native Shell (Mobile) | C | Only if Phase 1b includes native mobile targets |
| Native Shell (Desktop) | C | Only if Phase 1b includes desktop targets |
| AI | A | AI as feature (Brief principle) |
| Testing | A | Basic testing (Brief decision) |
| Monitoring | A | Basic monitoring (Brief decision) |
| Deployment | A or C | Professional deployment (Brief decision) |
| Package Manager | C | After ecosystem/client choices |
| Analytics | D | Only if user or Brief requires |
| Accessibility | D | Only if user or Brief requires |
| Icons | D | Fold into UI unless user requests separate section |
| Animations | D | Only if user or Brief requires |

**Remove** the standalone "Monorepo" row. Repository layout is captured under **Repository Organization** (type B, technology-agnostic). If the user's organization choice later implies a specific multi-package tool, that becomes a **Dependent** section only after Repository Organization is confirmed — never assume it upfront.

## Format

1. One H1 (`# Engineering Stack`)
2. H2 for each section
3. Do not skip heading levels
4. Separate sections with `---`
5. Each section: **Selected:** + short rationale + Traceability line
6. Every selection must reference at least one Engineering Principle or Decision

## What must NOT appear in the file

- `**Recommended:**` (use **Selected:**)
- `**Not selected:**` or rejected-alternative essays
- Option lists or multiple-choice tables
- Text like "Industry standard choice" without Brief traceability

Those belong in the **chat** during Phase 3 only.

## Quality standards

The defined stack must be:

- Architecturally coherent and internally consistent
- Explicitly chosen by the user (or confirmed via **Other**)
- Traceable to the Engineering Brief
- Readable as a **decision record**, not a proposal

## Prohibitions

- Do not suggest technologies before reading `brief/technical/`
- Do not modify engineering input files
- Do not generate `.workspace/spec/` or `.workspace/workflow/`
- Do not write the file before interactive selection completes
- Do not skip user confirmation per section
- Do not use hardcoded technology mappings or generic "popular" stacks
- Do not store recommendation debates in `engineering-stack.md`
- Do not offer options that violate locked Engineering Decisions without flagging the conflict
- Do not map "multi-platform" + "maximum code sharing" (or similar pairs) to a default repository or package structure
- Do not include Monorepo/multi-package tool sections without confirmed Repository Organization and user need
- Do not treat STANDARDS table rows as an automatic checklist — each row requires type classification and justification

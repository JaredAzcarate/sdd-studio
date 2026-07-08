---
description: Guides interactive, section-by-section technology selection from the Engineering Brief and writes engineering-stack.md with user-confirmed choices only. Acts as Software Architect. Use when the engineering brief is complete and the stack must be defined, or when the user invokes /sdd-technical. Never modifies engineering input files or writes .workspace/spec/.
---


# SDD Technical

Guide the user through defining a coherent technology stack **one section at a time**.

**Chat:** recommendations, alternatives, trade-offs, and user choices.

**File:** `.workspace/brief/technical/engineering-stack.md` — **selected technologies only**, written after all sections are confirmed.

Does **not** generate specification, modify engineering decisions, or change input brief files.

## Brief gate (mandatory — before any suggestion)

**Do not suggest technologies, present options, or start Phase 3 until the Engineering Brief is read and understood.**

Required files under `.workspace/brief/technical/`:

| File | Required |
| ---- | -------- |
| `engineering-principles.md` | **Yes** — stop if missing or empty |
| `engineering-decisions.md` | **Yes** — stop if missing or empty |
| `engineering-conventions.md` | **Yes** — stop if missing or empty |
| `engineering-modeling.md` | Read if present |

If any required file is missing or still default stubs, **stop** and tell the user to run `sdd-studio configure` (or complete the Engineering Brief in the TUI). Do **not** invent stack options from assumptions.

After reading, produce a **Brief digest** in chat (5–10 bullets): system type, key principles, locked decisions, conventions, and modeling notes. Every later recommendation must trace back to this digest.

## Required documents

Before starting, read:

- All files in **Brief gate** above (use the Read tool — do not rely on memory or defaults)
- @.opencode/sdd-studio/sdd-technical/STANDARDS.md — selection rules and output structure
- @.opencode/sdd-studio/sdd-technical/EXAMPLES.md — reference stack output

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read `.workspace/brief/technical/engineering-*.md` | Modify `engineering-principles.md`, `engineering-decisions.md`, `engineering-conventions.md`, or `engineering-modeling.md` |
| Recommend technologies in chat | Write `engineering-stack.md` before the user confirms every section |
| Ask the user to choose per section | Dump the full stack into the file without interactive selection |
| Write `engineering-stack.md` after all selections | Put recommendations or rejected alternatives in `engineering-stack.md` |
| Publish Brief digest from read files | Suggest technologies before reading `brief/technical/` |
| Ask the user to resolve contradictions | Use hardcoded mappings or "popular stack" defaults |
| Ground every option in the Brief | Offer options that contradict Engineering Decisions |

## Pre-execution

1. **Read** (do not skip) `.workspace/brief/technical/engineering-principles.md`.
2. **Read** `.workspace/brief/technical/engineering-decisions.md`.
3. **Read** `.workspace/brief/technical/engineering-conventions.md`.
4. **Read** `.workspace/brief/technical/engineering-modeling.md` if the file exists.
5. Read @.opencode/sdd-studio/sdd-technical/STANDARDS.md and @.opencode/sdd-studio/sdd-technical/EXAMPLES.md.
6. If steps 1–3 fail (file missing or not configured), **stop** — do not proceed.
7. Publish the **Brief digest** (see Brief gate) before Phase 2.
8. Do not ask the user to repeat information already present in the Engineering Brief.

## Flow

### Phase 1 — Engineering analysis (read-only)

From the Engineering Brief, determine:

- What kind of system is being built
- Architectural priorities and scalability requirements
- Product constraints and long-term evolution
- Team conventions and domain complexity
- Which stack sections apply (see @.opencode/sdd-studio/sdd-technical/STANDARDS.md)

Think about architecture first. Do not think about technologies first.

Present a short summary and the **ordered list of sections** you will walk through. Ask the user to confirm or adjust before Phase 3.

### Phase 2 — Architectural review

Detect:

- Contradictory principles
- Conflicting decisions
- Architectural inconsistencies
- Missing critical information
- Unrealistic combinations

If inconsistencies exist: **stop**, explain the issues, and ask the user to resolve them. Do **not** start section selection or write the file.

### Phase 3 — Interactive selection (one section per turn)

**Every section must be grounded in the Engineering Brief.** Before presenting options, cite which Principle(s) or Decision(s) drive this layer.

For **each applicable section**, in order:

1. State the architectural requirement for that layer — **quote or paraphrase the Brief** (e.g. "Engineering Decision §4: App Router").
2. Give your **recommendation** with reasoning **derived only from the Brief**, not from generic best practices alone.
3. Briefly note trade-offs of 1–2 rejected alternatives **in chat only** (optional, keep short).
4. Present a **multiple-choice** prompt:

```markdown
## <Section name> — choose one

**Requirement:** …

**Recommendation:** <technology> — …

| Option | Technology |
| ------ | ---------- |
| 1 | <recommended> *(recommended)* |
| 2 | <real alternative> |
| 3 | <real alternative> |
| 4 | **Other** — specify your choice |

Reply with the option number, technology name, or custom text for **Other**.
```

Rules:

- **Derive every option from the Brief** — each choice must be compatible with principles, decisions, and conventions already read.
- Offer **3–4 concrete options** plus **Other** on every section.
- Option 1 is always your recommendation (mark it *(recommended)*).
- Options 2–3 must be **real, viable** alternatives **for this project** per the Brief — not generic popular tools.
- **Other** always allows free text; ask for clarification if vague or if it conflicts with the Brief.
- **Wait for the user's answer** before the next section.
- Do **not** write or update `engineering-stack.md` during this phase.
- Keep a running summary in chat of confirmed selections.
- If the user changes a prior section, revisit dependent sections before writing the file.

### Phase 4 — Write the stack document

Only after **every applicable section** has a confirmed user choice:

1. Show a **final summary table** of all selections and ask for explicit approval (`yes` / edits).
2. Create or update `.workspace/brief/technical/engineering-stack.md` per @.opencode/sdd-studio/sdd-technical/STANDARDS.md and @.opencode/sdd-studio/sdd-technical/EXAMPLES.md.
3. The file must record **what was selected**, not the recommendation debate.

Conclude with an **Architecture Summary** in the file describing how the **selected** technologies work together.

## Checklist

```
- [ ] engineering-principles.md, engineering-decisions.md, engineering-conventions.md read (mandatory)
- [ ] engineering-modeling.md read if present
- [ ] Brief digest published in chat before suggestions
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] All suggestions trace to Engineering Brief (no generic defaults)
- [ ] Contradictions checked — stopped if found
- [ ] Section list agreed with the user
- [ ] Each section: recommendation + multiple choice + user confirmation
- [ ] Final summary approved before writing the file
- [ ] engineering-stack.md contains selected technologies only (no "Recommended" / "Not selected")
- [ ] Architecture Summary reflects confirmed choices
```

## Report

1. Whether `engineering-stack.md` was created or updated
2. Table of sections and **user-selected** technologies
3. Any sections skipped because the brief does not require them
4. Contradictions found (if stopped)
5. Next step: **sdd-spec** or **sdd-review** as appropriate

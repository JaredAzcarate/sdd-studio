# STANDARDS — sdd-technical

Mandatory rules for conversational stack selection and generating `engineering-stack.md`.

## Principle

Act as a **senior fullstack developer** and **technical auditor** in a team discussion. Read the Engineering Brief first. Propose technologies the team can actually ship with — options must fit the whole architecture, not isolated layers.

**Chat (default)** = short intro per turn; **stack choices via `AskQuestion`** (clickable UI, one question per tool call).

**Never** list stack options in markdown tables when `AskQuestion` is available.

**Chat (`modo verbose`)** = full digest, trade-offs, tensions — only when requested.

**`engineering-stack.md`** = **confirmed selections only** — the defined stack, not a recommendation report.

**sdd-technical reads the Engineering Brief and writes only `engineering-stack.md`.** Never create or modify `.workspace/spec/` or `.workspace/workflow/`.

## Input (read-only) — mandatory before suggestions

**The agent must read the Engineering Brief before recommending or listing any technology option.**

Read all of the following from `.workspace/brief/technical/` using the Read tool:

| File | Purpose | If missing |
| ---- | ------- | ---------- |
| `engineering-principles.md` | Technology-agnostic principles | **Stop** — user must run `sdd-studio configure` |
| `engineering-decisions.md` | Architectural decisions already made | **Stop** |
| `engineering-conventions.md` | Development conventions and team practices | **Stop** |
| `engineering-frontend-patterns.md` | Frontend implementation patterns | **Stop** |
| `engineering-backend-patterns.md` | Backend response and error patterns | **Stop** |
| `engineering-modeling.md` | Modeling approach and domain structure | Optional; read if present |

These documents are the **only** source for:

- Which areas to ask about
- What to recommend
- Which alternatives are viable
- What to reject

Do not ask the user to repeat information already in the Brief. Do not fill gaps with assumed technologies.

### Internal audit (not shown in default mode)

After reading, internally note:

- **Locked by Brief** — platforms, backend strategy, auth type, DB type, etc.
- **Open for selection** — concrete libraries/frameworks/tools
- **Blockers** — contradictions that must be resolved before questions

In default mode, surface at most **2 sentences** of Brief context in the opening message. Full digest only in `modo verbose`.

## Brief-grounded suggestions

Every recommendation and every multiple-choice option must:

1. Be **compatible** with `engineering-principles.md`, `engineering-decisions.md`, `engineering-conventions.md`, `engineering-frontend-patterns.md`, and `engineering-backend-patterns.md`
2. Trace to at least one **specific** Principle or Decision when explaining *(recomendada)*
3. **Not** contradict a locked decision without flagging the conflict
4. **Not** be chosen because it is popular, trendy, or your default stack

If the Brief does not constrain an area enough, say so in one line and still offer 3–4 viable options — do not invent a full stack silently.

## Chat output format (default)

### Turn 1 — intro + first `AskQuestion`

**Chat message:**

```text
Basado en `.workspace/brief/technical`, voy a proponerte tecnologías,
librerías e integraciones para definir el stack del proyecto.

<at most 2 sentences from Brief context>
```

**Then call `AskQuestion`** (same turn) with the first area question and 3–4 Brief-derived options.

### Turn 2+ — one `AskQuestion` per turn

**Chat:** optional one-line progress + at most 2 sentences of context.

**`AskQuestion`:** one question, 3–4 options; recommendation first with `(Recommended)` in label.

### `AskQuestion` shape (reference)

```json
{
  "title": "Stack — Web",
  "questions": [{
    "id": "web-framework",
    "prompt": "¿Qué te gustaría usar para desarrollo web?",
    "options": [
      { "id": "nextjs", "label": "Next.js (Recommended) — App Router, SSR, React" },
      { "id": "remix", "label": "Remix — file routing, React" },
      { "id": "nuxt", "label": "Nuxt — Vue, menos alineado con Expo" }
    ]
  }]
}
```

Cursor adds **Other** automatically. If the user picks Other, ask one follow-up for the custom name.

### Prohibited in default mode

- Markdown tables listing stack options (`| Opción | Tecnología |`)
- `Responde con 1, 2, 3, 4 u Other` when `AskQuestion` is available
- `Fase X/Y — …` headers
- `[Brief-locked]`, `[User-elicited]`, `[Dependent on: X]` labels
- Section list tables requiring user confirmation before questions
- Digest blocks (Del Brief / Inferido / Confirmado)
- Multiple `AskQuestion` calls or technology questions in one turn
- Hardcoded option menus unrelated to the current Brief

### Running summary

Maximum **one line** between questions:

```text
Confirmado hasta ahora: Web=Next.js, Mobile=Expo
```

### Trade-offs

Only when user says `alternativas` or `modo verbose`.

## Question areas

Map chat questions to `engineering-stack.md` sections. **Omit** areas the Brief does not require.

| Chat question (plain language) | Stack section | When to ask |
| ------------------------------ | ------------- | ----------- |
| ¿Qué usamos para **desarrollo web**? | Frontend (Web) | Web in Brief platforms |
| ¿Cómo abordamos **mobile nativo**? (nativo, Expo, adaptadores…) | Native Shell (Mobile) | Mobile native in Brief |
| ¿Cómo abordamos **desktop**? (Tauri, Electron, adaptador web…) | Native Shell (Desktop) | Desktop in Brief |
| ¿Qué usamos para **backend**? | Backend | Integrated/separate backend in scope |
| ¿Qué **base de datos** relacional? | Database | Relational DB in Brief |
| ¿Qué **ORM / capa de datos**? | ORM / Data Layer | After DB or backend chosen |
| ¿Cómo exponemos la **API**? | API | If not fully implied by backend/framework |
| ¿Qué usamos para **autenticación social**? | Authentication | Social auth in Brief |
| ¿Cómo gestionamos **roles y permisos**? | Authorization | Role-based in Brief |
| ¿Qué usamos para **tiempo real**? | Realtime | Realtime in Brief |
| ¿Qué usamos para **estado de servidor / caché**? | State Management | Cached server state in Brief |
| ¿Qué usamos para **formularios avanzados**? | Forms | Advanced forms in Brief |
| ¿Qué usamos para **validación por esquema**? | Validation | Schema-based in Brief |
| ¿Qué usamos para **tablas avanzadas**? | Tables | Advanced tables in Brief |
| ¿Dónde guardamos **archivos y media**? | File Storage | Media storage in Brief |
| ¿Qué usamos para **AI como feature**? | AI | AI as feature in Brief |
| ¿Qué **librería de componentes UI**? | UI Components | After client stack known |
| ¿Qué usamos para **estilos**? | Styling | After client stack known |
| ¿Qué usamos para **testing**? | Testing | Testing in Brief |
| ¿Qué usamos para **monitoring**? | Monitoring | Monitoring in Brief |
| ¿Cómo hacemos **deployment**? | Deployment | Professional deployment in Brief |
| ¿Qué **package manager**? | Package Manager | After ecosystem known |
| ¿Cómo organizamos **repos** a nivel herramienta? | Repository Organization | Only if Brief pattern is set but tool is not |

**Skip** platform and repo **pattern** questions when already locked in the Brief — use that knowledge to filter options only.

## Question order

1. **Surfaces** — web → mobile → desktop (skip absent platforms)
2. **Core server** — backend → database → ORM → API (merge/skip when prior answer covers it)
3. **Cross-cutting product** — auth → authorization → realtime → state → forms → validation → tables → files
4. **AI** — if Brief requires
5. **Dependent UI** — components → styling
6. **Ops** — testing → monitoring → deployment → package manager

Re-order when dependencies demand it (e.g. ask ORM after database; ask UI library after web framework).

## Anti-inference

Do **not** infer repository layout or deployment topology from broad principles alone.

If the Brief says "maximum code sharing" + multi-platform, **narrow options** in web/mobile/desktop questions — do not silently assume monorepo tool or a specific cross-platform framework without asking.

## Pre-selection review

Before the first question, check for:

- Contradictory principles or decisions
- Unrealistic combinations (e.g. three unrelated native stacks with "maximum code sharing" and no bridge strategy)

If blockers exist: explain in plain language, ask the team to resolve, **do not** continue with stack questions.

## Interactive selection (chat only)

For each area:

1. Re-read relevant Brief constraints for that layer.
2. Short context in chat (optional).
3. Call **`AskQuestion`** with one question and 3–4 Brief-derived options.
4. Wait for selection before the next area.
5. Record choice internally.

**Other:** provided by Cursor's Ask UI; follow up if custom text is needed.

**Do not** write `engineering-stack.md` until all areas are covered and the summary is approved.

## Recommendation philosophy

- Do **not** use hardcoded technology mappings.
- Do **not** assume technologies unless they emerge from the Brief.
- Do **not** recommend because something is popular.
- Recommendations live **in chat** only; the file records **user choices**.

## Output (write-only)

Generate **only** after summary approval:

```text
.workspace/brief/technical/engineering-stack.md
```

Never modify:

- `engineering-principles.md`
- `engineering-decisions.md`
- `engineering-conventions.md`
- `engineering-frontend-patterns.md`
- `engineering-backend-patterns.md`
- `engineering-modeling.md`

## Document structure

`engineering-stack.md` must follow this structure. Omit sections that do not apply.

```markdown
# Engineering Stack

## Overview

Brief description of the **selected** stack and how it fits the project.

Traceability: …

---

## Frontend

**Selected:** <user-confirmed technology>

<Short rationale — 2–4 sentences max.>

Traceability: Engineering Principles §…, Engineering Decisions §…

---

## Backend

**Selected:** …

…

---

## Architecture Summary

Narrative of how the **selected** technologies work together.
Reference Engineering Principles and Decisions. Do not list rejected alternatives.
```

Add H2 sections for each confirmed area (Database, Authentication, Native Shell (Mobile), etc.).

## Format rules

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
- "Industry standard" without Brief traceability

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
- Do not skip user confirmation per area
- Do not use hardcoded option lists independent of the Brief
- Do not store recommendation debates in `engineering-stack.md`
- Do not use architect-style phase labels or section taxonomy in default chat
- Do not require section-list confirmation before the first technology question
- Do not use markdown tables for stack options when `AskQuestion` is available

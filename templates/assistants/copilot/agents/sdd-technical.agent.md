---
name: sdd-technical
description: Guides interactive, section-by-section technology selection from the Engineering Brief and writes engineering-stack.md with user-confirmed choices only. Acts as Software Architect. Use when the engineering brief is complete and the stack must be defined, or when the user invokes /sdd-technical. Never modifies engineering input files or writes .workspace/spec/.
disable-model-invocation: true
tools: ["read", "edit", "search", "execute"]
---

# SDD Technical

Guide the user through defining a coherent technology stack **one section at a time**.

**Chat:** multiple-choice per phase; recommendations only inside each section block.

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

After reading, produce a **Brief digest** in chat using this mandatory structure:

### Del Brief (explícito)
Facts stated directly in engineering-principles, engineering-decisions, or engineering-conventions. Cite § references.

### Inferido por el agente (requiere confirmación del usuario)
Interpretations NOT explicitly stated in the Brief. Mark each as inference. Do NOT treat as locked decisions. Do NOT use as basis for Phase 3 until the user confirms or rejects.

### Confirmado por el usuario
Dimensions and preferences the user stated in this session (platforms, repository organization, existing stack choices, team constraints).

Every later recommendation must trace back to **Del Brief** or **Confirmado por el usuario** — never to unconfirmed inferences.

## Required documents

Before starting, read:

- All files in **Brief gate** above (use the Read tool — do not rely on memory or defaults)
- .github/sdd-studio/sdd-technical/STANDARDS.md — selection rules and output structure
- .github/sdd-studio/sdd-technical/EXAMPLES.md — reference stack output

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read `.workspace/brief/technical/engineering-*.md` | Modify `engineering-principles.md`, `engineering-decisions.md`, `engineering-conventions.md`, or `engineering-modeling.md` |
| Recommend technologies in chat (Phase 3 blocks only) | Write `engineering-stack.md` before the user confirms every section |
| Ask the user to choose per section | Dump the full stack into the file without interactive selection |
| Write `engineering-stack.md` after all selections | Put recommendations or rejected alternatives in `engineering-stack.md` |
| Publish Brief digest from read files | Suggest technologies before reading `brief/technical/` |
| Ask the user to resolve contradictions | Use hardcoded mappings or "popular stack" defaults |
| Ground every option in the Brief | Offer options that contradict Engineering Decisions |
| Elicit architectural dimensions in Phase 1b | Infer structural patterns from broad principles without user confirmation |
| One phase per message (modo conciso) | Mix Phase 1, 1b, 2, and 3 in a single turn |
| | Include User-elicited sections in Phase 3 before Phase 1b completes |
| | Present agent inferences as if they were Brief decisions |
| | Re-recommend dominant alternatives when the user already stated a preference |
| | Volcar digest + análisis + lista + preguntas de stack en un solo mensaje |

## Modo de interacción (default: conciso)

**Modo conciso (default)** — aplicar siempre salvo que el usuario diga `modo verbose` o `análisis completo`:

- **Una fase por mensaje.** Nunca combinar Fase 1, 1b, 2 y 3 en el mismo turno.
- **Excepción permitida — Turno 1:** Fase 0 (digest corto) + Fase 1 (tabla de secciones) en un solo mensaje. Nada más.
- **Sin repetición.** Tras confirmar una fase, no repetir digest, tensiones ni lista de secciones en turnos siguientes.
- **Límite de longitud por fase:**
  - **Fase 0 (Brief digest):** máximo 8 bullets en "Del Brief", 3 en "Inferido", 0–3 en "Confirmado". Sin tablas largas.
  - **Fase 1 (lista de secciones):** solo tabla compacta (`# | Sección | Etiqueta`) + una pregunta: `¿Confirmas esta lista? (sí / ajustes)`
  - **Fase 1b:** un solo bloque con 4 preguntas multiple-choice (A/B/C/D + Other). Sin tecnologías. Sin análisis adicional.
  - **Fase 2:** solo si hay contradicciones; si no hay, un mensaje de una línea: `Sin contradicciones. Pasando a selección.` y abrir Fase 3.
  - **Fase 3:** **exactamente un bloque por sección** con el formato de tabla multiple-choice. Máximo 3 líneas de contexto (Requirement, Recommendation, Etiqueta). Sin trade-offs salvo que el usuario pida `alternativas` o `verbose`.
  - **Fase 4:** tabla resumen + `¿Apruebas? (sí / edits)`.

**Modo verbose** — solo si el usuario lo pide explícitamente: permite digest completo, tensiones, trade-offs y tablas extensas.

**Secuencia esperada al invocar `/sdd-technical`:**

1. **Turno 1:** digest corto (Fase 0) + tabla de secciones (Fase 1) + confirmación de lista.
2. **Turno 2:** solo Fase 1b (tablas multiple-choice).
3. **Turno 3:** Fase 2 (una línea si no hay bloqueos) o primera sección de Fase 3.
4. **Turno 4+:** una sección de stack por mensaje (Fase 3).

## Pre-execution

1. **Read** (do not skip) `.workspace/brief/technical/engineering-principles.md`.
2. **Read** `.workspace/brief/technical/engineering-decisions.md`.
3. **Read** `.workspace/brief/technical/engineering-conventions.md`.
4. **Read** `.workspace/brief/technical/engineering-modeling.md` if the file exists.
5. Read .github/sdd-studio/sdd-technical/STANDARDS.md and .github/sdd-studio/sdd-technical/EXAMPLES.md.
6. If steps 1–3 fail (file missing or not configured), **stop** — do not proceed.
7. Publish the **Brief digest** (Fase 0) per limits above — en el mismo turno que Fase 1 si es el primer mensaje.
8. Do not ask the user to repeat information already present in the Engineering Brief.
9. Complete **Phase 1b — Architectural dimensions** after the user confirms the section list (Fase 1).
10. Apply **modo conciso** by default.
11. If the user already completed Phase 1b in this session, do not repeat it; continue from the next pending phase.

## Flow

**Prohibición de mezcla (todas las fases):**

- No incluir Brief digest en mensajes de Fase 1b o Fase 3.
- No incluir lista de secciones en mensajes de Fase 3.
- No incluir tensiones arquitectónicas (T1, T3, etc.) salvo en Fase 2 cuando bloqueen el avance, o en modo verbose.

**Transiciones explícitas:**

Tras cada fase confirmada, el siguiente mensaje debe empezar con una línea de estado:

`Fase X/Y — <nombre>` (ej. `Fase 3/18 — Database`)

### Phase 0 — Brief digest (read-only)

Publish the three-block digest per Brief gate. Apply concise limits. Do **not** add architectural analysis beyond the digest blocks.

### Phase 1 — Section list (read-only)

From the Engineering Brief, determine which stack sections apply (see .github/sdd-studio/sdd-technical/STANDARDS.md — types A/B/C/D).

Think about architecture first. Do not think about technologies first.

Present **only**:

- A compact table: `# | Sección | Etiqueta` where Etiqueta is `[Brief-locked]`, `[User-elicited]`, `[Dependent on: X]`, or `[Optional]`
- One closing question: `¿Confirmas esta lista? (sí / ajustes)`

**Ordering rule for Phase 3:** (1) User-elicited dimensions resolved in Phase 1b, (2) Brief-locked most restrictive decisions, (3) core layers, (4) cross-cutting, (5) Dependent, (6) Optional.

**Prohibition:** Do not open Phase 3 with `[User-elicited]` or inferred organizational sections. Do not include a section labeled `[Inferido]` — convert to confirmed or omit.

Do **not** include Phase 1b, Phase 2 analysis, or Phase 3 options in this message.

### Phase 1b — Architectural dimensions (mandatory)

Run **only after** the user confirms the section list from Phase 1. **One message only.**

The Brief defines product/engineering constraints, NOT necessarily repository layout, target platforms, or deployment topology.

**Rule:** Skip any question already answered in the Brief (e.g. plataformas objetivo, organización de repositorios from `sdd-studio configure`). Do not suggest technologies — only **dimensions**.

Use **exactly** this multiple-choice format (no open-ended prose):

```markdown
Fase 2/5 — Dimensiones arquitectónicas

## Fase 1b — Dimensiones arquitectónicas

### 1. Plataformas objetivo
| Opción | Respuesta |
| ------ | --------- |
| A | Web solamente |
| B | Web + mobile nativo |
| C | Web + mobile + desktop |
| D | **Other** — especifica |

### 2. Organización de repositorios
| Opción | Respuesta |
| ------ | --------- |
| A | Monorepo único |
| B | Repositorios independientes |
| C | Repo orquestador + repos independientes |
| D | **Other** — especifica |

### 3. Preferencias existentes
| Opción | Respuesta |
| ------ | --------- |
| A | No, empezar desde cero según el Brief |
| B | **Other** — lista tecnologías ya elegidas |

### 4. Restricciones de equipo (opcional)
| Opción | Respuesta |
| ------ | --------- |
| A | Ninguna |
| B | **Other** — especifica |

Responde con: `1B, 2A, 3B: Next.js+PostgreSQL, 4B: equipo pequeño` o texto libre por pregunta.
```

After user answers: move confirmed items to **Confirmado por el usuario** in your internal digest. Update or remove **Inferido por el agente** entries. Do **not** repeat the digest in the next message.

**Do not proceed to Phase 2 until Phase 1b is complete** (or explicitly skipped because ALL dimensions are already in the Brief — state why in one line).

### Phase 2 — Architectural review

Detect contradictions, unconfirmed inferences treated as decisions, structural assumptions without Brief/user basis, and sections lacking type justification.

**Modo conciso:** If no blockers, send only:

`Fase 3/N — <primera sección>` preceded by: `Sin contradicciones. Pasando a selección.`

If blockers exist: stop, explain **only** the blocking issues, ask user to resolve. Do **not** start Phase 3.

### Phase 3 — Interactive selection (one section per turn)

**One section per message. No exceptions in concise mode.**

Each message must contain **ONLY**:

1. Status line: `Fase 3/N — <Section>`
2. One label line: `[Brief-locked]` / `[User-elicited]` / `[Dependent on: X]` + basis (one line)
3. Up to 3 context lines: **Requirement**, **Recommendation**, **Etiqueta** (if not in line 2)
4. Multiple-choice table
5. Closing line: `Responde con 1, 2, 3, 4 u Other.`

Template:

```markdown
Fase 3/N — <Section>

**Etiqueta:** [Brief-locked] — Decision §4

**Requirement:** … (1 línea, cita al Brief)

**Recommendation:** <technology> — … (1 línea)

| Option | Technology |
| ------ | ---------- |
| 1 | <recommended> *(recommended)* |
| 2 | <real alternative> |
| 3 | <real alternative> |
| 4 | **Other** — specify your choice |

Responde con 1, 2, 3, 4 u Other.
```

**Prohibido en el mismo mensaje:** digest, lista de secciones, trade-offs extensos, running summary de más de 1 línea (`Confirmado hasta ahora: Frontend=SvelteKit`).

Rules (unchanged logic):

- **Derive every option from the Brief** — compatible with principles, decisions, conventions.
- **3–4 options + Other** per section. Option 1 = recommendation *(recommended)*.
- **Wait** for user answer before the next section.
- Do **not** write `engineering-stack.md` during Phase 3.
- **Anti-inference rule:** Do not derive repository topology from broad principles alone. Ask in Phase 1b if not in Brief.
- **User preference rule:** If user already stated a choice, confirm compatibility — do not push alternatives unless asked.
- Trade-offs **only** if user says `alternativas` or `verbose`.

### Phase 4 — Write the stack document

Only after every applicable section is confirmed:

1. Summary table + `¿Apruebas? (sí / edits)`
2. Write `.workspace/brief/technical/engineering-stack.md` per .github/sdd-studio/sdd-technical/STANDARDS.md and .github/sdd-studio/sdd-technical/EXAMPLES.md.
3. File records **selections only**, not debate.

Conclude with **Architecture Summary** in the file.

## Checklist

```
- [ ] engineering-principles.md, engineering-decisions.md, engineering-conventions.md read (mandatory)
- [ ] engineering-modeling.md read if present
- [ ] Modo conciso aplicado (una fase por mensaje)
- [ ] Sin mezcla de fases en un turno (salvo Fase 0+1 en turno 1)
- [ ] Brief digest has three blocks: Del Brief / Inferido / Confirmado por el usuario
- [ ] Phase 1b completed — architectural dimensions elicited or justified as already in Brief
- [ ] Fase 1b con tablas multiple-choice A/B/C/D
- [ ] Fase 3 con una sola sección por mensaje
- [ ] No unconfirmed inference used in Phase 3
- [ ] Each section in list has label [Brief-locked | User-elicited | Dependent | Optional]
- [ ] No organizational/structural section started Phase 3 without user confirmation
- [ ] User preferences recorded before re-recommending alternatives
- [ ] Broad principles not mapped to structural patterns without asking
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] All suggestions trace to Engineering Brief (no generic defaults)
- [ ] Contradictions checked — stopped if found
- [ ] Section list agreed with the user
- [ ] Final summary approved before writing the file
- [ ] engineering-stack.md contains selected technologies only
- [ ] Architecture Summary reflects confirmed choices
```

## Report

1. Whether `engineering-stack.md` was created or updated
2. Table of sections and **user-selected** technologies
3. Any sections skipped because the brief does not require them
4. Contradictions found (if stopped)
5. Next step: **sdd-spec** or **sdd-review** as appropriate

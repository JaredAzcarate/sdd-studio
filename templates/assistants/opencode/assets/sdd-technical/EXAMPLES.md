# EXAMPLES — sdd-technical

## Chat — section prompt (excerpt)

```markdown
## Database — choose one

**Requirement:** Relational storage with ACID (Engineering Principle §8, Decision §10 — *from Brief digest*).

**Recommendation:** PostgreSQL — …

**Brief basis:** Engineering Decision §10 (Relational); Principle §8 (Relational data model).

| Option | Technology |
| ------ | ---------- |
| 1 | PostgreSQL *(recommended)* |
| 2 | MySQL 8 |
| 3 | SQLite (single-node / embedded) |
| 4 | **Other** — specify your choice |

Reply with the option number, technology name, or custom text for **Other**.
```

Rejected alternatives and longer reasoning stay in chat, not in the file.

---

## Chat — Phase 1b dimension elicitation (excerpt)

```markdown
## Dimensiones arquitectónicas

El Brief define capacidades del producto, no cómo organizar los repositorios ni todas las plataformas. Necesito confirmar contigo:

1. **Plataformas objetivo** — ¿Qué superficies debe cubrir el producto?
2. **Organización de repositorios** — ¿Un solo repo, repos independientes, repo orquestador + repos independientes, u otro?
3. **Preferencias existentes** — ¿Hay decisiones de stack ya tomadas fuera del Brief?
4. **Restricciones operativas** — (opcional) ¿Algo que deba condicionar la selección?

No propongo tecnologías en este paso — solo dimensiones.
```

---

## Chat — Brief digest format (excerpt)

```markdown
### Del Brief (explícito)
- Backend integrado, fuente de verdad en servidor (Principle §4–§5)
- App Router (Decision §4)
- Autenticación social, autorización por roles (Decision §8–§9)
- …

### Inferido por el agente (requiere confirmación)
- ~~Organización multi-paquete en un solo repositorio~~ → **retirado; no confirmado**

### Confirmado por el usuario
- Plataformas: web + iOS + Android + desktop
- Repositorios: orquestador + repos independientes
- Preferencia cliente: (registrar lo que el usuario diga)
```

---

## Chat — user preference already stated (excerpt)

When the user already chose a technology in Phase 1b or earlier, do NOT re-open with a competing recommendation unless they ask.

```markdown
## Frontend — confirmar

**Etiqueta:** [User-elicited] — preferencia declarada en Phase 1b

**Requisito:** App Router (Decision §4); plataformas confirmadas: web + mobile + desktop

**Tu elección:** `<user stated choice>`

**Compatibilidad con el Brief:** … (2–3 frases)

¿Confirmas `<user stated choice>` para esta sección? (sí / quiero ver alternativas)
```

---

## engineering-stack.md (excerpt — after user confirms)

> **Note:** `engineering-stack.md` may include a **Repository Organization** section (technology-agnostic description of single repo / polyrepo / orchestrator pattern) when the user confirmed it in Phase 1b — written as **Selected:** pattern name, not tool name, unless the user selected a specific tool in Phase 3.

```markdown
# Engineering Stack

## Overview

TypeScript monolith: SvelteKit UI and server routes, PostgreSQL, Drizzle ORM. Chosen for integrated deployment, explicit data layer, and alignment with Feature First + Clean Architecture in the Engineering Brief.

Traceability: Engineering Principles §2 (web-first), Engineering Decisions §1 (Feature First), §3 (Clean Architecture).

---

## Repository Organization

**Selected:** Single repository with feature-first folders

Confirmed in Phase 1b; one deployable unit matches integrated backend and small-team iteration goals.

Traceability: Confirmado por el usuario (Phase 1b).

---

## Frontend

**Selected:** SvelteKit with TypeScript

Compiler-driven UI with file-based routing and SSR; matches web-first scope and keeps bundles small per Engineering Principles.

Traceability: Engineering Principles §2, Engineering Conventions (TypeScript end-to-end).

---

## Backend

**Selected:** SvelteKit server routes (same application)

Integrated server runtime reduces operational surface for the modular monolith; domain logic stays in application/domain layers per Clean Architecture.

Traceability: Engineering Decisions §3, Engineering Principles §4 (integrated backend).

---

## Database

**Selected:** PostgreSQL

Relational core for aggregates and billing; JSONB for flexible metadata without abandoning constraints.

Traceability: Engineering Principle §8, Engineering Decision §10.

---

## Architecture Summary

The selected stack is a single SvelteKit application on PostgreSQL with Drizzle. UI and API share one TypeScript codebase and deployment unit, preserving feature-first module boundaries inside the monolith. This matches the brief's maintainability and small-team iteration goals while leaving room to extract services later.
```

## Anti-example — Inferring structure from broad principles

**Incorrect:** After reading "multi-platform" + "maximum code sharing", the agent adds "Monorepo" or any multi-package tool as section #1 in Phase 3 without asking repository organization.

**Correct:** Phase 1b asks repository organization → user answers → section list includes `[User-elicited] Repository Organization` (already resolved) or omits tool-specific section until a dependent choice requires it.

---

## Anti-example — Mixed digest

**Incorrect:** Brief digest bullet: "Monorepo for code sharing across platforms" presented as fact.

**Correct:** Same idea under **Inferido por el agente** until user confirms, or under **Confirmado por el usuario** after Phase 1b.

---

## Anti-example — Phase 1 section list without labels

**Incorrect:** Flat numbered list of 21 stack sections with no source or type.

**Correct:**

```markdown
| # | Sección | Tipo | Base |
|---|---------|------|------|
| 1 | Repository Organization | [User-elicited] | Confirmado: orquestador + repos independientes |
| 2 | Frontend | [Brief-locked] + [Dependent] | Decision §4 App Router; plataformas confirmadas |
| … | Monorepo tool | **Omitida** | No requerida; repos independientes confirmados |
```

## Anti-example — Incorrect file content

```markdown
## Frontend

**Recommended:** Next.js 15

**Not selected:** Vite + React — viable but …
```

Recommendations and rejections belong in **chat**. The file must use **Selected:** only.

## Anti-example — Incorrect workflow

Writing `engineering-stack.md` in one shot without per-section user confirmation.

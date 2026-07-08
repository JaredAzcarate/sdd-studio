# EXAMPLES — sdd-technical

## Chat — modo conciso (default)

### Turno 1 — Fase 0 + Fase 1 (digest corto + lista)

```markdown
Fase 1/5 — Lista de secciones

### Del Brief (explícito)
- Backend integrado (Principle §4)
- App Router (Decision §4)
- Autenticación social + roles (Decision §8–§9)
- Base de datos relacional (Decision §10)
- Plataformas: Web, Mobile nativo iOS/Android (Principle §2)
- Repos: monorepo único (Decision §1)
- Testing y deployment profesional (Decision §13–§14)

### Inferido por el agente (requiere confirmación)
- (ninguno pendiente)

### Confirmado por el usuario
- (pendiente Fase 1b)

| # | Sección | Etiqueta |
|---|---------|----------|
| 1 | Frontend | [Brief-locked] |
| 2 | Backend | [Brief-locked] |
| 3 | Database | [Brief-locked] |
| … | … | … |

¿Confirmas esta lista? (sí / ajustes)
```

### Turno 2 — Fase 1b (solo tablas multiple-choice)

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

Responde con: `1B, 2A, 3A, 4A` o texto libre por pregunta.
```

### Turno 3+ — Fase 3 (una sección)

```markdown
Fase 3/8 — Database

**Etiqueta:** [Brief-locked] — Decision §10 (Relational)

**Requirement:** Almacenamiento relacional con ACID.

**Recommendation:** PostgreSQL — alineado con modelo relacional del Brief.

| Option | Technology |
| ------ | ---------- |
| 1 | PostgreSQL *(recommended)* |
| 2 | MySQL 8 |
| 3 | SQLite (single-node) |
| 4 | **Other** — specify your choice |

Responde con 1, 2, 3, 4 u Other.
```

### Anti-ejemplo — Mezcla de fases en un turno

**Incorrecto:** Un solo mensaje con digest de 20 bullets, análisis de tensiones T1–T4, tabla de 18 secciones, Fase 1b abierta y pregunta de Database con trade-offs de MySQL vs PostgreSQL.

**Correcto:** Turno 1 = digest corto + lista. Turno 2 = solo 1b. Turno 3 = una línea de revisión o primera sección. Turnos siguientes = una sección cada uno.

---

## Chat — section prompt (verbose / referencia)

```markdown
## Database — choose one

**Requirement:** Relational storage with ACID (Engineering Principle §8, Decision §10 — *from Brief digest*).

**Recommendation:** PostgreSQL — …

| Option | Technology |
| ------ | ---------- |
| 1 | PostgreSQL *(recommended)* |
| 2 | MySQL 8 |
| 3 | SQLite (single-node / embedded) |
| 4 | **Other** — specify your choice |

Reply with the option number, technology name, or custom text for **Other**.
```

Use this extended format **only** in `modo verbose`.

---

## Chat — Brief digest format (referencia)

```markdown
### Del Brief (explícito)
- Backend integrado, fuente de verdad en servidor (Principle §4–§5)
- App Router (Decision §4)
- Autenticación social, autorización por roles (Decision §8–§9)

### Inferido por el agente (requiere confirmación)
- ~~Organización multi-paquete~~ → **retirado; no confirmado**

### Confirmado por el usuario
- Plataformas: web + iOS + Android + desktop
- Repositorios: orquestador + repos independientes
```

En modo conciso: máximo 8 + 3 + 3 bullets.

---

## Chat — user preference already stated (excerpt)

```markdown
Fase 3/5 — Frontend

**Etiqueta:** [User-elicited] — preferencia declarada en Phase 1b

**Requirement:** App Router (Decision §4)

**Tu elección:** Next.js 15

**Compatibilidad con el Brief:** Cumple App Router y plataformas confirmadas.

¿Confirmas Next.js 15? (sí / quiero ver alternativas)
```

---

## engineering-stack.md (excerpt — after user confirms)

> **Note:** `engineering-stack.md` may include a **Repository Organization** section when confirmed in Phase 1b — **Selected:** pattern name, not tool name, unless user selected a tool in Phase 3.

```markdown
# Engineering Stack

## Overview

TypeScript monolith: SvelteKit UI and server routes, PostgreSQL, Drizzle ORM.

Traceability: Engineering Principles §2, Engineering Decisions §1, §3.

---

## Frontend

**Selected:** SvelteKit with TypeScript

Compiler-driven UI with file-based routing and SSR.

Traceability: Engineering Principles §2, Engineering Conventions (TypeScript end-to-end).

---

## Database

**Selected:** PostgreSQL

Relational core for aggregates and billing.

Traceability: Engineering Principle §8, Engineering Decision §10.

---

## Architecture Summary

Single SvelteKit application on PostgreSQL with Drizzle. Matches maintainability goals in the Brief.
```

## Anti-example — Inferring structure from broad principles

**Incorrect:** After reading "multi-platform" + "maximum code sharing", add "Monorepo" as section #1 in Phase 3 without asking repository organization.

**Correct:** Phase 1b asks repository organization → user answers → proceed.

## Anti-example — Incorrect file content

```markdown
## Frontend

**Recommended:** Next.js 15

**Not selected:** Vite + React — viable but …
```

The file must use **Selected:** only.

## Anti-example — Incorrect workflow

Writing `engineering-stack.md` in one shot without per-section user confirmation.

# EXAMPLES — sdd-technical

## Chat — turno 1 (intro + `AskQuestion`)

**Mensaje en chat:**

```markdown
Basado en `.workspace/brief/technical`, voy a proponerte tecnologías, librerías e integraciones para definir el stack del proyecto.

Veo **web + iOS/Android + desktop** con **máximo code sharing**, **App Router** y backend **integrado**. Empecemos por web.
```

**Luego `AskQuestion` (no repetir opciones en markdown):**

- **title:** `Stack — Web`
- **prompt:** `¿Qué te gustaría usar para desarrollo web?`
- **options:**
  - `Next.js (Recommended) — App Router, SSR, React para compartir con mobile`
  - `Remix — file routing, React, loaders/actions`
  - `Nuxt — Vue; menos alineado si mobile será React/Expo`

## Chat — turno 2 (mobile)

**Chat:**

```markdown
Confirmado: Web=Next.js
```

**`AskQuestion`:**

- **title:** `Stack — Mobile`
- **prompt:** `¿Cómo quieres abordar mobile nativo (iOS/Android)? El Brief pide máximo code sharing.`
- **options:**
  - `Expo (Recommended) — React Native, alinea con Next.js`
  - `React Native sin Expo`
  - `Capacitor — empaquetar la app web`

## Chat — turno 3 (desktop)

**Chat:**

```markdown
Confirmado: Web=Next.js, Mobile=Expo
```

**`AskQuestion`:**

- **title:** `Stack — Desktop`
- **prompt:** `¿Qué prefieren para desktop?`
- **options:**
  - `Tauri (Recommended) — binario ligero, reutiliza UI web`
  - `Electron`
  - `PWA / shell web mínimo`

## Chat — turno N (base de datos)

**`AskQuestion`:**

- **title:** `Stack — Database`
- **prompt:** `¿Qué base de datos relacional usamos?`
- **options:**
  - `PostgreSQL (Recommended) — ACID, JSON, ecosistema amplio`
  - `MySQL 8`
  - `SQLite — single-node / dev`

## Chat — bloqueo (auditor)

**Chat** explica el conflicto en lenguaje plano (2–4 frases).

**`AskQuestion`:**

- **prompt:** `¿Cómo quieren resolver el code sharing entre plataformas?`
- **options:** enfoques viables según el Brief (no tecnologías aún si el bloqueo es arquitectónico)

## Chat — resumen final

**Chat:** tabla área → selección.

**`AskQuestion`:**

- **title:** `Stack — Aprobación`
- **prompt:** `¿Apruebas este stack para escribir engineering-stack.md?`
- **options:**
  - `Sí, escribir engineering-stack.md`
  - `Quiero edits`

## Anti-ejemplo — tabla markdown (incorrecto)

```markdown
| Opción | Tecnología |
| ------ | ---------- |
| 1 | Next.js |
| 2 | Remix |

Responde con 1, 2, 3, 4 u Other.
```

**Correcto:** intro breve en chat + `AskQuestion` con opciones clicables.

## Anti-ejemplo — estilo arquitecto (incorrecto)

```markdown
Fase 3/18 — Frontend [Brief-locked]
```

**Correcto:** intro de equipo + `AskQuestion` con pregunta natural.

## Anti-ejemplo — opciones hardcodeadas

**Incorrecto:** Siempre las mismas opciones sin leer el Brief.

**Correcto:** Filtrar opciones según App Router, code sharing, backend integrado, etc.

## engineering-stack.md (excerpt — after approval)

```markdown
# Engineering Stack

## Overview

Next.js full-stack web app, Expo for iOS/Android, Tauri for desktop, PostgreSQL with Drizzle.

Traceability: Engineering Principles §2–§4, Engineering Decisions §4–§5, §11.

---

## Frontend

**Selected:** Next.js with TypeScript

App Router, SSR, and shared React patterns with Expo mobile.

Traceability: Engineering Principles §2, Engineering Decisions §5 (App Router).

---

## Architecture Summary

Next.js hosts the integrated backend and web UI. Expo and Tauri extend the product to mobile and desktop while maximizing shared TypeScript and React code.
```

## Anti-ejemplo — escribir sin confirmación

Writing `engineering-stack.md` without per-area `AskQuestion` answers and final approval question.

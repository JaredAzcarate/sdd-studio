# EXAMPLES — sdd-technical

## Chat — turno 1 (intro + primera pregunta)

```markdown
Basado en `.workspace/brief/technical`, voy a proponerte tecnologías, librerías e integraciones para definir el stack del proyecto.

Veo **web + iOS/Android + desktop** con **máximo code sharing**, **App Router** y backend **integrado**. Empecemos por web.

¿Qué te gustaría usar para desarrollo web?

1. Next.js (Recommended) — App Router, SSR, React para compartir con mobile
2. Remix — file routing, React, loaders/actions
3. Nuxt — Vue; menos alineado si mobile será React/Expo

Responde con el número o describe otra opción.
```

## Chat — turno 2 (mobile)

```markdown
Confirmado: Web=Next.js

¿Cómo quieres abordar mobile nativo (iOS/Android)? El Brief pide máximo code sharing.

1. Expo (Recommended) — React Native, alinea con Next.js
2. React Native sin Expo
3. Capacitor — empaquetar la app web

Responde con el número o describe otra opción.
```

## Chat — turno 3 (desktop)

```markdown
Confirmado: Web=Next.js, Mobile=Expo

¿Qué prefieren para desktop?

1. Tauri (Recommended) — binario ligero, reutiliza UI web
2. Electron
3. PWA / shell web mínimo

Responde con el número o describe otra opción.
```

## Chat — turno N (base de datos)

```markdown
¿Qué base de datos relacional usamos?

1. PostgreSQL (Recommended) — ACID, JSON, ecosistema amplio
2. MySQL 8
3. SQLite — single-node / dev

Responde con el número o describe otra opción.
```

## Chat — bloqueo (auditor)

Explica el conflicto en lenguaje plano (2–4 frases), luego:

```markdown
¿Cómo quieren resolver el code sharing entre plataformas?

1. <enfoque viable A según Brief>
2. <enfoque viable B>
3. <enfoque viable C>

Responde con el número o describe otra opción.
```

## Chat — resumen final

Tabla área → selección, luego:

```markdown
¿Apruebas este stack para escribir engineering-stack.md?

1. Sí, escribir engineering-stack.md
2. Quiero edits

Responde con el número.
```

## Anti-ejemplo — tabla markdown ancha (incorrecto)

```markdown
| Opción | Tecnología | Pros | Cons |
| ------ | ---------- | ---- | ---- |
| 1 | Next.js | … | … |
| 2 | Remix | … | … |
```

**Correcto:** intro breve + lista numerada compacta (3–4 opciones).

## Anti-ejemplo — estilo arquitecto (incorrecto)

```markdown
Fase 3/18 — Frontend [Brief-locked]
```

**Correcto:** intro de equipo + pregunta natural con opciones numeradas.

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

Writing `engineering-stack.md` without per-area answers and final approval question.

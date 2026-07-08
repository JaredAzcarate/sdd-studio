# EXAMPLES — sdd-technical

Reference output for `.workspace/brief/technical/engineering-stack.md`.

## engineering-stack.md (excerpt)

```markdown
# Engineering Stack

## Overview

This stack targets a multi-tenant B2B SaaS web application with real-time collaboration, strong typing end-to-end, and a single deployable unit for the MVP. It aligns with the Engineering Brief's emphasis on developer experience, long-term maintainability, and a modular monolith that can evolve without premature microservices.

Traceability: Engineering Principles §2 (Primary Platform: web-first), Engineering Decisions §1 (Modular monolith).

---

## Frontend

**Recommended:** SvelteKit

SvelteKit provides file-based routing, SSR, and a compiler-driven reactivity model that keeps bundle size small — matching the brief's performance and simplicity priorities. TypeScript is assumed throughout per Engineering Conventions.

**Not selected:** React — viable, but the brief prioritizes minimal runtime overhead and does not require React's ecosystem breadth for MVP scope.

---

## Backend

**Recommended:** SvelteKit server routes (same runtime)

Co-locating frontend and backend in one framework reduces operational surface area for the modular monolith decision. Server logic stays in route modules and dedicated server libraries per Engineering Conventions (feature folders).

---

## Database

**Recommended:** PostgreSQL

Relational model fits the domain aggregates documented in Engineering Modeling. JSONB columns cover flexible metadata without abandoning relational integrity — consistent with Engineering Decision §3 (relational core with selective document fields).

---

## ORM / Data Layer

**Recommended:** Drizzle ORM

Type-safe SQL with minimal abstraction overhead. Aligns with Engineering Conventions (explicit SQL visibility) and pairs naturally with PostgreSQL. Migrations stay version-controlled alongside application code.

---

## Architecture Summary

The stack forms a single TypeScript codebase deployed as one SvelteKit application against PostgreSQL. SvelteKit handles both UI and server routes, eliminating cross-service coordination for the MVP while preserving clear module boundaries inside the monolith. Drizzle keeps the data layer explicit and type-safe, supporting the DDD-style aggregates in Engineering Modeling without ORM magic. This ecosystem satisfies the brief's goals: fast iteration for a small team, strong typing, a path to scale reads via PostgreSQL replicas, and the option to extract services later without rewriting the domain model.
```

## Anti-example — Incorrect

```text
.workspace/brief/technical/engineering-principles.md   # sdd-technical does not modify inputs
.workspace/brief/technical/engineering-decisions.md    # sdd-technical does not modify inputs
.workspace/spec/technical/api/task-api.md              # sdd-technical does not write spec
```

**Incorrect — hardcoded default without brief justification:**

```markdown
## Frontend

React + Next.js

Industry standard choice.
```

Every recommendation must emerge from the Engineering Brief, not from popularity or defaults.

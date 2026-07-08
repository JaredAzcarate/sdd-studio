# STANDARDS — sdd-idea

Mandatory rules for generating the Brief under `.workspace/brief/`.

## Four-layer model

| Layer | Question |
| ----- | -------- |
| Brief — Business | What product do we want to build? |
| Brief — Technical | How do we decide to build it? |
| Specification | (not written by sdd-idea) |
| Workflow | (not written by sdd-idea) |

**sdd-idea writes only the Business Brief and `engineering-modeling.md`.** Never create or modify `.workspace/spec/` or `.workspace/workflow/`.

**Generation order:**

1. `brief/business/product-principles.md`
2. `brief/business/product-guide.md`
3. `brief/technical/engineering-modeling.md`

## Engineering Brief (not written by sdd-idea)

These files are created by `sdd-studio configure` (or `sdd-studio init`). **Read only** — do not write or modify:

| File | Created by |
| ---- | ---------- |
| `brief/technical/engineering-principles.md` | `sdd-studio configure` |
| `brief/technical/engineering-decisions.md` | `sdd-studio configure` |
| `brief/technical/engineering-conventions.md` | `sdd-studio configure` |
| `brief/technical/engineering-stack.md` | **sdd-technical** |

If engineering principles, decisions, or conventions are missing or incomplete, tell the user to run `sdd-studio configure`. If the stack is undefined, tell the user to run **sdd-technical**.

---

## Business Brief

### `.workspace/brief/business/product-principles.md`

**Question:** What conceptual principles is the product built on?

**Mandatory opening:**

```markdown
# Product Principles

> Este documento define los principios conceptuales sobre los que está construido el producto.
>
> Su objetivo es que cualquier diseñador, desarrollador o IA comprenda qué representa el producto, cuál es su unidad central y qué ideas no deben romperse al evolucionar el producto.
>
> Este documento no describe pantallas, recorridos ni implementación técnica.
```

**Required H2 sections (in order):**

```text
## Qué representa el producto
## Unidad principal
## Conceptos inmutables
## Cómo entiende el producto el negocio
## Principios para futuras funcionalidades
## Modelo mental compartido
```

**Forbidden:** screens, journeys, APIs, stack, domains, tasks.

---

### `.workspace/brief/business/product-guide.md`

**Question:** How does the product work for a user?

**Mandatory opening:**

```markdown
# Product Guide

> Este documento explica el producto desde el punto de vista del usuario.
>
> Su objetivo es que cualquier persona pueda comprender qué hace el producto, cómo funciona y cómo utilizar cada una de sus funcionalidades sin necesidad de conocimientos técnicos.
>
> Este documento debe mantenerse siempre actualizado y reflejar fielmente el comportamiento del producto.
>
> Cada modificación funcional realizada sobre el producto deberá actualizar también este documento.
```

**Organization:** continuous user journey; one H2 per experience; separate with `---`.

**Forbidden:** APIs, stack, architecture, DDD internals, principles (belongs in product-principles), specification content.

---

## Technical Brief (sdd-idea writes one file)

### `.workspace/brief/technical/engineering-modeling.md`

**Question:** How will we model the business domain?

**Mandatory opening:**

```markdown
# Engineering Modeling

> How the team interprets and structures the product domain.
>
> This document defines business modeling context. It does not describe APIs, databases, or implementation details.
```

**Required H2 sections:**

```text
## Domain Driven Design
## Bounded Context
## Aggregates
## Ubiquitous Language
## Modeling Principles
```

**Allowed:** DDD approach, bounded contexts, aggregates, ubiquitous language, modeling principles.

**Forbidden:** specific technologies, API contracts, UI specs, user journeys, product narratives, stack choices.

---

## Writing rules (all Brief files)

- Be explicit and verifiable
- Mark uncertainty with `TODO:` and ask the user
- Separate sections with `---` where specified
- Single H1 per file

## Prohibitions

- Do not create files outside `.workspace/brief/`
- Do not modify `.workspace/spec/` or `.workspace/workflow/`
- Do not modify `engineering-principles.md`, `engineering-decisions.md`, `engineering-conventions.md`, or `engineering-stack.md`
- Do not mix Business Brief content into Technical Brief or vice versa
- Do not duplicate principles as narratives or stack choices as modeling decisions

## Cross-skill contract

Skills **sdd-spec**, **sdd-generate**, and **sdd-review** must consume **Project Organization** from `brief/technical/engineering-decisions.md` and API/architecture context from `brief/technical/engineering-stack.md`. They must not contradict paths or conventions documented there.

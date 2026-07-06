# STANDARDS — sdd-idea

Mandatory rules for generating the Brief under `.workspace/brief/`.

## Four-layer model

| Layer | Question |
| ----- | -------- |
| Brief — Business | What product do we want to build? |
| Brief — Technical | How do we decide to build it? |
| Specification | (not written by sdd-idea) |
| Workflow | (not written by sdd-idea) |

**sdd-idea writes only the Brief.** Never create or modify `.workspace/spec/` or `.workspace/workflow/`.

**Generation order:**

1. `brief/business/product-principles.md`
2. `brief/business/product-guide.md`
3. `brief/technical/development.md`
4. `brief/technical/modeling.md`
5. `brief/technical/stack/frontend.md` → `backend.md` → `database.md` → `infrastructure.md` → `ai.md`

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

## Technical Brief

### `.workspace/brief/technical/development.md`

**Question:** How will we develop this product?

**Mandatory opening:**

```markdown
# Development

> ¿Cómo desarrollaremos este producto?
>
> Este documento define el modelo de desarrollo y las convenciones del proyecto.
> No describe tecnologías específicas ni decisiones de implementación.
```

**Required H2 sections:**

```text
## Development Model
## Workflow Methodology
## Repository Strategy
## Code Organization
## Development Conventions
```

**Allowed:** SDD, Kanban/Scrum, monorepo/polyrepo, feature-first/layer-first, linting conventions.

**Forbidden:** specific languages, frameworks, databases, cloud providers, user journeys, product behavior.

`Development Model` defaults to `Specification Driven Development` unless the user says otherwise.

---

### `.workspace/brief/technical/modeling.md`

**Question:** How will we model the business?

**Mandatory opening:**

```markdown
# Modeling

> ¿Cómo modelaremos el negocio?
>
> Este documento define cómo el equipo interpreta y estructura el dominio del producto.
> No describe APIs, bases de datos ni detalles de implementación.
```

**Required H2 sections:**

```text
## Domain Driven Design
## Bounded Context
## Aggregates
## Ubiquitous Language
## Modeling Principles
```

**Forbidden:** specific technologies, API contracts, UI specs, user journeys.

---

### `.workspace/brief/technical/stack/`

Each file answers **one question only**:

| File | Question |
| ---- | -------- |
| `frontend.md` | What technologies will we use to build the frontend? |
| `backend.md` | What technologies will we use to build the backend? |
| `database.md` | What technologies will we use for persistence? |
| `infrastructure.md` | How will we deploy, monitor, and operate the solution? |
| `ai.md` | What AI tools participate in development? |

Each file must start with `# <Title>` and a blockquote stating its single question.

**Forbidden in stack files:** user journeys, domain rules, development methodology (belongs in `development.md`), DDD structure (belongs in `modeling.md`).

---

## Writing rules (all Brief files)

- Be explicit and verifiable
- Mark uncertainty with `TODO:` and ask the user
- Separate sections with `---` where specified
- Single H1 per file

## Prohibitions

- Do not create files outside `.workspace/brief/`
- Do not modify `.workspace/spec/` or `.workspace/workflow/`
- Do not mix Business Brief content into Technical Brief or vice versa
- Do not duplicate principles as narratives or stack choices as modeling decisions

## Cross-skill contract

Skills **sdd-spec** and **sdd-generate** must consume **Repository Strategy** and **Code Organization** from this file (and API surface from `brief/technical/stack/backend.md`). They must not contradict paths or conventions documented here.

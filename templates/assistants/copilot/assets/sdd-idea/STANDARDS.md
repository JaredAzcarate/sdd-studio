# STANDARDS — sdd-idea

Mandatory rules for generating `.workspace/project.md` and `.workspace/product-guide.md`.

## Separation of concerns

| File | Question it answers | Contains |
| ---- | ------------------- | -------- |
| `.workspace/product-guide.md` | How does the product work for a user? | Narrative product guide only |
| `.workspace/project.md` | How will we develop this product? | Technical and development configuration |

Never mix content between these files. Never create files under `.workspace/spec/`.

---

## .workspace/product-guide.md

### Location

- Exact path: `.workspace/product-guide.md`
- One product guide per project
- Do not place product-guide inside `.workspace/spec/`

### Purpose

The Product Guide is the **entry point** for understanding the product.

It explains the complete product from the user's perspective using a **continuous narrative** organized by the **real user journey** — not by domains, features, or technical structure.

Any person should understand the full product by reading this document alone, from start to finish, as if it were a book.

It is **not** a specification. It can be delivered with the product as official user documentation.

### Mandatory opening

The file must begin **exactly** with:

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

### Organization

Organize by **user experiences** in journey order:

```text
Crear cuenta → Verificar correo → Pantalla de bienvenida → Onboarding → ...
```

- Each experience is one H2 section (`## Experience name`)
- Do **not** organize by domains, APIs, or feature lists
- Do **not** use generic sections like "Introduction", "Features", or "Glossary" as the primary structure
- Describe **all alternative paths** narratively when they exist (e.g. manual signup vs Google, individual vs team, admin vs guest)

### Narrative structure per experience

Each experience section must read like a usage guide:

```markdown
## Crear cuenta

[What is the goal of this screen/experience]

[What the user sees]

[What actions the user can take]

[What happens when the process completes successfully]

[Alternative paths or error flows, if any]

[What experience comes next]
```

### Writing style

- Clear, professional, natural language
- Narrative and continuous — not a technical spec
- Oriented exclusively to product usage

### Forbidden content

Never mention:

- APIs, endpoints, or contracts
- frameworks, languages, or stacks
- architecture or code organization
- databases or persistence
- DDD, Clean Architecture, microservices
- internal models, entities, or domain structure
- development methodology or AI assistant configuration
- tasks, releases, roadmap, or planning

### Format rules

1. Single H1: `# Product Guide` (mandatory opening only)
2. Mandatory blockquote immediately after H1
3. User experiences as H2 (`##`)
4. Separate experiences with `---`
5. No `TODO:` left without documenting open questions

---

## .workspace/project.md

### Location

- Exact path: `.workspace/project.md`
- One project configuration file per workspace

### Allowed content

Technical and development configuration:

- project name and description
- development model
- workflow methodology
- architecture
- modeling approach
- code organization
- language, framework, backend, frontend, database
- AI assistant
- any other technical setting used by SDD skills

### Forbidden content

- product behavior, user journeys, or experiences
- product guide content
- domain specifications
- tasks, releases, roadmap, or milestones

### Document structure

```markdown
# Project

## Name

---

## Description

---

## Development Model

Specification Driven Development

---

## Workflow Methodology

---

## Architecture

---

## Modeling

---

## Code Organization

---

## Language

---

## Framework

---

## Backend

---

## Frontend

---

## Database

---

## Assistant
```

### Format rules

1. Single H1: `# Project`
2. Main sections with H2 (`##`)
3. Separate main sections with `---`
4. Reflect user answers; do not invent values
5. `Development Model` defaults to `Specification Driven Development` unless the user says otherwise

---

## Writing rules (both files)

- Be explicit and verifiable
- Mark uncertainty with `TODO:` and ask the user
- If the user did not define a required field, ask before writing

## Prohibitions

- Do not create files outside `.workspace/project.md` and `.workspace/product-guide.md`
- Do not modify `.workspace/workflow/` or any file under `.workspace/spec/`
- Do not duplicate product-guide content in `project.md` or technical content in `product-guide.md`
- Do not create files under `.workspace/spec/`

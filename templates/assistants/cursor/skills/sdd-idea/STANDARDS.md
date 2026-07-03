# STANDARDS — sdd-idea

Mandatory rules for generating `workspace/project.md` and `workspace/user-manual.md`.

## Separation of concerns

| File | Question it answers | Contains |
| ---- | ------------------- | -------- |
| `workspace/user-manual.md` | How does this product work for a user? | Narrative user manual only |
| `workspace/project.md` | How will we develop this product? | Technical and development configuration |

Never mix content between these files. Never create files under `workspace/spec/`.

---

## workspace/user-manual.md

### Location

- Exact path: `workspace/user-manual.md`
- One user manual per project
- Do not place user-manual inside `workspace/spec/`

### Purpose

Explain the product from the user's perspective. The manual tells the product as a story — not organized by technical domains.

Any person should understand the full product by reading this document alone.

### Mandatory opening

The file must begin **exactly** with:

```markdown
# User Manual

> Este documento explica el producto desde el punto de vista del usuario.
>
> Su objetivo es que cualquier persona pueda comprender qué hace el producto, qué problema resuelve y cómo utilizar cada una de sus funcionalidades, sin necesidad de conocimientos técnicos.
>
> Este documento debe mantenerse siempre actualizado y reflejar fielmente el comportamiento del producto. Cada cambio funcional incorporado al sistema debe actualizar también este manual.
```

### Allowed content

User-facing, narrative content:

- introduction and product purpose
- problem being solved
- target users
- core concepts users need
- getting started
- features and how to use them
- typical user scenarios (stories)
- frequently asked questions
- glossary of user-facing terms

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

### Document structure

```markdown
# User Manual

> [mandatory blockquote — see above]

## Introduction

---

## Problem

---

## Who is this product for?

---

## Core Concepts

---

## Getting Started

---

## Features

---

## Typical User Scenarios

---

## Frequently Asked Questions

---

## Glossary
```

Sections may evolve over time. The focus must remain narrative and user-facing.

### Format rules

1. Single H1: `# User Manual`
2. Mandatory blockquote immediately after H1
3. Main sections with H2 only (`##`)
4. Separate main sections with `---`
5. Simple, clear language — understandable without technical knowledge
6. No `TODO:` left without documenting open questions

---

## workspace/project.md

### Location

- Exact path: `workspace/project.md`
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

- product behavior, user scenarios, or features
- user manual content
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

- Do not create files outside `workspace/project.md` and `workspace/user-manual.md`
- Do not modify `workspace/workflow/` or any file under `workspace/spec/`
- Do not duplicate user-manual content in `project.md` or technical content in `user-manual.md`
- Do not create `workspace/spec/product.md` or `workspace/spec/vision.md`

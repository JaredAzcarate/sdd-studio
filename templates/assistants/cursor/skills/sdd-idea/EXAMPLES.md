# EXAMPLES — sdd-idea

Valid examples of `workspace/user-manual.md` and `workspace/project.md`.

## workspace/user-manual.md

```markdown
# User Manual

> Este documento explica el producto desde el punto de vista del usuario.
>
> Su objetivo es que cualquier persona pueda comprender qué hace el producto, qué problema resuelve y cómo utilizar cada una de sus funcionalidades, sin necesidad de conocimientos técnicos.
>
> Este documento debe mantenerse siempre actualizado y reflejar fielmente el comportamiento del producto. Cada cambio funcional incorporado al sistema debe actualizar también este manual.

## Introduction

TaskFlow helps small teams see who is doing what, without the complexity of enterprise tools.

---

## Problem

Teams of 3–10 people coordinate work in spreadsheets and chat threads. Tasks get lost, status is unclear, and new members take days to catch up.

---

## Who is this product for?

- **Team leads** who need visibility across all work
- **Team members** who need a simple place to track assigned tasks

---

## Core Concepts

- **Task:** a unit of work with an owner and a status
- **Board:** a visual view of tasks grouped by status

---

## Getting Started

1. Create an account with your work email
2. Invite your teammates
3. Create your first task and assign it

---

## Features

- Create, assign, and complete tasks
- View tasks on a board by status
- Receive notifications when a task status changes

---

## Typical User Scenarios

**Scenario — Daily standup:** A team lead opens the board, sees blocked tasks, and reassigns work before the meeting.

**Scenario — New member:** A developer joins, reads open tasks, and picks up their first assignment in under 15 minutes.

---

## Frequently Asked Questions

**Can I use TaskFlow on my phone?** The web app works on mobile browsers. Native apps are not available yet.

---

## Glossary

- **Board:** the main view showing tasks by status
- **Task:** a single piece of work tracked in TaskFlow
```

## workspace/project.md

```markdown
# Project

## Name

TaskFlow

---

## Description

Web task management API and board UI for small teams.

---

## Development Model

Specification Driven Development

---

## Workflow Methodology

Kanban

---

## Architecture

Clean Architecture

---

## Modeling

Domain Driven Design

---

## Code Organization

Feature First

---

## Language

TypeScript

---

## Framework

Next.js

---

## Backend

Node.js API routes

---

## Frontend

React

---

## Database

PostgreSQL

---

## Assistant

Cursor
```

## Anti-examples

**Incorrect — technical content in user-manual.md:**

```markdown
## Database

PostgreSQL stores all tasks.
```

Belongs in `workspace/project.md`.

**Incorrect — product behavior in project.md:**

```markdown
## Features

Users can assign tasks to teammates.
```

Belongs in `workspace/user-manual.md`.

**Incorrect — domains in user-manual.md:**

```markdown
## Domains

- Task
- User
```

Domains are defined in **sdd-spec**, not in the user manual.

**Incorrect — API details in user-manual.md:**

```markdown
## API

POST /tasks creates a new task.
```

Never include APIs in the user manual.

# EXAMPLES — sdd-idea

Valid examples of `workspace/product-guide.md` and `workspace/project.md`.

## workspace/product-guide.md

```markdown
# Product Guide

> Este documento explica el producto desde el punto de vista del usuario.
>
> Su objetivo es que cualquier persona pueda comprender qué hace el producto, cómo funciona y cómo utilizar cada una de sus funcionalidades sin necesidad de conocimientos técnicos.
>
> Este documento debe mantenerse siempre actualizado y reflejar fielmente el comportamiento del producto.
>
> Cada modificación funcional realizada sobre el producto deberá actualizar también este documento.

## Crear cuenta

El usuario llega a TaskFlow para organizar el trabajo de su equipo. En esta pantalla puede registrarse con correo y contraseña o continuar con Google.

Ve un formulario con nombre, correo y contraseña, o el botón "Continuar con Google".

Si completa el registro con correo, recibe un mensaje de confirmación y pasa a **Verificar correo**. Si usa Google, salta directamente a **Pantalla de bienvenida**.

---

## Verificar correo

El usuario abre el enlace recibido por correo. La pantalla confirma que su cuenta quedó activa y ofrece un botón para continuar.

Al continuar, llega a **Pantalla de bienvenida**.

---

## Pantalla de bienvenida

El usuario ve un resumen breve de TaskFlow y un botón para comenzar el recorrido guiado.

Al pulsar "Comenzar", pasa a **Onboarding**.

---

## Onboarding

El usuario recorre tres pasos cortos: crear el primer tablero, invitar a un compañero y crear la primera tarea.

Al finalizar, llega al **Dashboard**.

---

## Dashboard

El usuario ve sus tableros y tareas pendientes. Desde aquí puede abrir un tablero, crear una tarea o invitar colaboradores.

La experiencia habitual continúa en **Gestionar tareas en el tablero**.

---

## Gestionar tareas en el tablero

El usuario mueve tarjetas entre columnas (Por hacer, En progreso, Hecho) y asigna responsables.

Cuando cambia el estado de una tarea, los involucrados reciben una notificación.
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

**Incorrect — technical content in product-guide.md:**

```markdown
## Dashboard

Los datos se almacenan en PostgreSQL y se sirven vía API REST.
```

Belongs in `workspace/project.md`.

**Incorrect — product journey in project.md:**

```markdown
## Architecture

Users move tasks between columns on the board.
```

Belongs in `workspace/product-guide.md`.

**Incorrect — domains in product-guide.md:**

```markdown
## Dominio Task

Las tareas tienen estados y asignados.
```

Domains belong in **sdd-spec**, not in the product guide.

**Incorrect — feature-list structure instead of journey:**

```markdown
## Features

- Create tasks
- Assign users
- Board view
```

Organize by user experiences in journey order, not feature lists.

**Incorrect — API details:**

```markdown
## Crear cuenta

POST /auth/register crea la cuenta.
```

Never include APIs in the product guide.

# EXAMPLES — sdd-idea

Valid examples of the Brief under `.workspace/brief/`.

## .workspace/brief/business/product-principles.md

```markdown
# Product Principles

> Este documento define los principios conceptuales sobre los que está construido el producto.
>
> Su objetivo es que cualquier diseñador, desarrollador o IA comprenda qué representa el producto, cuál es su unidad central y qué ideas no deben romperse al evolucionar el producto.
>
> Este documento no describe pantallas, recorridos ni implementación técnica.

## Qué representa el producto

TaskFlow es un espacio de trabajo compartido donde los equipos convierten intención en trabajo visible y terminado. No es un gestor de documentos ni un chat de equipo: su propósito es hacer explícito qué hay que hacer, quién lo hace y en qué estado está.

---

## Unidad principal

La **tarea** es la unidad central. Todo lo demás — tableros, columnas, miembros, notificaciones — existe para dar contexto, orden o visibilidad a las tareas.

---

## Conceptos inmutables

- **Tablero:** contenedor de trabajo de un equipo o proyecto; no se mezcla trabajo de contextos distintos en el mismo tablero sin decisión explícita del usuario.
- **Tarea:** unidad atómica de trabajo con responsable, estado y historial.
- **Miembro:** persona con acceso a un tablero; los permisos siempre se expresan en términos de tablero y tarea.

---

## Cómo entiende el producto el negocio

El valor está en la claridad operativa: menos reuniones de sincronización, menos trabajo perdido en mensajes dispersos. El producto prioriza equipos pequeños que necesitan velocidad sin burocracia.

---

## Principios para futuras funcionalidades

- Toda funcionalidad debe poder explicarse como efecto sobre tareas, tableros o miembros.
- No introducir conceptos paralelos que compitan con la tarea como unidad de trabajo.
- La visibilidad por defecto es del equipo del tablero; la privacidad es excepción explícita.
- Las automatizaciones deben preservar el historial y la responsabilidad de cada tarea.

---

## Modelo mental compartido

Antes de diseñar o implementar, asumir: "Los usuarios organizan trabajo en tableros; el progreso real se mide en tareas que avanzan de estado; las notificaciones informan cambios en tareas, no conversaciones genéricas."
```

## .workspace/brief/business/product-guide.md

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

## .workspace/brief/technical/development.md

```markdown
# Development

> ¿Cómo desarrollaremos este producto?

## Development Model

Specification Driven Development

---

## Workflow Methodology

Kanban

---

## Repository Strategy

Monorepo

---

## Code Organization

Feature First

---

## Development Conventions

Conventional commits; SDD review before merge
```

## .workspace/brief/technical/modeling.md

```markdown
# Modeling

> ¿Cómo modelaremos el negocio?

## Domain Driven Design

Tactical DDD

---

## Bounded Context

Task management

---

## Aggregates

Board, Task

---

## Ubiquitous Language

Board, Task, Column, Member

---

## Modeling Principles

Clean Architecture as structural guide
```

## .workspace/brief/technical/stack/backend.md

```markdown
# Backend Stack

> ¿Qué tecnologías utilizaremos para construir el backend?

## Technologies

Node.js API routes, TypeScript

---

## Rationale

Aligns with Next.js full-stack choice
```

## Anti-examples

**Incorrect — user journey in product-principles.md:**

```markdown
## Unidad principal

El usuario crea una cuenta y luego ve el dashboard.
```

Belongs in `.workspace/brief/business/product-guide.md`.

**Incorrect — principles duplicated as narrative in product-guide.md:**

```markdown
## Dashboard

TaskFlow es un espacio de trabajo compartido donde los equipos convierten intención en trabajo visible.
```

Belongs in `.workspace/brief/business/product-principles.md` (conceptual); the guide should describe what the user sees and does.

**Incorrect — technical content in product-principles.md:**

```markdown
## Conceptos inmutables

Las tareas se persisten en PostgreSQL.
```

Belongs in `.workspace/brief/technical/stack/database.md`.

**Incorrect — technical content in product-guide.md:**

```markdown
## Dashboard

Los datos se almacenan en PostgreSQL y se sirven vía API REST.
```

Belongs in `.workspace/brief/technical/stack/database.md`.

**Incorrect — product journey in development.md:**

```markdown
## Architecture

Users move tasks between columns on the board.
```

Belongs in `.workspace/brief/business/product-guide.md`.

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

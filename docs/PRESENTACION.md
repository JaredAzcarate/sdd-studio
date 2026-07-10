# SDD Studio — Guía de presentación

Documento de referencia para presentar la solución a equipos de producto y desarrollo. Explica el **por qué** del modelado, el versionado, las skills, el workflow y las secciones de configure.

**Versión del producto:** 0.7.0 (versión de prueba / early access)

## Slogan

> **SDD Studio — Knowledge Workspace for AI Development**

*El espacio donde el equipo y la IA comparten el mismo conocimiento del producto.*

SDD Studio no es un framework ni un generador de código: es un **knowledge workspace** — un lugar único donde vive todo lo que la IA necesita para respetar el producto, las decisiones técnicas y los patrones del equipo.

---

## Audiencia

SDD Studio está pensado para **product designers** y **developers** que trabajan juntos (o con IA) en productos web, mobile-native o híbridos.

| Rol | Qué obtiene |
| --- | --- |
| **Product designer** | Un lenguaje compartido para describir el producto (`product-guide.md`), principios que guían decisiones de UX y evolución del producto |
| **Developer** | Contrato técnico transversal (patterns, stack, spec por dominios) antes de escribir código en `src/` |
| **Ambos** | Misma fuente de verdad en `.workspace/`, skills con alcance acotado y validadores que reducen desalineación |

No está orientado a productos cuya superficie principal sea solo terminal o CLI.

---

## Origen — por qué existe esto

Narrativa personal para abrir la charla (Acto 0, ~3 min).

Llevo años desarrollando aplicaciones en **React**, cada vez más apoyado en **IA** para ir más rápido. Eso funciona… hasta que no.

Cada sesión nueva, cada modelo mejor, el asistente vuelve a “olvidar” cómo queremos que respondan las APIs, cómo manejamos loading y errores, cómo nombramos cosas, qué es el producto y qué no. **Hoy sigo renegando con lo mismo:** repetir contexto, corregir desvíos, re-explicar patrones.

A medida que la IA mejora, uso más IA — y la necesidad de **configuraciones técnicas agnósticas del stack concreto** pero **obligatorias para el equipo** se vuelve más urgente, no menos. No alcanza con “ser bueno pidiendo cosas al chat”. Hace falta un **contrato persistente** que diseñadores, desarrolladores y agentes lean igual.

SDD Studio nace de esa fricción real: no de una teoría de documentación, sino de días en los que la IA aceleraba el código pero **ralentizaba la coherencia**.

**Puente al problema:** el problema no es que la IA sea mala. Es que **no tiene dónde leer el contrato** del proyecto.

---

## Estado actual y feedback

SDD Studio se encuentra en **versión de prueba**. El flujo greenfield está documentado y operativo; el camino brownfield y algunas validaciones avanzadas siguen en evolución.

**Todo tipo de feedback aporta valor:** fricción en configure, preguntas confusas, handoffs entre skills, calidad de la spec generada, gaps en la documentación o ideas de patrones. Reportar lo que no encaja ayuda a priorizar mejoras reales.

---

## Mensaje central

> La IA sin contrato inventa el producto.

Sin estructura, el asistente mezcla producto, arquitectura, APIs y tareas en el mismo chat. El código aparece antes de acordar **qué** es el producto y **cómo** debe comportarse.

SDD Studio **no es un generador de código**. Es **infraestructura de conocimiento** para que humanos e IA trabajen con el mismo contrato.

> *"The CLI prepares your folder structure and assistant-specific SDD skills. The intelligence lives in the skills — not in this tool."*

---

## Estructura sugerida de la presentación (30–45 min)

### Acto 0 — Origen y motivación (3 min)

**Título:** *De React + IA a un knowledge workspace*

- Experiencia desarrollando con IA: velocidad sí, coherencia no siempre.
- La necesidad crece a medida que los modelos mejoran.
- SDD Studio como respuesta a la fricción diaria (“seguir renegando”).

### Acto 1 — El problema (5–7 min)

**Título:** *La IA sin contrato inventa el producto*

- Sin estructura, producto + arquitectura + APIs + tareas viven en el mismo hilo.
- El código se genera antes de fijar comportamiento y decisiones.
- SDD Studio prepara carpetas y skills; la inteligencia vive en las skills, no en el CLI.

### Acto 2 — El modelo mental (15–20 min)

**Título:** *Cada carpeta responde una pregunta distinta*

### Acto 3 — Demo narrada (10–15 min)

**Título:** *Greenfield en 7 pasos*

Recorrer el flujo con un proyecto temporal (ver [LOCAL.md](./LOCAL.md)).

---

## El ciclo SDD

```text
Idea → Brief → Specification → Planning → Implementation → Code
```

Cada etapa responde una pregunta distinta. No se mezclan responsabilidades.

| Capa | Pregunta | Quién la llena |
| --- | --- | --- |
| **Brief / business** | ¿Qué producto queremos? | **sdd-idea** |
| **Brief / technical** | ¿Cómo decidimos construirlo? | **configure** + **sdd-technical** |
| **Spec** | ¿Cómo está especificado el sistema? | **sdd-spec** |
| **Workflow** | ¿Cómo organizamos el trabajo? | **configure-workflow** + **sdd-plan** |
| **Código** | Implementación | Desarrollo + agente (fuera del alcance del CLI) |

---

## Mapa de `.workspace/`

| Ubicación | Pregunta que responde |
| --- | --- |
| `.workspace/brief/business/product-principles.md` | ¿Sobre qué principios conceptuales está construido el producto? |
| `.workspace/brief/business/product-guide.md` | ¿Cómo funciona el producto para un usuario? |
| `.workspace/brief/technical/engineering-*.md` | ¿Qué decisiones y patrones guían la ingeniería? |
| `.workspace/spec/business/` + `.workspace/spec/technical/` | ¿Cómo está modelado y especificado cada dominio? |
| `.workspace/workflow/` | ¿Cómo planificamos releases y tareas? |

Ver también la regla de workspace en `.cursor/rules/sdd-studio.mdc` para el mapa completo de fuentes de verdad. Árbol detallado en [ARQUITECTURA-WORKSPACE.md](./ARQUITECTURA-WORKSPACE.md).

---

## Qué es el Brief (para quien no viene de agencia)

En agencias y estudios, el **brief** es el documento donde se levantan las necesidades del **cliente** antes de diseñar o construir.

En SDD Studio hacemos lo mismo, pero el “cliente” es **el producto**:

| Brief | Pregunta | Archivos principales |
| --- | --- | --- |
| **Business** | ¿Qué producto queremos? | `product-principles.md`, `product-guide.md` |
| **Technical** | ¿Cómo decidimos construirlo? | `engineering-*.md`, `engineering-stack.md` |

No es spec todavía. Es **contexto acordado** antes de especificar dominios y antes de implementar en `src/`.

**Analogía en una frase:** *el brief responde “qué queremos y bajo qué reglas”; la spec responde “cómo está definido el sistema”.*

---

## Dónde vive el knowledge workspace

SDD Studio está pensado para que el **espacio de trabajo completo** viva en **un solo lugar**: la IA necesita el **mayor contexto posible** (brief, spec, workflow, código, agentes).

### Opción A — Monorepo (caso simple)

Ideal cuando front, back y paquetes compartidos ya conviven en un solo repositorio.

```text
mi-producto/
├── .workspace/          # brief, spec, workflow
├── .cursor/             # skills, rules, agentes
├── apps/web/
├── apps/api/
└── packages/shared/
```

### Opción B — Repo orquestador + submódulos (repos separados)

Cuando **project-A** (front), **project-B** (back) y **project-C** (mobile, design system, etc.) viven en repos distintos, la sugerencia es crear un repositorio **`workspace`** (orquestador) que:

- Monta los repos de producto como **submódulos** (o equivalente).
- Concentra **todo lo del método SDD**: `.workspace/`, skills, rules, agentes.
- Separa **producto** (código en cada submódulo) de **espacio de trabajo** (cómo desarrollamos con IA).

```text
mi-workspace/                    # Knowledge workspace — SDD Studio vive acá
├── .workspace/
│   ├── brief/
│   ├── spec/
│   └── workflow/
├── .cursor/                     # skills, rules, agentes
├── project-a/    → submodule    # frontend
├── project-b/    → submodule    # backend
└── project-c/    → submodule    # mobile, etc.
```

| Idea | Por qué importa |
| --- | --- |
| **Contexto completo para la IA** | Brief + spec + código accesibles en el mismo árbol de trabajo |
| **Producto ≠ espacio de trabajo** | En `project-A` vive el código; en `workspace` viven decisiones, spec, agentes y planificación |
| **Un solo hub del equipo** | No mezclar documentación de método con el repo que solo despliega la API |

Esta opción está alineada con **Orchestrator repo + independent repos** en `sdd-studio configure` y con el flujo brownfield de **sdd-generate** (explorar código en el submódulo, no en la raíz del orquestador).

### Cuándo usar cada patrón

| Situación | Recomendación |
| --- | --- |
| Front + back en un monorepo | `.workspace/` en la raíz del monorepo |
| Front y back en repos distintos | Repo `*-workspace` + submódulos |
| Un producto, un repo greenfield | Todo junto (caso típico de demo) |

**Nota honesta:** los submódulos añaden fricción operativa (clone, update, permisos). No es “siempre submódulos”; es **si ya tenés repos separados, no renuncies al contexto completo de la IA** — centralizá el workspace.

---

## Por qué el modelado actual

### Separación Brief vs Spec vs Workflow

| Artefacto | Rol | Contenido típico |
| --- | --- | --- |
| **Brief** | Contexto y decisiones | Narrativa de producto, principios, arquitectura acordada |
| **Spec** | Definición formal | Dominios, reglas, flujos, APIs, UI por dominio |
| **Workflow** | Ejecución | Roadmap, milestones, releases, `TASK-NNN` |

### El dominio ya no vive en el Brief

**Antes:** el modelado de dominio podía quedar en `engineering-modeling.md` dentro del brief técnico, duplicando o confundiendo contexto con especificación.

**Ahora (greenfield):**

| Qué | Dónde | Quién |
| --- | --- | --- |
| Narrativa funcional del producto | `product-guide.md` | **sdd-idea** |
| Enfoque de modelado (DDD, CRUD, etc.) | **Business Modeling** en `engineering-decisions.md` | **configure** |
| Dominios, reglas, APIs, UI | `spec/business/` + `spec/technical/` | **sdd-spec** |

**Mensaje para la audiencia:** *el brief define decisiones; la spec define el sistema.*

`engineering-modeling.md` solo tiene sentido como contexto legacy en proyectos brownfield migrados, no como paso obligatorio en greenfield.

---

## Por qué el versionado (`manifest.yaml`)

El brief versionado vive en `.workspace/brief/manifest.yaml` con carpetas semver (`0.1.0/`, etc.).

| Concepto | Significado |
| --- | --- |
| `business.current` / `technical.current` | Versión activa que leen las skills |
| `target` | Borrador de refactor sin romper lo vigente |
| `archived` | Historial de versiones anteriores |
| `spec.aligned_with` | La spec declara con qué versión del brief fue generada |

### Por qué importa

1. **Evolución controlada** — Puedes cambiar producto o arquitectura sin perder trazabilidad.
2. **Resolución explícita para la IA** — Las skills leen `manifest.yaml` y resuelven la carpeta correcta; no asumen rutas planas.
3. **Alineación spec ↔ brief** — Si el brief cambia, puedes ver si la spec sigue alineada o necesita regeneración.

**Analogía útil:** *control de versiones para el conocimiento del producto*, no solo para el código.

---

## Por qué las skills

Cada skill tiene **alcance acotado** y **prohibiciones explícitas**. Eso reduce alucinaciones y evita que un agente “haga de todo”.

| Skill / comando | Escribe | No toca |
| --- | --- | --- |
| **sdd-studio configure** | Engineering Brief (principles, decisions, conventions, patterns) | Producto, spec, workflow |
| **sdd-idea** | Business Brief | Spec, engineering, workflow |
| **sdd-technical** | `engineering-stack.md` | Spec, workflow |
| **sdd-find-skills** | — (instala skills externas con aprobación) | Brief, spec, workflow |
| **sdd-spec** | Spec completa por dominios | Brief, workflow, `src/` |
| **configure-workflow** | Config de metodología y convenciones de tareas | Brief, spec |
| **sdd-plan** | Roadmap, milestones, releases, tasks | Brief, spec |
| **sdd-review** | Análisis de alineación brief/spec | Workflow |
| **sdd-generate** | Alineación brownfield (con aprobación) | Implementación directa |

Las skills se sincronizan al proyecto con `sdd-studio init --assistant cursor` (u otro asistente soportado). Se invocan en el chat (`/sdd-idea`, `/sdd-spec`, etc.).

**Mensaje:** *un agente, un trabajo, un output verificable.*

### sdd-find-skills (opcional)

Tras confirmar el stack, **sdd-find-skills** conecta el Engineering Brief con el ecosistema abierto de skills (`npx skills`, skills.sh):

- Lee stack (`engineering-stack.md`) y **estrategias** (decisiones y patrones de configure).
- Busca skills por señal — **sin catálogo fijo** en SDD Studio.
- Presenta una tabla (Stack vs Strategy) y permite excluir filas antes de instalar.
- Instala solo con confirmación explícita del usuario.

Omitir si el equipo ya tiene sus propias skills o agentes.

---

## Por qué el workflow (separado de la spec)

| Capa | Pregunta |
| --- | --- |
| **Spec** | ¿Qué hay que construir? (dominios, reglas, APIs, pantallas) |
| **Workflow** | ¿Cómo lo ejecutamos? (Kanban/Scrum, IDs `TASK-NNN`, releases) |

**configure-workflow** captura:

- **methodology** — Cómo organiza el equipo el trabajo (p. ej. Kanban vs Scrum).
- **task-conventions** — Formato de tareas, prefijos, convenciones de PR vinculadas a tareas.

**sdd-plan** deriva roadmap, milestones y releases desde la spec ya generada.

Si el equipo usa Linear, GitHub Issues u otra herramienta externa, puede omitir el workflow SDD y conservar la spec como contrato.

---

## Por qué las secciones de `configure`

Agrupa las seis secciones en **tres niveles de decisión** (más fácil de explicar que seis archivos sueltos):

### 1. Principles — *qué clase de sistema es*

Archivo: `engineering-principles.md`

- Tipo de producto (aplicación vs plataforma).
- Superficies (web, mobile-native, híbrido).
- Estrategia de backend, datos, etc.
- **Sin tecnologías concretas** — describe hacia dónde va el sistema, no con qué librerías.

### 2. Decisions — *cómo se estructura*

Archivo: `engineering-decisions.md`

- Organización de repositorios (monorepo vs repos independientes).
- **Business Modeling** (DDD, CRUD, event-driven…).
- Autenticación, testing, observabilidad, organización del código.
- Aún mayormente agnóstico de stack; fija la forma del sistema.

### 3. Conventions — *cómo escribe el equipo*

Archivo: `engineering-conventions.md`

- Naming, documentación, consistencia de UX a nivel de equipo.
- Prácticas compartidas que aplican a todo el código.

### 4. Patterns — *contrato transversal por feature*

| Archivo | Qué fija |
| --- | --- |
| `engineering-frontend-patterns.md` | Estados async, loading, notificaciones, filtros |
| `engineering-backend-patterns.md` | Envelope de respuesta, errores, paginación |
| `engineering-contribution-patterns.md` | Branches, PRs, promoción entre entornos |

**Mensaje:** *configure no elige React ni Postgres; define las reglas del juego antes de que **sdd-technical** elija el stack y **sdd-spec** genere APIs y UI alineadas.*

Los archivos bajo `brief/technical/` deben alinearse con los patrones en `spec/technical/*-api.md` y `*-ui.md`.

---

## Flujo greenfield (referencia para demo)

Orden canónico documentado en [FLOW-GREENFIELD.md](./FLOW-GREENFIELD.md) y [README.md](../README.md):

| Paso | Skill / comando | Propósito |
| --- | --- | --- |
| 0 | `sdd-studio init` o TUI *Create brief scaffold* | Stubs del Brief + skills del asistente |
| 1 | `sdd-studio configure` | Engineering Brief |
| 2 | **sdd-idea** | Business Brief |
| 3 | **sdd-technical** | `engineering-stack.md` |
| 3b | **sdd-find-skills** *(opcional)* | Skills de implementación según stack y estrategias |
| 4 | TUI *Create spec scaffold* o `init --spec` | Carpetas vacías en `spec/` |
| 5 | **sdd-spec** | Archivos de dominio en `spec/` |
| 6 | `sdd-studio configure-workflow` | Metodología y convenciones de tareas |
| 7 | **sdd-plan** | Roadmap, milestones, releases |

**Flexible:** puedes empezar con **sdd-idea** antes del paso 1; cuando el producto esté claro, ejecuta **configure** y luego **sdd-technical**.

En cada paso de la demo, di una frase: *"Ahora respondemos la pregunta X; el output va en Y."*

---

## Qué se espera de un producto greenfield

En greenfield, el “documento que cuenta la app que el usuario quiere desarrollar” **no es un PDF suelto ni un README del repo**. Es el **Business Brief** bajo `.workspace/brief/business/<versión>/`, generado con la skill **sdd-idea** a partir de una conversación de descubrimiento.

Consta de **dos archivos complementarios**:

### 1. `product-principles.md` — Los cimientos conceptuales

**Pregunta:** ¿Sobre qué principios conceptuales está construido el producto?

**Para quién:** Diseñador, desarrollador o IA que necesite entender *qué representa* el producto sin entrar en pantallas ni código.

**Secciones obligatorias (en este orden):**

1. **Qué representa el producto** — Qué es y qué no es.
2. **Unidad principal** — El concepto central (ej. tarea, pedido, espacio de trabajo).
3. **Conceptos inmutables** — Ideas que no deben romperse al evolucionar.
4. **Cómo entiende el producto el negocio** — Valor, modelo mental del negocio.
5. **Principios para futuras funcionalidades** — Reglas para decidir si algo encaja.
6. **Modelo mental compartido** — Lenguaje común entre diseño, desarrollo e IA.

**No incluye:** pantallas, recorridos de usuario, APIs, stack, dominios DDD, tareas.

### 2. `product-guide.md` — La app contada desde el usuario

**Pregunta:** ¿Cómo funciona el producto para un usuario?

**Para quién:** Cualquier persona que necesite entender el producto en lenguaje **no técnico**.

**Formato:**

- Recorrido continuo del usuario, **un H2 por experiencia** (ej. *Crear cuenta*, *Verificar correo*, *Dashboard*).
- Experiencias separadas con `---`.
- En cada experiencia: qué ve el usuario, qué hace, a dónde va después.

**No incluye:** APIs, stack, arquitectura, listas de features sueltas, principios (van en `product-principles.md`), dominios ni spec.

**Es la fuente de verdad funcional** que **sdd-spec** transforma en dominios estructurados. La spec **no debe inventar** funcionalidad que no esté en el Product Guide.

### Checklist rápido antes de pasar a spec

- [ ] ¿Un diseñador entiende el producto leyendo solo `product-guide.md`?
- [ ] ¿Un desarrollador entiende los límites conceptuales con `product-principles.md`?
- [ ] ¿Hay `TODO:` marcados donde aún hay incertidumbre? (válido en versión de prueba)
- [ ] ¿Se evitó mezclar decisiones técnicas en el business brief?

### Qué **no** es parte del documento de producto greenfield

| Contenido | Dónde va | Cuándo |
| --- | --- | --- |
| Stack (React, DB, hosting…) | `engineering-stack.md` | **sdd-technical** |
| Patrones API/UI | `engineering-*-patterns.md` | **configure** |
| Dominios, reglas, endpoints | `spec/` | **sdd-spec** |
| MVP, Beta, releases | `workflow/` | **sdd-plan** |

Beta, trial o “versión 1.0” del **producto comercial** se planifican como **milestones** en workflow, no como secciones del Product Guide.

---

## Validación y contrato verificable

SDD Studio no es solo documentación bonita:

- Scripts de validación de spec y workflow (invocados desde las skills).
- Patrones del brief técnico que deben reflejarse en `*-api.md` y `*-ui.md`.
- `manifest.yaml` para saber qué versión del brief está activa.

Útil para audiencia técnica: mostrar un dominio completo en `spec/` (ej. `task`) y cómo hereda los patterns del engineering brief.

---

## Diapositivas sugeridas (15–18 slides)

0. Título + slogan (*Knowledge Workspace for AI Development*)
1. Origen: React, IA y “seguir renegando”
2. Problema: IA sin contrato
3. Qué es el Brief (analogía agencia → producto)
4. Dónde vive: monorepo vs repo orquestador
5. Audiencia: product designers + developers
6. Estado: versión de prueba — feedback bienvenido
7. Ciclo SDD (Idea → Code)
8. Mapa `.workspace/` (una pregunta por carpeta)
9. Brief vs Spec vs Workflow
10. Por qué el dominio vive en spec
11. `manifest.yaml`: current / target / aligned_with
12. Skills: división del trabajo
13. Configure: principles → decisions → conventions → patterns
14. Qué se espera en greenfield (`product-principles` + `product-guide`)
15. Flujo greenfield (tabla de pasos)
16. Demo / capturas / video
17. Qué NO hace SDD Studio (no genera `src/`)
18. Cómo empezar (`npx sdd-studio`, [LOCAL.md](./LOCAL.md))

---

## Mensajes elevator pitch

| Audiencia | Mensaje |
| --- | --- |
| **General** | SDD Studio — *Knowledge Workspace for AI Development*: brief, spec, patrones y agentes en un solo lugar para que la IA deje de inventar. |
| **Origen (30 s)** | Desarrollo en React con IA hace años. La IA va más rápido, pero sin contrato compartido sigo corrigiendo APIs, UI y contexto perdido. SDD Studio es el workspace donde el equipo y la IA leen las mismas reglas. |
| **Developers** | Spec primero, código después; cada skill con un solo trabajo. Monorepo o repo orquestador con submódulos — el contexto completo importa. |
| **Product designers** | El Product Guide es la historia del usuario; la spec y el código derivan de ahí. El brief es como el documento de necesidades del producto. |
| **Arquitectura** | Configure fija decisiones y patrones; el stack viene después y la spec los aplica. Repo orquestador cuando front y back ya están separados. |

---

## Qué NO hace SDD Studio

- No genera código de aplicación en `src/`.
- No sustituye herramientas de gestión (Linear, Jira) si el equipo no quiere usar workflow SDD.
- No reemplaza el juicio humano en discovery — **sdd-idea** facilita y estructura la conversación.
- No garantiza spec perfecta en un solo pase; la versión de prueba asume iteración y feedback.

---

## Recursos relacionados

| Documento | Contenido |
| --- | --- |
| [ARQUITECTURA-WORKSPACE.md](./ARQUITECTURA-WORKSPACE.md) | Árbol completo de archivos y carpetas |
| [FLOW-GREENFIELD.md](./FLOW-GREENFIELD.md) | Flujo greenfield paso a paso (TUI + skills) |
| [FLOW-BROWNFIELD.md](./FLOW-BROWNFIELD.md) | Proyectos con código existente |
| [SKILLS.md](./SKILLS.md) | Catálogo de skills |
| [LOCAL.md](./LOCAL.md) | Pruebas locales y demo |
| [README.md](../README.md) | Instalación, CLI y tabla de skills |

---

## Slide de título (ejemplo)

```text
SDD Studio
Knowledge Workspace for AI Development

El espacio donde brief, spec, patrones y agentes
dan a la IA el contexto completo del producto.

v0.7.0 — versión de prueba — tu feedback cuenta
```

---

## Cierre sugerido para la presentación

1. Mostrar `.workspace/brief/manifest.yaml` y una versión del business brief.
2. Mostrar un dominio en `spec/` generado desde el Product Guide.
3. Invitar a probar con un proyecto real o temporal.
4. Pedir feedback explícito: qué confundió, qué faltó, qué sobró.

*SDD Studio está en evolución. Cada equipo que lo prueba en un greenfield real ayuda a afilar el modelo, las preguntas de configure y la calidad de las skills.*

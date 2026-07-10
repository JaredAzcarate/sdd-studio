# SDD Studio — Guía de presentación

Documento de referencia para presentar la solución a equipos de producto y desarrollo. Explica el **por qué** del modelado, el versionado, las skills, el workflow y las secciones de configure.

**Versión del producto:** 0.7.0 (versión de prueba / early access)

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

Ver también la regla de workspace en `.cursor/rules/sdd-studio.mdc` para el mapa completo de fuentes de verdad.

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

## Diapositivas sugeridas (12–15 slides)

1. Problema: IA sin contrato
2. Audiencia: product designers + developers
3. Estado: versión de prueba — feedback bienvenido
4. Ciclo SDD (Idea → Code)
5. Mapa `.workspace/` (una pregunta por carpeta)
6. Brief vs Spec vs Workflow
7. Por qué el dominio vive en spec
8. `manifest.yaml`: current / target / aligned_with
9. Skills: división del trabajo
10. Configure: principles → decisions → conventions → patterns
11. Qué se espera en greenfield (`product-principles` + `product-guide`)
12. Flujo greenfield (tabla de pasos)
13. Demo / capturas / video
14. Qué NO hace SDD Studio (no genera `src/`)
15. Cómo empezar (`npx sdd-studio`, [LOCAL.md](./LOCAL.md))

---

## Mensajes elevator pitch

| Audiencia | Mensaje |
| --- | --- |
| **General** | SDD Studio convierte el desarrollo con IA en un pipeline de documentos versionados que la IA puede leer y respetar. |
| **Developers** | Spec primero, código después; cada skill con un solo trabajo. |
| **Product designers** | El Product Guide es la historia del usuario; la spec y el código derivan de ahí. |
| **Arquitectura** | Configure fija decisiones y patrones; el stack viene después y la spec los aplica. |

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
| [FLOW-GREENFIELD.md](./FLOW-GREENFIELD.md) | Flujo greenfield paso a paso (TUI + skills) |
| [FLOW-BROWNFIELD.md](./FLOW-BROWNFIELD.md) | Proyectos con código existente |
| [SKILLS.md](./SKILLS.md) | Catálogo de skills |
| [LOCAL.md](./LOCAL.md) | Pruebas locales y demo |
| [README.md](../README.md) | Instalación, CLI y tabla de skills |

---

## Cierre sugerido para la presentación

1. Mostrar `.workspace/brief/manifest.yaml` y una versión del business brief.
2. Mostrar un dominio en `spec/` generado desde el Product Guide.
3. Invitar a probar con un proyecto real o temporal.
4. Pedir feedback explícito: qué confundió, qué faltó, qué sobró.

*SDD Studio está en evolución. Cada equipo que lo prueba en un greenfield real ayuda a afilar el modelo, las preguntas de configure y la calidad de las skills.*

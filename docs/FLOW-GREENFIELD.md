# Flujo Greenfield — SDD Studio

Fuente de verdad del camino feliz para proyectos **greenfield** (sin código existente).

## Convenciones

| Concepto | Valor |
| -------- | ----- |
| CLI | `npx sdd-studio` o `sdd-studio` |
| Init | `sdd-studio init` |
| Configure Engineering | `sdd-studio configure` o menú TUI **Configure Engineering** |
| Configure Workflow | `sdd-studio configure-workflow` |
| Skills | Invocar en el asistente elegido (`/sdd-idea`, skill **sdd-idea**, etc.) |

### Orden canónico de skills

```text
configure → sdd-idea → sdd-technical → [sdd-find-skills] → sdd-spec → [workflow] → sdd-plan
```

**Camino flexible:** puedes empezar por **sdd-idea**. Cuando el producto esté claro, ejecuta **configure** y luego **sdd-technical**.

### Mapa `.workspace/`

| Carpeta | Pregunta |
| ------- | -------- |
| `brief/manifest.yaml` | ¿Qué versión de cada carril está activa? |
| `brief/business/<semver>/` | ¿Qué producto queremos? |
| `brief/technical/<semver>/` | ¿Cómo decidimos construirlo? |
| `spec/business/` + `spec/technical/` | ¿Cómo está especificado? (viva, sin versiones) |
| `workflow/` | ¿Cómo organizamos el trabajo? (después de spec) |

El scaffold inicial crea `manifest.yaml` con `current: "0.1.0"` y carpetas `brief/business/0.1.0/` y `brief/technical/0.1.0/`.

---

## 1. Arranque de la terminal

Al ejecutar `sdd-studio`, la TUI pregunta:

- **Greenfield** — flujo de este documento
- **Brownfield** — ver `FLOW-BROWNFIELD.md`

### Menú principal (Greenfield)

| Opción | Qué hace |
| ------ | -------- |
| **Create brief scaffold** | `manifest.yaml` + stubs versionados + skills del asistente. Sin `spec/`, sin `workflow/` |
| **Create spec scaffold** | Carpetas vacías `spec/business/` y `spec/technical/` |
| **Configure Engineering** | TUI del Engineering Brief (escribe en `brief/technical/<current>/`) |
| **Configure Workflow** | Metodología y convenciones de tareas (tras spec) |
| **Sync Assistant Files** | Actualiza skills del paquete |
| **Exit** | Cierra la TUI |

---

## 2. Foundation — Create brief scaffold

Equivalente a `sdd-studio init` (sin spec ni workflow).

**Genera:**

- `.workspace/brief/manifest.yaml`
- `.workspace/brief/business/0.1.0/` — stubs `product-principles.md`, `product-guide.md`
- `.workspace/brief/technical/0.1.0/` — stubs de engineering (sin stack)
- Skills del asistente (`.cursor/skills/`, etc.)

**No genera:** `spec/`, `workflow/`, `engineering-stack.md`, código de aplicación.

**Next step:** **Configure Engineering** o **sdd-idea** (si prefieres empezar por producto).

---

## 3. Configure Engineering

TUI o `sdd-studio configure`.

**Archivos generados (6)** en `brief/technical/<current>/`:

- `engineering-principles.md`
- `engineering-decisions.md`
- `engineering-conventions.md`
- `engineering-frontend-patterns.md`
- `engineering-backend-patterns.md`
- `engineering-contribution-patterns.md`

Flujo: preguntas por sección → resumen → confirmación.

**Next step:** **sdd-idea**

---

## 4. Definición de la idea — sdd-idea

El usuario describe la idea en el chat y ejecuta **sdd-idea**.

**Fases:** descubrimiento → preguntas → confirmación funcional.

**Genera** en `brief/business/<current>/`:

- `product-principles.md`
- `product-guide.md`

**Si empezaste por idea sin configure:** al terminar, mensaje amigable → `sdd-studio configure` → **sdd-technical**.

**Next step:** **sdd-technical** (con Engineering Brief completo).

---

## 5. Spec scaffold — Create spec scaffold

En TUI, antes de **sdd-spec**.

**Genera:** carpetas vacías bajo `.workspace/spec/business/` y `.workspace/spec/technical/` (incluye `spec/business/decisions/`).

---

## 6. Diseño técnico — sdd-technical

Lee el Engineering Brief (6 archivos de configure + patterns) desde `brief/technical/<current>/`.

Preguntas por superficie (web, mobile, backend, DB, auth, …) → confirmación → escribe:

- `brief/technical/<current>/engineering-stack.md`

**Next step (opcional):** **sdd-find-skills** — descubrir e instalar skills de implementación del ecosistema abierto según stack y estrategias del Brief. Omitir si ya usas tus propias skills o agentes.

**Next step:** **sdd-spec**

---

## 6b. Skills de implementación — sdd-find-skills (opcional)

Lee `manifest.yaml` y el Engineering Brief técnico confirmado (`engineering-stack.md` + decisiones y patrones de configure).

**No modifica** `.workspace/`. Busca skills en el ecosistema abierto (`npx skills`, https://skills.sh/) — **sin catálogo fijo** en SDD Studio.

**Flujo:**

1. Extrae señales del **stack** (`**Selected:**` en `engineering-stack.md`) y de **estrategias** (decisiones y patrones).
2. Busca y valida skills por señal (instalaciones, fuente, ajuste).
3. Presenta tabla con columnas `Trigger type` (Stack o Strategy), trigger, skill sugerida, installs, source, install command, status.
4. El usuario puede excluir filas; confirma si desea instalar.
5. Instala con `npx skills add <owner/repo@skill> -g -y` solo tras aprobación explícita.

**Next step:** **sdd-spec** o implementación con las skills instaladas.

---

## 7. Especificación — sdd-spec

Lee brief completo (producto + engineering + stack), incluyendo `engineering-*-patterns.md` y **Business Modeling** en `engineering-decisions.md`.

Genera módulos bajo `spec/business/` y `spec/technical/`:

| Business | Technical |
| -------- | --------- |
| domain, relations, capabilities, flows, rules, security, events, **decisions** | api, ui, testing, architecture, database |

El modelado de dominio vive en spec, no en `engineering-modeling.md`. Los ADRs de dominio van en `spec/business/decisions/<domain>-decisions.md`.

**Next step:** selección de proveedor de trabajo.

---

## 8. Workflow — post-spec

La skill o el asistente pregunta con qué workflow trabajar:

| Elección | Acción |
| -------- | ------ |
| **SDD Studio** | `sdd-studio configure-workflow` → metodología (Kanban, Scrum, …) + convenciones → `.workspace/workflow/` |
| **Linear / GitHub Issues / otro** | No instalar workflow SDD; **sdd-plan** sigue disponible |

**Next step:** **sdd-plan**

---

## 9. Planificación — sdd-plan

Lee brief + spec + patrones de tareas del brief técnico (+ workflow config si aplica).

Propuesta → confirmación → genera:

- `workflow/roadmap/`
- `workflow/milestones/`
- `workflow/releases/release-NNN/` (`release.md`, `tasks.md`, `reviews.md`)

**Next step:** implementar la primera tarea con el agente de desarrollo.

---

## 10. Ciclo iterativo (referencia)

| Skill | Cuándo |
| ----- | ------ |
| **sdd-review** | Opcional; validar cambios contra Brief o spec |
| **sdd-find-skills** | Opcional; tras stack confirmado — skills de implementación del ecosistema abierto |
| **sdd-generate** | Brownfield — ver `FLOW-BROWNFIELD.md` |

---

## Diagrama

```mermaid
flowchart LR
  INIT[Foundation] --> CFG[Configure Engineering]
  CFG --> IDEA[sdd-idea]
  IDEA --> TECH[sdd-technical]
  TECH --> FIND{sdd-find-skills?}
  FIND -->|Opcional| SPEC[sdd-spec]
  FIND -->|Omitir| SPEC
  SCAFFOLD[Spec scaffold] --> SPEC
  SPEC --> WF{Workflow?}
  WF -->|SDD Studio| CW[configure-workflow]
  WF -->|Externo| PLAN[sdd-plan]
  CW --> PLAN
```

---

## Fuera de alcance greenfield

- Brownfield (`sdd-generate`, migrate legacy, refactor engineering) — ver `FLOW-BROWNFIELD.md`
- Código de aplicación (`src/`, `tests/`)
- `engineering-modeling.md` — eliminado del flujo; dominio en **sdd-spec**

# Puntos pendientes — SDD Studio

Documento de seguimiento para decisiones y trabajo aún no implementado.  
Relacionado con el trabajo de **Engineering Patterns** y el flujo Configure → `sdd-technical` → spec.

---

## Catálogo Configure (Engineering Patterns)

### Defaults y UX del TUI

- [x] **Multiselect con valores por defecto sensatos** — p. ej. en Async UI States pre-marcar `loading`, `error`, `success`, `empty` en lugar de solo la primera opción.
- [x] **Multiselect en PR Conventions** — definir qué opciones vienen pre-marcadas por defecto (p. ej. `delete-branch-on-merge`).
- [ ] **Validación de combinaciones incoherentes** — detectar y advertir antes de guardar, p. ej.:
  - envelope `flat` + `meta.pagination` en body
  - paginación `offset` en frontend + `embedded-cursor` en backend
  - `no-shared-cache` en frontend + asumir TanStack Query en stack
- [ ] **Revisión final de textos** — ¿alguna pregunta u opción necesita renombrar o más ejemplos?

### Preguntas a evaluar agregar

- [ ] **Sort/order como pregunta explícita** — hoy está implícito en “List filters & sort”; ¿conviene separarlo?
- [ ] **Search en mobile-native** — hoy solo aparece si `target-platforms` incluye `web`; ¿extender a mobile?
- [ ] **Más variantes de branch naming** — p. ej. `feature/TASK-123-slug` como opción dedicada vs Custom.

---

## Integración con skills y spec

### `sdd-spec`

- [x] **Consumir `engineering-*-patterns.md`** al generar `*-api.md` y `*-ui.md` (envelopes, errores, async states, modals, paginación).
- [x] **Bloques globales en STANDARDS** — response shape, pagination meta, validation errors, HTTP status, loading/error/empty en UI.
- [ ] **Extender `validate-spec.mjs`** — referencias o checks mínimos a patrones del brief (opcional, definir alcance).

### `sdd-technical`

- [ ] **Sección Project languages (implementación completa)** — hoy está documentada como “planned” en la skill; falta flujo `AskQuestion` concreto y dónde persistir si el usuario lo pide (¿`engineering-conventions.md`? ¿archivo aparte?).
- [ ] **Usar `component-documentation`** al sugerir Storybook / Ladle / etc. en el stack.
- [ ] **Usar patrones FE/BE** como restricciones al elegir librerías (p. ej. query params → `nuqs`; optimistic → TanStack Query).

### Redistribución de responsabilidades entre skills

- [ ] **Mapa definitivo** — qué hace cada skill con `engineering-*-patterns.md` (generate, review, technical, spec, plan).
- [ ] **Handoff `sdd-generate` → `sdd-technical`** — inventario de stack/patrones detectados en código (sin implementar brownfield aún).

---

## Brownfield y proyectos en producción

> Acordado: **no implementar aún**; requiere análisis del flujo completo greenfield vs brownfield.

- [ ] **Flujo brownfield unificado** — orden y responsables: `init` / `migrate` → `generate` → `configure` → `technical` → `spec` → `review` / `plan`.
- [ ] **Actual vs objetivo** — cómo documentar:
  - **Target** = lo que define Configure (contrato para la IA).
  - **As-is** = lo que existe en código (¿`_inventory/`? ¿reporte de generate?).
  - **Drift** = diff entre ambos sin contaminar el contrato target.
- [ ] **Regla de precedencia en brownfield** — código gana al documentar as-is; target sigue siendo Configure para implementación futura.
- [ ] **Modo `sdd-technical` brownfield** — pre-opción `(Detected)` desde inventario de código (pendiente de diseño).

---

## Alcance del producto

- [x] **Comunicar en README/docs** que SDD Studio apunta a aplicaciones **web, mobile-native e híbridas**, no a productos CLI/terminal como superficie principal (parcialmente en principles + rules).
- [ ] **¿Excluir preguntas de patterns** cuando el brief indica solo API/backend sin UI? — hoy Frontend Patterns es obligatorio; evaluar `showWhen` a nivel sección.

---

## Futuras áreas de patterns (extensibilidad)

Patrón acordado: nuevas secciones bajo **Engineering Patterns** → `engineering-<area>-patterns.md`.

- [ ] **Database Patterns** — migraciones, naming, soft delete, timestamps, etc.
- [ ] **Testing Patterns** — e2e vs integration, fixtures, mocking de API.
- [ ] Otras áreas según uso real del equipo.

---

## Form validation

- [ ] **No duplicar en patterns** — ya existe en **Engineering Decisions** (`validation`: basic / schema-based / business-rules).
- [ ] **Verificar alineación** — que `sdd-spec` y skills referencien `engineering-decisions.md` para validación cliente/servidor, no solo patterns.

---

## PR y release

- [ ] Merge del PR de Engineering Patterns tras revisión final del catálogo.
- [ ] Bump de versión (`package.json`) y notas de release si aplica.
- [ ] `sdd-studio sync` en proyectos que ya usan el paquete para traer skills y rules actualizados.

---

## Referencias

- PR: Engineering Patterns configure — ver repositorio / PR abierto en la rama `cursor/engineering-patterns-config-f97f`.
- Archivos de patterns generados por Configure:
  - `.workspace/brief/technical/engineering-frontend-patterns.md`
  - `.workspace/brief/technical/engineering-backend-patterns.md`
  - `.workspace/brief/technical/engineering-contribution-patterns.md`
  - `.workspace/brief/technical/engineering-conventions.md` (incluye code comments)

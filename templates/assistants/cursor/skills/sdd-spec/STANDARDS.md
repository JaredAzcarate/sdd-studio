# STANDARDS — sdd-spec

Mandatory rules for generating files in `.workspace/spec/business/` and `.workspace/spec/technical/`.

## Principle

Each document answers **one question only**. Never mix categories.

Do not create:

- per-domain folders inside `spec/`
- `index.md`, `README.md`, `map.md`, or alternate names
- tasks, releases, roadmap, milestones, or estimates in `spec/`
- files at the top level of `spec/` (only `business/` and `technical/` allowed)

## Brief-driven technical conventions

Before generating `technical/api/` or `technical/architecture/` files, read:

- `.workspace/brief/technical/development.md` — **Repository Strategy**, **Code Organization** (resolve product code root and domain folder pattern)
- `.workspace/brief/technical/stack/backend.md` — API surface (Server Actions vs Route Handlers vs REST)

| Principle | Rule |
| --------- | ---- |
| Brief over convention | `development.md` wins over default folder names (`src/modules/`, `packages/`) |
| Stack over REST default | API spec format follows `stack/backend.md`, not REST-by-default |
| Polyrepo-aware | Paths in architecture/api docs use resolved code root from Brief |
| Evidence label | Module paths in architecture must match Code Organization in Brief |

Skills **sdd-generate** and **sdd-review** must apply the same rules when inferring or updating technical spec.

## Folder structure

```text
.workspace/spec/

    business/

        domain/

        relations/

        capabilities/

        flows/

        rules/

        security/

        events/

    technical/

        api/

        ui/

        testing/

        architecture/

        database/
```

## Naming convention

For each `<domain>` (kebab-case, lowercase):

| Folder | File |
| ------ | ---- |
| `business/domain/` | `<domain>-domain.md` |
| `business/relations/` | `<domain>-relations.md` |
| `business/capabilities/` | `<domain>-capabilities.md` |
| `business/flows/` | `<domain>-flows.md` |
| `business/rules/` | `<domain>-rules.md` |
| `business/security/` | `<domain>-security.md` |
| `business/events/` | `<domain>-events.md` |
| `technical/api/` | `<domain>-api.md` |
| `technical/ui/` | `<domain>-ui.md` |
| `technical/testing/` | `<domain>-testing.md` |
| `technical/architecture/` | `<domain>-architecture.md` |
| `technical/database/` | `<domain>-database.md` |

Example domain `task`:

```text
business/domain/task-domain.md
business/relations/task-relations.md
business/capabilities/task-capabilities.md
...
technical/api/task-api.md
technical/architecture/task-architecture.md
technical/database/task-database.md
```

## Responsibility per document

| Document | Question | Allowed content |
| -------- | -------- | --------------- |
| domain | What is this domain? | description, purpose, attributes, states, responsibilities |
| relations | What does it relate to? | associations, cardinalities, dependencies, ownership |
| capabilities | What can the system do? | functional capabilities |
| flows | How do processes happen? | business processes (no UI states) |
| rules | What constraints always apply? | business rules |
| security | Who can do what? | permissions, roles, authorization |
| events | What events does it produce? | domain events |
| api | How do other systems interact? | technical contract |
| ui | How does a person interact? | interface behavior (no business rules) |
| testing | How do we verify? | validation scenarios |
| architecture | How is this domain structured? | modules, layers, boundaries, integration points |
| database | How is this domain persisted? | tables, schemas, indexes, constraints |

## Mandatory templates

### `<domain>-domain.md`

```markdown
# [Domain Title]

## Purpose

---

## Description

---

## Attributes

| Attribute | Type | Required | Description |
| --------- | ---- | -------- | ----------- |

---

## States

---

## Responsibilities

---

## Notes
```

### `<domain>-relations.md`

```markdown
# [Domain] Relationships

## Incoming Relations

---

## Outgoing Relations

---

## Cardinality

---

## Ownership

---

## Notes
```

### `<domain>-capabilities.md`

```markdown
# [Domain] Capabilities

## Capability List

### [Capability Name]

Description

Preconditions

Result

---
```

### `<domain>-flows.md`

```markdown
# [Domain] Flows

## Flow: [Flow Name]

### Actor

### Preconditions

### Steps

1.
2.

### Result

---
```

Do not describe UI states.

### `<domain>-rules.md`

```markdown
# [Domain] Rules

## Validation Rules

---

## Business Rules

---

## Lifecycle Rules

---

## Constraints
```

### `<domain>-security.md`

```markdown
# [Domain] Security

## Roles

---

## Permissions

---

## Authorization Rules

---

## Policies
```

### `<domain>-events.md`

```markdown
# [Domain] Events

## Event List

### [Event Name]

Description

Trigger

Consumers

---
```

### `<domain>-api.md`

Use the API surface defined in `brief/technical/stack/backend.md`. Default template below assumes **Server Actions** as primary surface and **Route Handlers** only when HTTP is required (e.g. OAuth, webhooks, external signatures). If the Brief specifies REST-only or another model, follow the Brief instead.

```markdown
# [Domain] API

> Technical contract implemented in the product repo. Primary surface: **Server Actions**. **Route Handlers** only when an HTTP endpoint is required.

## Server Actions

Module: `<resolved-code-root>/domains/<domain>/application/actions/<domain>-actions.ts`

### actionNameInCamelCase

Purpose

Input

Output

Errors

---

## Route Handlers

(Only if needed; otherwise: "None required for this domain in the current scope.")

### METHOD /api/...

Purpose

Input

Output

Errors

---

## Notes

Reference `*-architecture.md`, business capabilities, and `brief/technical/stack/backend.md`.
```

Replace `<resolved-code-root>` with the path from `brief/technical/development.md` (e.g. repo root, `numo-app/`, or monorepo package path). Do not hardcode `src/modules/`.

### `<domain>-ui.md`

```markdown
# [Domain] UI

## Screens

---

## Components

---

## User Actions

---

## Messages

---

## Validations

---

## Navigation
```

Do not document business rules.

### `<domain>-testing.md`

```markdown
# [Domain] Testing

## Acceptance Scenarios

---

## Success Cases

---

## Validation Cases

---

## Error Cases

---

## Edge Cases
```

### `<domain>-architecture.md`

Paths in **Module Structure** must match `brief/technical/development.md` (Code Organization). Use `<resolved-code-root>` and the domain folder pattern documented there.

```markdown
# [Domain] Architecture

## Module Structure

- `<resolved-code-root>/domains/<domain>/domain/` — entities, value objects, invariants
- `<resolved-code-root>/domains/<domain>/application/` — use cases, Server Actions
- `<resolved-code-root>/domains/<domain>/infrastructure/` — persistence, external adapters

---

## Layer Responsibilities

---

## Integration Points

---

## Dependencies

---

## Notes
```

### `<domain>-database.md`

```markdown
# [Domain] Database

## Tables

### [Table Name]

| Column | Type | Required | Description |
| ------ | ---- | -------- | ----------- |

---

## Indexes

---

## Constraints

---

## Migrations

---

## Notes
```

## Format rules

1. Single H1 per document
2. Main sections with H2
3. Do not skip heading levels
4. Use tables only when they represent information better
5. Use lists for rules, states, and permissions
6. Numbered steps only in Flows
7. Separate main sections with `---`
8. Do not duplicate information across documents; reference the corresponding file

## Final principle

Document structure **never** depends on the domain. Only the content changes.

## Validation

After generating or modifying, run:

```bash
node .cursor/skills/sdd-spec/scripts/validate-spec.mjs .workspace/spec
```

Fix all errors before finishing.

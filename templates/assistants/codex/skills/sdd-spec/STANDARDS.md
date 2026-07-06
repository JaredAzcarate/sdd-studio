# STANDARDS — sdd-spec

Mandatory rules for generating files in `.workspace/spec/business/` and `.workspace/spec/technical/`.

## Principle

Each document answers **one question only**. Never mix categories.

Do not create:

- per-domain folders inside `spec/`
- `index.md`, `README.md`, `map.md`, or alternate names
- tasks, releases, roadmap, milestones, or estimates in `spec/`
- files at the top level of `spec/` (only `business/` and `technical/` allowed)

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

```markdown
# [Domain] API

## Endpoints

### [METHOD] [path]

Purpose

Request

Response

Errors

---
```

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

```markdown
# [Domain] Architecture

## Module Structure

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

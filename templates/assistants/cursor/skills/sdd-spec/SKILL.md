---
name: sdd-spec
description: Reads workspace/spec/vision.md, discovers domains through questions, and generates the full specification tree under workspace/spec/ using SDD Studio naming conventions. Use when specifying domains, APIs, flows, or when the user invokes /sdd-spec.
disable-model-invocation: true
---

# SDD Spec

Read the vision, discover domains, and generate the full specification under `workspace/spec/`.

## Required documents

Before generating, read:

- [STANDARDS.md](STANDARDS.md) — naming, folders, and templates
- [EXAMPLES.md](EXAMPLES.md) — complete reference `task` domain

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read `workspace/spec/vision.md` | Modify `workspace/workflow/` |
| Create/update files in `workspace/spec/` | Modify `vision.md` without explicit permission |
| Ask the user questions | Write code in `src/` |
| Run validation script | Generate tasks, releases, or roadmap |

## Pre-execution

1. Read `workspace/spec/vision.md`.
2. Read [STANDARDS.md](STANDARDS.md) and [EXAMPLES.md](EXAMPLES.md).
3. Verify `workspace/spec/vision.md` exists; if not, stop and suggest **sdd-idea**.
4. Inventory existing files in `workspace/spec/`.

## Flow

### Phase 1 — Domain discovery

From `vision.md`, propose candidate domains. Ask:

1. Are the domains correct? Is anything missing or extra?
2. Per domain: purpose, entities, boundaries
3. Relationships between domains
4. If the vision or user indicates DDD: aggregates, invariants, ubiquitous language

Present the domain map for **approval** before writing files.

### Phase 2 — Per-domain discovery

For each approved domain, discover content for the 10 documents (excluding vision):

- domain, relations, capabilities, flows, rules, security, events, api, ui, testing

Ask only what is necessary. One question per document category.

### Phase 3 — Generation

For each `<domain>`, create exactly 10 files:

```text
spec/domain/<domain>-domain.md
spec/relations/<domain>-relations.md
spec/capabilities/<domain>-capabilities.md
spec/flows/<domain>-flows.md
spec/rules/<domain>-rules.md
spec/security/<domain>-security.md
spec/events/<domain>-events.md
spec/api/<domain>-api.md
spec/ui/<domain>-ui.md
spec/testing/<domain>-testing.md
```

Use the exact templates from [STANDARDS.md](STANDARDS.md). See [EXAMPLES.md](EXAMPLES.md) for the `task` domain.

### Phase 4 — Validation

Run the validator from the project root:

```bash
node .cursor/skills/sdd-spec/scripts/validate-spec.mjs workspace/spec
```

If it fails:

1. Read each error
2. Fix only what is indicated
3. Re-run until `OK`

Do not report completion until the script exits with code 0.

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] vision.md read
- [ ] Domains approved by the user
- [ ] 10 files per domain generated
- [ ] validate-spec.mjs passes with no errors
```

## Report

1. Identified domains
2. Files created or updated
3. Open `TODO:` items
4. Next step: **sdd-review** or **sdd-plan**

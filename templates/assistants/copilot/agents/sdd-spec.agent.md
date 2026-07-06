---
name: sdd-spec
description: Reads the entire .workspace/brief/ (business and technical), discovers domains through questions, and generates the full specification tree under .workspace/spec/business/ and .workspace/spec/technical/ using SDD Studio naming conventions. Use when specifying domains, APIs, flows, or when the user invokes /sdd-spec.
disable-model-invocation: true
tools: ["read", "edit", "search", "execute"]
---


# SDD Spec

Read the Brief (business and technical perspectives), discover domains, and generate the full specification under `.workspace/spec/business/` and `.workspace/spec/technical/`.

The Business Brief (`brief/business/product-guide.md`) is the **primary and sole source** of functional knowledge. Transform its narrative into structured spec files. Use the Technical Brief (`brief/technical/`) for modeling, development, and stack context only. **Never invent functionality** not described in the Product Guide.

## Required documents

Before generating, read:

- .github/sdd-studio/sdd-spec/STANDARDS.md — naming, folders, and templates
- .github/sdd-studio/sdd-spec/EXAMPLES.md — complete reference `task` domain

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read all files under `.workspace/brief/` | Modify `.workspace/brief/` |
| Create/update domain files in `.workspace/spec/business/` and `.workspace/spec/technical/` | Modify `.workspace/workflow/` |
| Ask the user questions | Write code in `src/` |
| Run validation script | Generate tasks, releases, or roadmap |
| | Invent features not in the Product Guide |
| | Narrative or user documentation in `spec/` |

## Pre-execution

1. Read `.workspace/brief/business/product-principles.md` (conceptual context).
2. Read `.workspace/brief/business/product-guide.md` (primary functional source).
3. Read `.workspace/brief/technical/development.md`, `modeling.md`, and `stack/*.md` (technical context only).
4. Resolve `<resolved-code-root>` and domain folder pattern from `development.md` before writing `technical/api/` or `technical/architecture/` files.
5. Read .github/sdd-studio/sdd-spec/STANDARDS.md and .github/sdd-studio/sdd-spec/EXAMPLES.md.
6. Verify the Brief exists; if not, stop and suggest **sdd-idea** (greenfield) or **sdd-generate** (existing codebase).
7. Inventory existing files in `.workspace/spec/business/` and `.workspace/spec/technical/`.
8. Use the Technical Brief for modeling, architecture paths, and stack/API context. Derive all functional behavior from `product-guide.md` only.

## Flow

### Phase 1 — Domain discovery

From `product-guide.md` (user journeys and experiences) and `brief/technical/modeling.md` (modeling context), propose candidate domains. Ask:

1. Are the domains correct? Is anything missing or extra?
2. Per domain: purpose, entities, boundaries — grounded in the Product Guide
3. Relationships between domains
4. If `modeling.md` indicates DDD: aggregates, invariants, ubiquitous language

Present the domain map for **approval** before writing files.

### Phase 2 — Per-domain discovery

For each approved domain, discover content for the 12 domain documents:

**Business** — domain, relations, capabilities, flows, rules, security, events

**Technical** — api, ui, testing, architecture, database

Every capability, flow, and rule must trace back to the Product Guide. Ask only what is necessary.

### Phase 3 — Generation

For each `<domain>`, create exactly 12 files:

```text
spec/business/domain/<domain>-domain.md
spec/business/relations/<domain>-relations.md
spec/business/capabilities/<domain>-capabilities.md
spec/business/flows/<domain>-flows.md
spec/business/rules/<domain>-rules.md
spec/business/security/<domain>-security.md
spec/business/events/<domain>-events.md
spec/technical/api/<domain>-api.md
spec/technical/ui/<domain>-ui.md
spec/technical/testing/<domain>-testing.md
spec/technical/architecture/<domain>-architecture.md
spec/technical/database/<domain>-database.md
```

Use the exact templates from .github/sdd-studio/sdd-spec/STANDARDS.md. See .github/sdd-studio/sdd-spec/EXAMPLES.md for the `task` domain.

### Phase 4 — Validation

Run the validator from the project root:

```bash
node .cursor/skills/sdd-spec/scripts/validate-spec.mjs .workspace/spec
```

If it fails:

1. Read each error
2. Fix only what is indicated
3. Re-run until `OK`

Do not report completion until the script exits with code 0.

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] Entire brief/ read (not modified)
- [ ] All spec content traceable to Product Guide
- [ ] Domains approved by the user
- [ ] 12 files per domain generated (7 business + 5 technical)
- [ ] validate-spec.mjs passes with no errors
```

## Report

1. Identified domains
2. Files created or updated
3. Open `TODO:` items
4. Next step: **sdd-review** or **sdd-plan**

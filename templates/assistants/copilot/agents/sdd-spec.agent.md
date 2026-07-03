---
name: sdd-spec
description: Reads .workspace/product-guide.md and .workspace/project.md, discovers domains through questions, and generates the full specification tree under .workspace/spec/ using SDD Studio naming conventions. Use when specifying domains, APIs, flows, or when the user invokes /sdd-spec.
disable-model-invocation: true
tools: ["read", "edit", "search", "execute"]
---


# SDD Spec

Read the Product Guide and project configuration, discover domains, and generate the full technical specification under `.workspace/spec/`.

The Product Guide is the **primary and sole source** of functional knowledge. Transform its narrative into structured spec files. **Never invent functionality** not described in the Product Guide.

## Required documents

Before generating, read:

- .github/sdd-studio/sdd-spec/STANDARDS.md — naming, folders, and templates
- .github/sdd-studio/sdd-spec/EXAMPLES.md — complete reference `task` domain

## Scope

| Allowed | Forbidden |
|---------|-----------|
| Read `.workspace/product-guide.md` and `.workspace/project.md` | Modify `.workspace/workflow/` |
| Create/update domain files in `.workspace/spec/` | Modify `product-guide.md` or `project.md` without explicit permission |
| Ask the user questions | Write code in `src/` |
| Run validation script | Generate tasks, releases, or roadmap |
| | Invent features not in the Product Guide |
| | Narrative or user documentation in `spec/` |

## Pre-execution

1. Read `.workspace/product-guide.md` (primary source).
2. Read `.workspace/project.md` (technical context only).
3. Read .github/sdd-studio/sdd-spec/STANDARDS.md and .github/sdd-studio/sdd-spec/EXAMPLES.md.
4. Verify both files exist; if not, stop and suggest **sdd-idea** (greenfield) or **sdd-generate** (existing codebase).
5. Inventory existing files in `.workspace/spec/`.
6. Use `project.md` for technical context (architecture, DDD, stack). Derive all functional behavior from `product-guide.md` only.

## Flow

### Phase 1 — Domain discovery

From `product-guide.md` (user journeys and experiences) and `project.md` (modeling context), propose candidate domains. Ask:

1. Are the domains correct? Is anything missing or extra?
2. Per domain: purpose, entities, boundaries — grounded in the Product Guide
3. Relationships between domains
4. If `project.md` indicates DDD: aggregates, invariants, ubiquitous language

Present the domain map for **approval** before writing files.

### Phase 2 — Per-domain discovery

For each approved domain, discover content for the 10 domain documents:

- domain, relations, capabilities, flows, rules, security, events, api, ui, testing

Every capability, flow, and rule must trace back to the Product Guide. Ask only what is necessary.

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

Use the exact templates from .github/sdd-studio/sdd-spec/STANDARDS.md. See .github/sdd-studio/sdd-spec/EXAMPLES.md for the `task` domain.

### Phase 4 — Validation

Run the validator from the project root:

```bash
node .github/sdd-studio/sdd-spec/scripts/validate-spec.mjs .workspace/spec
```

If it fails:

1. Read each error
2. Fix only what is indicated
3. Re-run until `OK`

Do not report completion until the script exits with code 0.

## Checklist

```
- [ ] STANDARDS.md and EXAMPLES.md read
- [ ] product-guide.md and project.md read
- [ ] All spec content traceable to Product Guide
- [ ] Domains approved by the user
- [ ] 10 files per domain generated
- [ ] validate-spec.mjs passes with no errors
```

## Report

1. Identified domains
2. Files created or updated
3. Open `TODO:` items
4. Next step: **sdd-review** or **sdd-plan**

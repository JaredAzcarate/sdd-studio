# STANDARDS — sdd-review

Mandatory rules when reviewing and updating `.workspace/brief/` and `.workspace/spec/`.

## Edit scope

- May modify `.workspace/brief/business/product-guide.md` for functional or user-facing changes
- May modify `.workspace/brief/business/product-principles.md` for conceptual changes
- May modify `.workspace/brief/technical/` for technical configuration changes (development, modeling, stack/*)
- May modify files under `.workspace/spec/business/` and `.workspace/spec/technical/` for specification changes
- **Never** modify `.workspace/workflow/`
- **Never** write code in `src/`
- **Never** place Brief content inside `.workspace/spec/`

If the change requires replanning, suggest **sdd-plan**. Do not create tasks or releases.

## File responsibilities

| File | Changes when |
| ---- | ------------ |
| `.workspace/brief/business/product-principles.md` | Conceptual principles or product foundations change |
| `.workspace/brief/business/product-guide.md` | User journey, experiences, scope, or product narrative change |
| `.workspace/brief/technical/development.md` | Development model, workflow methodology, or conventions change |
| `.workspace/brief/technical/modeling.md` | Modeling approach, DDD, or domain boundaries change |
| `.workspace/brief/technical/stack/*.md` | Stack, architecture, or technology choices change |
| `.workspace/spec/<business\|technical>/<category>/<domain>-*.md` | Domain-level specification change |

Do not put technical details in `product-guide.md`. Do not put product behavior in the Technical Brief.

## Nomenclature

Keep the per-domain pattern:

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

Forbidden in `spec/`: `index.md`, `README.md`, `map.md`, per-domain folders, and any loose file at the top level (only `business/` and `technical/` allowed; narrative docs belong in `.workspace/brief/`).

## brief/business/product-guide.md

- Modify only for **user-facing** changes (journeys, experiences, alternative paths)
- Preserve the mandatory opening blockquote from **sdd-idea** STANDARDS
- Maintain journey-based organization — not domains or feature lists
- Requires explicit approval for scope changes that contradict existing domain specs
- After functional changes, ensure `.workspace/spec/` stays aligned

## brief/technical/

- Modify only for **technical** changes
- `development.md` — development model and conventions (no specific technologies)
- `modeling.md` — modeling approach and DDD context
- `stack/*.md` — technology choices per layer (frontend, backend, database, infrastructure, ai)
- Keep section structure from **sdd-idea** STANDARDS

## One question per document

Each domain file answers only its question (see **sdd-spec** STANDARDS for templates).

Do not move business rules to `*-ui.md`. Do not put UI states in `*-flows.md`.

## Actions by change type

| Type | Typical files |
| ---- | ------------- |
| User-facing scope change | `brief/business/product-guide.md`; may require domain updates via **sdd-spec** |
| Conceptual change | `brief/business/product-principles.md` |
| Development model change | `brief/technical/development.md` |
| Modeling change | `brief/technical/modeling.md` |
| Technical stack change | `brief/technical/stack/*.md` |
| New domain | 12 domain files (7 business + 5 technical) |
| New capability | `*-capabilities.md`, possibly `*-flows.md`, `*-api.md` |
| Rule change | `*-rules.md`; verify `*-flows.md`, `*-testing.md` |
| API change | `*-api.md`; verify `*-capabilities.md`, `*-security.md` |
| UI change | `*-ui.md` for interface only |
| Architecture change | `*-architecture.md`; verify `brief/technical/modeling.md` |
| Database change | `*-database.md`; verify `brief/technical/stack/database.md` |
| New relationship | `*-relations.md` in both affected domains |
| New event | `*-events.md`; verify consumers in relations |
| Security change | `*-security.md`; verify `*-api.md` |

## Remove domain

Delete all 12 `<domain>-*.md` files in every folder (business and technical). Clean references in other `*-relations.md` files.

## Format

1. One H1 per file
2. H2 for main sections
3. Do not skip levels
4. Separate sections with `---`
5. Do not duplicate; reference other documents

## Mandatory confirmation

Require explicit user confirmation when:

- High impact (new domain, deletion, scope change)
- Contradiction between Brief and domain files
- Unresolved open questions

## Post-edit validation

```bash
node .cursor/skills/sdd-review/scripts/validate-spec.mjs .workspace/spec
```

Do not finish until exit code is 0.

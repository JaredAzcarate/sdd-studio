# STANDARDS — sdd-review

Mandatory rules when reviewing and updating `.workspace/brief/` and `.workspace/spec/`.

## Edit scope

- May modify `.workspace/brief/business/product-guide.md` for functional or user-facing changes
- May modify `.workspace/brief/business/product-principles.md` for conceptual changes
- May modify `.workspace/brief/technical/engineering-modeling.md` for domain modeling changes
- May modify files under `.workspace/spec/business/` and `.workspace/spec/technical/` for specification changes
- **Never** modify `engineering-principles.md`, `engineering-decisions.md`, `engineering-conventions.md` (use `sdd-studio configure`)
- **Never** modify `engineering-stack.md` (use **sdd-technical**)
- **Never** modify `.workspace/workflow/`
- **Never** write code in `src/`
- **Never** place Brief content inside `.workspace/spec/`

If the change requires replanning, suggest **sdd-plan**. Do not create tasks or releases.

## File responsibilities

| File | Changes when |
| ---- | ------------ |
| `.workspace/brief/business/product-principles.md` | Conceptual principles or product foundations change |
| `.workspace/brief/business/product-guide.md` | User journey, experiences, scope, or product narrative change |
| `.workspace/brief/technical/engineering-modeling.md` | Modeling approach, DDD, or domain boundaries change |
| `.workspace/brief/technical/engineering-principles.md` | Read only — recommend `sdd-studio configure` |
| `.workspace/brief/technical/engineering-decisions.md` | Read only — recommend `sdd-studio configure` |
| `.workspace/brief/technical/engineering-conventions.md` | Read only — recommend `sdd-studio configure` |
| `.workspace/brief/technical/engineering-stack.md` | Read only — recommend **sdd-technical** |
| `.workspace/spec/<business\|technical>/<category>/<domain>-*.md` | Domain-level specification change |

Do not put technical details in `product-guide.md`. Do not put product behavior in the Technical Brief.

## Brief-driven technical conventions

Before creating or editing `technical/api/` or `technical/architecture/` files, read:

- `.workspace/brief/technical/engineering-decisions.md` — **Project Organization** (resolve `<resolved-code-root>` and domain folder pattern)
- `.workspace/brief/technical/engineering-stack.md` — **Backend** and **API** sections (API surface)

| Principle | Rule |
| --------- | ---- |
| Brief over convention | `engineering-decisions.md` (Project Organization) wins over default folder names (`src/modules/`, `packages/`) |
| Stack over REST default | `*-api.md` follows `engineering-stack.md` (Backend + API); do not revert to REST-by-default |
| Polyrepo-aware | Module paths must match Project Organization; orchestrator root may have no product code |
| Template fidelity | Use **sdd-spec** STANDARDS templates for `*-api.md` and `*-architecture.md` |
| Evidence label | Paths cited in spec must match Brief, not generic examples |

When **Project Organization** changes in `engineering-decisions.md`, propagate path updates to all affected `*-api.md` and `*-architecture.md` files.

When **engineering-stack.md** (Backend + API) changes, verify all `*-api.md` files still match the documented API surface.

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

## brief/technical/engineering-modeling.md

- Modify only for **domain modeling** changes
- Keep section structure from **sdd-idea** STANDARDS
- No specific technologies, API contracts, or user journeys

## One question per document

Each domain file answers only its question (see **sdd-spec** STANDARDS for templates).

Do not move business rules to `*-ui.md`. Do not put UI states in `*-flows.md`.

### Editing `*-api.md` and `*-architecture.md`

1. Resolve `<resolved-code-root>` from `brief/technical/engineering-decisions.md` (Project Organization) before writing paths.
2. Follow the **sdd-spec** template for Server Actions + Route Handlers (unless `engineering-stack.md` Backend + API sections say otherwise).
3. **Module Structure** in `*-architecture.md` must use the domain folder pattern from Project Organization (e.g. `<resolved-code-root>/domains/<domain>/`).
4. Never introduce `src/modules/` or `packages/` paths unless documented in the Brief.

## Actions by change type

| Type | Typical files |
| ---- | ------------- |
| User-facing scope change | `brief/business/product-guide.md`; may require domain updates via **sdd-spec** |
| Conceptual change | `brief/business/product-principles.md` |
| Engineering principles change | Recommend `sdd-studio configure` (`engineering-principles.md`) |
| Engineering decisions change | Recommend `sdd-studio configure` (`engineering-decisions.md`); may require path updates in `*-api.md` and `*-architecture.md` |
| Engineering conventions change | Recommend `sdd-studio configure` (`engineering-conventions.md`) |
| Modeling change | `brief/technical/engineering-modeling.md` |
| Technical stack change | Recommend **sdd-technical** (`engineering-stack.md`) |
| New domain | 12 domain files (7 business + 5 technical) |
| New capability | `*-capabilities.md`, possibly `*-flows.md`, `*-api.md` |
| Rule change | `*-rules.md`; verify `*-flows.md`, `*-testing.md` |
| API change | `*-api.md` per **sdd-spec** + `engineering-stack.md` (Backend + API); verify `*-capabilities.md`, `*-security.md` |
| UI change | `*-ui.md` for interface only |
| Architecture change | `*-architecture.md` per **sdd-spec** + `engineering-decisions.md` Project Organization; verify `engineering-modeling.md` |
| Repository / layout change | Recommend `sdd-studio configure` (`engineering-decisions.md`); then update paths in all `*-api.md` and `*-architecture.md` |
| Database change | `*-database.md`; verify `engineering-stack.md` (Database section) |
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

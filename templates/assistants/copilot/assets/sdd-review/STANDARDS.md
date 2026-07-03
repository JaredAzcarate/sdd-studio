# STANDARDS — sdd-review

Mandatory rules when reviewing and updating `.workspace/product-guide.md`, `.workspace/project.md`, and `.workspace/spec/`.

## Edit scope

- May modify `.workspace/product-guide.md` for functional or user-facing changes
- May modify `.workspace/project.md` for technical configuration changes
- May modify files under `.workspace/spec/` for specification changes
- **Never** modify `.workspace/workflow/`
- **Never** write code in `src/`
- **Never** place `product-guide.md` inside `.workspace/spec/`

If the change requires replanning, suggest **sdd-plan**. Do not create tasks or releases.

## File responsibilities

| File | Changes when |
| ---- | ------------ |
| `.workspace/product-guide.md` | User journey, experiences, scope, or product narrative change |
| `.workspace/project.md` | Stack, architecture, modeling, or development configuration change |
| `.workspace/spec/<domain>-*.md` | Domain-level specification change |

Do not put technical details in `product-guide.md`. Do not put product behavior in `project.md`.

## Nomenclature (unchanged)

Keep the per-domain pattern:

| Folder | File |
| ------ | ---- |
| `domain/` | `<domain>-domain.md` |
| `relations/` | `<domain>-relations.md` |
| `capabilities/` | `<domain>-capabilities.md` |
| `flows/` | `<domain>-flows.md` |
| `rules/` | `<domain>-rules.md` |
| `security/` | `<domain>-security.md` |
| `events/` | `<domain>-events.md` |
| `api/` | `<domain>-api.md` |
| `ui/` | `<domain>-ui.md` |
| `testing/` | `<domain>-testing.md` |

Forbidden in `spec/`: `index.md`, `README.md`, `map.md`, per-domain folders, and any loose file at the top level (narrative docs belong in `.workspace/product-guide.md`).

## product-guide.md

- Modify only for **user-facing** changes (journeys, experiences, alternative paths)
- Preserve the mandatory opening blockquote from **sdd-idea** STANDARDS
- Maintain journey-based organization — not domains or feature lists
- Requires explicit approval for scope changes that contradict existing domain specs
- After functional changes, ensure `.workspace/spec/` stays aligned

## project.md

- Modify only for **technical** changes
- Keep section structure from **sdd-idea** STANDARDS

## One question per document

Each domain file answers only its question (see **sdd-spec** STANDARDS for templates).

Do not move business rules to `*-ui.md`. Do not put UI states in `*-flows.md`.

## Actions by change type

| Type | Typical files |
| ---- | ------------- |
| User-facing scope change | `product-guide.md`; may require domain updates via **sdd-spec** |
| Technical stack change | `project.md` |
| New domain | 10 domain files |
| New capability | `*-capabilities.md`, possibly `*-flows.md`, `*-api.md` |
| Rule change | `*-rules.md`; verify `*-flows.md`, `*-testing.md` |
| API change | `*-api.md`; verify `*-capabilities.md`, `*-security.md` |
| UI change | `*-ui.md` for interface only |
| New relationship | `*-relations.md` in both affected domains |
| New event | `*-events.md`; verify consumers in relations |
| Security change | `*-security.md`; verify `*-api.md` |

## Remove domain

Delete all 10 `<domain>-*.md` files in every folder. Clean references in other `*-relations.md` files.

## Format

1. One H1 per file
2. H2 for main sections
3. Do not skip levels
4. Separate sections with `---`
5. Do not duplicate; reference other documents

## Mandatory confirmation

Require explicit user confirmation when:

- High impact (new domain, deletion, scope change)
- Contradiction between `product-guide.md`, `project.md`, or domain files
- Unresolved open questions

## Post-edit validation

```bash
node .github/sdd-studio/sdd-review/scripts/validate-spec.mjs .workspace/spec
```

Do not finish until exit code is 0.

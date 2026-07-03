# STANDARDS — sdd-review

Mandatory rules when reviewing and updating `workspace/spec/`.

## Edit scope

- Modify only files under `workspace/spec/`
- **Never** modify `workspace/workflow/`
- **Never** write code in `src/`

If the change requires replanning, suggest **sdd-plan** to the user. Do not create tasks or releases.

## Naming (unchanged)

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

Forbidden: `index.md`, `README.md`, `map.md`, per-domain folders.

## vision.md

- Do not modify except for **scope or objectives** changes explicitly approved
- If the change is only technical or domain-level, edit the corresponding domain files

## One question per document

When editing, each file answers only its question (see **sdd-spec** STANDARDS for templates).

Do not move business rules to `*-ui.md`. Do not put UI states in `*-flows.md`.

## Actions by change type

| Type | Typical files |
| ---- | ------------- |
| New domain | All 10 domain files |
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
- Contradiction with `vision.md`
- Unresolved open questions

## Post-edit validation

```bash
node .cursor/skills/sdd-review/scripts/validate-spec.mjs workspace/spec
```

Do not finish until exit code is 0.

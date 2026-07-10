# STANDARDS — sdd-find-skills

Mandatory rules for discovering and installing implementation skills from the open ecosystem.

## Role

**sdd-find-skills** bridges the **Engineering Brief** (stack + strategies) and the **open skills ecosystem** (`npx skills`, https://skills.sh/). It does not replace the user's own skills or agents.

## Brief path resolution (versioned)

1. Read `.workspace/brief/manifest.yaml`.
2. Resolve `brief/technical/<technical.current>/` for all reads.
3. Legacy flat layout requires `sdd-studio migrate` before versioned paths work.

## Signal extraction

### Stack signals (`Trigger type: Stack`)

From `engineering-stack.md`:

- Parse each `##` section that contains `**Selected:**`.
- Use the selected technology name as the trigger label (e.g. `Frontend (Web) → Next.js`).
- Skip sections with no `**Selected:**` line.

### Strategy signals (`Trigger type: Strategy`)

From configure-generated files (same technical folder):

| File | What to extract |
| --- | --- |
| `engineering-decisions.md` | Chosen options: business modeling, testing strategy, authentication, forms, validation, deployment, etc. |
| `engineering-frontend-patterns.md` | Patterns: component-documentation, server-state, async-ui-states, notifications, tables |
| `engineering-backend-patterns.md` | API envelope, pagination, error shape |
| `engineering-contribution-patterns.md` | PR/branch conventions when they imply tooling (e.g. conventional commits) |
| `engineering-principles.md` | `target-platforms`, product type — only when they imply ecosystem skills (e.g. mobile → react native) |

Use the **decision or pattern name** as the trigger (e.g. `component-documentation → Storybook`, `business-modeling → DDD`).

### Priority when capping signals

1. Stack selections from `engineering-stack.md`
2. Strategies that affect daily implementation (testing, forms, validation, component docs)
3. Remaining strategies

Maximum **12 signals** per run.

## No catalog rule

- Do **not** use a fixed mapping table bundled in SDD Studio.
- Every suggestion must be justified by a Brief signal **and** validated through `npx skills find` or skills.sh.
- It is valid to end with `No match` rows — report them honestly.

## Skills CLI

| Command | Use |
| --- | --- |
| `npx skills find [query]` | Search by keyword per signal |
| `npx skills add <owner/repo@skill> -g -y` | Install globally after user confirmation |
| `npx skills check` | Optional — mention if user asks about updates |

Browse: https://skills.sh/

## Quality bar (mandatory)

Do **not** recommend a skill based solely on search results.

| Criterion | Guidance |
| --- | --- |
| Install count | Prefer 1K+; caution under 100 |
| Source | Prefer vercel-labs, anthropics, microsoft, or repos with strong reputation |
| Fit | Skill must match the **specific** trigger, not a generic "web dev" skill |
| One per signal | Initial table: one best skill per signal |

When two skills are close, prefer higher installs and official sources. Mention the runner-up in chat only if the user asks.

## Recommendation table (required format)

| Column | Required | Description |
| --- | --- | --- |
| Trigger type | Yes | `Stack` or `Strategy` |
| Trigger (stack or strategy) | Yes | Brief source label |
| Suggested skill | Yes | Skill name or `—` if no match |
| Installs | Yes | From skills.sh or search metadata, or `—` |
| Source | Yes | `owner/repo` or `—` |
| Install command | Yes | Full `npx skills add ...` or `—` |
| Status | Yes | `Suggested`, `No match`, `Skipped`, `Installed`, `Failed` |

## User edit rules

- The user may exclude any row before install.
- **Install all** applies only to rows with Status `Suggested` and a valid install command.
- **Let me choose** must use multi-select so the user can drop individual skills.
- Never install a skill the user removed from the final list.

## Installation rules

- **Always** get explicit confirmation immediately before `npx skills add`.
- Use `-g -y` for non-interactive global install unless the user asks for project-local install.
- Report stdout/stderr failures; do not hide partial failures.
- Do not install SDD Studio's own packaged SDD skills (`sdd-idea`, `sdd-technical`, etc.) — those come from `sdd-studio init` / `sync`.

## Forbidden

- Modifying any file under `.workspace/`
- Recommending skills without a Brief signal
- Recommending without quality verification
- Installing without user confirmation
- Hardcoding a skill list instead of searching per project

## Handoff context

Typically invoked **after sdd-technical** when `engineering-stack.md` exists. Optional before **sdd-spec** or during implementation.

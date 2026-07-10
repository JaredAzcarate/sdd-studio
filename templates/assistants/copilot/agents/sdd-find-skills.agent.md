---
name: sdd-find-skills
description: Reads the Engineering Brief and engineering-stack.md, discovers implementation skills from the open skills ecosystem (skills.sh / npx skills), presents a table by stack area or strategy, and installs approved skills. Optional after sdd-technical. Never modifies .workspace/.
disable-model-invocation: true
tools: ["read", "search", "execute"]
---

# SDD Find Skills

Discover and optionally install **implementation skills** from the open agent skills ecosystem, based on this project's **confirmed stack** and **engineering strategies** in `.workspace/brief/technical/`.

This skill is **optional**. Users may already have their own skills or agents — skip it when not needed.

Inspired by the **find-skills** workflow (`npx skills`, https://skills.sh/). There is **no hardcoded catalog** in SDD Studio: recommendations come from reading the Technical Brief and searching the ecosystem per signal.

## Required documents

Before running, read:

- .github/sdd-studio/sdd-find-skills/STANDARDS.md — signal extraction, table format, quality bar, install rules
- .github/sdd-studio/sdd-find-skills/EXAMPLES.md — sample flows and tables

## Scope

| Allowed | Forbidden |
| --- | --- |
| Read `.workspace/brief/manifest.yaml` and resolve `brief/technical/<current>/` | Modify any file under `.workspace/` |
| Read all files in the resolved technical folder | Modify `spec/` or `workflow/` |
| Run `npx skills find`, `npx skills add` (after user approval) | Invent stack or strategies not in the Brief |
| Present recommendations in a table | Install skills without explicit user confirmation |
| Skip installation when the user declines | Recommend skills without quality verification |

## Pre-execution

1. Read `.workspace/brief/manifest.yaml` and resolve `brief/technical/<technical.current>/` (or `technical.target` only if the user is explicitly refactoring).
2. Read every file in that folder, especially `engineering-stack.md`.
3. Read .github/sdd-studio/sdd-find-skills/STANDARDS.md and .github/sdd-studio/sdd-find-skills/EXAMPLES.md.
4. **Gate:** If `engineering-stack.md` is missing or still a stub, stop and recommend **sdd-technical** first.
5. If configure inputs are incomplete (stubs in principles/decisions/conventions/patterns), note it but still proceed if `engineering-stack.md` is confirmed.

## Flow

### Phase 1 — Extract signals (no catalog)

Build an internal list of **search signals** from the Technical Brief. Each signal becomes one row candidate in the final table.

**Two signal types** (both are valid triggers — use the `Trigger type` column):

| Trigger type | Source | Examples |
| --- | --- | --- |
| **Stack** | `engineering-stack.md` sections with `**Selected:**` | Next.js, Expo, Drizzle, PostgreSQL, Tiptap, Tailwind |
| **Strategy** | `engineering-decisions.md`, `engineering-*-patterns.md`, `engineering-principles.md` | DDD, Storybook, schema validation, E2E testing, App Router, server-state pattern |

Rules:

- One signal per concrete technology or strategy — do not merge unrelated items.
- Derive search queries from the signal (e.g. `Next.js` → `npx skills find nextjs`; `Storybook` → `npx skills find storybook`; `DDD` → `npx skills find domain driven design`).
- Do not recommend a skill for a signal that is not present in the Brief.
- Cap at **12 signals** — if more exist, prioritize stack selections first, then strategies that affect implementation daily.

### Phase 2 — Discover skills (ecosystem search)

For each signal:

1. Check https://skills.sh/ leaderboard when the domain is common (React, Next.js, testing, PR review).
2. Run `npx skills find <query>` when leaderboard coverage is unclear.
3. **Verify quality** before adding to the table (see STANDARDS.md):
   - Prefer 1K+ installs; be cautious under 100.
   - Prefer official or well-known sources (`vercel-labs`, `anthropics`, `microsoft`, etc.).
   - Do not recommend from search results alone without install count or source check.
4. Pick **one best match per signal** for the initial table. If none qualifies, mark the row `No match` and suggest the user search manually or create a skill with `npx skills init`.

### Phase 3 — Present table

Show a markdown table **before** any install prompt:

| Trigger type | Trigger (stack or strategy) | Suggested skill | Installs | Source | Install command | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Stack | Next.js | react-best-practices | 185K | vercel-labs/agent-skills | `npx skills add vercel-labs/agent-skills@react-best-practices` | Suggested |
| Strategy | Storybook (component-documentation) | … | … | … | … | Suggested |

Column rules:

- **Trigger type:** `Stack` or `Strategy` only.
- **Trigger:** exact area from the Brief (section name or decision/pattern id).
- **Status:** `Suggested`, `No match`, or `Skipped` (after user edit).

Tell the user they may **remove or exclude** any row before install — this skill does not assume they want every suggestion.

### Phase 4 — User edit and confirmation

Use `AskQuestion` — never install without approval.

**Step A — intent:**

- Prompt: `How do you want to proceed with the suggested skills?`
- Options:
  - `Install all suggested skills (Recommended)` — only rows with Status `Suggested` and a valid install command
  - `Let me choose which skills to install`
  - `Skip installation — recommendations only`

**Step B — if "Let me choose":**

- `AskQuestion` with `allow_multiple: true`
- One option per installable row (skill name + trigger in the label)
- User deselects skills they do not want

**Step C — final confirm (if installing):**

- Show the **final list** after edits
- `AskQuestion`: `Confirm installation of N skills?` → Yes / No
- On **No**, stop with recommendations only

### Phase 5 — Install

For each approved skill, run:

```bash
npx skills add <owner/repo@skill> -g -y
```

- Run installs **sequentially**; report success or failure per skill.
- On failure, continue with remaining skills and list failures in the Report.
- Do not retry more than once per skill without asking the user.

### Phase 6 — Validation

- [ ] Every table row maps to a real Brief signal
- [ ] No skill recommended without quality check
- [ ] User explicitly confirmed before any `npx skills add`
- [ ] No `.workspace/` files modified
- [ ] Install results reported

## Checklist

```
- [ ] manifest.yaml read; technical path resolved
- [ ] engineering-stack.md present and confirmed
- [ ] Signals extracted (stack + strategy)
- [ ] npx skills find / skills.sh used per signal
- [ ] Table presented with Trigger type column
- [ ] User edited selection or confirmed install all / skip
- [ ] Installs run only after confirmation
- [ ] Report delivered
```

## Report

1. Number of signals from stack vs strategy
2. Final recommendation table (including skipped or failed rows)
3. Install summary: installed / skipped / failed
4. Skills with no match — optional manual search queries
5. Next step (optional): **sdd-spec** if spec is the user's priority, or continue implementation with installed skills

Remind the user: this step is **optional**; they can invoke **sdd-find-skills** again after stack or Brief changes.

# EXAMPLES — sdd-find-skills

## Example signals from a Technical Brief

**From `engineering-stack.md` (Stack):**

| Section | Selected | Signal label |
| --- | --- | --- |
| Frontend (Web) | Next.js | Stack — Next.js |
| Database | PostgreSQL | Stack — PostgreSQL |
| ORM / Data Layer | Drizzle | Stack — Drizzle |
| UI Components | shadcn/ui | Stack — shadcn |

**From configure files (Strategy):**

| File | Decision / pattern | Signal label |
| --- | --- | --- |
| engineering-frontend-patterns.md | component-documentation: storybook | Strategy — Storybook |
| engineering-decisions.md | testing: e2e-playwright | Strategy — E2E Playwright |
| engineering-decisions.md | business-modeling: domain-driven-design | Strategy — DDD |

---

## Example recommendation table (chat output)

```markdown
Based on your Engineering Brief, here are implementation skills from the open ecosystem:

| Trigger type | Trigger (stack or strategy) | Suggested skill | Installs | Source | Install command | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Stack | Next.js | react-best-practices | 185K | vercel-labs/agent-skills | `npx skills add vercel-labs/agent-skills@react-best-practices` | Suggested |
| Stack | Drizzle | — | — | — | — | No match |
| Strategy | E2E Playwright | playwright-testing | 12K | example-org/skills | `npx skills add example-org/skills@playwright-testing` | Suggested |
| Strategy | Storybook | — | — | — | — | No match |

You can exclude any row before install. This step is optional if you already use your own skills.
```

Then `AskQuestion`:

- **title:** `Install skills`
- **prompt:** `How do you want to proceed with the suggested skills?`
- **options:**
  - `Install all suggested skills (Recommended)`
  - `Let me choose which skills to install`
  - `Skip installation — recommendations only`

---

## Example — user chooses subset

**AskQuestion** (allow_multiple: true):

- `react-best-practices — Next.js (Stack)`
- `playwright-testing — E2E Playwright (Strategy)`

User deselects Playwright → only Next.js skill installs after final Yes confirmation.

---

## Example — install commands

```bash
npx skills add vercel-labs/agent-skills@react-best-practices -g -y
```

Report:

```markdown
## Install summary

| Skill | Trigger | Result |
| --- | --- | --- |
| react-best-practices | Stack — Next.js | Installed |
| playwright-testing | Strategy — E2E Playwright | Skipped (user choice) |

Next: **sdd-spec** when you are ready to generate the specification.
```

---

## Example — gate (no stack)

If `engineering-stack.md` is missing:

```markdown
engineering-stack.md is not defined yet. Run **sdd-technical** first to confirm your stack, then invoke **sdd-find-skills** again (optional).
```

---

## Example search queries (derived, not catalogued)

| Brief signal | Example `npx skills find` query |
| --- | --- |
| Next.js | `nextjs` or `react performance` |
| Expo | `expo react native` |
| Tiptap | `tiptap` |
| Storybook | `storybook` |
| DDD | `domain driven design` |
| Playwright E2E | `playwright e2e` |
| PR review | `pr review` |
| Figma (if in conventions) | `figma design` |

Always verify results against the quality bar in STANDARDS.md.

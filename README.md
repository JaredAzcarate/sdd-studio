# SDD Studio

> **Knowledge Workspace for AI Development**

Build software from shared knowledge instead of scattered AI conversations.

**v0.8.0** — early access. Feedback welcome.

---

## Why SDD Studio?

AI coding assistants are incredibly good at writing code.

The problem isn't the code anymore.

The problem is context.

Every new conversation starts with incomplete knowledge. Product decisions get forgotten, engineering conventions drift, and implementations become inconsistent over time.

**SDD Studio solves this by giving your project a dedicated knowledge workspace where both humans and AI share the same source of truth.**

---

## What is SDD Studio?

SDD Studio is a Specification-Driven Development toolkit for **web, mobile-native, and hybrid** client applications — not terminal-only or CLI-primary products.

It helps teams organize product knowledge before writing code.

Instead of asking AI to guess your architecture, requirements, or conventions, SDD Studio guides you through building a structured knowledge base that AI can reliably use throughout the entire development lifecycle.

**The CLI prepares your folder structure and assistant-specific SDD skills. The intelligence lives in the skills — not in the CLI.**

The result is better implementations, fewer assumptions, and more consistent software.

---

## The `.workspace` Philosophy

SDD Studio separates **product knowledge** from **application code**:

```text
my-project/

├── src/                    # Your application code
├── .cursor/                # Assistant skills & rules (or .claude/, .agents/, etc.)
└── .workspace/             # Shared product knowledge
    ├── brief/
    ├── spec/
    └── workflow/
```

Your application code stays exactly where it belongs.

**`.workspace/`** holds structured knowledge the whole team (and every AI session) can read:

- Product and engineering briefs (versioned)
- Domain specifications
- Workflow planning (roadmap, releases, tasks)

**Assistant files** (skills, rules, agents) are installed next to your code — for example `.cursor/skills/` and `.cursor/rules/` — not inside `.workspace/`. Run `sdd-studio sync` to update packaged skills from the npm package.

Keep implementation and knowledge separate.

---

## Why this matters

Modern AI doesn't need better prompts.

It needs better knowledge.

SDD Studio helps you build that knowledge once, so every future AI conversation starts with the full context instead of starting from zero.

---

## Multi-Repository Products

If your frontend, backend, mobile app, or services live in separate repositories, we recommend creating a dedicated **Workspace Repository**.

```text
workspace/

├── frontend/    (git submodule)
├── backend/     (git submodule)
├── mobile/      (git submodule)
└── .workspace/
```

This gives AI a complete view of the product while keeping every repository independent.

This pattern is optional but highly recommended when front and back already live in separate repos.

---

## Official cycle

```text
Idea → Brief → Specification → Planning → Implementation → Code
```

---

## Features

SDD Studio has three layers: **CLI/TUI**, **`.workspace/` knowledge**, and **chat skills**.

### CLI & TUI

| Command / action | Purpose |
| ---------------- | ------- |
| `sdd-studio init` | Brief scaffold (`manifest.yaml`), versioned stubs, assistant skills |
| `sdd-studio` (TUI) | Greenfield / Brownfield menu — foundation, spec scaffold, configure, sync |
| `sdd-studio configure` | Engineering Brief — principles, decisions, conventions, FE/BE/contribution patterns |
| `sdd-studio configure-workflow` | Methodology and task conventions in `.workspace/workflow/` |
| `sdd-studio migrate` | Upgrade legacy flat brief layouts to versioned semver folders |
| `sdd-studio sync` | Refresh packaged skills and rules from the npm package (does not modify `.workspace/`) |

### Knowledge workspace (`.workspace/`)

| Area | What it stores |
| ---- | -------------- |
| `brief/business/<version>/` | Product principles and user journey (`sdd-idea`) |
| `brief/technical/<version>/` | Engineering decisions, patterns, and stack (`configure`, `sdd-technical`) |
| `brief/manifest.yaml` | Active brief versions (`current`, `target`, `archived`) and spec alignment |
| `spec/` | Domain specification — 13 files per domain (`sdd-spec`) |
| `workflow/` | Roadmap, milestones, releases, `TASK-NNN` (`configure-workflow`, `sdd-plan`) |

Cross-cutting **engineering patterns** (API envelopes, async UI states, PR conventions) live in the technical brief and must align with `*-api.md` and `*-ui.md` in spec.

**Validators:** `sdd-spec` and `sdd-plan` ship scripts (`validate-spec.mjs`, `validate-workflow.mjs`) to check structure before you rely on the output.

### Packaged AI skills (7)

Invoke explicitly in your assistant — they do not run automatically.

| Skill | Role |
| ----- | ---- |
| **sdd-idea** | Discover the product → Business Brief |
| **sdd-technical** | Choose concrete stack → `engineering-stack.md` |
| **sdd-find-skills** | *(Optional)* Search the open skills ecosystem (`npx skills`, skills.sh) from your stack and engineering strategies; install only after you approve |
| **sdd-spec** | Generate full domain specification under `spec/` |
| **sdd-plan** | Plan roadmap, milestones, and releases |
| **sdd-review** | *(Optional)* Validate or align brief and spec after changes |
| **sdd-generate** | *(Brownfield)* Explore existing code and propose brief/spec alignment |

### Also included

- **Greenfield & brownfield** entry paths (TUI asks on startup)
- **Versioned brief** — evolve product or architecture without losing traceability
- **Refactor engineering** — draft technical brief in `target`, then promote (brownfield stack changes)
- **Multi-assistant** — Cursor (default), Claude, Codex, OpenCode, GitHub Copilot
- **Markdown-first** — human-readable, git-friendly knowledge

### What SDD Studio does not do

- Generate application code (`src/`, `app/`, `tests/`)
- Replace issue trackers (Linear, Jira) — SDD workflow is optional
- Install external skills without your confirmation (`sdd-find-skills` always asks first)
- Guarantee a perfect spec in one pass — iteration and review are expected

**Learn more:** [SKILLS.md](./docs/SKILLS.md) · [WORKSPACE-ARCHITECTURE.md](./docs/WORKSPACE-ARCHITECTURE.md) (full file tree)

---

## Quick Start

SDD Studio supports **two entry paths**. Choose based on whether you already have application code.

| Path | When to use it |
| ---- | -------------- |
| **Greenfield** | New product or no meaningful codebase yet — you define knowledge before writing code |
| **Brownfield** | Existing codebase — you extract and align knowledge from what is already built |

Initialize your workspace:

```bash
npx sdd-studio init
```

Or launch the interactive TUI — it asks **Greenfield** or **Brownfield** on startup:

```bash
npx sdd-studio
```

Invoke skills in your AI assistant (e.g. **sdd-idea**, `/sdd-idea` in OpenCode). See [Packaged AI skills](#packaged-ai-skills-7) above. Do not implement without a specification.

### Step reference

| Step | Command / skill | Output |
| ---- | --------------- | ------ |
| Foundation | `init` / TUI *Create brief scaffold* | `.workspace/brief/` stubs + assistant skills |
| Engineering | `configure` | 6 files in `brief/technical/<version>/` |
| Product | **sdd-idea** | `product-principles.md`, `product-guide.md` |
| Stack | **sdd-technical** | `engineering-stack.md` |
| Ecosystem skills | **sdd-find-skills** *(optional)* | Recommended / installed implementation skills |
| Spec scaffold | TUI *Create spec scaffold* | Empty `spec/` folders |
| Specification | **sdd-spec** | Domain files (13 per domain) |
| Workflow | `configure-workflow` | `workflow-config.md` |
| Planning | **sdd-plan** | Roadmap, milestones, releases |
| Brownfield | **sdd-generate** | Brief + spec from codebase |
| Review | **sdd-review** *(optional)* | Alignment check |
| Legacy | `migrate` | Versioned brief layout |

Full reference: [FLOW-GREENFIELD.md](./docs/FLOW-GREENFIELD.md) · [FLOW-BROWNFIELD.md](./docs/FLOW-BROWNFIELD.md)

### Greenfield flow

Recommended order when starting from scratch:

```text
configure → sdd-idea → sdd-technical → [sdd-find-skills] → sdd-spec → [configure-workflow] → sdd-plan
```

| # | Action | Output |
| - | ------ | ------ |
| 0 | `sdd-studio init` | Brief stubs + skills |
| 1 | `sdd-studio configure` | Engineering Brief (6 files) |
| 2 | **sdd-idea** | Business Brief |
| 3 | **sdd-technical** | `engineering-stack.md` |
| 4 | **sdd-find-skills** *(optional)* | Installed implementation skills |
| 5 | Create spec scaffold, then **sdd-spec** | Domain specification |
| 6 | `sdd-studio configure-workflow` *(if using SDD workflow)* | Workflow config |
| 7 | **sdd-plan** | Roadmap and release tasks |

**Flexible start:** you may run **sdd-idea** before step 1. Once the product is clear, run `configure`, then **sdd-technical**.

```text
Idea → Brief → Technical Decisions → Specification → Workflow → Implementation
```

### Brownfield flow

Recommended order when code already exists:

```text
[migrate] → sdd-generate → [sdd-review] → [configure-workflow] → sdd-plan
```

| # | Action | Output |
| - | ------ | ------ |
| 0 | `sdd-studio init` | Versioned brief scaffold + **sdd-generate** skill |
| 1 | `sdd-studio migrate` *(only if legacy layout)* | `manifest.yaml` + semver folders |
| 2 | **sdd-generate** | Completes Brief and generates spec from the codebase |
| 3 | **sdd-review** *(optional)* | Validates alignment with the real project |
| 4 | `sdd-studio configure-workflow` *(optional)* | Workflow config |
| 5 | **sdd-plan** | Roadmap and release tasks |

**Evolving the stack:** when architecture or technology changes, use TUI *Configure Refactor Engineering* → **sdd-technical** (target version) → *Promote Engineering Target*.

---

## Philosophy

> AI doesn't need better prompts.

It needs better knowledge.

The most valuable asset of a software project isn't its code.

It's the knowledge behind it.

SDD Studio exists to make that knowledge explicit.

---

## License

MIT

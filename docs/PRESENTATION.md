# SDD Studio — Presentation Guide

Reference document for presenting the solution to product and development teams. Explains the **why** behind modeling, versioning, skills, workflow, and configure sections.

**Product version:** 0.8.0 (early access / test version)

## Slogan

> **SDD Studio — Knowledge Workspace for AI Development**

*The space where the team and AI share the same product knowledge.*

SDD Studio is not a framework or code generator: it is a **knowledge workspace** — a single place where everything the AI needs to respect the product, technical decisions, and team patterns lives.

---

## Audience

SDD Studio is designed for **product designers** and **developers** working together (or with AI) on web, mobile-native, or hybrid products.

| Role | What they get |
| --- | --- |
| **Product designer** | A shared language to describe the product (`product-guide.md`), principles that guide UX decisions and product evolution |
| **Developer** | Cross-cutting technical contract (patterns, stack, spec by domain) before writing code in `src/` |
| **Both** | Same source of truth in `.workspace/`, skills with scoped responsibility, and validators that reduce misalignment |

It is not aimed at products whose primary surface is terminal or CLI only.

---

## Origin — why this exists

Personal narrative to open the talk (Act 0, ~3 min).

I've spent years building applications in **React**, increasingly supported by **AI** to move faster. That works… until it doesn't.

Every new session, every better model, the assistant "forgets" again how we want APIs to respond, how we handle loading and errors, how we name things, what the product is and what it isn't. **I still fight the same battles today:** repeat context, correct drift, re-explain patterns.

As AI improves, I use more AI — and the need for **stack-agnostic but team-mandatory technical configuration** becomes more urgent, not less. "Being good at prompting the chat" is not enough. You need a **persistent contract** that designers, developers, and agents read the same way.

SDD Studio was born from that real friction: not from documentation theory, but from days when AI accelerated code but **slowed coherence**.

**Bridge to the problem:** the problem isn't that AI is bad. It's that **it has nowhere to read the project contract**.

---

## Current state and feedback

SDD Studio is in **early access**. The greenfield flow is documented and operational; the brownfield path and some advanced validations are still evolving.

**All feedback is valuable:** friction in configure, confusing questions, handoffs between skills, quality of generated spec, documentation gaps, or pattern ideas. Reporting what doesn't fit helps prioritize real improvements.

---

## Core message

> AI without a contract invents the product.

Without structure, the assistant mixes product, architecture, APIs, and tasks in the same chat. Code appears before agreeing **what** the product is and **how** it should behave.

SDD Studio **is not a code generator**. It is **knowledge infrastructure** so humans and AI work with the same contract.

> *"The CLI prepares your folder structure and assistant-specific SDD skills. The intelligence lives in the skills — not in this tool."*

---

## Suggested presentation structure (30–45 min)

### Act 0 — Origin and motivation (3 min)

**Title:** *From React + AI to a knowledge workspace*

- Experience developing with AI: speed yes, coherence not always.
- The need grows as models improve.
- SDD Studio as a response to daily friction ("still fighting the same battles").

### Act 1 — The problem (5–7 min)

**Title:** *AI without a contract invents the product*

- Without structure, product + architecture + APIs + tasks live in the same thread.
- Code is generated before fixing behavior and decisions.
- SDD Studio prepares folders and skills; intelligence lives in skills, not the CLI.

### Act 2 — Mental model (15–20 min)

**Title:** *Each folder answers a different question*

### Act 3 — Narrated demo (10–15 min)

**Title:** *Greenfield in 7 steps*

Walk through the flow with a temporary project (see [LOCAL.md](./LOCAL.md)).

---

## The SDD cycle

```text
Idea → Brief → Specification → Planning → Implementation → Code
```

Each stage answers a different question. Responsibilities are not mixed.

| Layer | Question | Who fills it |
| --- | --- | --- |
| **Brief / business** | What product do we want? | **sdd-idea** |
| **Brief / technical** | How do we decide to build it? | **configure** + **sdd-technical** |
| **Spec** | How is the system specified? | **sdd-spec** |
| **Workflow** | How do we organize the work? | **configure-workflow** + **sdd-plan** |
| **Code** | Implementation | Development + agent (outside CLI scope) |

---

## `.workspace/` map

| Location | Question it answers |
| --- | --- |
| `.workspace/brief/business/product-principles.md` | What conceptual principles is the product built on? |
| `.workspace/brief/business/product-guide.md` | How does the product work for a user? |
| `.workspace/brief/technical/engineering-*.md` | What decisions and patterns guide engineering? |
| `.workspace/spec/business/` + `.workspace/spec/technical/` | How is each domain modeled and specified? |
| `.workspace/workflow/` | How do we plan releases and tasks? |

See also the workspace rule in `.cursor/rules/sdd-studio.mdc` for the full source-of-truth map. Detailed tree in [WORKSPACE-ARCHITECTURE.md](./WORKSPACE-ARCHITECTURE.md).

---

## What the Brief is (for those not from agencies)

In agencies and studios, the **brief** is the document where **client** needs are captured before design or build.

In SDD Studio we do the same, but the "client" is **the product**:

| Brief | Question | Main files |
| --- | --- | --- |
| **Business** | What product do we want? | `product-principles.md`, `product-guide.md` |
| **Technical** | How do we decide to build it? | `engineering-*.md`, `engineering-stack.md` |

It is not spec yet. It is **agreed context** before specifying domains and before implementing in `src/`.

**One-line analogy:** *the brief answers "what we want and under what rules"; spec answers "how the system is defined".*

---

## Where the knowledge workspace lives

SDD Studio is designed so the **full workspace** lives in **one place**: the AI needs the **most context possible** (brief, spec, workflow, code, agents).

### Option A — Monorepo (simple case)

Ideal when front, back, and shared packages already live in one repository.

```text
my-product/
├── .workspace/          # brief, spec, workflow
├── .cursor/             # skills, rules, agents
├── apps/web/
├── apps/api/
└── packages/shared/
```

### Option B — Orchestrator repo + submodules (separate repos)

When **project-A** (front), **project-B** (back), and **project-C** (mobile, design system, etc.) live in separate repos, the suggestion is to create a **`workspace`** repository (orchestrator) that:

- Mounts product repos as **submodules** (or equivalent).
- Concentrates **everything for the SDD method**: `.workspace/`, skills, rules, agents.
- Separates **product** (code in each submodule) from **workspace** (how we develop with AI).

```text
my-workspace/                    # Knowledge workspace — SDD Studio lives here
├── .workspace/
│   ├── brief/
│   ├── spec/
│   └── workflow/
├── .cursor/                     # skills, rules, agents
├── project-a/    → submodule    # frontend
├── project-b/    → submodule    # backend
└── project-c/    → submodule    # mobile, etc.
```

| Idea | Why it matters |
| --- | --- |
| **Full context for AI** | Brief + spec + code accessible in the same work tree |
| **Product ≠ workspace** | In `project-A` lives the code; in `workspace` live decisions, spec, agents, and planning |
| **Single team hub** | Do not mix method documentation with the repo that only deploys the API |

This option aligns with **Orchestrator repo + independent repos** in `sdd-studio configure` and with the brownfield **sdd-generate** flow (explore code in the submodule, not at the orchestrator root).

### When to use each pattern

| Situation | Recommendation |
| --- | --- |
| Front + back in a monorepo | `.workspace/` at the monorepo root |
| Front and back in separate repos | `*-workspace` repo + submodules |
| One product, one greenfield repo | Everything together (typical demo case) |

**Honest note:** submodules add operational friction (clone, update, permissions). It is not "always submodules"; it is **if you already have separate repos, don't give up full AI context** — centralize the workspace.

---

## Why the current modeling

### Brief vs Spec vs Workflow separation

| Artifact | Role | Typical content |
| --- | --- | --- |
| **Brief** | Context and decisions | Product narrative, principles, agreed architecture |
| **Spec** | Formal definition | Domains, rules, flows, APIs, UI per domain |
| **Workflow** | Execution | Roadmap, milestones, releases, `TASK-NNN` |

### Domain no longer lives in the Brief

**Before:** domain modeling could live in `engineering-modeling.md` inside the technical brief, duplicating or confusing context with specification.

**Now (greenfield):**

| What | Where | Who |
| --- | --- | --- |
| Functional product narrative | `product-guide.md` | **sdd-idea** |
| Modeling approach (DDD, CRUD, etc.) | **Business Modeling** in `engineering-decisions.md` | **configure** |
| Domains, rules, APIs, UI | `spec/business/` + `spec/technical/` | **sdd-spec** |

**Message for the audience:** *the brief defines decisions; spec defines the system.*

`engineering-modeling.md` only makes sense as legacy context in migrated brownfield projects, not as a mandatory greenfield step.

---

## Why versioning (`manifest.yaml`)

The versioned brief lives in `.workspace/brief/manifest.yaml` with semver folders (`0.1.0/`, etc.).

| Concept | Meaning |
| --- | --- |
| `business.current` / `technical.current` | Active version skills read |
| `target` | Refactor draft without breaking what is live |
| `archived` | History of previous versions |
| `spec.aligned_with` | Spec declares which brief version it was generated against |

### Why it matters

1. **Controlled evolution** — Change product or architecture without losing traceability.
2. **Explicit resolution for AI** — Skills read `manifest.yaml` and resolve the correct folder; they do not assume flat paths.
3. **Spec ↔ brief alignment** — If the brief changes, you can see whether spec is still aligned or needs regeneration.

**Useful analogy:** *version control for product knowledge*, not just code.

---

## Why skills

Each skill has **scoped responsibility** and **explicit prohibitions**. That reduces hallucinations and stops an agent from "doing everything".

| Skill / command | Writes | Does not touch |
| --- | --- | --- |
| **sdd-studio configure** | Engineering Brief (principles, decisions, conventions, patterns) | Product, spec, workflow |
| **sdd-idea** | Business Brief | Spec, engineering, workflow |
| **sdd-technical** | `engineering-stack.md` | Spec, workflow |
| **sdd-find-skills** | — (installs external skills with approval) | Brief, spec, workflow |
| **sdd-spec** | Full spec by domain | Brief, workflow, `src/` |
| **configure-workflow** | Methodology and task convention config | Brief, spec |
| **sdd-plan** | Roadmap, milestones, releases, tasks | Brief, spec |
| **sdd-review** | Brief/spec alignment analysis | Workflow |
| **sdd-generate** | Brownfield alignment (with approval) | Direct implementation |

Skills sync to the project with `sdd-studio init --assistant cursor` (or another supported assistant). Invoke them in chat (`/sdd-idea`, `/sdd-spec`, etc.).

**Message:** *one agent, one job, one verifiable output.*

### sdd-find-skills (optional)

After confirming the stack, **sdd-find-skills** connects the Engineering Brief with the open skills ecosystem (`npx skills`, skills.sh):

- Reads stack (`engineering-stack.md`) and **strategies** (configure decisions and patterns).
- Searches skills by signal — **no fixed catalog** in SDD Studio.
- Presents a table (Stack vs Strategy) and lets you exclude rows before installing.
- Installs only with explicit user confirmation.

Skip if the team already has its own skills or agents.

---

## Why workflow (separate from spec)

| Layer | Question |
| --- | --- |
| **Spec** | What needs to be built? (domains, rules, APIs, screens) |
| **Workflow** | How do we execute it? (Kanban/Scrum, `TASK-NNN` IDs, releases) |

**configure-workflow** captures:

- **methodology** — How the team organizes work (e.g. Kanban vs Scrum).
- **task-conventions** — Task format, prefixes, PR conventions linked to tasks.

**sdd-plan** derives roadmap, milestones, and releases from generated spec.

If the team uses Linear, GitHub Issues, or another external tool, SDD workflow can be omitted and spec remains the contract.

---

## Why `configure` sections

Group the six sections into **three decision levels** (easier to explain than six loose files):

### 1. Principles — *what kind of system it is*

File: `engineering-principles.md`

- Product type (application vs platform).
- Surfaces (web, mobile-native, hybrid).
- Backend strategy, data, etc.
- **No concrete technologies** — describes where the system is headed, not which libraries.

### 2. Decisions — *how it is structured*

File: `engineering-decisions.md`

- Repository organization (monorepo vs independent repos).
- **Business Modeling** (DDD, CRUD, event-driven…).
- Authentication, testing, observability, code organization.
- Still mostly stack-agnostic; fixes the shape of the system.

### 3. Conventions — *how the team writes*

File: `engineering-conventions.md`

- Naming, documentation, team-level UX consistency.
- Shared practices that apply to all code.

### 4. Patterns — *cross-cutting contract per feature*

| File | What it fixes |
| --- | --- |
| `engineering-frontend-patterns.md` | Async states, loading, notifications, filters |
| `engineering-backend-patterns.md` | Response envelope, errors, pagination |
| `engineering-contribution-patterns.md` | Branches, PRs, environment promotion |

**Message:** *configure does not choose React or Postgres; it defines the rules of the game before **sdd-technical** chooses the stack and **sdd-spec** generates aligned APIs and UI.*

Files under `brief/technical/` must align with patterns in `spec/technical/*-api.md` and `*-ui.md`.

---

## Greenfield flow (demo reference)

Canonical order documented in [FLOW-GREENFIELD.md](./FLOW-GREENFIELD.md) and [README.md](../README.md):

| Step | Skill / command | Purpose |
| --- | --- | --- |
| 0 | `sdd-studio init` or TUI *Create brief scaffold* | Brief stubs + assistant skills |
| 1 | `sdd-studio configure` | Engineering Brief |
| 2 | **sdd-idea** | Business Brief |
| 3 | **sdd-technical** | `engineering-stack.md` |
| 3b | **sdd-find-skills** *(optional)* | Implementation skills from stack and strategies |
| 4 | TUI *Create spec scaffold* or `init --spec` | Empty folders in `spec/` |
| 5 | **sdd-spec** | Domain files in `spec/` |
| 6 | `sdd-studio configure-workflow` | Methodology and task conventions |
| 7 | **sdd-plan** | Roadmap, milestones, releases |

**Flexible:** you may start with **sdd-idea** before step 1; once the product is clear, run **configure**, then **sdd-technical**.

At each demo step, say one sentence: *"Now we answer question X; the output goes in Y."*

---

## What to expect from a greenfield product

In greenfield, the "document that describes the app the user wants to build" **is not a loose PDF or repo README**. It is the **Business Brief** under `.workspace/brief/business/<version>/`, generated with **sdd-idea** from a discovery conversation.

It consists of **two complementary files**:

### 1. `product-principles.md` — Conceptual foundations

**Question:** What conceptual principles is the product built on?

**For whom:** Designer, developer, or AI who needs to understand *what the product represents* without entering screens or code.

**Required sections (in this order):**

1. **What the product represents** — What it is and what it is not.
2. **Primary unit** — The central concept (e.g. task, order, workspace).
3. **Immutable concepts** — Ideas that must not break as the product evolves.
4. **How the product understands the business** — Value, business mental model.
5. **Principles for future features** — Rules to decide if something fits.
6. **Shared mental model** — Common language between design, development, and AI.

**Does not include:** screens, user journeys, APIs, stack, DDD domains, tasks.

### 2. `product-guide.md` — The app told from the user

**Question:** How does the product work for a user?

**For whom:** Anyone who needs to understand the product in **non-technical** language.

**Format:**

- Continuous user journey, **one H2 per experience** (e.g. *Create account*, *Verify email*, *Dashboard*).
- Experiences separated with `---`.
- In each experience: what the user sees, what they do, where they go next.

**Does not include:** APIs, stack, architecture, loose feature lists, principles (those go in `product-principles.md`), domains, or spec.

**It is the functional source of truth** that **sdd-spec** transforms into structured domains. Spec **must not invent** functionality that is not in the Product Guide.

### Quick checklist before moving to spec

- [ ] Can a designer understand the product reading only `product-guide.md`?
- [ ] Can a developer understand conceptual boundaries with `product-principles.md`?
- [ ] Are there `TODO:` markers where uncertainty remains? (valid in early access)
- [ ] Were technical decisions kept out of the business brief?

### What is **not** part of the greenfield product document

| Content | Where it goes | When |
| --- | --- | --- |
| Stack (React, DB, hosting…) | `engineering-stack.md` | **sdd-technical** |
| API/UI patterns | `engineering-*-patterns.md` | **configure** |
| Domains, rules, endpoints | `spec/` | **sdd-spec** |
| MVP, Beta, releases | `workflow/` | **sdd-plan** |

Beta, trial, or commercial product "version 1.0" are planned as **milestones** in workflow, not as Product Guide sections.

---

## Validation and verifiable contract

SDD Studio is not just nice documentation:

- Spec and workflow validation scripts (invoked from skills).
- Technical brief patterns that must appear in `*-api.md` and `*-ui.md`.
- `manifest.yaml` to know which brief version is active.

Useful for a technical audience: show a complete domain in `spec/` (e.g. `task`) and how it inherits patterns from the engineering brief.

---

## Suggested slides (15–18 slides)

0. Title + slogan (*Knowledge Workspace for AI Development*)
1. Origin: React, AI, and "still fighting the same battles"
2. Problem: AI without a contract
3. What the Brief is (agency analogy → product)
4. Where it lives: monorepo vs orchestrator repo
5. Audience: product designers + developers
6. State: early access — feedback welcome
7. SDD cycle (Idea → Code)
8. `.workspace/` map (one question per folder)
9. Brief vs Spec vs Workflow
10. Why domain lives in spec
11. `manifest.yaml`: current / target / aligned_with
12. Skills: division of labor
13. Configure: principles → decisions → conventions → patterns
14. What to expect in greenfield (`product-principles` + `product-guide`)
15. Greenfield flow (step table)
16. Demo / screenshots / video
17. What SDD Studio does NOT do (does not generate `src/`)
18. How to start (`npx sdd-studio`, [LOCAL.md](./LOCAL.md))

---

## Elevator pitch messages

| Audience | Message |
| --- | --- |
| **General** | SDD Studio — *Knowledge Workspace for AI Development*: brief, spec, patterns, and agents in one place so AI stops inventing. |
| **Origin (30 s)** | Developing in React with AI for years. AI goes faster, but without a shared contract I keep correcting APIs, UI, and lost context. SDD Studio is the workspace where the team and AI read the same rules. |
| **Developers** | Spec first, code after; each skill has one job. Monorepo or orchestrator repo with submodules — full context matters. |
| **Product designers** | The Product Guide is the user story; spec and code derive from it. The brief is like the product requirements document. |
| **Architecture** | Configure fixes decisions and patterns; stack comes later and spec applies them. Orchestrator repo when front and back are already separate. |

---

## What SDD Studio does NOT do

- Does not generate application code in `src/`.
- Does not replace management tools (Linear, Jira) if the team does not want SDD workflow.
- Does not replace human judgment in discovery — **sdd-idea** facilitates and structures the conversation.
- Does not guarantee perfect spec in one pass; early access assumes iteration and feedback.

---

## Related resources

| Document | Content |
| --- | --- |
| [WORKSPACE-ARCHITECTURE.md](./WORKSPACE-ARCHITECTURE.md) | Complete file and folder tree |
| [FLOW-GREENFIELD.md](./FLOW-GREENFIELD.md) | Greenfield flow step by step (TUI + skills) |
| [FLOW-BROWNFIELD.md](./FLOW-BROWNFIELD.md) | Projects with existing code |
| [SKILLS.md](./SKILLS.md) | Skills catalog |
| [LOCAL.md](./LOCAL.md) | Local testing and demo |
| [README.md](../README.md) | Installation, CLI, and skills table |

---

## Title slide (example)

```text
SDD Studio
Knowledge Workspace for AI Development

The space where brief, spec, patterns, and agents
give AI the full product context.

v0.8.0 — early access — your feedback counts
```

---

## Suggested presentation closing

1. Show `.workspace/brief/manifest.yaml` and a business brief version.
2. Show a domain in `spec/` generated from the Product Guide.
3. Invite trying it with a real or temporary project.
4. Ask for explicit feedback: what confused, what was missing, what was extra.

*SDD Studio is evolving. Every team that tries it on a real greenfield helps sharpen the model, configure questions, and skill quality.*

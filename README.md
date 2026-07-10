# sdd-studio

Bootstrap a **Specification Driven Development (SDD)** workspace for AI-assisted projects.

SDD Studio targets **web, mobile-native, and hybrid** client applications — not terminal-only or CLI-primary products.

The CLI prepares your folder structure and assistant-specific SDD skills. The intelligence lives in the skills — not in this tool.

```bash
npx sdd-studio
```

Or use subcommands directly:

```bash
npx sdd-studio init
```

## What it does

`sdd-studio init` scaffolds by default:

- `.workspace/brief/business/` — product principles and narrative product guide
- `.workspace/brief/technical/` — engineering stubs (completed via `configure` + skills)
- Assistant files — skills, rules, or commands for your chosen AI tool

It does **not** create `.workspace/spec/` or `.workspace/workflow/` unless you opt in:

- **Spec scaffold** — TUI menu *Create spec scaffold*, or `init --spec` / `init --yes --spec`
- **Workflow scaffold** — TUI *Configure Workflow* (creates folders as needed), or `init --workflow` / `init --yes --workflow`

After foundation, use **sdd-spec** to fill `.workspace/spec/business/` and `.workspace/spec/technical/`.

It does **not** generate application code (`src/`, `tests/`, etc.). You implement after the spec is ready.

## Official cycle

```text
Idea → Brief → Specification → Planning → Implementation → Code
```

## Document map

| Location | Question |
| -------- | -------- |
| `.workspace/brief/business/` | What product do we want to build? |
| `.workspace/brief/technical/` | How do we decide to build it? |
| `.workspace/spec/business/` | How does the business work? |
| `.workspace/spec/technical/` | How must it be implemented? |
| `.workspace/workflow/` | How do we organize the work? (optional) |

The Product Guide is the root of functional knowledge. Specification derives entirely from it.

## Quick start

```bash
mkdir my-product && cd my-product
npx sdd-studio init
```

Non-interactive (defaults to Cursor, without workflow):

```bash
npx sdd-studio init --yes --assistant cursor
```

Include the SDD workflow module:

```bash
npx sdd-studio init --yes --assistant cursor --workflow
```

Then run the **sdd-idea** skill (or `/sdd-idea` in OpenCode) to complete the Business Brief under `.workspace/brief/business/`.

The interactive TUI (`sdd-studio`) starts with **Greenfield** and a main menu: foundation, spec scaffold, configure engineering, configure workflow, and sync. Engineering configuration is a separate step:

```bash
npx sdd-studio configure
```

Non-interactive defaults for the Engineering Brief:

```bash
npx sdd-studio init --yes --assistant cursor --engineering
```

### Migrating an existing workspace

If your project was created with sdd-studio 0.4.x (flat `project.md` and `spec/` layout) or 0.5.x (`development.md`, `modeling.md`, `stack/`):

```bash
npx sdd-studio migrate
```

## Updating assistant files

After upgrading `sdd-studio`, refresh assistant files without touching your `.workspace/`:

```bash
npx sdd-studio sync
```

Sync only skills (keep your rules or project instructions as-is):

```bash
npx sdd-studio sync --skills
```

Requires an existing SDD project (`.workspace/brief/technical/engineering-principles.md`, legacy `.workspace/project.md`, or installed assistant skills from a prior `init`).

## Assistant-specific layout

`--assistant` controls which AI tooling receives the SDD skills:

| Assistant | Project instructions | Skills / commands |
| --------- | ---------------------- | ----------------- |
| `cursor` (default) | `.cursor/rules/sdd-studio.mdc` | `.cursor/skills/sdd-*/` |
| `claude` | `CLAUDE.md` | `.claude/skills/sdd-*/` |
| `codex` | `AGENTS.md` | `.agents/skills/sdd-*/` (+ `agents/openai.yaml` per skill) |
| `opencode` | — | `.opencode/commands/sdd-*.md` (+ assets in `.opencode/sdd-studio/`) |
| `copilot` | `.github/copilot-instructions.md` | `.github/agents/sdd-*.agent.md` + `.github/prompts/sdd-*.prompt.md` (+ assets in `.github/sdd-studio/`) |

`.workspace/` is identical for all assistants.

```bash
npx sdd-studio init --yes --assistant claude
npx sdd-studio init --yes --assistant codex
npx sdd-studio init --yes --assistant opencode
npx sdd-studio init --yes --assistant copilot
npx sdd-studio sync --assistant opencode
npx sdd-studio sync --assistant copilot
```

### Merge-safe install

If `.cursor/skills/`, `.opencode/commands/`, or similar folders already exist with your own skills or commands, `init` adds only the SDD files and **does not delete** unrelated entries. Run `sync` to overwrite SDD files from the package.

## Generated structure (Cursor)

```
./
├── .workspace/
│   ├── brief/
│   │   ├── business/
│   │   │   ├── product-principles.md
│   │   │   └── product-guide.md
│   │   └── technical/
│   │       ├── engineering-principles.md   # sdd-studio configure
│   │       ├── engineering-decisions.md    # sdd-studio configure
│   │       ├── engineering-conventions.md  # sdd-studio configure
│   │       ├── engineering-frontend-patterns.md  # sdd-studio configure
│   │       ├── engineering-backend-patterns.md   # sdd-studio configure
│   │       ├── engineering-contribution-patterns.md  # sdd-studio configure
│   │       └── engineering-stack.md        # sdd-technical (generated)
│   ├── spec/                   # Create spec scaffold (separate step)
│   │   ├── business/
│   │   │   ├── domain/
│   │   │   ├── relations/
│   │   │   ├── capabilities/
│   │   │   ├── flows/
│   │   │   ├── rules/
│   │   │   ├── security/
│   │   │   └── events/
│   │   └── technical/
│   │       ├── api/
│   │       ├── ui/
│   │       ├── testing/
│   │       ├── architecture/
│   │       └── database/
│   └── workflow/               # only with --workflow
│       ├── roadmap/
│       ├── milestones/
│       └── releases/
│           └── release-001/
│               ├── release.md
│               ├── tasks.md
│               ├── reviews.md
│               └── decisions.md
└── .cursor/                    # Cursor only
    ├── rules/sdd-studio.mdc
    └── skills/
        ├── sdd-idea/
        ├── sdd-technical/
        ├── sdd-generate/
        ├── sdd-spec/
        ├── sdd-review/
        └── sdd-plan/
```

### OpenCode layout

```
./
├── .workspace/                 # same as above
└── .opencode/
    ├── commands/
    │   ├── sdd-idea.md
    │   ├── sdd-technical.md
    │   ├── sdd-generate.md
    │   ├── sdd-spec.md
    │   ├── sdd-review.md
    │   └── sdd-plan.md
    └── sdd-studio/             # STANDARDS, EXAMPLES, validation scripts
        ├── sdd-idea/
        ├── sdd-spec/
        └── ...
```

Invoke with `/sdd-idea`, `/sdd-spec`, etc.

### GitHub Copilot layout

```
./
├── .workspace/                 # same as above
└── .github/
    ├── copilot-instructions.md # repo-wide SDD context (always on)
    ├── agents/
    │   ├── sdd-idea.agent.md
    │   ├── sdd-technical.agent.md
    │   ├── sdd-generate.agent.md
    │   ├── sdd-spec.agent.md
    │   ├── sdd-review.agent.md
    │   └── sdd-plan.agent.md
    ├── prompts/
    │   ├── sdd-idea.prompt.md
    │   └── ...
    └── sdd-studio/             # STANDARDS, EXAMPLES, validation scripts
        ├── sdd-idea/
        └── ...
```

- **Agents** (`.github/agents/*.agent.md`): specialist personas with full SDD instructions ([custom agents](https://docs.github.com/en/copilot/reference/custom-agents-configuration)).
- **Prompts** (`.github/prompts/*.prompt.md`): slash commands that delegate to the matching agent ([prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files)).
- Invoke prompts with `/sdd-idea`, `/sdd-spec`, etc. in VS Code or select the agent from the dropdown.

## Skill workflow

See [FLOW-GREENFIELD.md](./FLOW-GREENFIELD.md) for the full greenfield path (TUI menu + skills).

### Greenfield

| Step | Skill / command | Purpose |
| ---- | ----------------- | ------- |
| 0 | `sdd-studio init` or TUI *Create brief scaffold* | Brief stubs + assistant skills |
| 1 | `sdd-studio configure` | Engineering Brief (principles, decisions, conventions, patterns) |
| 2 | **sdd-idea** | Business Brief (`product-principles.md`, `product-guide.md`) |
| 3 | **sdd-technical** | Interactive stack selection → `engineering-stack.md` |
| 4 | TUI *Create spec scaffold* or `init --spec` | Empty `.workspace/spec/` folders |
| 5 | **sdd-spec** | Generate domain files under `spec/` |
| 6 | `sdd-studio configure-workflow` | Workflow methodology and task conventions |
| 7 | **sdd-plan** | Roadmap, milestones, releases under `.workspace/workflow/` |

You may start with **sdd-idea** before step 1; after the product is defined, run configure, then **sdd-technical**.

### Existing codebase

| Skill | Purpose |
| ----- | ------- |
| **sdd-generate** | Explore code, compare with Brief/spec, propose gaps; align workspace (conservative) |
| **sdd-review** / **sdd-plan** | After spec is aligned |

Invoke skills explicitly in your AI assistant. Do not implement without a specification.

## CLI reference

Launch the Terminal UI (default):

```bash
sdd-studio
```

Subcommands:

```bash
sdd-studio init [options]
sdd-studio configure
sdd-studio configure-workflow
sdd-studio migrate
sdd-studio sync [options]
```

| Command | Description |
| ------- | ----------- |
| `(default)` | Launch the SDD Studio Terminal UI |
| `init` | Scaffold a new SDD workspace (foundation only by default) |
| `configure` | Configure the Engineering Brief (TUI) |
| `configure-workflow` | Configure workflow methodology and task conventions (TUI) |
| `migrate` | Migrate a legacy workspace to the Engineering Brief structure |
| `sync` | Update assistant files from the installed package |

| Option | Description |
| ------ | ----------- |
| `--yes` | Skip prompts; use defaults (`init` only) |
| `--assistant <id>` | `cursor` (default), `claude`, `codex`, `opencode`, or `copilot` |
| `--spec` | Include `.workspace/spec/` scaffold (`init` only, default: off) |
| `--workflow` | Include `.workspace/workflow/` scaffold (`init` only, default: off) |
| `--engineering` | Write default Engineering Brief answers (`init --yes` only) |
| `--skills` | Sync only skills/commands, not instructions or rules (`sync` only) |

All assistants install the same six SDD skills with provider-native paths.

## Requirements

- Node.js **20+**
- npm or npx

## Philosophy

| Layer | Responsibility |
| ----- | -------------- |
| **Brief** | Project context — business and technical decisions |
| **Specification** | Formal product definition — business and technical |
| **Workflow** | Work organization only |
| **CLI** | Scaffold folders, templates, and assistant setup |
| **Skills** | Discovery, specification, review, and planning |
| **You** | Implementation in your codebase |

The Brief explains what we build and how we decide to build it. The Specification is the formal source of truth. The Workflow is the plan.

## License

MIT

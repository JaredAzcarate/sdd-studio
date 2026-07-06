# sdd-studio

Bootstrap a **Specification Driven Development (SDD)** workspace for AI-assisted projects.

The CLI prepares your folder structure and assistant-specific SDD skills. The intelligence lives in the skills — not in this tool.

```bash
npx sdd-studio init
```

## What it does

`sdd-studio init` scaffolds by default:

- `.workspace/project.md` — technical and development configuration
- `.workspace/product-principles.md` — conceptual product principles
- `.workspace/product-guide.md` — narrative product guide (user journey)
- `.workspace/spec/` — structured technical and functional specification (domain files)
- Assistant files — skills, rules, or commands for your chosen AI tool

Optionally, with `--workflow`:

- `.workspace/workflow/` — SDD planning (roadmap, milestones, releases, tasks)

If you manage tasks elsewhere (Linear, GitHub Issues, etc.), skip the workflow module and use **sdd-plan** later only when you want SDD-native planning.

It does **not** generate application code (`src/`, `tests/`, etc.). You implement after the spec is ready.

## Official cycle

```text
Idea → Product Principles → Product Guide → Specification → Planning → Implementation
```

## Document map

| Location | Question |
| -------- | -------- |
| `.workspace/product-principles.md` | What conceptual principles is the product built on? |
| `.workspace/product-guide.md` | How does the product work for a user? |
| `.workspace/project.md` | How will we develop this product? |
| `.workspace/spec/` | How is the product specified? |
| `.workspace/workflow/` | How do we organize the work? (optional SDD planning module) |

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

Then run the **sdd-idea** skill (or `/sdd-idea` in OpenCode) to complete `.workspace/product-principles.md`, `.workspace/product-guide.md`, and `.workspace/project.md`.

## Updating assistant files

After upgrading `sdd-studio`, refresh assistant files without touching your `.workspace/`:

```bash
npx sdd-studio sync
```

Sync only skills (keep your rules or project instructions as-is):

```bash
npx sdd-studio sync --skills
```

Requires an existing SDD project (`.workspace/project.md` or installed assistant skills from a prior `init`).

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
│   ├── project.md
│   ├── product-principles.md
│   ├── product-guide.md
│   ├── spec/
│   │   ├── domain/
│   │   ├── relations/
│   │   ├── capabilities/
│   │   ├── flows/
│   │   ├── rules/
│   │   ├── security/
│   │   ├── events/
│   │   ├── api/
│   │   ├── ui/
│   │   └── testing/
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

### Greenfield

| Skill | Purpose |
| ----- | ------- |
| **sdd-idea** | Discover product; write `product-principles.md`, `product-guide.md`, and `project.md` |
| **sdd-spec** | Read product guide + project; generate domain files under `.workspace/spec/` |
| **sdd-review** | Analyze changes; update `product-guide.md` and/or `.workspace/spec/` |
| **sdd-plan** | Read project + product guide + spec; generate `.workspace/workflow/` |

### Existing codebase

| Skill | Purpose |
| ----- | ------- |
| **sdd-generate** | Explore code, compare with spec, propose gaps; generate or align spec (conservative) |
| **sdd-review** / **sdd-plan** | After spec is aligned |

Invoke skills explicitly in your AI assistant. Do not implement without a specification.

## CLI reference

```bash
sdd-studio init [options]
sdd-studio sync [options]
```

| Command | Description |
| ------- | ----------- |
| `init` | Scaffold a new SDD workspace |
| `sync` | Update assistant files from the installed package |

| Option | Description |
| ------ | ----------- |
| `--yes` | Skip prompts; use defaults (`init` only) |
| `--assistant <id>` | `cursor` (default), `claude`, `codex`, `opencode`, or `copilot` |
| `--workflow` | Include `.workspace/workflow/` scaffold (`init` only, default: off) |
| `--skills` | Sync only skills/commands, not instructions or rules (`sync` only) |

All assistants install the same five SDD skills with provider-native paths.

## Requirements

- Node.js **20+**
- npm or npx

## Philosophy

| Layer | Responsibility |
| ----- | -------------- |
| **CLI** | Scaffold folders, templates, and assistant setup |
| **Skills** | Discovery, product guide, specification, review, and planning |
| **You** | Implementation in your codebase |

The product guide explains the product. The specification is the technical source of truth. The workflow is the plan.

## License

MIT

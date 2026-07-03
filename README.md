# sdd-studio

Bootstrap a **Specification Driven Development (SDD)** workspace for AI-assisted projects.

The CLI prepares your folder structure and Cursor skills. The intelligence lives in the skills — not in this tool.

```bash
npx sdd-studio init
```

## What it does

`sdd-studio init` scaffolds:

- `workspace/project.md` — technical and development configuration
- `workspace/user-manual.md` — user-facing product manual (narrative)
- `workspace/spec/` — structured technical and functional specification (domain files)
- `workspace/workflow/` — planning (roadmap, milestones, releases, tasks)
- `.cursor/` — SDD skills and rules (when Cursor is selected)

It does **not** generate application code (`src/`, `tests/`, etc.). You implement after the spec is ready.

## Official cycle

```text
Idea → User Manual → Specification → Planning → Implementation
```

## Four questions

| Location | Question |
| -------- | -------- |
| `workspace/project.md` | How will we develop this product? |
| `workspace/user-manual.md` | How does this product work for a user? |
| `workspace/spec/` | How is the product specified? |
| `workspace/workflow/` | How do we organize the work? |

## Quick start

```bash
mkdir my-product && cd my-product
npx sdd-studio init
```

Non-interactive (defaults to Cursor):

```bash
npx sdd-studio init --yes --assistant cursor
```

Then in Cursor, run the **sdd-idea** skill to complete `workspace/project.md` and `workspace/user-manual.md`.

## Updating assistant files

After upgrading `sdd-studio`, refresh Cursor skills and rules without touching your `workspace/`:

```bash
npx sdd-studio sync
```

Sync only skills (keep your `.cursor/rules/` as-is):

```bash
npx sdd-studio sync --skills
```

Requires an existing SDD project (`workspace/project.md` or `.cursor/skills/` from a prior `init`).

## Generated structure

```
./
├── workspace/
│   ├── project.md
│   ├── user-manual.md
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
│   └── workflow/
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

## Skill workflow

### Greenfield

| Skill | Purpose |
| ----- | ------- |
| **sdd-idea** | Discover product idea; write `project.md` and `user-manual.md` |
| **sdd-spec** | Read project + user manual; generate domain files under `workspace/spec/` |
| **sdd-review** | Analyze changes; update `user-manual.md` and/or `workspace/spec/` |
| **sdd-plan** | Read project + user manual + spec; generate `workspace/workflow/` |

### Existing codebase

| Skill | Purpose |
| ----- | ------- |
| **sdd-generate** | Explore code, compare with spec, propose gaps; generate or align spec (conservative) |
| **sdd-review** / **sdd-plan** | After spec is aligned |

Invoke skills explicitly in Cursor. Do not implement without a specification.

## CLI reference

```bash
sdd-studio init [options]
sdd-studio sync [options]
```

| Command | Description |
| ------- | ----------- |
| `init` | Scaffold a new SDD workspace |
| `sync` | Update `.cursor/` skills and rules from the installed package |

| Option | Description |
| ------ | ----------- |
| `--yes` | Skip prompts; use defaults (`init` only) |
| `--assistant <id>` | `cursor` (default), `claude`, or `codex` |
| `--skills` | Sync only `.cursor/skills/` (`sync` only) |

`claude` and `codex` are reserved for future releases; only Cursor installs skills today.

## Requirements

- Node.js **20+**
- npm or npx

## Philosophy

| Layer | Responsibility |
| ----- | -------------- |
| **CLI** | Scaffold folders, templates, and assistant setup |
| **Skills** | Discovery, user manual, specification, review, and planning |
| **You** | Implementation in your codebase |

The user manual explains the product. The specification is the technical source of truth. The workflow is the plan.

## License

MIT

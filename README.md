# sdd-studio

Bootstrap a **Specification Driven Development (SDD)** workspace for AI-assisted projects.

The CLI prepares your folder structure and Cursor skills. The intelligence lives in the skills — not in this tool.

```bash
npx sdd-studio init
```

## What it does

`sdd-studio init` scaffolds:

- `workspace/spec/` — product specification (vision, domains, APIs, flows, rules, …)
- `workspace/workflow/` — planning (roadmap, milestones, releases, tasks)
- `.cursor/` — SDD skills and rules (when Cursor is selected)

It does **not** generate application code (`src/`, `tests/`, etc.). You implement after the spec is ready.

## Quick start

```bash
mkdir my-product && cd my-product
npx sdd-studio init
```

Non-interactive (defaults to Cursor):

```bash
npx sdd-studio init --yes --assistant cursor
```

Then in Cursor, run the **sdd-idea** skill to complete `workspace/spec/vision.md`.

## Generated structure

```
./
├── workspace/
│   ├── spec/
│   │   ├── vision.md
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
        ├── sdd-spec/
        ├── sdd-review/
        └── sdd-plan/
```

## Skill workflow

| Skill | Purpose |
| ----- | ------- |
| **sdd-idea** | Discover the problem; write `workspace/spec/vision.md` |
| **sdd-spec** | Read the vision; generate the full `workspace/spec/` tree |
| **sdd-review** | Analyze change requests; update only the specification |
| **sdd-plan** | Read validated spec; generate `workspace/workflow/` |

Invoke skills explicitly in Cursor. Do not implement without a specification.

## CLI reference

```bash
sdd-studio init [options]
```

| Option | Description |
| ------ | ----------- |
| `--yes` | Skip prompts; use defaults |
| `--assistant <id>` | `cursor` (default), `claude`, or `codex` |

`claude` and `codex` are reserved for future releases; only Cursor installs skills today.

## Requirements

- Node.js **20+**
- npm or npx

## Philosophy

| Layer | Responsibility |
| ----- | -------------- |
| **CLI** | Scaffold folders, templates, and assistant setup |
| **Skills** | Discovery, specification, review, and planning |
| **You** | Implementation in your codebase |

The specification is the source of truth. The workflow is the plan.

## License

MIT

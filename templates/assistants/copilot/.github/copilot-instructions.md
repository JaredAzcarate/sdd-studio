# SDD Studio

This project uses **Specification Driven Development (SDD)**.

## Official cycle

```text
Idea → Product Principles → Product Guide → Specification → Planning → Implementation
```

Each stage answers a different question.

## Document map

| Location | Question |
| -------- | -------- |
| `.workspace/product-principles.md` | What conceptual principles is the product built on? |
| `.workspace/product-guide.md` | How does the product work for a user? |
| `.workspace/project.md` | How will we develop this product? |
| `.workspace/spec/` | How is the product specified? |
| `.workspace/workflow/` | How do we organize the work to build it? |

## Entry points

- Read `.workspace/product-principles.md` for durable conceptual foundations.
- Read `.workspace/project.md` for technical and development configuration.
- Read `.workspace/product-guide.md` for the complete user journey (narrative, non-technical).
- Read `.workspace/spec/` for structured technical and functional specification.
- Never mix principles into journeys, technical details into `product-guide.md`, or user-facing content into `project.md`.

## Source of truth

| Folder / file | Content | Forbidden |
| ------------- | ------- | --------- |
| `.workspace/product-principles.md` | Conceptual product principles | screens, journeys, APIs, stack |
| `.workspace/project.md` | Technical configuration | principles, product guide, domains, tasks |
| `.workspace/product-guide.md` | Product guide (user journey) | principles, APIs, stack, architecture, domains, tasks |
| `.workspace/spec/` | Structured specification | narrative user docs, principles, tasks, releases, roadmap |
| `.workspace/workflow/` | Planning and execution | business rules, domains, product guide |

Product Principles ground the product. The Product Guide is the **root of functional knowledge** for user-facing behavior. Specification derives from the Product Guide.

## Skill flow

### Greenfield (no code yet)

1. **sdd-idea** — discover product; write `.workspace/product-principles.md`, `.workspace/product-guide.md`, and `.workspace/project.md`
2. **sdd-spec** — read product guide + project; generate domain files under `.workspace/spec/`
3. **sdd-review** — analyze changes; update `product-guide.md` and/or `.workspace/spec/`
4. **sdd-plan** — read project + product guide + spec; generate `.workspace/workflow/`

### Existing codebase (brownfield)

1. **sdd-generate** — explore code + workspace; compare; propose gaps; generate or align spec (conservative; approval required)
2. **sdd-review** / **sdd-plan** — as needed after spec is aligned

Use custom agents in `.github/agents/` or prompt files in `.github/prompts/` (for example `/sdd-idea`). Do not implement without a specification.

## Conventions

- Domain files: `<domain>-<category>.md` in the matching category folder
- Workflow: `roadmap-NNN.md`, `milestone-NNN.md`, `release-NNN/`
- IDs: `TASK-NNN`, `RELEASE-NNN`, `DECISION-NNN`
- Only category folders allowed at the top level of `spec/` (narrative docs belong in `.workspace/product-guide.md`)

Read each skill's STANDARDS.md under `.github/sdd-studio/` before generating or modifying files.

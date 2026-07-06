
# SDD Studio

This project uses **Specification Driven Development (SDD)**.

## Official cycle

```text
Idea → Brief → Specification → Planning → Implementation → Code
```

Each stage answers a different question.

## Document map

| Location | Question |
| -------- | -------- |
| `.workspace/brief/business/product-principles.md` | What conceptual principles is the product built on? |
| `.workspace/brief/business/product-guide.md` | How does the product work for a user? |
| `.workspace/brief/technical/development.md` | How will we develop this product? |
| `.workspace/brief/technical/modeling.md` | How do we model the product? |
| `.workspace/brief/technical/stack/*.md` | What technologies do we use? |
| `.workspace/spec/business/` | How is the product specified (business)? |
| `.workspace/spec/technical/` | How is the product specified (technical)? |
| `.workspace/workflow/` | How do we organize the work to build it? |

## Entry points

- Read `.workspace/brief/business/product-principles.md` for durable conceptual foundations.
- Read `.workspace/brief/business/product-guide.md` for the complete user journey (narrative, non-technical).
- Read `.workspace/brief/technical/` for development decisions, modeling, and stack.
- Read `.workspace/spec/business/` and `.workspace/spec/technical/` for structured specification.
- Never mix principles into journeys, technical details into `product-guide.md`, or user-facing content into the Technical Brief.

## Source of truth

| Folder / file | Content | Forbidden |
| ------------- | ------- | --------- |
| `.workspace/brief/business/product-principles.md` | Conceptual product principles | screens, journeys, APIs, stack |
| `.workspace/brief/business/product-guide.md` | Product guide (user journey) | principles, APIs, stack, architecture, domains, tasks |
| `.workspace/brief/technical/development.md` | Development model and conventions | specific technologies, product narrative |
| `.workspace/brief/technical/modeling.md` | Modeling approach and DDD context | stack details, user journeys |
| `.workspace/brief/technical/stack/*.md` | Technology choices per layer | product behavior, domains, tasks |
| `.workspace/spec/business/` | Business specification (domains, flows, rules, …) | narrative user docs, principles, tasks, releases |
| `.workspace/spec/technical/` | Technical specification (api, ui, architecture, …) | narrative user docs, principles, tasks, releases |
| `.workspace/workflow/` | Planning and execution | business rules, domains, brief content |

Product Principles ground the product. The Product Guide is the **root of functional knowledge** for user-facing behavior. Specification derives from the Brief.

## Skill flow

### Greenfield (no code yet)

1. **sdd-idea** — discover product; write `.workspace/brief/` (business + technical)
2. **sdd-spec** — read entire brief/; generate domain files under `.workspace/spec/business/` and `.workspace/spec/technical/`
3. **sdd-review** — analyze changes; update Brief and/or Specification
4. **sdd-plan** — read brief/ + spec/; generate `.workspace/workflow/`

### Existing codebase (brownfield)

1. **sdd-generate** — explore code + workspace; compare; propose gaps; generate or align brief/ and spec/ (conservative; approval required)
2. **sdd-review** / **sdd-plan** — as needed after brief and spec are aligned

Invoke skills explicitly. Do not implement without a specification.

## Conventions

- Brief: `brief/business/` (product-principles, product-guide) + `brief/technical/` (development, modeling, stack/*)
- Spec: only `business/` and `technical/` at the top level of `spec/`
- Domain files: `<domain>-<category>.md` in the matching category folder
- Workflow: `roadmap-NNN.md`, `milestone-NNN.md`, `release-NNN/`
- IDs: `TASK-NNN`, `RELEASE-NNN`, `DECISION-NNN`

Read each skill's STANDARDS.md before generating or modifying files.

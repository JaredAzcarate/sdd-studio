# STANDARDS — sdd-idea

Mandatory rules for generating `workspace/spec/vision.md`.

## Location

- Exact path: `workspace/spec/vision.md`
- There is **one** vision file per project
- Do not create `vision/` or additional vision files

## Required content

`vision.md` describes only:

- product vision
- problem to solve
- objectives
- scope
- context

It must not include:

- domains or entities (that is **sdd-spec**)
- tasks, releases, roadmap, or milestones
- API contracts, detailed flows, or per-domain business rules
- estimates or planning

## Document structure

```markdown
# [Product name]

## Vision

[Product vision in 2–4 sentences]

---

## Problem

[Problem to solve and current context]

---

## Objectives

- [Measurable objective 1]
- [Measurable objective 2]

---

## Scope

### In Scope

- ...

### Out of Scope

- ...

---

## Context

- **Stack / language:** ...
- **Architecture preference:** ...
- **Code organization:** ...
- **Modeling:** (e.g. DDD, if applicable)
- **Assistant:** ...

---

## Assumptions

- ...

---

## Risks

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| ...  | ...    | ...        |

---

## Success Criteria

- [Verifiable criterion]

---

## Next Step

Run **sdd-spec** to discover domains and generate the specification.
```

## Format rules

1. Single H1 heading with the product name
2. Main sections with H2 (`##`)
3. Do not skip heading levels (H1 → H2 → H3)
4. Use lists for objectives, assumptions, and criteria
5. Use tables only for risks when appropriate
6. Separate main sections with `---`
7. Do not duplicate content that belongs in domain documents

## Writing rules

- Be explicit and verifiable
- Mark uncertainty with `TODO:` and ask the user
- Technical context must reflect what was agreed with the user during discovery; do not invent values
- If the user did not define the product name, ask before writing the H1

## Prohibitions

- Do not create files outside `workspace/spec/vision.md`
- Do not modify `workspace/workflow/`
- Do not use file names other than `vision.md`
- Do not mix planning with vision

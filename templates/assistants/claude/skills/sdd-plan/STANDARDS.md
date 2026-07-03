# STANDARDS — sdd-plan

Mandatory rules for generating files in `.workspace/workflow/`.

## Principle

`workflow/` represents planning. It **never** describes functional product behavior.

Do not modify `.workspace/spec/`. If spec is missing information, report and suggest **sdd-review**.

## Structure

```text
.workspace/workflow/

    roadmap/

    milestones/

    releases/
```

Do not create additional folders or files except future standard extensions.

## Roadmaps

Location: `workflow/roadmap/roadmap-NNN.md` (NNN = 3 digits)

Required content:

- identifier (`ROADMAP-NNN`)
- objective
- scope
- priorities
- associated releases

## Milestones

Location: `workflow/milestones/milestone-NNN.md`

Milestones are **not** versions. Examples: MVP, Beta, First Customer, Version 1.0.

Required content:

- identifier (`MILESTONE-NNN`)
- name
- objective
- completion criteria
- related releases

## Releases

Location: `workflow/releases/release-NNN/`

Each folder contains **exactly**:

```text
release.md
tasks.md
reviews.md
decisions.md
```

### release.md

- identifier (`RELEASE-NNN`)
- version
- name
- objective
- status
- related milestone
- scope
- dates (if any)

### tasks.md

All tasks in a single document. Do not create one file per task.

Each task includes at minimum:

| Field | Required |
| ----- | -------- |
| id | yes (`TASK-NNN`) |
| title | yes |
| description | yes |
| epic | yes |
| priority | yes |
| status | yes |
| owner | optional |
| dependencies | optional |

Suggested statuses: `pending`, `in_progress`, `done`, `blocked`.

### reviews.md

Each review includes:

- id (`REVIEW-NNN`)
- related task
- reviewer
- result
- notes

### decisions.md

Each decision includes:

- id (`DECISION-NNN`)
- title
- context
- decision made
- justification
- impact

## Identifier convention

```text
ROADMAP-001
MILESTONE-001
RELEASE-001
TASK-001
REVIEW-001
DECISION-001
```

Identifiers are **never** reused.

## File numbering

- `roadmap-001.md`, `roadmap-002.md`, ...
- `milestone-001.md`, `milestone-002.md`, ...
- `release-001/`, `release-002/`, ...

## Format

1. One H1 per document
2. H2 for main sections
3. Do not skip heading levels
4. Separate sections with `---`
5. Tables for task, review, and decision lists

## Traceability

Each task must reference spec:

- `spec/capabilities/<domain>-capabilities.md`
- `spec/flows/<domain>-flows.md`
- or relevant domain document

## Validation

```bash
node .claude/skills/sdd-plan/scripts/validate-workflow.mjs .workspace/workflow
```

Do not finish until exit code is 0.

## Prohibitions

- Do not modify `.workspace/spec/`
- Do not create `index.md` in roadmap or milestones
- Do not add extra files inside `release-NNN/`
- Do not invent IDs outside the `TYPE-NNN` pattern

# EXAMPLES — sdd-review

Review scenarios and affected files.

## Scenario 1 — New `comment` domain

**Request:** "Add comments on tasks."

**Impact:**

| Action | File |
| ------ | ---- |
| create | `domain/comment-domain.md` |
| create | `relations/comment-relations.md` |
| create | `capabilities/comment-capabilities.md` |
| create | `flows/comment-flows.md` |
| create | `rules/comment-rules.md` |
| create | `security/comment-security.md` |
| create | `events/comment-events.md` |
| create | `api/comment-api.md` |
| create | `ui/comment-ui.md` |
| create | `testing/comment-testing.md` |
| update | `relations/task-relations.md` (Task → Comment) |

**Proposal to user:**

```markdown
## Change summary
Add Comment domain linked to Task.

## Files to modify
| File | Action |
| ---- | ------ |
| comment-*.md (×10) | create |
| relations/task-relations.md | update |
```

## Scenario 2 — Business rule change

**Request:** "Only the creator can cancel a task."

**Impact:**

| Action | File |
| ------ | ------- |
| update | `rules/task-rules.md` |
| update | `security/task-security.md` |
| update | `flows/task-flows.md` (new Cancel flow) |
| update | `testing/task-testing.md` |

Do not touch `workflow/`.

## Scenario 3 — Endpoint change

**Request:** "POST /tasks now accepts priority."

**Impact:**

| Action | File |
| ------ | ------- |
| update | `api/task-api.md` |
| update | `domain/task-domain.md` (priority attribute) |
| update | `ui/task-ui.md` (form field) |
| update | `testing/task-testing.md` |

## Scenario 4 — Scope change (requires product-guide.md)

**Request:** "Include native mobile app in MVP."

**Action:**

1. Ask for confirmation (contradicts out of scope in `product-guide.md`)
2. Only with approval: update `product-guide.md` affected experiences
3. Then update domain spec according to new scope

## Anti-example — Incorrect

**Request:** "Add TASK-005 to implement comments."

**Correct response:** reject workflow edits. Propose spec change; suggest **sdd-plan** to generate TASK-005.

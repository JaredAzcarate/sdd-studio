# EXAMPLES — sdd-review

Review scenarios and affected files.

## Scenario 1 — New `comment` domain

**Request:** "Add comments on tasks."

**Impact:**

| Action | File |
| ------ | ---- |
| create | `business/domain/comment-domain.md` |
| create | `business/relations/comment-relations.md` |
| create | `business/capabilities/comment-capabilities.md` |
| create | `business/flows/comment-flows.md` |
| create | `business/rules/comment-rules.md` |
| create | `business/security/comment-security.md` |
| create | `business/events/comment-events.md` |
| create | `technical/api/comment-api.md` |
| create | `technical/ui/comment-ui.md` |
| create | `technical/testing/comment-testing.md` |
| create | `technical/architecture/comment-architecture.md` |
| create | `technical/database/comment-database.md` |
| update | `business/relations/task-relations.md` (Task → Comment) |

**Proposal to user:**

```markdown
## Change summary
Add Comment domain linked to Task.

## Files to modify
| File | Action |
| ---- | ------ |
| comment-*.md (×12) | create |
| business/relations/task-relations.md | update |
```

## Scenario 2 — Business rule change

**Request:** "Only the creator can cancel a task."

**Impact:**

| Action | File |
| ------ | ------- |
| update | `business/rules/task-rules.md` |
| update | `business/security/task-security.md` |
| update | `business/flows/task-flows.md` (new Cancel flow) |
| update | `technical/testing/task-testing.md` |

Do not touch `workflow/`.

## Scenario 3 — Endpoint change

**Request:** "POST /tasks now accepts priority."

**Impact:**

| Action | File |
| ------ | ------- |
| update | `technical/api/task-api.md` |
| update | `business/domain/task-domain.md` (priority attribute) |
| update | `technical/ui/task-ui.md` (form field) |
| update | `technical/testing/task-testing.md` |

## Scenario 4 — Scope change (requires product-guide.md)

**Request:** "Include native mobile app in MVP."

**Action:**

1. Ask for confirmation (contradicts out of scope in `brief/business/product-guide.md`)
2. Only with approval: update `product-guide.md` affected experiences
3. Then update domain spec according to new scope

## Scenario 5 — Stack change (requires brief/technical/)

**Request:** "Migrate from PostgreSQL to MongoDB."

**Action:**

1. Update `brief/technical/stack/database.md`
2. Update affected `technical/database/<domain>-database.md` files
3. Verify `technical/architecture/<domain>-architecture.md` consistency

## Anti-example — Incorrect

**Request:** "Add TASK-005 to implement comments."

**Correct response:** reject workflow edits. Propose spec change; suggest **sdd-plan** to generate TASK-005.

# EXAMPLES — sdd-spec

Reference domain: `task`. Generate the 12 spec files per domain (Brief files come from **sdd-idea** or **sdd-generate**).

## spec/business/domain/task-domain.md

```markdown
# Task

## Purpose

Represent an assignable unit of work within a team.

---

## Description

A task has a title, description, owner, status, and dates. It is the core of the TaskFlow product.

---

## Attributes

| Attribute   | Type     | Required | Description           |
| ----------- | -------- | -------- | --------------------- |
| id          | UUID     | yes      | Unique identifier     |
| title       | string   | yes      | Short title           |
| description | string   | no       | Optional detail       |
| status      | enum     | yes      | pending, active, done |
| assigneeId  | UUID     | no       | Responsible user      |
| dueDate     | datetime | no       | Due date              |

---

## States

- pending
- active
- done
- cancelled

---

## Responsibilities

- Record work to be done
- Transition between valid states
- Notify relevant changes via events

---

## Notes

See `task-relations.md` for links to User and Team.
```

## spec/business/relations/task-relations.md

```markdown
# Task Relationships

## Incoming Relations

- User assigns tasks (assignee)
- Team groups tasks

---

## Outgoing Relations

- Task belongs to a Team

---

## Cardinality

- Task → User (assignee): many to one
- Team → Task: one to many

---

## Ownership

- Task is owned by the Task domain
- User and Team are external domains referenced by ID

---

## Notes
```

## spec/business/capabilities/task-capabilities.md

```markdown
# Task Capabilities

## Capability List

### Create Task

Description

Create a new task in pending state.

Preconditions

Authenticated user with create permission.

Result

Task persisted with assigned ID.

---

### Update Task

Description

Modify editable attributes of an existing task.

Preconditions

Task exists and user has edit permission.

Result

Task updated; Task Updated event emitted.

---

### Complete Task

Description

Mark task as done.

Preconditions

Task in active or pending state.

Result

Status done; Task Completed event emitted.
```

## spec/business/flows/task-flows.md

```markdown
# Task Flows

## Flow: Create Task

### Actor

Team Member

### Preconditions

Authenticated user.

### Steps

1. User requests task creation with title
2. System validates data
3. System persists task in pending

### Result

Task created and visible on the board.

---

## Flow: Complete Task

### Actor

Assignee

### Preconditions

Task assigned to user; active state.

### Steps

1. User marks task as complete
2. System validates transition
3. System updates status to done

### Result

Task closed; metrics updated.
```

## spec/business/rules/task-rules.md

```markdown
# Task Rules

## Validation Rules

- Title cannot be empty
- dueDate cannot be before creation date

---

## Business Rules

- Only the assignee or an admin can complete the task
- Cancelled tasks cannot return to active

---

## Lifecycle Rules

- pending → active → done
- pending → cancelled
- active → cancelled

---

## Constraints

- Maximum 500 active tasks per team in MVP
```

## spec/business/security/task-security.md

```markdown
# Task Security

## Roles

- member
- admin

---

## Permissions

| Action        | member | admin |
| ------------- | ------ | ----- |
| create        | yes    | yes   |
| update own    | yes    | yes   |
| update any    | no     | yes   |
| complete own  | yes    | yes   |
| delete        | no     | yes   |

---

## Authorization Rules

- member edits only tasks where they are assignee
- admin operates on any task in the team

---

## Policies

- OAuth authentication required for all operations
```

## spec/business/events/task-events.md

```markdown
# Task Events

## Event List

### Task Created

Description

Emitted when a task is created.

Trigger

Successful Create Task.

Consumers

Notification, Analytics

---

### Task Completed

Description

Emitted when transitioning to done.

Trigger

Successful Complete Task.

Consumers

Notification, Analytics
```

## spec/technical/api/task-api.md

```markdown
# Task API

> Technical contract implemented in the product repo. Primary surface: **Server Actions**. **Route Handlers** only when an HTTP endpoint is required.

## Server Actions

Module: `<resolved-code-root>/domains/task/application/actions/task-actions.ts`

### createTask

Purpose

Create a task in the user's board.

Input

    { title: string; assigneeId?: string; dueDate?: string }

Output

    { taskId: string; status: "pending" }

Errors

ValidationError, UnauthorizedError

---

### completeTask

Purpose

Mark task as done.

Input

    { taskId: string }

Output

    { status: "done" }

Errors

NotFoundError, ForbiddenError

---

## Route Handlers

None required for this domain in the current scope.

---

## Notes

See `brief/technical/engineering-stack.md` (Backend + API sections). Module path follows **Project Organization** in `brief/technical/engineering-decisions.md`.
```

## spec/technical/ui/task-ui.md

```markdown
# Task UI

## Screens

- Task Board (columns by status)
- Task Detail (modal or page)

---

## Components

- TaskCard
- TaskForm
- StatusBadge

---

## User Actions

- Create task from "+" button
- Drag card between columns (status change)
- Open detail on click

---

## Messages

- "Task created successfully"
- "You don't have permission to edit this task"

---

## Validations

- Title required in form
- Inline message if title is empty

---

## Navigation

Board → Task Detail → back to Board
```

## spec/technical/testing/task-testing.md

```markdown
# Task Testing

## Acceptance Scenarios

- User creates task and it appears in pending column
- Assignee completes task and it moves to done

---

## Success Cases

- Create with valid title
- Complete from active

---

## Validation Cases

- Reject empty title
- Reject dueDate in the past

---

## Error Cases

- member tries to edit another user's task
- Complete cancelled task

---

## Edge Cases

- Create task without assignee
- 500 active tasks in team (MVP limit)
```

## spec/technical/architecture/task-architecture.md

```markdown
# Task Architecture

## Module Structure

- `<resolved-code-root>/domains/task/domain/` — Task entity, state transitions, invariants
- `<resolved-code-root>/domains/task/application/` — CreateTask, CompleteTask use cases, Server Actions
- `<resolved-code-root>/domains/task/infrastructure/` — PostgreSQL repository, event publisher

---

## Layer Responsibilities

- Domain: Task entity, state transitions, invariants
- Application: CreateTask, UpdateTask, CompleteTask use cases
- Infrastructure: PostgreSQL repository, message bus

---

## Integration Points

- User module (assignee validation)
- Team module (ownership)
- Notification service (event consumers)

---

## Dependencies

- `brief/technical/engineering-decisions.md` — Project Organization (domain folder layout)
- `brief/technical/engineering-modeling.md` — DDD aggregate boundaries
- `brief/technical/engineering-stack.md` — Server Actions surface (Backend + API sections)

---

## Notes

Replace `<resolved-code-root>` per **Project Organization** in `engineering-decisions.md` (e.g. repo root or `numo-app/`).
```

## spec/technical/database/task-database.md

```markdown
# Task Database

## Tables

### tasks

| Column      | Type        | Required | Description           |
| ----------- | ----------- | -------- | --------------------- |
| id          | uuid        | yes      | Primary key           |
| title       | varchar(255)| yes      | Short title           |
| description | text        | no       | Optional detail       |
| status      | varchar(20) | yes      | pending, active, done |
| assignee_id | uuid        | no       | FK to users           |
| team_id     | uuid        | yes      | FK to teams           |
| due_date    | timestamptz | no       | Due date              |
| created_at  | timestamptz | yes      | Creation timestamp    |
| updated_at  | timestamptz | yes      | Last update           |

---

## Indexes

- `idx_tasks_team_status` on (team_id, status)
- `idx_tasks_assignee` on (assignee_id)

---

## Constraints

- status CHECK in ('pending', 'active', 'done', 'cancelled')
- title NOT NULL and length > 0

---

## Migrations

- `001_create_tasks_table.sql`

---

## Notes

See `brief/technical/engineering-stack.md` (Database section) for PostgreSQL conventions.
```

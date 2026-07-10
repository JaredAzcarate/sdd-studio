# Brownfield Flow — SDD Studio

Source of truth for the happy path on **brownfield** projects (existing code).

## Conventions

| Concept | Value |
| -------- | ----- |
| CLI | `npx sdd-studio` or `sdd-studio` |
| Brownfield menu | TUI **Brownfield** when starting `sdd-studio` |
| Migrate legacy | `sdd-studio migrate` or TUI **Migrate** |
| Skills | Invoke in your chosen assistant (`/sdd-generate`, skill **sdd-generate**, etc.) |

### Canonical skill order

```text
migrate (if legacy) → sdd-generate → [sdd-review] → sdd-plan
```

For stack or architecture changes:

```text
Configure Refactor Engineering → sdd-technical (target) → Promote Engineering Target
```

### Brief versioning

The brownfield brief uses **semver folders** and a central manifest:

| File / folder | Role |
| ----------------- | --- |
| `.workspace/brief/manifest.yaml` | `current`, `target`, and `archived` pointers per lane |
| `.workspace/brief/business/<semver>/` | Versioned Business Brief (`0.1.0`, `0.2.0`, …) |
| `.workspace/brief/technical/<semver>/` | Versioned Technical Brief |
| `.workspace/spec/` | Living spec, aligned with versions declared in the manifest |

**`manifest.yaml` contract (schema: 1):**

```yaml
schema: 1

business:
  current: "0.1.0"
  target: null
  archived: []

technical:
  current: "0.1.0"
  target: "0.2.0"  # or null if no draft in progress
  archived: []

spec:
  aligned_with:
    business: "0.1.0"
    technical: "0.1.0"
```

- **Full semver** in folder names: `0.1.0`, not `0.1`.
- **`current`**: active version of the lane.
- **`target`**: draft of the next version (`null` if no work in progress).
- **`archived`**: preserved previous versions.
- **`spec.aligned_with`**: brief versions the spec is aligned with.

**Flat** legacy layouts (`brief/business/product-guide.md` without semver) are detected when `manifest.yaml` is missing; migrate with **Migrate** before using versioned path resolution.

### `.workspace/` map

| Folder | Question |
| ------- | -------- |
| `brief/manifest.yaml` | Which version of each lane is active or in draft? |
| `brief/business/<semver>/` | What product does this version describe? |
| `brief/technical/<semver>/` | How do we decide to build it in this version? |
| `spec/business/` + `spec/technical/` | How is it specified (aligned to the manifest)? |
| `workflow/` | How do we organize the work? (optional, post-spec) |

---

## 1. Terminal startup

When you run `sdd-studio`, the TUI asks:

- **Greenfield** — see `FLOW-GREENFIELD.md`
- **Brownfield** — flow in this document

### Main menu (Brownfield)

| Option | What it does |
| ------ | -------- |
| **Create brief scaffold** | `manifest.yaml` + `0.1.0` stubs + skills (incl. `sdd-generate`) |
| **Create spec scaffold** | Empty folders `spec/business/` and `spec/technical/` |
| **Configure Refactor Engineering** | Creates `target` version and configures Technical Brief sections |
| **Promote Engineering Target** | Promotes `technical.target` → `current` in the manifest |
| **Migrate** | Flat legacy layout → versioned brief with `manifest.yaml` |
| **Sync Assistant Files** | Updates packaged skills |
| **Exit** | Closes the TUI |

> **Configure Workflow** is not in the brownfield menu; use `sdd-studio configure-workflow` after spec, same as greenfield.

---

## 2. Foundation — Create brief scaffold

The CLI creates the brownfield structure with manifest and initial semver folders (`0.1.0`).

**Generates:**

- `.workspace/brief/manifest.yaml`
- `.workspace/brief/business/0.1.0/` — stubs `product-principles.md`, `product-guide.md`
- `.workspace/brief/technical/0.1.0/` — engineering stubs (no stack)
- Assistant skills (`.cursor/skills/`, etc.), including **sdd-generate**

**Does not generate:** full spec, `workflow/`, `engineering-stack.md`, application code.

**Next step:** open chat and run **sdd-generate**.

---

## 3. Migrate (legacy only)

If the workspace was created before semver versioning (no `manifest.yaml`):

- TUI **Migrate** or `sdd-studio migrate`
- Moves flat files to `brief/business/0.1.0/` and `brief/technical/0.1.0/`
- Archives `engineering-modeling.md` if it existed
- Writes `manifest.yaml`

**Next step:** continue with **sdd-generate** or **Configure Refactor Engineering**.

---

## 4. Discovery — sdd-generate

The user starts a chat and runs **sdd-generate**.

The AI analyzes existing code and completes the Brief at paths resolved by `manifest.yaml` (`current` lane by default).

**Generates or completes:**

### Business (`brief/business/<semver>/`)

- `product-guide.md`
- `product-principles.md`

### Technical (`brief/technical/<semver>/`)

- `engineering-principles.md`
- `engineering-decisions.md`
- `engineering-conventions.md`
- `engineering-frontend-patterns.md`
- `engineering-backend-patterns.md`
- `engineering-contribution-patterns.md`
- `engineering-stack.md` (when applicable)
- `engineering-inventory.md` (inventory phase, when applicable)

If information cannot be inferred with confidence, the skill asks the user instead of assuming.

---

## 5. Specifications — sdd-generate (continued)

After the Brief, **sdd-generate** identifies domains, flows, and technical surfaces and generates spec under `.workspace/spec/`, aligned with `spec.aligned_with` in the manifest.

### Business

- Domains, Relations, Capabilities, Flows, Rules, Security, Events, **Decisions** (`spec/business/decisions/`)

### Technical

- API, UI, Testing, Architecture, Database

**Next step:** review with the user or **sdd-review**.

---

## 6. Review — sdd-review (optional)

Validates changes against Brief or Specification. The user may correct, complete, or request partial regeneration until documentation reflects the project.

---

## 7. Technical Brief evolution — Configure Refactor Engineering

For a new version of stack or architecture decisions (e.g. `0.1.0` → `0.2.0`):

### 7.1 Start refactor (TUI)

**Configure Refactor Engineering**:

1. Creates folder `brief/technical/<target>/` (e.g. `0.2.0`)
2. Updates `manifest.yaml` (`technical.target`)
3. Does **not copy** files at start
4. Loads form answers from `technical.current` (current values)

### 7.2 Configure by section

The user chooses sections in the dashboard (principles, decisions, conventions, patterns):

- Each completed section **writes immediately** to `brief/technical/<target>/`
- After each section, a prompt appears:
  - **Continue configuring** — return to the dashboard for another section
  - **Finalize refactor** — copy from `current` any **unmodified** files (e.g. `engineering-stack.md` if untouched)

Shortcut: **`f`** from the dashboard to finalize without opening another section.

### 7.3 Publish

1. Run **sdd-technical** against the `target` version
2. TUI **Promote Engineering Target** (or edit `manifest.yaml` manually):
   - `technical.current` ← `technical.target`
   - `technical.target` ← `null`
   - previous version → `technical.archived`
   - `spec.aligned_with.technical` updated

Path resolution uses `current` or `target`; if `target` is `null`, draft paths are not resolved.

---

## 8. Workflow and planning

After aligned spec:

| Choice | Action |
| -------- | ------ |
| **SDD Studio** | `sdd-studio configure-workflow` → `.workspace/workflow/` |
| **Linear / GitHub Issues / other** | **sdd-plan** without SDD workflow |

**sdd-plan** reads brief + spec + workflow config (if applicable) and generates releases under `workflow/`.

---

## 9. Iterative cycle

| Skill / command | When |
| --------------- | ------ |
| **sdd-generate** | Bootstrap or brownfield re-sync |
| **sdd-review** | Validate changes against Brief or spec |
| **sdd-plan** | Plan work on existing spec |
| **migrate** | Flat legacy → versioned brief |
| **Configure Refactor Engineering** | New Technical Brief version |
| **Promote Engineering Target** | Publish `target` as `current` |

---

## Diagram

```mermaid
flowchart LR
  INIT[Versioned brief + manifest] --> GEN[sdd-generate]
  GEN --> BRIEF[Completes semver Brief]
  BRIEF --> SPEC[Generates aligned spec]
  SPEC --> REV{sdd-review?}
  REV -->|Yes| GEN
  REV -->|No| REF{Refactor tech?}
  REF -->|Yes| CFG[Configure Refactor Engineering]
  CFG --> TECH[sdd-technical target]
  TECH --> PROM[Promote Engineering Target]
  REF -->|No| WF{Workflow?}
  PROM --> WF
  WF -->|SDD Studio| CW[configure-workflow]
  WF -->|External| PLAN[sdd-plan]
  CW --> PLAN
```

---

## Out of scope (this document)

- Application code (`src/`, `tests/` of the target product)
- `engineering-modeling.md` — archived on migrate; domain in **sdd-spec**
- Spec snapshots (`spec/_snapshots/`) — not supported

## Infrastructure

Modules in the `sdd-studio` package:

- `src/workspace/manifest.ts` — read, write, and validate `manifest.yaml`
- `src/workspace/brief-paths.ts` — resolve `current` / `target` paths per lane
- `src/workspace/technical-version.ts` — `prepareTechnicalTargetVersion`, `finalizeTechnicalTargetVersion`, `promoteTechnicalTarget`
- Brownfield TUI — full menu with refactor and promote

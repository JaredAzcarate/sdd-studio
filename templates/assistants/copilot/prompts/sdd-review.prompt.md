---
name: sdd-review
description: Analyzes change requests against .workspace/product-guide.md, .workspace/project.md, and .workspace/spec/, detects impacts and inconsistencies, updates product-guide and specification files per SDD Studio standards, and validates with validate-spec.mjs. Use when reviewing spec changes or when the user invokes /sdd-review. Never modifies .workspace/workflow/.
agent: sdd-review
argument-hint: Optional context, goals, or constraints for this SDD step
---

${input:context:Describe the task context or paste relevant notes}

Run the **sdd-review** workflow using the `sdd-review` custom agent.

Before writing files, read:
- `.github/sdd-studio/sdd-review/STANDARDS.md`
- `.github/sdd-studio/sdd-review/EXAMPLES.md` (if present)

Follow the agent instructions exactly.
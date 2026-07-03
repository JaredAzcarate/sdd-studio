---
name: sdd-plan
description: Reads .workspace/project.md, .workspace/product-guide.md, and validated .workspace/spec/ to generate or update .workspace/workflow/ with roadmaps, milestones, releases, tasks, reviews, and decisions per SDD Studio conventions. Use when planning from spec or when the user invokes /sdd-plan. Never modifies .workspace/spec/, .workspace/product-guide.md, or .workspace/project.md.
agent: sdd-plan
argument-hint: Optional context, goals, or constraints for this SDD step
---

${input:context:Describe the task context or paste relevant notes}

Run the **sdd-plan** workflow using the `sdd-plan` custom agent.

Before writing files, read:
- `.github/sdd-studio/sdd-plan/STANDARDS.md`
- `.github/sdd-studio/sdd-plan/EXAMPLES.md` (if present)

Follow the agent instructions exactly.
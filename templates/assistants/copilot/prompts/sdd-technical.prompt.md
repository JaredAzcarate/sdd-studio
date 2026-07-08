---
name: sdd-technical
description: Guides interactive, section-by-section technology selection from the Engineering Brief and writes engineering-stack.md with user-confirmed choices only. Acts as Software Architect. Use when the engineering brief is complete and the stack must be defined, or when the user invokes /sdd-technical. Never modifies engineering input files or writes .workspace/spec/.
agent: sdd-technical
argument-hint: Optional context, goals, or constraints for this SDD step
---

${input:context:Describe the task context or paste relevant notes}

Run the **sdd-technical** workflow using the `sdd-technical` custom agent.

**Default: modo conciso** — one phase per message, multiple-choice only. User may request `modo verbose` for full analysis.

Before writing files, read:
- `.github/sdd-studio/sdd-technical/STANDARDS.md`
- `.github/sdd-studio/sdd-technical/EXAMPLES.md`

Follow the agent instructions exactly.

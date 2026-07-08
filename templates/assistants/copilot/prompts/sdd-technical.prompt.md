---
name: sdd-technical
description: >-
  Guides interactive stack selection as a fullstack developer / technical auditor
  talking with the team. Reads the Engineering Brief, proposes technologies per
  surface (web, mobile, backend, …) via multiple-choice, writes
  engineering-stack.md with confirmed choices only. Use when the engineering
  brief is complete and the stack must be defined, or when the user invokes
  /sdd-technical. Never modifies engineering input files or writes
  .workspace/spec/.
agent: sdd-technical
argument-hint: Optional context, goals, or constraints for this SDD step
---

${input:context:Describe the task context or paste relevant notes}

Run the **sdd-technical** workflow using the `sdd-technical` custom agent.

**Default:** conversational — one numbered question per message, options derived from the Brief. User may request `modo verbose` for full analysis.

Before writing files, read:
- `.github/sdd-studio/sdd-technical/STANDARDS.md`
- `.github/sdd-studio/sdd-technical/EXAMPLES.md`

Follow the agent instructions exactly.

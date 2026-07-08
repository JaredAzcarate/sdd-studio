---
name: sdd-technical
description: Analyzes the Engineering Brief under .workspace/brief/technical/ and generates engineering-stack.md with a coherent, justified technology stack. Acts as Software Architect. Use when the engineering brief is complete and technologies must be recommended, or when the user invokes /sdd-technical. Never modifies engineering input files or writes .workspace/spec/.
agent: sdd-technical
argument-hint: Optional context, goals, or constraints for this SDD step
---

${input:context:Describe the task context or paste relevant notes}

Run the **sdd-technical** workflow using the `sdd-technical` custom agent.

Before writing files, read:
- `.github/sdd-studio/sdd-technical/STANDARDS.md`
- `.github/sdd-studio/sdd-technical/EXAMPLES.md`

Follow the agent instructions exactly.

---
name: sdd-spec
description: Reads the entire .workspace/brief/ (business and technical), discovers domains through questions, and generates the full specification tree under .workspace/spec/business/ and .workspace/spec/technical/ using SDD Studio naming conventions. Use when specifying domains, APIs, flows, or when the user invokes /sdd-spec.
agent: sdd-spec
argument-hint: Optional context, goals, or constraints for this SDD step
---

${input:context:Describe the task context or paste relevant notes}

Run the **sdd-spec** workflow using the `sdd-spec` custom agent.

Before writing files, read:
- `.github/sdd-studio/sdd-spec/STANDARDS.md`
- `.github/sdd-studio/sdd-spec/EXAMPLES.md`

Follow the agent instructions exactly.

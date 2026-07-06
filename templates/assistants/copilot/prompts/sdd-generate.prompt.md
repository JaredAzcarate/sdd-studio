---
name: sdd-generate
description: Explores the codebase and workspace brief/spec, compares implementation against SDD conventions, proposes gaps and inconsistencies, and generates or updates .workspace/brief/ and domain spec files with conservative user approval. Use for existing projects, missing spec, spec drift, or when the user invokes /sdd-generate.
agent: sdd-generate
argument-hint: Optional context, goals, or constraints for this SDD step
---

${input:context:Describe the task context or paste relevant notes}

Run the **sdd-generate** workflow using the `sdd-generate` custom agent.

Before writing files, read:
- `.github/sdd-studio/sdd-generate/STANDARDS.md`
- `.github/sdd-studio/sdd-generate/EXAMPLES.md`

Follow the agent instructions exactly.
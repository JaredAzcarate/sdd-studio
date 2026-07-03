import { createSkillsBasedAssistantStrategy } from "./skills-based.strategy.js";

export const claudeAssistantStrategy = createSkillsBasedAssistantStrategy({
  id: "claude",
  skillsDir: ".claude/skills",
  instructionsFile: "CLAUDE.md",
});

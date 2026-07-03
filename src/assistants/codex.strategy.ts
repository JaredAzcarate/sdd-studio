import { createSkillsBasedAssistantStrategy } from "./skills-based.strategy.js";

export const codexAssistantStrategy = createSkillsBasedAssistantStrategy({
  id: "codex",
  skillsDir: ".agents/skills",
  instructionsFile: "AGENTS.md",
});

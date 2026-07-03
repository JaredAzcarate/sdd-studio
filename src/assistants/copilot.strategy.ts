import { createSkillsBasedAssistantStrategy } from "./skills-based.strategy.js";

export const copilotAssistantStrategy = createSkillsBasedAssistantStrategy({
  id: "copilot",
  skillsDir: ".github/agents",
  instructionsFile: ".github/copilot-instructions.md",
});

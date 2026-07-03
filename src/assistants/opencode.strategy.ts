import { createSkillsBasedAssistantStrategy } from "./skills-based.strategy.js";

export const opencodeAssistantStrategy = createSkillsBasedAssistantStrategy({
  id: "opencode",
  skillsDir: ".opencode/commands",
  instructionsFile: "",
});

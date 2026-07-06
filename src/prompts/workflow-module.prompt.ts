import { confirm } from "@inquirer/prompts";

export async function promptWorkflowModule(): Promise<boolean> {
  return confirm({
    message:
      "Include the SDD workflow module (roadmap, milestones, releases, tasks)?",
    default: false,
  });
}

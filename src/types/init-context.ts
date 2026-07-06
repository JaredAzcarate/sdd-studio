import { z } from "zod";

export const assistantIdSchema = z.enum([
  "cursor",
  "claude",
  "codex",
  "opencode",
  "copilot",
]);

export const workspaceModulesSchema = z.object({
  workflow: z.boolean(),
});

export const initContextSchema = z.object({
  targetDir: z.string().min(1),
  assistant: assistantIdSchema,
  modules: workspaceModulesSchema,
});

export type WorkspaceModules = z.infer<typeof workspaceModulesSchema>;

export type AssistantId = z.infer<typeof assistantIdSchema>;
export type InitContext = z.infer<typeof initContextSchema>;

export type InitContextLabels = {
  assistant: string;
};

export type InitContextWithLabels = InitContext & {
  labels: InitContextLabels;
};

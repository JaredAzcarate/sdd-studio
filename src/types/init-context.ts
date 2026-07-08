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

export const engineeringConfigSchema = z.object({
  answers: z.record(z.string(), z.string()),
});

export const initContextSchema = z.object({
  targetDir: z.string().min(1),
  assistant: assistantIdSchema,
  modules: workspaceModulesSchema,
  engineering: engineeringConfigSchema.optional(),
});

export type WorkspaceModules = z.infer<typeof workspaceModulesSchema>;

export type EngineeringConfig = z.infer<typeof engineeringConfigSchema>;

export type AssistantId = z.infer<typeof assistantIdSchema>;
export type InitContext = z.infer<typeof initContextSchema>;

export type InitContextLabels = {
  assistant: string;
};

export type InitContextWithLabels = InitContext & {
  labels: InitContextLabels;
};

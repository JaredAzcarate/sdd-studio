import { z } from "zod";

export const assistantIdSchema = z.enum(["cursor", "claude", "codex", "opencode"]);

export const initContextSchema = z.object({
  targetDir: z.string().min(1),
  assistant: assistantIdSchema,
});

export type AssistantId = z.infer<typeof assistantIdSchema>;
export type InitContext = z.infer<typeof initContextSchema>;

export type InitContextLabels = {
  assistant: string;
};

export type InitContextWithLabels = InitContext & {
  labels: InitContextLabels;
};

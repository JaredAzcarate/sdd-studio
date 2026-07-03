import type { AssistantId } from "../types/init-context.js";

export type RegistryItem<T extends string> = {
  id: T;
  label: string;
};

export const ASSISTANTS: RegistryItem<AssistantId>[] = [
  { id: "cursor", label: "Cursor" },
  { id: "claude", label: "Claude Code" },
  { id: "codex", label: "Codex CLI" },
  { id: "opencode", label: "OpenCode" },
  { id: "copilot", label: "GitHub Copilot" },
];

export function getAssistantLabel(id: AssistantId): string {
  return ASSISTANTS.find((item) => item.id === id)?.label ?? id;
}

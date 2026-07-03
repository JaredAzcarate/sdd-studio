import { join } from "node:path";
import { getTemplatesDir } from "../utils/package-root.js";

export function resolveTemplatePath(...segments: string[]): string {
  return join(getTemplatesDir(), ...segments);
}

export function resolveWorkspaceTemplatePath(...segments: string[]): string {
  return resolveTemplatePath("workspace", ...segments);
}

export function resolveAssistantTemplatePath(
  assistantId: string,
  ...segments: string[]
): string {
  return resolveTemplatePath("assistants", assistantId, ...segments);
}

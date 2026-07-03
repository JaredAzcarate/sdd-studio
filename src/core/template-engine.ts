import { readFile } from "node:fs/promises";
import Handlebars from "handlebars";

export async function renderTemplateFile(
  templatePath: string,
  data: Record<string, unknown>,
): Promise<string> {
  const source = await readFile(templatePath, "utf8");
  return renderTemplateString(source, data);
}

export function renderTemplateString(
  source: string,
  data: Record<string, unknown>,
): string {
  const template = Handlebars.compile(source, { noEscape: true });
  return template(data);
}

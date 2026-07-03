import { dirname, join } from "node:path";
import fs from "fs-extra";
import { renderTemplateFile } from "./template-engine.js";

const HANDLEBARS_EXTENSION = ".hbs";

export type CopyTemplateTreeOptions = {
  variables?: Record<string, unknown>;
  overwrite?: boolean;
};

export type CopyTemplateTreeResult = {
  createdPaths: string[];
};

export async function copyTemplateTree(
  sourceDir: string,
  targetDir: string,
  options: CopyTemplateTreeOptions = {},
): Promise<CopyTemplateTreeResult> {
  const { variables = {}, overwrite = false } = options;
  const createdPaths: string[] = [];

  await walkDirectory(sourceDir, targetDir, "", variables, overwrite, createdPaths);

  return { createdPaths };
}

async function walkDirectory(
  sourceDir: string,
  targetDir: string,
  relativePath: string,
  variables: Record<string, unknown>,
  overwrite: boolean,
  createdPaths: string[],
): Promise<void> {
  const currentSourceDir = join(sourceDir, relativePath);
  const currentTargetDir = join(targetDir, relativePath);

  await fs.ensureDir(currentTargetDir);

  const entries = await fs.readdir(currentSourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const entryRelativePath = relativePath
      ? join(relativePath, entry.name)
      : entry.name;
    const sourcePath = join(sourceDir, entryRelativePath);

    if (entry.isDirectory()) {
      await walkDirectory(
        sourceDir,
        targetDir,
        entryRelativePath,
        variables,
        overwrite,
        createdPaths,
      );
      continue;
    }

    const outputFileName = entry.name.endsWith(HANDLEBARS_EXTENSION)
      ? entry.name.slice(0, -HANDLEBARS_EXTENSION.length)
      : entry.name;
    const destinationPath = join(
      targetDir,
      dirname(entryRelativePath),
      outputFileName,
    );

    await fs.ensureDir(dirname(destinationPath));

    if (entry.name.endsWith(HANDLEBARS_EXTENSION)) {
      const rendered = await renderTemplateFile(sourcePath, variables);
      await writeOutputFile(destinationPath, rendered, overwrite);
    } else {
      await copyOutputFile(sourcePath, destinationPath, overwrite);
    }

    createdPaths.push(destinationPath);
  }
}

async function writeOutputFile(
  destinationPath: string,
  content: string,
  overwrite: boolean,
): Promise<void> {
  if (!overwrite && (await fs.pathExists(destinationPath))) {
    throw new Error(`File already exists: ${destinationPath}`);
  }

  await fs.writeFile(destinationPath, content, "utf8");
}

async function copyOutputFile(
  sourcePath: string,
  destinationPath: string,
  overwrite: boolean,
): Promise<void> {
  await fs.copy(sourcePath, destinationPath, {
    overwrite,
    errorOnExist: !overwrite,
  });
}

export async function copyPlainDirectory(
  sourceDir: string,
  targetDir: string,
  overwrite = false,
): Promise<void> {
  await fs.copy(sourceDir, targetDir, {
    overwrite,
    errorOnExist: !overwrite,
  });
}

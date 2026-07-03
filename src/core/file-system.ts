import { dirname, join } from "node:path";
import fs from "fs-extra";
import { renderTemplateFile } from "./template-engine.js";

const HANDLEBARS_EXTENSION = ".hbs";

export type CopyTemplateTreeOptions = {
  variables?: Record<string, unknown>;
  overwrite?: boolean;
  skipIfExists?: boolean;
};

export type CopyTemplateTreeResult = {
  createdPaths: string[];
};

export async function copyTemplateTree(
  sourceDir: string,
  targetDir: string,
  options: CopyTemplateTreeOptions = {},
): Promise<CopyTemplateTreeResult> {
  const { variables = {}, overwrite = false, skipIfExists = false } = options;
  const createdPaths: string[] = [];

  await walkDirectory(
    sourceDir,
    targetDir,
    "",
    variables,
    overwrite,
    skipIfExists,
    createdPaths,
  );

  return { createdPaths };
}

async function walkDirectory(
  sourceDir: string,
  targetDir: string,
  relativePath: string,
  variables: Record<string, unknown>,
  overwrite: boolean,
  skipIfExists: boolean,
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
        skipIfExists,
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

    let copied = false;

    if (entry.name.endsWith(HANDLEBARS_EXTENSION)) {
      const rendered = await renderTemplateFile(sourcePath, variables);
      copied = await writeOutputFile(
        destinationPath,
        rendered,
        overwrite,
        skipIfExists,
      );
    } else {
      copied = await copyOutputFile(
        sourcePath,
        destinationPath,
        overwrite,
        skipIfExists,
      );
    }

    if (copied) {
      createdPaths.push(destinationPath);
    }
  }
}

async function writeOutputFile(
  destinationPath: string,
  content: string,
  overwrite: boolean,
  skipIfExists: boolean,
): Promise<boolean> {
  if (!overwrite && (await fs.pathExists(destinationPath))) {
    if (skipIfExists) {
      return false;
    }

    throw new Error(`File already exists: ${destinationPath}`);
  }

  await fs.writeFile(destinationPath, content, "utf8");
  return true;
}

async function copyOutputFile(
  sourcePath: string,
  destinationPath: string,
  overwrite: boolean,
  skipIfExists: boolean,
): Promise<boolean> {
  if (!overwrite && (await fs.pathExists(destinationPath))) {
    if (skipIfExists) {
      return false;
    }
  }

  await fs.copy(sourcePath, destinationPath, {
    overwrite,
    errorOnExist: !overwrite && !skipIfExists,
  });

  return true;
}

export type CopyTemplateFileOptions = {
  overwrite?: boolean;
  skipIfExists?: boolean;
};

export async function copyTemplateFile(
  sourceFile: string,
  targetFile: string,
  options: CopyTemplateFileOptions | boolean = false,
): Promise<CopyTemplateTreeResult> {
  const resolvedOptions =
    typeof options === "boolean" ? { overwrite: options } : options;
  const overwrite = resolvedOptions.overwrite ?? false;
  const skipIfExists = resolvedOptions.skipIfExists ?? false;

  await fs.ensureDir(dirname(targetFile));

  if (!overwrite && (await fs.pathExists(targetFile))) {
    if (skipIfExists) {
      return { createdPaths: [] };
    }

    throw new Error(`File already exists: ${targetFile}`);
  }

  await fs.copy(sourceFile, targetFile, {
    overwrite: true,
    errorOnExist: !overwrite && !skipIfExists,
  });

  return { createdPaths: [targetFile] };
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

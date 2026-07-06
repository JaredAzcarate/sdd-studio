import { join } from "node:path";

export const SDD_WORKSPACE_DIR = ".workspace";

export const SDD_WORKSPACE_MARKER_PATH = join(
  SDD_WORKSPACE_DIR,
  "brief/technical/development.md",
);

export const SDD_WORKSPACE_LEGACY_MARKER_PATH = join(
  SDD_WORKSPACE_DIR,
  "project.md",
);

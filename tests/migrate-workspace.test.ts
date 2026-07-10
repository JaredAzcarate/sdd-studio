import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { migrateWorkspace } from "../src/generators/migrate-workspace.generator.js";
import { DEFAULT_INITIAL_VERSION } from "../src/workspace/manifest.js";

const BRIEF_VERSION = DEFAULT_INITIAL_VERSION;

describe("migrateWorkspace", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("migrates a legacy flat workspace to versioned brief/spec structure", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-migrate-"));
    const workspaceDir = join(tempDir, ".workspace");

    mkdirSync(join(workspaceDir, "spec/domain"), { recursive: true });
    mkdirSync(join(workspaceDir, "spec/api"), { recursive: true });

    writeFileSync(
      join(workspaceDir, "product-principles.md"),
      "# Product Principles\n",
    );
    writeFileSync(join(workspaceDir, "product-guide.md"), "# Product Guide\n");
    writeFileSync(
      join(workspaceDir, "project.md"),
      `# Project

## Development Model

Specification Driven Development

---

## Workflow Methodology

Kanban

---

## Architecture

Clean Architecture

---

## Modeling

Domain Driven Design

---

## Code Organization

Feature-first

---

## Backend

Node.js

---

## Database

PostgreSQL

---

## Assistant

Cursor
`,
    );
    writeFileSync(join(workspaceDir, "spec/domain/task-domain.md"), "# Task\n");
    writeFileSync(join(workspaceDir, "spec/api/task-api.md"), "# Task API\n");

    const result = await migrateWorkspace({ targetDir: tempDir });

    expect(result.alreadyMigrated).toBe(false);
    expect(result.briefVersion).toBe(BRIEF_VERSION);
    expect(
      readFileSync(
        join(
          workspaceDir,
          `brief/business/${BRIEF_VERSION}/product-principles.md`,
        ),
        "utf8",
      ),
    ).toContain("# Product Principles");
    expect(
      readFileSync(
        join(
          workspaceDir,
          `brief/technical/${BRIEF_VERSION}/engineering-principles.md`,
        ),
        "utf8",
      ),
    ).toContain("# Engineering Principles");
    expect(
      readFileSync(
        join(workspaceDir, "brief/technical/.archived/engineering-modeling.md"),
        "utf8",
      ),
    ).toContain("Domain Driven Design");
    expect(
      existsSync(join(workspaceDir, "brief/manifest.yaml")),
    ).toBe(true);
    expect(
      readFileSync(
        join(workspaceDir, "spec/business/domain/task-domain.md"),
        "utf8",
      ),
    ).toContain("# Task");
    expect(
      readFileSync(
        join(workspaceDir, "spec/technical/api/task-api.md"),
        "utf8",
      ),
    ).toContain("# Task API");
    expect(
      existsSync(
        join(
          workspaceDir,
          `brief/technical/${BRIEF_VERSION}/engineering-modeling.md`,
        ),
      ),
    ).toBe(false);
  });

  it("is idempotent when manifest already exists", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-migrate-"));
    const workspaceDir = join(tempDir, ".workspace");
    const manifest = join(workspaceDir, "brief/manifest.yaml");
    mkdirSync(join(manifest, ".."), { recursive: true });
    writeFileSync(
      manifest,
      `schema: 1
business:
  current: "0.1.0"
  target: null
  archived: []
technical:
  current: "0.1.0"
  target: null
  archived: []
spec:
  aligned_with:
    business: "0.1.0"
    technical: "0.1.0"
`,
    );

    const result = await migrateWorkspace({ targetDir: tempDir });

    expect(result.alreadyMigrated).toBe(true);
  });
});

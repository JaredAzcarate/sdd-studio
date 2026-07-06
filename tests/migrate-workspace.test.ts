import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { migrateWorkspace } from "../src/generators/migrate-workspace.generator.js";

describe("migrateWorkspace", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("migrates a legacy flat workspace to brief/spec structure", async () => {
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
    expect(
      readFileSync(
        join(workspaceDir, "brief/business/product-principles.md"),
        "utf8",
      ),
    ).toContain("# Product Principles");
    expect(
      readFileSync(
        join(workspaceDir, "brief/business/product-guide.md"),
        "utf8",
      ),
    ).toContain("# Product Guide");
    expect(
      readFileSync(
        join(workspaceDir, "brief/technical/development.md"),
        "utf8",
      ),
    ).toContain("Kanban");
    expect(
      readFileSync(join(workspaceDir, "brief/technical/modeling.md"), "utf8"),
    ).toContain("Domain Driven Design");
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
  });

  it("is idempotent when the new marker already exists", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-studio-migrate-"));
    const marker = join(
      tempDir,
      ".workspace/brief/technical/development.md",
    );
    mkdirSync(join(marker, ".."), { recursive: true });
    writeFileSync(marker, "# Development\n");

    const result = await migrateWorkspace({ targetDir: tempDir });

    expect(result.alreadyMigrated).toBe(true);
  });
});

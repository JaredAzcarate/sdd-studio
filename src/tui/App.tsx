import React, { useCallback, useEffect, useMemo, useState } from "react";
import { basename, join } from "node:path";
import { existsSync } from "node:fs";
import { SDD_WORKSPACE_DIR } from "../constants/sdd-workspace-path.js";
import type {
  EngineeringCustomNotes,
  EngineeringSectionId,
} from "../engineering-config/types.js";
import {
  getSectionFileName,
  loadEngineeringAnswersFromWorkspace,
} from "../engineering-config/state/engineering-section-status.js";
import { loadWorkflowAnswersFromWorkspace } from "../workflow-config/state/workflow-section-status.js";
import { buildInitContext } from "../utils/build-init-context.js";
import { initWorkspace } from "../use-cases/init-workspace.use-case.js";
import {
  generateSpecScaffold,
  generateWorkflowScaffold,
} from "../generators/workspace.generator.js";
import { migrateWorkspace } from "../generators/migrate-workspace.generator.js";
import { syncAssistant } from "../use-cases/sync-assistant.use-case.js";
import { formatGenerationResult } from "../utils/format-generation-result.js";
import {
  formatSpecScaffoldError,
  formatSpecScaffoldMissingWorkspace,
  formatSpecScaffoldResult,
} from "../utils/format-spec-scaffold-result.js";
import { formatInitSummary } from "../utils/format-init-summary.js";
import { formatMigrateResult } from "../utils/format-migrate-result.js";
import { formatSyncResult } from "../utils/format-sync-result.js";
import { assertTargetDirectoryAvailable } from "../policies/target-directory.policy.js";
import { readManifest } from "../workspace/manifest.js";
import { resolveTechnicalBriefDirFromManifest } from "../workspace/brief-paths.js";
import {
  finalizeTechnicalTargetVersion,
  prepareTechnicalTargetVersion,
  promoteTechnicalTarget,
} from "../workspace/technical-version.js";
import {
  getWorkspaceDir,
  hasSddWorkspace,
  needsBriefVersioningMigration,
  resolveWorkspaceTechnicalBriefDir,
} from "../workspace/workspace-detection.js";
import { AppLayout } from "./components/AppLayout.js";
import { ContentPanel, NavigationPanel } from "./components/AppPanels.js";
import { getFooterShortcuts, getSectionTitle } from "./app-chrome.js";
import { useStableInput } from "./hooks/use-stable-input.js";
import type { EngineeringSession, WorkflowSession } from "./use-app-input.js";
import { useAppInput } from "./use-app-input.js";
import type { AppScreen, AppState, TuiExitResult } from "./types.js";
import type { AssistantId } from "../types/init-context.js";
import type { WorkflowCustomNotes } from "../workflow-config/types.js";

type SddAppProps = {
  targetDir: string;
  version: string;
  initialScreen?: AppScreen;
  onFinish: (result: TuiExitResult) => void;
};

export function SddApp({
  targetDir,
  version,
  initialScreen = { name: "project-type" },
  onFinish,
}: SddAppProps) {
  const workspaceWorkflowDir = join(targetDir, SDD_WORKSPACE_DIR, "workflow");

  const [screen, setScreen] = useState<AppScreen>(initialScreen);
  const [history, setHistory] = useState<AppScreen[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [projectMode, setProjectMode] = useState<AppState["projectMode"]>(
    initialScreen.name === "brownfield-main-menu" ? "brownfield" : "greenfield",
  );
  const [engineeringPointer, setEngineeringPointer] =
    useState<AppState["engineeringPointer"]>("current");
  const [engineeringBriefDir, setEngineeringBriefDir] = useState<string | null>(
    null,
  );
  const [refactorModifiedSections, setRefactorModifiedSections] = useState<
    EngineeringSectionId[]
  >([]);
  const [engineeringAnswers, setEngineeringAnswers] = useState(
    () => ({} as AppState["engineeringAnswers"]),
  );
  const [engineeringCustomNotes, setEngineeringCustomNotes] = useState(
    () => ({} as EngineeringCustomNotes),
  );
  const [workflowAnswers, setWorkflowAnswers] = useState(
    () => ({} as AppState["workflowAnswers"]),
  );
  const [workflowCustomNotes, setWorkflowCustomNotes] = useState(
    () => ({} as WorkflowCustomNotes),
  );
  const [engineeringSession, setEngineeringSession] =
    useState<EngineeringSession | null>(null);
  const [workflowSession, setWorkflowSession] =
    useState<WorkflowSession | null>(null);
  const [assistant, setAssistant] = useState<AssistantId | undefined>();
  const [resultLines, setResultLines] = useState<string[]>([]);
  const [loadedAnswers, setLoadedAnswers] = useState(false);
  const [loadedWorkflowAnswers, setLoadedWorkflowAnswers] = useState(false);

  const projectName = basename(targetDir) || targetDir;

  useEffect(() => {
    if (screen.name === "engineering-section" && !engineeringSession) {
      setSelectedIndex(0);
      setScreen({ name: "engineering-dashboard" });
    }
  }, [engineeringSession, screen]);

  useEffect(() => {
    if (screen.name === "workflow-section" && !workflowSession) {
      setSelectedIndex(0);
      setScreen({ name: "workflow-dashboard" });
    }
  }, [workflowSession, screen]);

  const state: AppState = useMemo(
    () => ({
      screen,
      targetDir,
      projectName,
      version,
      projectMode,
      engineeringPointer,
      assistant,
      engineeringAnswers,
      engineeringCustomNotes,
      workflowAnswers,
      workflowCustomNotes,
      history,
      engineeringBriefDir,
      refactorModifiedSections,
    }),
    [
      screen,
      targetDir,
      projectName,
      version,
      projectMode,
      engineeringPointer,
      assistant,
      engineeringAnswers,
      engineeringCustomNotes,
      workflowAnswers,
      workflowCustomNotes,
      history,
      engineeringBriefDir,
      refactorModifiedSections,
    ],
  );

  const navigate = useCallback((next: AppScreen) => {
    setSelectedIndex(0);
    setHistory((current) => [...current, screen]);
    setScreen(next);
  }, [screen]);

  const goBack = useCallback(() => {
    setSelectedIndex(0);
    setEngineeringSession(null);
    setWorkflowSession(null);
    setHistory((current) => {
      const previous = current.at(-1);
      if (!previous) {
        setScreen(
          projectMode === "brownfield"
            ? { name: "brownfield-main-menu" }
            : { name: "main-menu" },
        );
        return [];
      }
      setScreen(previous);
      return current.slice(0, -1);
    });
  }, [projectMode]);

  const resetToMainMenu = useCallback(() => {
    setSelectedIndex(0);
    setResultLines([]);
    setEngineeringSession(null);
    setWorkflowSession(null);
    setEngineeringPointer("current");
    setRefactorModifiedSections([]);
    setScreen(
      projectMode === "brownfield"
        ? { name: "brownfield-main-menu" }
        : { name: "main-menu" },
    );
    setHistory([]);
  }, [projectMode]);

  const resolveAndSetEngineeringBriefDir = useCallback(
    async (pointer: "current" | "target"): Promise<string | null> => {
      if (!hasSddWorkspace(targetDir)) {
        return null;
      }

      if (needsBriefVersioningMigration(targetDir)) {
        return join(getWorkspaceDir(targetDir), "brief", "technical");
      }

      try {
        const dir = await resolveWorkspaceTechnicalBriefDir(targetDir, pointer);
        setEngineeringBriefDir(dir);
        return dir;
      } catch {
        return null;
      }
    },
    [targetDir],
  );

  const ensureEngineeringAnswersLoaded = useCallback(
    async (dir: string) => {
      if (loadedAnswers && engineeringBriefDir === dir) {
        return;
      }

      if (existsSync(dir)) {
        const { answers, customNotes } =
          await loadEngineeringAnswersFromWorkspace(dir);
        setEngineeringAnswers(answers);
        setEngineeringCustomNotes(customNotes);
      }

      setLoadedAnswers(true);
    },
    [engineeringBriefDir, loadedAnswers],
  );

  const ensureWorkflowAnswersLoaded = useCallback(async () => {
    if (loadedWorkflowAnswers) {
      return;
    }

    if (existsSync(workspaceWorkflowDir)) {
      const { answers, customNotes } = await loadWorkflowAnswersFromWorkspace(
        workspaceWorkflowDir,
      );
      setWorkflowAnswers(answers);
      setWorkflowCustomNotes(customNotes);
    }

    setLoadedWorkflowAnswers(true);
  }, [loadedWorkflowAnswers, workspaceWorkflowDir]);

  const openEngineeringDashboard = useCallback(async () => {
    if (!hasSddWorkspace(targetDir)) {
      setResultLines([
        "No SDD workspace found.",
        "Run Create brief scaffold first.",
      ]);
      setScreen({
        name: "action-result",
        title: "Configure Engineering",
        lines: [],
      });
      return;
    }

    if (needsBriefVersioningMigration(targetDir)) {
      setResultLines([
        "Brief uses legacy flat layout.",
        "Run Migrate from the brownfield menu first.",
      ]);
      setScreen({
        name: "action-result",
        title: "Configure Engineering",
        lines: [],
      });
      return;
    }

    setEngineeringPointer("current");
    const dir = await resolveAndSetEngineeringBriefDir("current");
    if (!dir) {
      setResultLines(["Could not resolve technical brief directory."]);
      setScreen({
        name: "action-result",
        title: "Configure Engineering",
        lines: [],
      });
      return;
    }

    setLoadedAnswers(false);
    await ensureEngineeringAnswersLoaded(dir);
    navigate({ name: "engineering-dashboard" });
  }, [
    ensureEngineeringAnswersLoaded,
    navigate,
    resolveAndSetEngineeringBriefDir,
    targetDir,
  ]);

  useEffect(() => {
    if (
      initialScreen.name !== "engineering-dashboard" ||
      screen.name !== "engineering-dashboard" ||
      engineeringBriefDir ||
      !hasSddWorkspace(targetDir)
    ) {
      return;
    }

    void openEngineeringDashboard();
  }, [
    engineeringBriefDir,
    initialScreen.name,
    openEngineeringDashboard,
    screen.name,
    targetDir,
  ]);

  const openRefactorEngineeringDashboard = useCallback(async () => {
    if (!hasSddWorkspace(targetDir)) {
      setResultLines([
        "No SDD workspace found.",
        "Run Create brief scaffold first.",
      ]);
      setScreen({
        name: "action-result",
        title: "Configure Refactor Engineering",
        lines: [],
      });
      return;
    }

    if (needsBriefVersioningMigration(targetDir)) {
      setResultLines([
        "Brief uses legacy flat layout.",
        "Run Migrate first to create manifest.yaml and versioned folders.",
      ]);
      setScreen({
        name: "action-result",
        title: "Configure Refactor Engineering",
        lines: [],
      });
      return;
    }

    setScreen({
      name: "action-running",
      label: "Preparing engineering target version…",
    });

    try {
      const workspaceDir = getWorkspaceDir(targetDir);
      const manifest = await readManifest(workspaceDir);

      if (!manifest) {
        throw new Error("Missing brief manifest.");
      }

      const currentTechnicalDir = resolveTechnicalBriefDirFromManifest(
        workspaceDir,
        "current",
        manifest,
      );

      await prepareTechnicalTargetVersion(workspaceDir);
      setEngineeringPointer("target");
      setRefactorModifiedSections([]);
      const dir = await resolveAndSetEngineeringBriefDir("target");

      if (!dir) {
        throw new Error("Could not resolve technical target directory.");
      }

      setLoadedAnswers(false);
      await ensureEngineeringAnswersLoaded(currentTechnicalDir);
      navigate({ name: "engineering-dashboard" });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setResultLines([`Error: ${message}`]);
      setScreen({
        name: "action-result",
        title: "Configure Refactor Engineering",
        lines: [],
      });
    }
  }, [
    ensureEngineeringAnswersLoaded,
    navigate,
    resolveAndSetEngineeringBriefDir,
    targetDir,
  ]);

  const onRefactorSectionSaved = useCallback((sectionId: EngineeringSectionId) => {
    setRefactorModifiedSections((current) =>
      current.includes(sectionId) ? current : [...current, sectionId],
    );
  }, []);

  const finalizeRefactorEngineering = useCallback(async () => {
    setScreen({
      name: "action-running",
      label: "Finalizing engineering target version…",
    });

    try {
      if (!hasSddWorkspace(targetDir)) {
        throw new Error("No SDD workspace found.");
      }

      const workspaceDir = getWorkspaceDir(targetDir);
      const modifiedFileNames = refactorModifiedSections.map((sectionId) =>
        getSectionFileName(sectionId),
      );
      const result = await finalizeTechnicalTargetVersion(
        workspaceDir,
        modifiedFileNames,
      );

      setResultLines([
        "Engineering refactor target finalized.",
        "",
        `Copied ${result.copiedFiles.length} unchanged file(s) from current.`,
        "",
        "Next step: run **sdd-technical** against the target version,",
        "then use Promote Engineering Target when ready.",
      ]);
      navigate({ name: "engineering-summary" });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setResultLines([`Error: ${message}`]);
      setScreen({
        name: "action-result",
        title: "Finalize Engineering Refactor",
        lines: [],
      });
    }
  }, [navigate, refactorModifiedSections, targetDir]);

  const runPromoteTechnical = useCallback(async () => {
    setScreen({ name: "action-running", label: "Promoting technical target…" });

    try {
      if (!hasSddWorkspace(targetDir)) {
        throw new Error("No SDD workspace found.");
      }

      const manifest = await readManifest(getWorkspaceDir(targetDir));
      if (!manifest?.technical.target) {
        throw new Error(
          "No technical target version set. Run Configure Refactor Engineering first.",
        );
      }

      const result = await promoteTechnicalTarget(getWorkspaceDir(targetDir));
      setResultLines([
        "Technical brief target promoted successfully.",
        "",
        `Previous current: ${result.previousCurrent}`,
        `New current: ${result.newCurrent}`,
        "",
        "Next step: run **sdd-technical** against the new current version.",
      ]);
      setScreen({
        name: "action-result",
        title: "Promote Engineering Target",
        lines: [],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setResultLines([`Error: ${message}`]);
      setScreen({ name: "action-result", title: "Error", lines: [] });
    }
  }, [targetDir]);

  const runWorkflowScaffold = useCallback(async () => {
    if (!hasSddWorkspace(targetDir)) {
      return false;
    }

    const workflowMarker = join(
      targetDir,
      SDD_WORKSPACE_DIR,
      "workflow",
      "roadmap",
      ".gitkeep",
    );
    if (existsSync(workflowMarker)) {
      return true;
    }

    await generateWorkflowScaffold({ targetDir });
    return true;
  }, [targetDir]);

  const openWorkflowDashboard = useCallback(async () => {
    if (!hasSddWorkspace(targetDir)) {
      setResultLines([
        "No SDD workspace found.",
        "Run Create brief scaffold first.",
      ]);
      setScreen({
        name: "action-result",
        title: "Configure Workflow",
        lines: [],
      });
      return;
    }

    try {
      await runWorkflowScaffold();
      await ensureWorkflowAnswersLoaded();
      navigate({ name: "workflow-dashboard" });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setResultLines([`Error: ${message}`]);
      setScreen({
        name: "action-result",
        title: "Configure Workflow",
        lines: [],
      });
    }
  }, [ensureWorkflowAnswersLoaded, navigate, runWorkflowScaffold, targetDir]);

  const runInit = useCallback(
    async (options: {
      assistantId: AssistantId;
      includeSpec?: boolean;
      includeWorkflow?: boolean;
    }) => {
      setScreen({ name: "action-running", label: "Setting up SDD foundation…" });

      try {
        assertTargetDirectoryAvailable(targetDir);

        const context = buildInitContext({
          targetDir,
          assistant: options.assistantId,
          modules: {
            workflow: options.includeWorkflow ?? false,
            spec: options.includeSpec ?? false,
          },
        });

        const result = await initWorkspace({ context });
        setResultLines([
          formatInitSummary(context, result),
          "",
          formatGenerationResult(targetDir, context.assistant, result),
        ]);

        setScreen({
          name: "action-result",
          title: "Create brief scaffold",
          lines: [],
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        setResultLines(formatSpecScaffoldError(message));
        setScreen({
          name: "action-result",
          title: "Error",
          lines: [],
        });
      }
    },
    [targetDir],
  );

  const runSpecScaffold = useCallback(async () => {
    setScreen({ name: "action-running", label: "Creating spec scaffold…" });

    try {
      if (!hasSddWorkspace(targetDir)) {
        setResultLines(formatSpecScaffoldMissingWorkspace());
        setScreen({
          name: "action-result",
          title: "Create spec scaffold",
          lines: [],
        });
        return;
      }

      const specMarker = join(
        targetDir,
        SDD_WORKSPACE_DIR,
        "spec",
        "business",
        "domain",
        ".gitkeep",
      );
      if (existsSync(specMarker)) {
        setResultLines(formatSpecScaffoldResult({ alreadyExists: true }));
        setScreen({
          name: "action-result",
          title: "Create spec scaffold",
          lines: [],
        });
        return;
      }

      const result = await generateSpecScaffold({ targetDir });
      setResultLines(
        formatSpecScaffoldResult({ fileCount: result.createdPaths.length }),
      );
      setScreen({
        name: "action-result",
        title: "Create spec scaffold",
        lines: [],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setResultLines([`Error: ${message}`]);
      setScreen({
        name: "action-result",
        title: "Error",
        lines: [],
      });
    }
  }, [targetDir]);

  const runMigrate = useCallback(async () => {
    setScreen({ name: "action-running", label: "Migrating workspace…" });
    try {
      const result = await migrateWorkspace({ targetDir });
      setResultLines(formatMigrateResult(targetDir, result).split("\n"));
      setScreen({ name: "action-result", title: "Migrate Workspace", lines: [] });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setResultLines([`Error: ${message}`]);
      setScreen({ name: "action-result", title: "Error", lines: [] });
    }
  }, [targetDir]);

  const runSync = useCallback(
    async (assistantId: AssistantId) => {
      setScreen({ name: "action-running", label: "Syncing assistant files…" });
      try {
        const result = await syncAssistant({
          targetDir,
          assistant: assistantId,
          scope: "all",
        });
        setResultLines(
          formatSyncResult(targetDir, assistantId, "all", result).split("\n"),
        );
        setScreen({
          name: "action-result",
          title: "Sync Assistant Files",
          lines: [],
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setResultLines([`Error: ${message}`]);
        setScreen({ name: "action-result", title: "Error", lines: [] });
      }
    },
    [targetDir],
  );

  const actions = useMemo(
    () => ({
      navigate,
      goBack,
      onFinish,
      openEngineeringDashboard,
      openRefactorEngineeringDashboard,
      openWorkflowDashboard,
      runMigrate,
      runPromoteTechnical,
      finalizeRefactorEngineering,
      onRefactorSectionSaved,
      runSync,
      runInit,
      runSpecScaffold,
      runWorkflowScaffold,
      setAssistant,
      setProjectMode,
      setEngineeringAnswers,
      setEngineeringCustomNotes,
      setEngineeringSession,
      setWorkflowAnswers,
      setWorkflowCustomNotes,
      setWorkflowSession,
      resetToMainMenu,
    }),
    [
      navigate,
      goBack,
      onFinish,
      openEngineeringDashboard,
      openRefactorEngineeringDashboard,
      openWorkflowDashboard,
      runMigrate,
      runPromoteTechnical,
      finalizeRefactorEngineering,
      onRefactorSectionSaved,
      runSync,
      runInit,
      runSpecScaffold,
      runWorkflowScaffold,
      resetToMainMenu,
    ],
  );

  const handleInput = useAppInput({
    state,
    selectedIndex,
    setSelectedIndex,
    engineeringSession,
    workflowSession,
    actions,
  });

  useStableInput(handleInput);

  const sectionTitle = getSectionTitle(screen, projectMode);
  const shortcuts = getFooterShortcuts(
    screen,
    engineeringAnswers,
    engineeringSession,
    workflowAnswers,
    workflowSession,
    projectMode,
    engineeringPointer,
  );

  return (
    <AppLayout
      version={version}
      sectionTitle={sectionTitle}
      projectName={projectName}
      shortcuts={shortcuts}
      navigation={
        <NavigationPanel
          screen={screen}
          state={state}
          selectedIndex={selectedIndex}
          engineeringSession={engineeringSession}
          workflowSession={workflowSession}
        />
      }
      content={
        <ContentPanel
          screen={screen}
          state={state}
          selectedIndex={selectedIndex}
          engineeringSession={engineeringSession}
          workflowSession={workflowSession}
          resultLines={resultLines}
        />
      }
    />
  );
}

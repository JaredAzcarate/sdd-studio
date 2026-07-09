import React, { useCallback, useEffect, useMemo, useState } from "react";
import { basename, join } from "node:path";
import { existsSync } from "node:fs";
import { SDD_WORKSPACE_DIR, SDD_WORKSPACE_MARKER_PATH } from "../constants/sdd-workspace-path.js";
import { loadEngineeringAnswersFromWorkspace } from "../engineering-config/state/engineering-section-status.js";
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
import { formatInitSummary } from "../utils/format-init-summary.js";
import { formatMigrateResult } from "../utils/format-migrate-result.js";
import { formatSyncResult } from "../utils/format-sync-result.js";
import { assertTargetDirectoryAvailable } from "../policies/target-directory.policy.js";
import { AppLayout } from "./components/AppLayout.js";
import { ContentPanel, NavigationPanel } from "./components/AppPanels.js";
import { getFooterShortcuts, getSectionTitle } from "./app-chrome.js";
import { useStableInput } from "./hooks/use-stable-input.js";
import type { EngineeringSession, WorkflowSession } from "./use-app-input.js";
import { useAppInput } from "./use-app-input.js";
import type { AppScreen, AppState, TuiExitResult } from "./types.js";
import type { EngineeringCustomNotes } from "../engineering-config/types.js";
import type { WorkflowCustomNotes } from "../workflow-config/types.js";
import type { AssistantId } from "../types/init-context.js";

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
  const workspaceTechnicalDir = join(
    targetDir,
    SDD_WORKSPACE_DIR,
    "brief",
    "technical",
  );

  const workspaceWorkflowDir = join(targetDir, SDD_WORKSPACE_DIR, "workflow");

  const [screen, setScreen] = useState<AppScreen>(initialScreen);
  const [history, setHistory] = useState<AppScreen[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
      setScreen({ name: "engineering-dashboard" });
    }
  }, [engineeringSession, screen]);

  useEffect(() => {
    if (screen.name === "workflow-section" && !workflowSession) {
      setScreen({ name: "workflow-dashboard" });
    }
  }, [workflowSession, screen]);

  const state: AppState = useMemo(
    () => ({
      screen,
      targetDir,
      projectName,
      version,
      assistant,
      engineeringAnswers,
      engineeringCustomNotes,
      workflowAnswers,
      workflowCustomNotes,
      history,
    }),
    [
      screen,
      targetDir,
      projectName,
      version,
      assistant,
      engineeringAnswers,
      engineeringCustomNotes,
      workflowAnswers,
      workflowCustomNotes,
      history,
    ],
  );

  const navigate = useCallback((next: AppScreen) => {
    setHistory((current) => [...current, screen]);
    setScreen(next);
  }, [screen]);

  const goBack = useCallback(() => {
    setEngineeringSession(null);
    setWorkflowSession(null);
    setHistory((current) => {
      const previous = current.at(-1);
      if (!previous) {
        setScreen({ name: "main-menu" });
        return [];
      }
      setScreen(previous);
      return current.slice(0, -1);
    });
  }, []);

  const resetToMainMenu = useCallback(() => {
    setResultLines([]);
    setEngineeringSession(null);
    setWorkflowSession(null);
    setScreen({ name: "main-menu" });
    setHistory([]);
  }, []);

  const ensureEngineeringAnswersLoaded = useCallback(async () => {
    if (loadedAnswers) {
      return;
    }

    if (existsSync(workspaceTechnicalDir)) {
      const { answers, customNotes } = await loadEngineeringAnswersFromWorkspace(
        workspaceTechnicalDir,
      );
      setEngineeringAnswers(answers);
      setEngineeringCustomNotes(customNotes);
    }

    setLoadedAnswers(true);
  }, [loadedAnswers, workspaceTechnicalDir]);

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
    const markerPath = join(targetDir, SDD_WORKSPACE_MARKER_PATH);
    if (!existsSync(markerPath)) {
      setResultLines([
        "No SDD workspace found.",
        "Run Create Business & Technical foundation first.",
      ]);
      setScreen({
        name: "action-result",
        title: "Configure Engineering",
        lines: [],
      });
      return;
    }

    await ensureEngineeringAnswersLoaded();
    navigate({ name: "engineering-dashboard" });
  }, [ensureEngineeringAnswersLoaded, navigate, targetDir]);

  const runWorkflowScaffold = useCallback(async () => {
    const markerPath = join(targetDir, SDD_WORKSPACE_MARKER_PATH);
    if (!existsSync(markerPath)) {
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
    const markerPath = join(targetDir, SDD_WORKSPACE_MARKER_PATH);
    if (!existsSync(markerPath)) {
      setResultLines([
        "No SDD workspace found.",
        "Run Create Business & Technical foundation first.",
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
          title: "Create Business & Technical foundation",
          lines: [],
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        setResultLines([`Error: ${message}`]);
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
      const markerPath = join(targetDir, SDD_WORKSPACE_MARKER_PATH);
      if (!existsSync(markerPath)) {
        setResultLines([
          "No SDD workspace found.",
          "Run Create Business & Technical foundation first.",
        ]);
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
        setResultLines([
          "Spec scaffold already exists under .workspace/spec/.",
          "Next step: run **sdd-spec** when Brief and stack are ready.",
        ]);
        setScreen({
          name: "action-result",
          title: "Create spec scaffold",
          lines: [],
        });
        return;
      }

      const result = await generateSpecScaffold({ targetDir });
      setResultLines([
        "Spec scaffold created successfully.",
        "",
        `Files: ${result.createdPaths.length}`,
        "",
        "Next step: run **sdd-spec** after the Brief and engineering-stack.md are complete.",
      ]);
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
      openWorkflowDashboard,
      runMigrate,
      runSync,
      runInit,
      runSpecScaffold,
      runWorkflowScaffold,
      setAssistant,
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
      openWorkflowDashboard,
      runMigrate,
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

  const sectionTitle = getSectionTitle(screen);
  const shortcuts = getFooterShortcuts(
    screen,
    engineeringAnswers,
    engineeringSession,
    workflowAnswers,
    workflowSession,
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

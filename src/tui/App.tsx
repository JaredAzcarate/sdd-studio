import React, { useCallback, useEffect, useMemo, useState } from "react";
import { basename, join } from "node:path";
import { existsSync } from "node:fs";
import { SDD_WORKSPACE_DIR, SDD_WORKSPACE_MARKER_PATH } from "../constants/sdd-workspace-path.js";
import { loadEngineeringAnswersFromWorkspace } from "../engineering-config/state/engineering-section-status.js";
import { buildInitContext } from "../utils/build-init-context.js";
import { initWorkspace } from "../use-cases/init-workspace.use-case.js";
import { generateWorkspace } from "../generators/workspace.generator.js";
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
import type { EngineeringSession } from "./use-app-input.js";
import { useAppInput } from "./use-app-input.js";
import type { AppScreen, AppState, TuiExitResult } from "./types.js";
import type { EngineeringCustomNotes } from "../engineering-config/types.js";
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
  initialScreen = { name: "main-menu" },
  onFinish,
}: SddAppProps) {
  const workspaceTechnicalDir = join(
    targetDir,
    SDD_WORKSPACE_DIR,
    "brief",
    "technical",
  );

  const [screen, setScreen] = useState<AppScreen>(initialScreen);
  const [history, setHistory] = useState<AppScreen[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [engineeringAnswers, setEngineeringAnswers] = useState(
    () => ({} as AppState["engineeringAnswers"]),
  );
  const [engineeringCustomNotes, setEngineeringCustomNotes] = useState(
    () => ({} as EngineeringCustomNotes),
  );
  const [engineeringSession, setEngineeringSession] =
    useState<EngineeringSession | null>(null);
  const [assistant, setAssistant] = useState<AssistantId | undefined>();
  const [installEngineering, setInstallEngineering] = useState(false);
  const [workflow, setWorkflow] = useState(false);
  const [resultLines, setResultLines] = useState<string[]>([]);
  const [loadedAnswers, setLoadedAnswers] = useState(false);

  const projectName = basename(targetDir) || targetDir;

  useEffect(() => {
    if (screen.name === "engineering-section" && !engineeringSession) {
      setScreen({ name: "engineering-dashboard" });
    }
  }, [engineeringSession, screen]);

  const state: AppState = useMemo(
    () => ({
      screen,
      targetDir,
      projectName,
      version,
      assistant,
      workflow,
      engineeringAnswers,
      engineeringCustomNotes,
      installEngineering,
      history,
    }),
    [
      screen,
      targetDir,
      projectName,
      version,
      assistant,
      workflow,
      engineeringAnswers,
      engineeringCustomNotes,
      installEngineering,
      history,
    ],
  );

  const navigate = useCallback((next: AppScreen) => {
    setHistory((current) => [...current, screen]);
    setScreen(next);
  }, [screen]);

  const goBack = useCallback(() => {
    setEngineeringSession(null);
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

  const openEngineeringDashboard = useCallback(async () => {
    const markerPath = join(targetDir, SDD_WORKSPACE_MARKER_PATH);
    if (!existsSync(markerPath)) {
      setResultLines([
        "No SDD workspace found.",
        "Run Install SDD or Create Workspace first.",
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

  const runInit = useCallback(
    async (options: {
      assistantId: AssistantId;
      includeAssistant: boolean;
      includeEngineering: boolean;
      includeWorkflow: boolean;
    }) => {
      setScreen({ name: "action-running", label: "Installing SDD…" });

      try {
        assertTargetDirectoryAvailable(targetDir);

        const context = buildInitContext({
          targetDir,
          assistant: options.assistantId,
          modules: { workflow: options.includeWorkflow },
          engineering:
            options.includeEngineering &&
            Object.keys(engineeringAnswers).length > 0
              ? { answers: engineeringAnswers }
              : undefined,
        });

        if (options.includeAssistant) {
          const result = await initWorkspace({ context });
          setResultLines([
            formatInitSummary(context, result),
            "",
            formatGenerationResult(targetDir, context.assistant, result),
          ]);
        } else {
          const workspace = await generateWorkspace({
            targetDir,
            modules: { workflow: options.includeWorkflow },
          });
          setResultLines([
            "Workspace created successfully.",
            "",
            `Files: ${workspace.createdPaths.length}`,
            `Workflow module: ${options.includeWorkflow ? "enabled" : "disabled"}`,
          ]);
        }

        setScreen({
          name: "action-result",
          title: options.includeAssistant ? "Install SDD" : "Create Workspace",
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
    [engineeringAnswers, targetDir],
  );

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

  const continueInstallAfterEngineering = useCallback(() => {
    if (installEngineering && assistant) {
      navigate({ name: "install-sdd-workflow" });
      return;
    }
    if (history.some((item) => item.name === "install-sdd-engineering")) {
      navigate({ name: "install-sdd-workflow" });
      return;
    }
    goBack();
  }, [assistant, goBack, history, installEngineering, navigate]);

  const actions = useMemo(
    () => ({
      navigate,
      goBack,
      onFinish,
      openEngineeringDashboard,
      runMigrate,
      runSync,
      runInit,
      setAssistant,
      setInstallEngineering,
      setWorkflow,
      setEngineeringAnswers,
      setEngineeringCustomNotes,
      setEngineeringSession,
      resetToMainMenu,
      continueInstallAfterEngineering,
    }),
    [
      navigate,
      goBack,
      onFinish,
      openEngineeringDashboard,
      runMigrate,
      runSync,
      runInit,
      continueInstallAfterEngineering,
      resetToMainMenu,
    ],
  );

  const handleInput = useAppInput({
    state,
    selectedIndex,
    setSelectedIndex,
    engineeringSession,
    actions,
  });

  useStableInput(handleInput);

  const sectionTitle = getSectionTitle(screen);
  const shortcuts = getFooterShortcuts(
    screen,
    engineeringAnswers,
    engineeringSession,
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
        />
      }
      content={
        <ContentPanel
          screen={screen}
          state={state}
          selectedIndex={selectedIndex}
          engineeringSession={engineeringSession}
          resultLines={resultLines}
        />
      }
    />
  );
}

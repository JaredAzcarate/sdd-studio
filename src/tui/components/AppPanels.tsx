import React, { memo } from "react";
import { Box, Text } from "ink";
import { MenuPreview, OptionPreview } from "./PreviewPanels.js";
import { SelectableList } from "./SelectableList.js";
import {
  ENGINEERING_PATTERNS_ITEMS,
  ENGINEERING_SECTION_ITEMS,
  WORKFLOW_SECTION_ITEMS,
  getVisibleBrownfieldMenuItems,
  getVisibleMainMenuItems,
  PROJECT_TYPE_ITEMS,
} from "../data/menu-items.js";
import { theme } from "../theme.js";
import type { EngineeringSession, WorkflowSession } from "../use-app-input.js";
import type { AppScreen, AppState } from "../types.js";
import {
  countCompletedSections,
  getPatternsGroupStatus,
  getSectionStatus,
  statusIcon,
} from "../../engineering-config/state/engineering-section-status.js";
import {
  countCompletedWorkflowSections,
  getWorkflowSectionStatus,
} from "../../workflow-config/state/workflow-section-status.js";
import {
  ENGINEERING_LEAF_SECTION_COUNT,
  ENGINEERING_SECTIONS,
} from "../../engineering-config/catalog/index.js";
import {
  WORKFLOW_LEAF_SECTION_COUNT,
  WORKFLOW_SECTIONS,
} from "../../workflow-config/catalog/index.js";
import { getVisibleQuestions } from "../../engineering-config/catalog/question-utils.js";
import { ASSISTANTS } from "../../registries/assistants.registry.js";
import type { EngineeringSectionId } from "../../engineering-config/types.js";
import type { WorkflowSectionId } from "../../workflow-config/types.js";
import { formatEngineeringConfigureSummary } from "../../utils/format-engineering-summary.js";
import { formatWorkflowConfigureSummary } from "../../utils/format-workflow-result.js";

const EngineeringSectionNavigation = memo(function EngineeringSectionNavigation({
  sectionId,
  questionIndex,
  optionIndex,
  selectedOptionIds,
  answers,
  saving,
  customEntry,
}: {
  sectionId: EngineeringSectionId;
  questionIndex: number;
  optionIndex: number;
  selectedOptionIds: string[];
  answers: AppState["engineeringAnswers"];
  saving: boolean;
  customEntry: EngineeringSession["customEntry"];
}) {
  const section = ENGINEERING_SECTIONS.find((item) => item.id === sectionId)!;
  const question = section.questions[questionIndex];
  const visibleQuestions = getVisibleQuestions(section, answers);
  const visibleQuestionIndex = visibleQuestions.findIndex(
    (item) => item.id === question.id,
  );

  if (customEntry) {
    return (
      <Box flexDirection="column" overflow="hidden">
        <Text bold color={theme.brand}>
          Custom answer
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Text bold>{question.title}</Text>
          <Text wrap="wrap" color={theme.muted}>
            Describe your approach in your own words.
          </Text>
        </Box>
        <Box marginTop={1} flexDirection="column">
          <Text bold>Your answer</Text>
          <Text>
            {customEntry.text}
            <Text color={theme.accent}>|</Text>
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" overflow="hidden">
      <Text bold color={theme.brand}>
        Question {visibleQuestionIndex + 1} / {visibleQuestions.length}
      </Text>
      <Box marginTop={1} flexDirection="column">
        <Text bold>{question.title}</Text>
        <Text wrap="wrap" color={theme.muted}>
          {question.description}
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text bold>{question.question}</Text>
      </Box>
      {question.selectionMode === "multi" ? (
        <Box marginTop={1}>
          <Text color={theme.muted} wrap="wrap">
            Space to toggle. Enter to confirm.
          </Text>
        </Box>
      ) : null}
      <Box marginTop={1} overflow="hidden">
        <SelectableList
          title="Options"
          selectedIndex={optionIndex}
          selectionMode={question.selectionMode}
          selectedOptionIds={selectedOptionIds}
          items={question.options.map((option) => ({
            id: option.id,
            label: option.label,
          }))}
        />
      </Box>
      {saving ? (
        <Box marginTop={1}>
          <Text color={theme.accent}>Saving section…</Text>
        </Box>
      ) : null}
    </Box>
  );
});

const EngineeringSectionPreview = memo(function EngineeringSectionPreview({
  sectionId,
  questionIndex,
  optionIndex,
}: {
  sectionId: EngineeringSectionId;
  questionIndex: number;
  optionIndex: number;
}) {
  const section = ENGINEERING_SECTIONS.find((item) => item.id === sectionId)!;
  const question = section.questions[questionIndex];

  return (
    <OptionPreview
      title="Option Preview"
      detail={question.options[optionIndex]?.detail ?? null}
    />
  );
});

const WorkflowSectionNavigation = memo(function WorkflowSectionNavigation({
  sectionId,
  questionIndex,
  optionIndex,
  selectedOptionIds,
  answers,
  saving,
  customEntry,
}: {
  sectionId: WorkflowSectionId;
  questionIndex: number;
  optionIndex: number;
  selectedOptionIds: string[];
  answers: AppState["workflowAnswers"];
  saving: boolean;
  customEntry: WorkflowSession["customEntry"];
}) {
  const section = WORKFLOW_SECTIONS.find((item) => item.id === sectionId)!;
  const question = section.questions[questionIndex];
  const visibleQuestions = getVisibleQuestions(section, answers);
  const visibleQuestionIndex = visibleQuestions.findIndex(
    (item) => item.id === question.id,
  );

  if (customEntry) {
    return (
      <Box flexDirection="column" overflow="hidden">
        <Text bold color={theme.brand}>
          Custom answer
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Text bold>{question.title}</Text>
          <Text wrap="wrap" color={theme.muted}>
            Describe your approach in your own words.
          </Text>
        </Box>
        <Box marginTop={1} flexDirection="column">
          <Text bold>Your answer</Text>
          <Text>
            {customEntry.text}
            <Text color={theme.accent}>|</Text>
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" overflow="hidden">
      <Text bold color={theme.brand}>
        Question {visibleQuestionIndex + 1} / {visibleQuestions.length}
      </Text>
      <Box marginTop={1} flexDirection="column">
        <Text bold>{question.title}</Text>
        <Text wrap="wrap" color={theme.muted}>
          {question.description}
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text bold>{question.question}</Text>
      </Box>
      {question.selectionMode === "multi" ? (
        <Box marginTop={1}>
          <Text color={theme.muted} wrap="wrap">
            Space to toggle. Enter to confirm.
          </Text>
        </Box>
      ) : null}
      <Box marginTop={1} overflow="hidden">
        <SelectableList
          title="Options"
          selectedIndex={optionIndex}
          selectionMode={question.selectionMode}
          selectedOptionIds={selectedOptionIds}
          items={question.options.map((option) => ({
            id: option.id,
            label: option.label,
          }))}
        />
      </Box>
      {saving ? (
        <Box marginTop={1}>
          <Text color={theme.accent}>Saving section…</Text>
        </Box>
      ) : null}
    </Box>
  );
});

const WorkflowSectionPreview = memo(function WorkflowSectionPreview({
  sectionId,
  questionIndex,
  optionIndex,
}: {
  sectionId: WorkflowSectionId;
  questionIndex: number;
  optionIndex: number;
}) {
  const section = WORKFLOW_SECTIONS.find((item) => item.id === sectionId)!;
  const question = section.questions[questionIndex];

  return (
    <OptionPreview
      title="Option Preview"
      detail={question.options[optionIndex]?.detail ?? null}
    />
  );
});

type NavigationPanelProps = {
  screen: AppScreen;
  state: AppState;
  selectedIndex: number;
  engineeringSession: EngineeringSession | null;
  workflowSession: WorkflowSession | null;
};

type ContentPanelProps = NavigationPanelProps & {
  resultLines: string[];
};

const ProjectTypeNavigation = memo(function ProjectTypeNavigation({
  selectedIndex,
}: {
  selectedIndex: number;
}) {
  return (
    <SelectableList
      title="Project type"
      selectedIndex={selectedIndex}
      items={PROJECT_TYPE_ITEMS.map((item) => ({
        id: item.id,
        label: item.label,
      }))}
    />
  );
});

const ProjectTypeContent = memo(function ProjectTypeContent({
  selectedIndex,
}: {
  selectedIndex: number;
}) {
  const selected = PROJECT_TYPE_ITEMS[selectedIndex];
  return (
    <MenuPreview
      title={selected.label}
      description={selected.description}
      why={selected.why}
      filesAffected={selected.filesAffected}
      estimatedTime={selected.estimatedTime}
      recommendedUsage={selected.recommendedUsage}
    />
  );
});

const BrownfieldMenuNavigation = memo(function BrownfieldMenuNavigation({
  selectedIndex,
}: {
  selectedIndex: number;
}) {
  const items = getVisibleBrownfieldMenuItems();
  return (
    <SelectableList
      title="Brownfield"
      selectedIndex={selectedIndex}
      items={items.map((item) => ({
        id: item.id,
        label: item.label,
      }))}
    />
  );
});

const BrownfieldMenuContent = memo(function BrownfieldMenuContent({
  selectedIndex,
}: {
  selectedIndex: number;
}) {
  const selected = getVisibleBrownfieldMenuItems()[selectedIndex];
  return (
    <MenuPreview
      title={selected.label}
      description={selected.description}
      why={selected.why}
      filesAffected={selected.filesAffected}
      estimatedTime={selected.estimatedTime}
      recommendedUsage={selected.recommendedUsage}
    />
  );
});

const MainMenuNavigation = memo(function MainMenuNavigation({
  selectedIndex,
}: {
  selectedIndex: number;
}) {
  const items = getVisibleMainMenuItems();
  return (
    <SelectableList
      title="Greenfield"
      selectedIndex={selectedIndex}
      items={items.map((item) => ({
        id: item.id,
        label: item.label,
      }))}
    />
  );
});

const MainMenuContent = memo(function MainMenuContent({
  selectedIndex,
}: {
  selectedIndex: number;
}) {
  const selected = getVisibleMainMenuItems()[selectedIndex];
  return (
    <MenuPreview
      title={selected.label}
      description={selected.description}
      why={selected.why}
      filesAffected={selected.filesAffected}
      estimatedTime={selected.estimatedTime}
      recommendedUsage={selected.recommendedUsage}
    />
  );
});

export const NavigationPanel = memo(function NavigationPanel({
  screen,
  state,
  selectedIndex,
  engineeringSession,
  workflowSession,
}: NavigationPanelProps) {
  if (screen.name === "project-type") {
    return <ProjectTypeNavigation selectedIndex={selectedIndex} />;
  }

  if (screen.name === "brownfield-main-menu") {
    return <BrownfieldMenuNavigation selectedIndex={selectedIndex} />;
  }

  if (screen.name === "main-menu") {
    return <MainMenuNavigation selectedIndex={selectedIndex} />;
  }

  if (
    screen.name === "setup-foundation-assistant" ||
    screen.name === "sync-assistant"
  ) {
    return (
      <SelectableList
        title={screen.name === "sync-assistant" ? "Assistant to sync" : "AI Assistant"}
        selectedIndex={selectedIndex}
        items={ASSISTANTS.map((item) => ({
          id: item.id,
          label: item.label,
        }))}
      />
    );
  }

  if (screen.name === "engineering-dashboard") {
    const completed = countCompletedSections(state.engineeringAnswers);
    const items = ENGINEERING_SECTION_ITEMS.map((item) => {
      const icon =
        item.id === "patterns"
          ? statusIcon(getPatternsGroupStatus(state.engineeringAnswers))
          : statusIcon(
              getSectionStatus(item.id, state.engineeringAnswers),
            );

      return {
        id: item.id,
        label: item.label,
        icon,
      };
    });

    return (
      <Box flexDirection="column">
        <SelectableList
          title="Sections"
          selectedIndex={selectedIndex}
          items={items}
        />
        <Box
          marginTop={2}
          flexDirection="column"
          borderStyle="single"
          borderColor={theme.border}
          paddingX={1}
        >
          <Text bold>Progress</Text>
          <Text>
            {completed} / {ENGINEERING_LEAF_SECTION_COUNT} completed
          </Text>
        </Box>
      </Box>
    );
  }

  if (screen.name === "engineering-patterns-dashboard") {
    const items = ENGINEERING_PATTERNS_ITEMS.map((item) => ({
      id: item.id,
      label: item.label,
      icon: statusIcon(
        getSectionStatus(item.id, state.engineeringAnswers),
      ),
    }));

    return (
      <Box flexDirection="column">
        <SelectableList
          title="Pattern areas"
          selectedIndex={selectedIndex}
          items={items}
        />
      </Box>
    );
  }

  if (screen.name === "engineering-section" && engineeringSession) {
    return (
      <EngineeringSectionNavigation
        sectionId={engineeringSession.sectionId}
        questionIndex={engineeringSession.questionIndex}
        optionIndex={engineeringSession.optionIndex}
        selectedOptionIds={engineeringSession.selectedOptionIds}
        answers={engineeringSession.answers}
        saving={engineeringSession.saving}
        customEntry={engineeringSession.customEntry}
      />
    );
  }

  if (screen.name === "engineering-refactor-prompt") {
    const REFACTOR_PROMPT_ITEMS = [
      { id: "continue", label: "Continue configuring" },
      { id: "finalize", label: "Finalize refactor" },
    ] as const;

    return (
      <Box flexDirection="column">
        <Text bold color={theme.accent}>
          Section saved to target version
        </Text>
        <Box marginTop={1}>
          <Text wrap="wrap">
            File written to{" "}
            {state.engineeringBriefDir ?? "technical/target"}.
          </Text>
        </Box>
        <Box marginTop={2}>
          <SelectableList
            title="Next step"
            selectedIndex={selectedIndex}
            items={REFACTOR_PROMPT_ITEMS.map((item) => ({
              id: item.id,
              label: item.label,
            }))}
          />
        </Box>
      </Box>
    );
  }

  if (screen.name === "workflow-dashboard") {
    const completed = countCompletedWorkflowSections(state.workflowAnswers);
    const items = WORKFLOW_SECTION_ITEMS.map((item) => ({
      id: item.id,
      label: item.label,
      icon: statusIcon(
        getWorkflowSectionStatus(item.id, state.workflowAnswers),
      ),
    }));

    return (
      <Box flexDirection="column">
        <SelectableList
          title="Sections"
          selectedIndex={selectedIndex}
          items={items}
        />
        <Box
          marginTop={2}
          flexDirection="column"
          borderStyle="single"
          borderColor={theme.border}
          paddingX={1}
        >
          <Text bold>Progress</Text>
          <Text>
            {completed} / {WORKFLOW_LEAF_SECTION_COUNT} completed
          </Text>
        </Box>
      </Box>
    );
  }

  if (screen.name === "workflow-section" && workflowSession) {
    return (
      <WorkflowSectionNavigation
        sectionId={workflowSession.sectionId}
        questionIndex={workflowSession.questionIndex}
        optionIndex={workflowSession.optionIndex}
        selectedOptionIds={workflowSession.selectedOptionIds}
        answers={workflowSession.answers}
        saving={workflowSession.saving}
        customEntry={workflowSession.customEntry}
      />
    );
  }

  if (screen.name === "workflow-summary") {
    const sections = WORKFLOW_SECTION_ITEMS.map((item) => ({
      label: item.label,
      status: getWorkflowSectionStatus(item.id, state.workflowAnswers),
    }));

    return (
      <Box flexDirection="column">
        <Text bold color={theme.accent}>
          Workflow configuration complete
        </Text>
        <Box marginTop={1}>
          <Text wrap="wrap">
            All {WORKFLOW_LEAF_SECTION_COUNT} sections were saved to your
            workspace.
          </Text>
        </Box>
        {sections.map((section) => (
          <Text key={section.label}>
            {statusIcon(section.status)} {section.label}
          </Text>
        ))}
      </Box>
    );
  }

  if (screen.name === "engineering-summary") {
    const sections = [
      ...ENGINEERING_SECTION_ITEMS.filter((item) => item.id !== "patterns").map(
        (item) => ({
          label: item.label,
          status: getSectionStatus(item.id, state.engineeringAnswers),
        }),
      ),
      ...ENGINEERING_PATTERNS_ITEMS.map((item) => ({
        label: item.label,
        status: getSectionStatus(item.id, state.engineeringAnswers),
      })),
    ];

    return (
      <Box flexDirection="column">
        <Text bold color={theme.accent}>
          {state.engineeringPointer === "target"
            ? "Refactor Engineering complete"
            : "Engineering Brief complete"}
        </Text>
        <Box marginTop={1}>
          <Text wrap="wrap">
            {state.engineeringPointer === "target"
              ? "Modified files are in the target version. Run sdd-technical, then Promote Engineering Target when ready."
              : `All ${ENGINEERING_LEAF_SECTION_COUNT} sections were saved to your workspace.`}
          </Text>
        </Box>
        {sections.map((section) => (
          <Text key={section.label}>
            {statusIcon(section.status)} {section.label}
          </Text>
        ))}
      </Box>
    );
  }

  if (screen.name === "action-running") {
    return (
      <Box flexDirection="column">
        <Text bold color={theme.accent}>
          {screen.label}
        </Text>
      </Box>
    );
  }

  if (screen.name === "action-result") {
    return (
      <Box flexDirection="column">
        <Text bold color={theme.accent}>
          {screen.title}
        </Text>
      </Box>
    );
  }

  return <Text>Loading…</Text>;
});

export const ContentPanel = memo(function ContentPanel({
  screen,
  state,
  selectedIndex,
  engineeringSession,
  workflowSession,
  resultLines,
}: ContentPanelProps) {
  if (screen.name === "brownfield-main-menu") {
    return <BrownfieldMenuContent selectedIndex={selectedIndex} />;
  }

  if (screen.name === "project-type") {
    return <ProjectTypeContent selectedIndex={selectedIndex} />;
  }

  if (screen.name === "main-menu") {
    return <MainMenuContent selectedIndex={selectedIndex} />;
  }

  if (
    screen.name === "setup-foundation-assistant" ||
    screen.name === "sync-assistant"
  ) {
    const selected = ASSISTANTS[selectedIndex];
    return (
      <MenuPreview
        title={selected.label}
        description={`Install SDD skills for ${selected.label}.`}
        why="Your assistant needs SDD skills to run sdd-idea, sdd-spec, and other workflows."
        filesAffected={[`${selected.label}-specific skills folder`]}
        estimatedTime="< 1 min"
        recommendedUsage="Choose the assistant you use daily."
      />
    );
  }

  if (screen.name === "engineering-dashboard") {
    const selected = ENGINEERING_SECTION_ITEMS[selectedIndex];
    const status =
      selected.id === "patterns"
        ? getPatternsGroupStatus(state.engineeringAnswers)
        : getSectionStatus(selected.id, state.engineeringAnswers);

    return (
      <Box flexDirection="column">
        <Text bold color={theme.accent}>
          {selected.label}
        </Text>
        <Text wrap="wrap">{selected.description}</Text>
        <Box marginTop={1} flexDirection="column">
          <Text bold>Status</Text>
          <Text>
            {statusIcon(status)} {status.replace("-", " ")}
          </Text>
        </Box>
        <Box marginTop={1} flexDirection="column">
          <Text bold>Generates</Text>
          <Text>{selected.filesAffected.join(", ")}</Text>
        </Box>
      </Box>
    );
  }

  if (screen.name === "engineering-patterns-dashboard") {
    const selected = ENGINEERING_PATTERNS_ITEMS[selectedIndex];
    const status = getSectionStatus(selected.id, state.engineeringAnswers);

    return (
      <Box flexDirection="column">
        <Text bold color={theme.accent}>
          {selected.label}
        </Text>
        <Text wrap="wrap">{selected.description}</Text>
        <Box marginTop={1} flexDirection="column">
          <Text bold>Status</Text>
          <Text>
            {statusIcon(status)} {status.replace("-", " ")}
          </Text>
        </Box>
        <Box marginTop={1} flexDirection="column">
          <Text bold>Generates</Text>
          <Text>{selected.filesAffected.join(", ")}</Text>
        </Box>
      </Box>
    );
  }

  if (screen.name === "engineering-section" && engineeringSession) {
    return (
      <EngineeringSectionPreview
        sectionId={engineeringSession.sectionId}
        questionIndex={engineeringSession.questionIndex}
        optionIndex={engineeringSession.optionIndex}
      />
    );
  }

  if (screen.name === "engineering-refactor-prompt") {
    const selected =
      selectedIndex === 0 ? "Continue configuring" : "Finalize refactor";

    return (
      <Box flexDirection="column">
        <Text bold color={theme.accent}>
          {selected}
        </Text>
        <Box marginTop={1}>
          <Text wrap="wrap">
            {selectedIndex === 0
              ? "Return to the dashboard to configure another Engineering Brief section."
              : "Copy unchanged files from current and close the refactor."}
          </Text>
        </Box>
        {state.refactorModifiedSections.length > 0 ? (
          <Box marginTop={1} flexDirection="column">
            <Text bold>Modified sections</Text>
            {state.refactorModifiedSections.map((sectionId) => (
              <Text key={sectionId}>{sectionId}</Text>
            ))}
          </Box>
        ) : null}
      </Box>
    );
  }

  if (screen.name === "workflow-dashboard") {
    const selected = WORKFLOW_SECTION_ITEMS[selectedIndex];
    const status = getWorkflowSectionStatus(
      selected.id,
      state.workflowAnswers,
    );

    return (
      <Box flexDirection="column">
        <Text bold color={theme.accent}>
          {selected.label}
        </Text>
        <Text wrap="wrap">{selected.description}</Text>
        <Box marginTop={1} flexDirection="column">
          <Text bold>Status</Text>
          <Text>
            {statusIcon(status)} {status.replace("-", " ")}
          </Text>
        </Box>
        <Box marginTop={1} flexDirection="column">
          <Text bold>Generates</Text>
          <Text>{selected.filesAffected.join(", ")}</Text>
        </Box>
      </Box>
    );
  }

  if (screen.name === "workflow-section" && workflowSession) {
    return (
      <WorkflowSectionPreview
        sectionId={workflowSession.sectionId}
        questionIndex={workflowSession.questionIndex}
        optionIndex={workflowSession.optionIndex}
      />
    );
  }

  if (screen.name === "workflow-summary") {
    const lines = formatWorkflowConfigureSummary();

    return (
      <Box flexDirection="column">
        {lines.map((line, index) => (
          <Text key={`${index}-${line}`} wrap="wrap">
            {line}
          </Text>
        ))}
      </Box>
    );
  }

  if (screen.name === "engineering-summary") {
    const lines = formatEngineeringConfigureSummary();

    return (
      <Box flexDirection="column">
        {lines.map((line, index) => (
          <Text key={`${index}-${line}`} wrap="wrap">
            {line}
          </Text>
        ))}
      </Box>
    );
  }

  if (screen.name === "action-running") {
    return (
      <Box flexDirection="column">
        <Text color={theme.muted}>Please wait…</Text>
      </Box>
    );
  }

  if (screen.name === "action-result") {
    const lines = screen.lines.length > 0 ? screen.lines : resultLines;
    return (
      <Box flexDirection="column">
        {lines.map((line, index) => (
          <Text key={`${index}-${line}`} wrap="wrap">
            {line}
          </Text>
        ))}
      </Box>
    );
  }

  return <Text color={theme.muted}>Preparing view…</Text>;
});

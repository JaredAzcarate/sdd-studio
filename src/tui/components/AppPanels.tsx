import React, { memo } from "react";
import { Box, Text } from "ink";
import { MenuPreview, OptionPreview } from "./PreviewPanels.js";
import { SelectableList } from "./SelectableList.js";
import {
  ENGINEERING_PATTERNS_ITEMS,
  ENGINEERING_SECTION_ITEMS,
  MAIN_MENU_ITEMS,
} from "../data/menu-items.js";
import { theme } from "../theme.js";
import type { EngineeringSession } from "../use-app-input.js";
import type { AppScreen, AppState } from "../types.js";
import {
  countCompletedSections,
  getPatternsGroupStatus,
  getSectionStatus,
  statusIcon,
} from "../../engineering-config/state/engineering-section-status.js";
import {
  ENGINEERING_LEAF_SECTION_COUNT,
  ENGINEERING_SECTIONS,
} from "../../engineering-config/catalog/index.js";
import { getVisibleQuestions } from "../../engineering-config/catalog/question-utils.js";
import { ASSISTANTS } from "../../registries/assistants.registry.js";
import type { EngineeringSectionId } from "../../engineering-config/types.js";

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

type NavigationPanelProps = {
  screen: AppScreen;
  state: AppState;
  selectedIndex: number;
  engineeringSession: EngineeringSession | null;
};

type ContentPanelProps = NavigationPanelProps & {
  resultLines: string[];
};

const MainMenuNavigation = memo(function MainMenuNavigation({
  selectedIndex,
}: {
  selectedIndex: number;
}) {
  return (
    <SelectableList
      title="Actions"
      selectedIndex={selectedIndex}
      items={MAIN_MENU_ITEMS.map((item) => ({
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
  const selected = MAIN_MENU_ITEMS[selectedIndex];
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
}: NavigationPanelProps) {
  if (screen.name === "main-menu") {
    return <MainMenuNavigation selectedIndex={selectedIndex} />;
  }

  if (screen.name === "install-sdd-assistant" || screen.name === "sync-assistant") {
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

  if (
    screen.name === "install-sdd-engineering" ||
    screen.name === "install-sdd-workflow" ||
    screen.name === "create-workspace-workflow"
  ) {
    const titles: Record<string, string> = {
      "install-sdd-engineering": "Configure Engineering Brief now?",
      "install-sdd-workflow": "Include workflow module?",
      "create-workspace-workflow": "Include workflow module?",
    };

    return (
      <SelectableList
        title={titles[screen.name]}
        selectedIndex={selectedIndex}
        items={[
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
        ]}
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
          Engineering Brief complete
        </Text>
        <Box marginTop={1}>
          <Text wrap="wrap">
            All {ENGINEERING_LEAF_SECTION_COUNT} sections were saved to your
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
          Result
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
  resultLines,
}: ContentPanelProps) {
  if (screen.name === "main-menu") {
    return <MainMenuContent selectedIndex={selectedIndex} />;
  }

  if (screen.name === "install-sdd-assistant" || screen.name === "sync-assistant") {
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

  if (
    screen.name === "install-sdd-engineering" ||
    screen.name === "install-sdd-workflow" ||
    screen.name === "create-workspace-workflow"
  ) {
    const meta: Record<string, { title: string; description: string }> = {
      "install-sdd-engineering": {
        title: "Configure Engineering Brief now?",
        description:
          "Set principles, decisions, conventions, and patterns before generating the technology stack.",
      },
      "install-sdd-workflow": {
        title: "Include workflow module?",
        description:
          "Adds roadmap, milestones, and releases under .workspace/workflow/.",
      },
      "create-workspace-workflow": {
        title: "Include workflow module?",
        description:
          "Adds roadmap, milestones, and releases under .workspace/workflow/.",
      },
    };
    const item = meta[screen.name];

    return (
      <Box flexDirection="column">
        <Text bold color={theme.accent}>
          {item.title}
        </Text>
        <Text wrap="wrap">{item.description}</Text>
      </Box>
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

  if (screen.name === "engineering-summary") {
    const sections = [
      ...ENGINEERING_SECTION_ITEMS.filter((item) => item.id !== "patterns").map(
        (item) => item.filesAffected[0],
      ),
      ...ENGINEERING_PATTERNS_ITEMS.map((item) => item.filesAffected[0]),
    ];

    return (
      <Box flexDirection="column">
        <Text bold color={theme.accent}>
          Success
        </Text>
        <Text wrap="wrap">
          Your Engineering Brief is ready. The following files were generated:
        </Text>
        <Box marginTop={1} flexDirection="column">
          {sections.map((file) => (
            <Text key={file}>• {file}</Text>
          ))}
        </Box>
        <Box marginTop={2} flexDirection="column">
          <Text bold>Next step</Text>
          <Text wrap="wrap">
            Run the sdd-technical skill to generate engineering-stack.md.
          </Text>
        </Box>
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

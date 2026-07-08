import React from "react";
import { Box, Text } from "ink";
import { useTerminalSize } from "../hooks/use-terminal-size.js";
import { theme } from "../theme.js";
import type { FooterShortcut } from "../types.js";

const HEADER_ROWS = 6;
const FOOTER_ROWS = 3;
const LAYOUT_MARGIN_ROWS = 2;

type AppLayoutProps = {
  version: string;
  sectionTitle: string;
  projectName: string;
  shortcuts: FooterShortcut[];
  navigation: React.ReactNode;
  content: React.ReactNode;
};

export function AppLayout({
  version,
  sectionTitle,
  projectName,
  shortcuts,
  navigation,
  content,
}: AppLayoutProps) {
  const { rows } = useTerminalSize();
  const bodyHeight = Math.max(
    rows - HEADER_ROWS - FOOTER_ROWS - LAYOUT_MARGIN_ROWS,
    10,
  );

  return (
    <Box flexDirection="column">
      <Box
        flexShrink={0}
        borderStyle="round"
        borderColor={theme.border}
        paddingX={1}
        flexDirection="column"
      >
        <Text bold color={theme.brand}>
          SDD Studio v{version}
        </Text>
        <Text color={theme.header}>{sectionTitle}</Text>
        <Text color={theme.muted}>Project: {projectName}</Text>
      </Box>

      <Box marginTop={1} height={bodyHeight} flexDirection="row">
        <Box
          width="32%"
          height={bodyHeight}
          borderStyle="single"
          borderColor={theme.border}
          flexDirection="column"
          paddingX={1}
          overflow="hidden"
        >
          {navigation}
        </Box>
        <Box
          flexGrow={1}
          height={bodyHeight}
          borderStyle="single"
          borderColor={theme.border}
          flexDirection="column"
          paddingX={1}
          marginLeft={1}
          overflow="hidden"
        >
          {content}
        </Box>
      </Box>

      <Box
        flexShrink={0}
        borderStyle="round"
        borderColor={theme.border}
        paddingX={1}
        marginTop={1}
      >
        <Text color={theme.muted}>
          {shortcuts.map((item) => `${item.keys} ${item.label}`).join("   ")}
        </Text>
      </Box>
    </Box>
  );
}

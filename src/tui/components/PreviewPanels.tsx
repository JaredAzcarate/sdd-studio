import React, { memo } from "react";
import { Box, Text } from "ink";
import type { OptionDetail } from "../../engineering-config/types.js";
import { theme } from "../theme.js";

type OptionPreviewProps = {
  detail: OptionDetail | null;
  title?: string;
};

export const OptionPreview = memo(function OptionPreview({
  detail,
  title = "Preview",
}: OptionPreviewProps) {
  return (
    <Box flexDirection="column" overflow="hidden">
      <Text bold color={theme.accent}>
        {title}
      </Text>
      <Box marginTop={1} flexDirection="column" overflow="hidden">
        {!detail ? (
          <Text color={theme.muted}>Select an option to see details.</Text>
        ) : (
          <>
            <Box flexDirection="column" marginBottom={1}>
              <Text bold>What is it?</Text>
              <Text wrap="wrap">{detail.whatIsIt}</Text>
            </Box>
            {detail.structureExample ? (
              <Box flexDirection="column" marginBottom={1}>
                <Text bold>Structure</Text>
                <Text>{detail.structureExample}</Text>
              </Box>
            ) : (
              <Box flexDirection="column" marginBottom={1}>
                <Text bold>Example</Text>
                <Text wrap="wrap">{detail.example}</Text>
              </Box>
            )}
            <Box flexDirection="column">
              <Text bold>Recommendation</Text>
              <Text wrap="wrap">{detail.recommendation}</Text>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
});

type MenuPreviewProps = {
  title: string;
  description: string;
  why: string;
  filesAffected: string[];
  estimatedTime: string;
  recommendedUsage: string;
};

export function MenuPreview({
  title,
  description,
  why,
  filesAffected,
  estimatedTime,
  recommendedUsage,
}: MenuPreviewProps) {
  return (
    <Box flexDirection="column">
      <Text bold color={theme.accent}>
        {title}
      </Text>
      <Box marginTop={1} flexDirection="column">
        <Text bold>What it does</Text>
        <Text wrap="wrap">{description}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text bold>Why it exists</Text>
        <Text wrap="wrap">{why}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text bold>Files affected</Text>
        {filesAffected.length === 0 ? (
          <Text color={theme.muted}>None</Text>
        ) : (
          filesAffected.map((file) => <Text key={file}>• {file}</Text>)
        )}
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text bold>Estimated time</Text>
        <Text>{estimatedTime}</Text>
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text bold>Recommended usage</Text>
        <Text wrap="wrap">{recommendedUsage}</Text>
      </Box>
    </Box>
  );
}

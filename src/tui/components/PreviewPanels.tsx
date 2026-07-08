import React, { memo } from "react";
import { Box, Text } from "ink";
import type { OptionDetail } from "../../engineering-config/types.js";
import { theme } from "../theme.js";

type OptionPreviewProps = {
  detail: OptionDetail | null;
  title?: string;
};

const DETAIL_FIELDS: Array<{ key: keyof OptionDetail; icon: string; label: string }> =
  [
    { key: "whatIsIt", icon: "📖", label: "What is it?" },
    { key: "example", icon: "📁", label: "Example" },
    { key: "bestFor", icon: "✅", label: "Best for" },
    { key: "considerations", icon: "⚠", label: "Considerations" },
    { key: "recommendation", icon: "💡", label: "SDD Studio Recommendation" },
    { key: "learnMore", icon: "📚", label: "Learn more" },
  ];

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
          DETAIL_FIELDS.map((field) => (
            <Box key={field.key} flexDirection="column" marginBottom={1}>
              <Text color={theme.selected}>
                {field.icon} {field.label}
              </Text>
              <Text wrap="wrap">{detail[field.key]}</Text>
            </Box>
          ))
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

import React from "react";
import { Box, Text } from "ink";
import { theme } from "../theme.js";

type SelectableListProps = {
  title: string;
  items: Array<{ id: string; label: string; icon?: string }>;
  selectedIndex: number;
  selectionMode?: "single" | "multi";
  selectedOptionIds?: string[];
};

export function SelectableList({
  title,
  items,
  selectedIndex,
  selectionMode = "single",
  selectedOptionIds = [],
}: SelectableListProps) {
  return (
    <Box flexDirection="column">
      <Text bold color={theme.brand}>
        {title}
      </Text>
      <Box marginTop={1} flexDirection="column">
        {items.map((item, index) => {
          const selected = index === selectedIndex;
          const prefix = selected ? "❯ " : "  ";
          const icon = item.icon ? `${item.icon} ` : "";
          const multiMark =
            selectionMode === "multi"
              ? `${selectedOptionIds.includes(item.id) ? "[x]" : "[ ]"} `
              : "";

          return (
            <Text
              key={item.id}
              color={selected ? theme.selected : undefined}
              bold={selected}
            >
              {prefix}
              {multiMark}
              {icon}
              {item.label}
            </Text>
          );
        })}
      </Box>
    </Box>
  );
}

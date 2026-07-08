import React from "react";
import { Box, Text } from "ink";
import { theme } from "../theme.js";

type SelectableListProps = {
  title: string;
  items: Array<{ id: string; label: string; icon?: string }>;
  selectedIndex: number;
};

export function SelectableList({
  title,
  items,
  selectedIndex,
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

          return (
            <Text
              key={item.id}
              color={selected ? theme.selected : undefined}
              bold={selected}
            >
              {prefix}
              {icon}
              {item.label}
            </Text>
          );
        })}
      </Box>
    </Box>
  );
}

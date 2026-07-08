import { stdin as input, stdout as output } from "node:process";
import readline from "node:readline";
import type { EngineeringOption, OptionDetail } from "../types.js";

export type DetailSelectConfig = {
  sectionTitle: string;
  sectionDescription: string;
  questionDescription: string;
  message: string;
  options: EngineeringOption[];
};

const DETAIL_LABELS: Array<{ key: keyof OptionDetail; icon: string; label: string }> =
  [
    { key: "whatIsIt", icon: "📖", label: "What is it?" },
    { key: "example", icon: "📁", label: "Example" },
    { key: "bestFor", icon: "✅", label: "Best for" },
    { key: "considerations", icon: "⚠️", label: "Considerations" },
    { key: "recommendation", icon: "💡", label: "SDD Studio Recommendation" },
    { key: "learnMore", icon: "📚", label: "Learn more" },
  ];

function clearScreen(): void {
  output.write("\x1b[2J\x1b[H");
}

function hideCursor(): void {
  output.write("\x1b[?25l");
}

function showCursor(): void {
  output.write("\x1b[?25h");
}

function formatDetail(detail: OptionDetail): string[] {
  const lines: string[] = [""];

  for (const item of DETAIL_LABELS) {
    lines.push(`${item.icon} ${item.label}`);
    lines.push("");
    lines.push(detail[item.key]);
    lines.push("");
  }

  return lines;
}

function renderPrompt(
  config: DetailSelectConfig,
  selectedIndex: number,
  showDetails: boolean,
): string[] {
  const lines: string[] = [
    config.sectionTitle,
    "",
    config.sectionDescription,
    "",
    config.questionDescription,
    "",
    config.message,
    "",
  ];

  config.options.forEach((option, index) => {
    const prefix = index === selectedIndex ? "❯ " : "  ";
    lines.push(`${prefix}${option.label}`);
  });

  lines.push("");
  lines.push("Press Space for details on the selected option.");
  lines.push("Use ↑/↓ to move, Enter to confirm.");

  if (showDetails) {
    lines.push(...formatDetail(config.options[selectedIndex].detail));
  }

  return lines;
}

export async function detailSelect(
  config: DetailSelectConfig,
): Promise<string> {
  if (!input.isTTY || !output.isTTY) {
    throw new Error(
      "An interactive terminal is required for engineering configuration.",
    );
  }

  return new Promise((resolve, reject) => {
    let selectedIndex = 0;
    let showDetails = false;
    let settled = false;

    readline.emitKeypressEvents(input);

    const cleanup = (): void => {
      input.setRawMode(false);
      input.pause();
      input.removeListener("keypress", onKeypress);
      showCursor();
    };

    const redraw = (): void => {
      clearScreen();
      const lines = renderPrompt(config, selectedIndex, showDetails);
      output.write(lines.join("\n"));
    };

    const finish = (value: string): void => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      clearScreen();
      resolve(value);
    };

    const onKeypress = (
      _str: string,
      key: readline.Key & { name?: string; ctrl?: boolean },
    ): void => {
      if (!key) {
        return;
      }

      if (key.ctrl && key.name === "c") {
        settled = true;
        cleanup();
        clearScreen();
        reject(new Error("Engineering configuration cancelled."));
        return;
      }

      if (key.name === "up") {
        selectedIndex =
          (selectedIndex - 1 + config.options.length) % config.options.length;
        redraw();
        return;
      }

      if (key.name === "down") {
        selectedIndex = (selectedIndex + 1) % config.options.length;
        redraw();
        return;
      }

      if (key.name === "space") {
        showDetails = !showDetails;
        redraw();
        return;
      }

      if (key.name === "return") {
        finish(config.options[selectedIndex].id);
      }
    };

    hideCursor();
    input.setRawMode(true);
    input.resume();
    input.on("keypress", onKeypress);
    redraw();
  });
}

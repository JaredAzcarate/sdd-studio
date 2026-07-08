import React from "react";
import process from "node:process";
import { render } from "ink";
import { SddApp } from "./App.js";
import type { AppScreen, TuiExitResult } from "./types.js";

const ENTER_ALTERNATE_SCREEN = "\x1b[?1049h";
const EXIT_ALTERNATE_SCREEN = "\x1b[?1049l";

export type RunTuiOptions = {
  targetDir: string;
  version: string;
  initialScreen?: AppScreen;
};

export async function runTui(options: RunTuiOptions): Promise<TuiExitResult> {
  const { stdout } = process;
  const useAlternateScreen = stdout.isTTY === true;

  if (useAlternateScreen) {
    stdout.write(ENTER_ALTERNATE_SCREEN);
  }

  try {
    return await new Promise<TuiExitResult>((resolve) => {
      const instance = render(
        <SddApp
          targetDir={options.targetDir}
          version={options.version}
          initialScreen={options.initialScreen}
          onFinish={(result) => {
            instance.unmount();
            resolve(result);
          }}
        />,
        { exitOnCtrlC: true, stdout },
      );
    });
  } finally {
    if (useAlternateScreen) {
      stdout.write(EXIT_ALTERNATE_SCREEN);
    }
  }
}

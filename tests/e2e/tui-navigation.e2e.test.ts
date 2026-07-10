import { PassThrough } from "node:stream";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import React from "react";
import { render } from "ink";
import { afterEach, describe, expect, it } from "vitest";
import { SddApp } from "../../src/tui/App.js";
import type { AppScreen, TuiExitResult } from "../../src/tui/types.js";
import { getVisibleBrownfieldMenuItems, getVisibleMainMenuItems } from "../../src/tui/data/menu-items.js";

function createMockStdin(): PassThrough & {
  isTTY: boolean;
  setRawMode: (mode: boolean) => void;
} {
  const stdin = new PassThrough() as PassThrough & {
    isTTY: boolean;
    setRawMode: (mode: boolean) => void;
  };
  stdin.isTTY = true;
  stdin.setRawMode = () => stdin;
  return stdin;
}

function pressEnter(stdin: PassThrough): void {
  stdin.write("\r");
}

function pressEscape(stdin: PassThrough): void {
  stdin.write("\u001b");
}

function pressDown(stdin: PassThrough, count = 1): void {
  for (let i = 0; i < count; i += 1) {
    stdin.write("\u001b[B");
  }
}

async function renderApp(
  targetDir: string,
  initialScreen?: AppScreen,
): Promise<{
  stdin: PassThrough;
  waitForExit: Promise<TuiExitResult>;
  unmount: () => void;
}> {
  const stdin = createMockStdin();
  const stdout = new PassThrough();

  let resolveExit!: (result: TuiExitResult) => void;
  const waitForExit = new Promise<TuiExitResult>((resolve) => {
    resolveExit = resolve;
  });

  const { unmount } = render(
    React.createElement(SddApp, {
      targetDir,
      version: "0.7.0-test",
      initialScreen,
      onFinish: (result) => {
        resolveExit(result);
        unmount();
      },
    }),
    { stdin, stdout, patchConsole: false },
  );

  await sleep(50);
  return { stdin, waitForExit, unmount };
}

async function navigateToMenuItem(
  stdin: PassThrough,
  index: number,
): Promise<void> {
  pressDown(stdin, index);
  await sleep(30);
  pressEnter(stdin);
  await sleep(100);
}

describe("tui navigation e2e", () => {
  let tempDir = "";

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = "";
    }
  });

  it("greenfield: navigates all main menu options without crash", async () => {
    tempDir = mkdtempSync(join(tmpdir(), "sdd-tui-greenfield-"));
    const { stdin, unmount } = await renderApp(tempDir);

    pressEnter(stdin);
    await sleep(100);

    const menuItems = getVisibleMainMenuItems().filter((item) => item.id !== "exit");

    for (let index = 0; index < menuItems.length; index += 1) {
      await navigateToMenuItem(stdin, index);

      if (menuItems[index].id === "setup-foundation") {
        pressEnter(stdin);
        await sleep(500);
      }

      if (menuItems[index].id === "configure-engineering") {
        pressEscape(stdin);
        await sleep(100);
        continue;
      }

      if (menuItems[index].id === "configure-workflow") {
        pressEscape(stdin);
        await sleep(100);
        continue;
      }

      if (menuItems[index].id === "sync") {
        pressEnter(stdin);
        await sleep(500);
      }

      pressEscape(stdin);
      await sleep(100);
    }

    const exitIndex = getVisibleMainMenuItems().findIndex((item) => item.id === "exit");
    await navigateToMenuItem(stdin, exitIndex);
    unmount();
  }, 30_000);

  it("brownfield: navigates all menu options without crash", async () => {
  tempDir = mkdtempSync(join(tmpdir(), "sdd-tui-brownfield-"));
  const { stdin, unmount } = await renderApp(tempDir);

  pressDown(stdin, 1);
  await sleep(30);
  pressEnter(stdin);
  await sleep(100);

  const menuItems = getVisibleBrownfieldMenuItems().filter((item) => item.id !== "exit");

  for (let index = 0; index < menuItems.length; index += 1) {
    await navigateToMenuItem(stdin, index);

    if (menuItems[index].id === "setup-foundation") {
      pressEnter(stdin);
      await sleep(500);
    }

    if (menuItems[index].id === "configure-refactor-engineering") {
      pressEscape(stdin);
      await sleep(100);
      continue;
    }

    if (menuItems[index].id === "sync") {
      pressEnter(stdin);
      await sleep(500);
    }

    pressEscape(stdin);
    await sleep(100);
  }

  const exitIndex = getVisibleBrownfieldMenuItems().findIndex((item) => item.id === "exit");
  await navigateToMenuItem(stdin, exitIndex);
  unmount();
}, 30_000);
});

import { useCallback, useRef } from "react";
import { useInput } from "ink";
import type { Key } from "ink";

export type InputHandler = (input: string, key: Key) => void;

export function useStableInput(handler: InputHandler): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const stableHandler = useCallback((input: string, key: Key) => {
    handlerRef.current(input, key);
  }, []);

  useInput(stableHandler);
}

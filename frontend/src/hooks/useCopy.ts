import { useCallback, useEffect, useRef, useState } from "react";

export function useCopy(resetMs = 1500) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        return false;
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetMs);
      return true;
    },
    [resetMs],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return { copied, copy };
}

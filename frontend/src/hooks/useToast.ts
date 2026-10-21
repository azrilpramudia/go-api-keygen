import { useCallback, useEffect, useRef, useState } from "react";

export interface ToastState {
  id: number;
  message: string;
  kind: "success" | "error";
}

export function useToast(duration = 2000) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback(
    (message: string, kind: ToastState["kind"] = "success") => {
      clearTimeout(timer.current);
      setToast({ id: Date.now(), message, kind });
      timer.current = setTimeout(() => setToast(null), duration);
    },
    [duration],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return { toast, show };
}

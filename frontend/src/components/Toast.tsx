import { CheckCircle2, XCircle } from "lucide-react";
import type { ToastState } from "../hooks/useToast";

export function Toast({ toast }: { toast: ToastState | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center px-4"
    >
      {toast && (
        <div
          key={toast.id}
          className={`flex animate-toast-in items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-white shadow-lg ${
            toast.kind === "success"
              ? "bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900"
              : "bg-red-600"
          }`}
        >
          {toast.kind === "success" ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <XCircle className="size-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}

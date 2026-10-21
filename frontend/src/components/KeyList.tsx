import { useState } from "react";
import { Check, Copy, Download, Eye, EyeOff, Trash2 } from "lucide-react";
import { downloadEnv, downloadTxt } from "../lib/download";
import { useCopy } from "../hooks/useCopy";
import { KeyItem } from "./KeyItem";
import type { ToastState } from "../hooks/useToast";
import type { GeneratedKey } from "../types/key";

interface Props {
  keys: GeneratedKey[];
  onClear: () => void;
  onNotify: (message: string, kind?: ToastState["kind"]) => void;
}

const btn =
  "inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800";

export function KeyList({ keys, onClear, onNotify }: Props) {
  const [masked, setMasked] = useState(false);
  const { copied, copy } = useCopy();

  if (keys.length === 0) return null;

  async function copyAll() {
    const ok = await copy(keys.map((k) => k.value).join("\n"));
    if (ok) onNotify(`${keys.length} keys copied to clipboard`);
    else onNotify("Failed to copy", "error");
  }

  return (
    <section
      className="flex min-h-0 flex-1 flex-col"
      aria-label="Generated results"
    >
      <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Results ({keys.length})</h2>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btn}
            onClick={() => setMasked((m) => !m)}
          >
            {masked ? (
              <Eye className="size-3.5" />
            ) : (
              <EyeOff className="size-3.5" />
            )}
            {masked ? "Show" : "Hide"}
          </button>
          {keys.length > 1 && (
            <button type="button" className={btn} onClick={copyAll}>
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
              Copy all
            </button>
          )}
          <button
            type="button"
            className={btn}
            onClick={() => downloadTxt(keys)}
          >
            <Download className="size-3.5" /> .txt
          </button>
          <button
            type="button"
            className={btn}
            onClick={() => downloadEnv(keys)}
          >
            <Download className="size-3.5" /> .env
          </button>
          <button type="button" className={btn} onClick={onClear}>
            <Trash2 className="size-3.5" /> Clear
          </button>
        </div>
      </div>

      <ul className="min-h-0 space-y-2 overflow-y-auto pr-1">
        {keys.map((k) => (
          <KeyItem key={k.value} data={k} masked={masked} onNotify={onNotify} />
        ))}
      </ul>
    </section>
  );
}

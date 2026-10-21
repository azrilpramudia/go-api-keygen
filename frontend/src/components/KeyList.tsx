import { useState } from "react";
import { Check, Copy, Download, Eye, EyeOff, Trash2 } from "lucide-react";
import { downloadEnv, downloadTxt } from "../lib/download";
import { useCopy } from "../hooks/useCopy";
import { KeyItem } from "./KeyItem";
import { LevelBadge } from "./LevelBadge";
import type { ToastState } from "../hooks/useToast";
import type { GeneratedKey } from "../types/key";

interface Props {
  keys: GeneratedKey[];
  onClear: () => void;
  onNotify: (message: string, kind?: ToastState["kind"]) => void;
}

const btn =
  "inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100";

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
    <section className="mt-8" aria-label="Generated results">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium">Results ({keys.length})</h2>
          <LevelBadge level={keys[0].level} />
        </div>

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

      <ul className="space-y-2">
        {keys.map((k) => (
          <KeyItem key={k.value} data={k} masked={masked} onNotify={onNotify} />
        ))}
      </ul>
    </section>
  );
}

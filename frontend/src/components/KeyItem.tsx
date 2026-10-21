import { Check, Copy } from "lucide-react";
import { useCopy } from "../hooks/useCopy";
import { maskKey } from "../lib/format";
import type { ToastState } from "../hooks/useToast";
import type { GeneratedKey } from "../types/key";

interface Props {
  data: GeneratedKey;
  masked: boolean;
  onNotify: (message: string, kind?: ToastState["kind"]) => void;
}

export function KeyItem({ data, masked, onNotify }: Props) {
  const { copied, copy } = useCopy();

  async function handleCopy() {
    const ok = await copy(data.value);
    if (ok) onNotify("Key copied to clipboard");
    else
      onNotify("Failed to copy. Select the text and copy it manually.", "error");
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3">
      <code
        className={`min-w-0 flex-1 break-all font-mono text-sm ${masked ? "select-none" : "select-all"}`}
      >
        {masked ? maskKey(data.value) : data.value}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy key"
        className="shrink-0 rounded-md p-2 text-neutral-600 transition hover:bg-neutral-100"
      >
        {copied ? (
          <Check className="size-4 text-emerald-600" />
        ) : (
          <Copy className="size-4" />
        )}
      </button>
    </li>
  );
}

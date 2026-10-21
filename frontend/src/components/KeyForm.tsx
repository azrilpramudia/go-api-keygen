import { useState, type FormEvent } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import {
  BIT_OPTIONS,
  type BitSize,
  type GenerateRequest,
  type KeyFormat,
} from "../types/key";
import { levelForBits } from "../lib/levels";
import { outputLength } from "../lib/format";
import { MAX_COUNT, PREFIX_PATTERN, PREFIX_PRESETS } from "../lib/validation";
import { LevelBadge } from "./LevelBadge";

const FORMATS: { value: KeyFormat; label: string }[] = [
  { value: "hex", label: "Hex" },
  { value: "base64", label: "Base64" },
  { value: "base62", label: "Base62" },
  { value: "uuid", label: "UUID v4" },
];

const chip = (active: boolean, disabled = false) =>
  `rounded-lg border px-3 py-1.5 font-mono text-sm transition ${
    active
      ? "border-neutral-900 bg-neutral-900 text-white"
      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
  } ${disabled ? "cursor-not-allowed opacity-40 hover:border-neutral-300" : ""}`;

interface Props {
  loading: boolean;
  onSubmit: (req: GenerateRequest) => void;
}

export function KeyForm({ loading, onSubmit }: Props) {
  const [bits, setBits] = useState<BitSize>(128);
  const [format, setFormat] = useState<KeyFormat>("hex");
  const [prefix, setPrefix] = useState("");
  const [count, setCount] = useState(1);

  const isUUID = format === "uuid";
  const prefixValid = PREFIX_PATTERN.test(prefix);
  const countValid =
    Number.isInteger(count) && count >= 1 && count <= MAX_COUNT;
  const canSubmit = prefixValid && countValid && !loading;

  function selectFormat(f: KeyFormat) {
    setFormat(f);
    if (f === "uuid") setBits(128);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ bits, format, prefix, count });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">
          Entropy (bits)
        </legend>
        <div className="flex flex-wrap gap-2">
          {BIT_OPTIONS.map((b) => {
            const disabled = isUUID && b !== 128;
            return (
              <button
                key={b}
                type="button"
                disabled={disabled}
                aria-pressed={bits === b}
                onClick={() => setBits(b)}
                className={chip(bits === b, disabled)}
              >
                {b}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
          <LevelBadge level={levelForBits(bits)} />
          <span>
            Length: {outputLength(bits, format)} characters
            {prefix ? ` + prefix (${prefix.length})` : ""}
          </span>
        </div>
        {isUUID && (
          <p className="mt-2 text-xs text-neutral-500">
            UUID v4 is always 128 bits, with 122 random bits (the remaining
            bits are used for version information).
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Format</legend>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={format === f.value}
              onClick={() => selectFormat(f.value)}
              className={chip(format === f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="prefix" className="mb-2 block text-sm font-medium">
          Prefix{" "}
          <span className="font-normal text-neutral-500">(optional)</span>
        </label>
        <input
          id="prefix"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          placeholder="sk_live_"
          maxLength={32}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={!prefixValid}
          className={`w-full rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:ring-2 ${
            prefixValid
              ? "border-neutral-300 focus:ring-neutral-300"
              : "border-red-400 focus:ring-red-200"
          }`}
        />
        {!prefixValid && (
          <p className="mt-1 text-xs text-red-600">
            Only letters, numbers, underscores (_), and hyphens (-), up to 32
            characters.
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {PREFIX_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPrefix(p)}
              className="rounded-md bg-neutral-100 px-2 py-1 font-mono text-xs text-neutral-700 hover:bg-neutral-200"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="count" className="mb-2 block text-sm font-medium">
          Number of keys{" "}
          <span className="font-normal text-neutral-500">(1–{MAX_COUNT})</span>
        </label>
        <input
          id="count"
          type="number"
          min={1}
          max={MAX_COUNT}
          value={Number.isNaN(count) ? "" : count}
          onChange={(e) => setCount(e.target.valueAsNumber)}
          aria-invalid={!countValid}
          className={`w-28 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
            countValid
              ? "border-neutral-300 focus:ring-neutral-300"
              : "border-red-400 focus:ring-red-200"
          }`}
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <KeyRound className="size-4" />
        )}
        {loading ? "Generating…" : "Generate"}
      </button>
    </form>
  );
}

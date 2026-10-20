import { LEVELS } from "../lib/levels";
import type { KeyLevel } from "../types/key";

export function LevelBadge({ level }: { level: KeyLevel }) {
  const l = LEVELS[level];
  return (
    <span
      title={l.description}
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${l.className}`}
    >
      {l.label}
    </span>
  );
}

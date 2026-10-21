import type { KeyLevel } from "../types/key";

export const LEVELS: Record<
  KeyLevel,
  { label: string; description: string; className: string }
> = {
  weak: {
    label: "Very Weak",
    description: "For demos only; easy to guess",
    className:
      "bg-red-50 text-red-800 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800",
  },
  medium: {
    label: "Medium Security",
    description: "Suitable for identifiers, not secrets",
    className:
      "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800",
  },
  high: {
    label: "High Security",
    description: "128 bits or more; safe to use as a secret",
    className:
      "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800",
  },
};

export function levelForBits(bits: number): KeyLevel {
  if (bits <= 32) return "weak";
  if (bits <= 64) return "medium";
  return "high";
}

import type { KeyLevel } from "../types/key";

export const LEVELS: Record<
  KeyLevel,
  { label: string; description: string; className: string }
> = {
  weak: {
    label: "Very Weak",
    description: "For demos only; easy to guess",
    className: "bg-red-50 text-red-800 ring-red-200",
  },
  medium: {
    label: "Medium Security",
    description: "Suitable for identifiers, not secrets",
    className: "bg-amber-50 text-amber-800 ring-amber-200",
  },
  high: {
    label: "Production Ready",
    description: "128 bits or more; safe to use as a secret",
    className: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
};

export function levelForBits(bits: number): KeyLevel {
  if (bits <= 32) return "weak";
  if (bits <= 64) return "medium";
  return "high";
}

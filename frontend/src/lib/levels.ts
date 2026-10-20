import type { KeyLevel } from "../types/key";

export const LEVELS: Record<
  KeyLevel,
  { label: string; description: string; className: string }
> = {
  weak: {
    label: "Very Weak",
    description: "Hanya untuk demo, mudah ditebak",
    className: "bg-red-50 text-red-800 ring-red-200",
  },
  medium: {
    label: "Medium Security",
    description: "Cukup untuk identifier, bukan untuk secret",
    className: "bg-amber-50 text-amber-800 ring-amber-200",
  },
  high: {
    label: "Production Ready",
    description: "128 bit ke atas, aman dipakai sebagai secret",
    className: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
};

export function levelForBits(bits: number): KeyLevel {
  if (bits <= 32) return "weak";
  if (bits <= 64) return "medium";
  return "high";
}

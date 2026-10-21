import type { KeyFormat } from "../types/key";

export function outputLength(bits: number, format: KeyFormat): number {
  switch (format) {
    case "hex":
      return bits / 4;
    case "base64":
      return Math.ceil(bits / 6);
    case "base62":
      return Math.ceil(bits / Math.log2(62));
    case "uuid":
      return 36;
  }
}

export function maskKey(value: string, head = 6, tail = 4): string {
  if (value.length <= head + tail) return "•".repeat(value.length);
  return (
    value.slice(0, head) +
    "•".repeat(value.length - head - tail) +
    value.slice(-tail)
  );
}

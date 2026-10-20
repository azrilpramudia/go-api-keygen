export const BIT_OPTIONS = [16, 32, 48, 64, 128, 256] as const;
export type BitSize = (typeof BIT_OPTIONS)[number];

export type KeyFormat = "hex" | "base64" | "base62" | "uuid";
export type KeyLevel = "weak" | "medium" | "high";

export interface GenerateRequest {
  bits: BitSize;
  format: KeyFormat;
  prefix: string;
  count: number;
}

export interface GeneratedKey {
  value: string;
  bits: number;
  format: KeyFormat;
  level: KeyLevel;
}

export interface GenerateResponse {
  keys: GeneratedKey[];
}

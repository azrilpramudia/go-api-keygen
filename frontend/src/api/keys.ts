import type {
  GenerateRequest,
  GenerateResponse,
  GeneratedKey,
} from "../types/key";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  status: number;
  retryAfter?: number;

  constructor(message: string, status: number, retryAfter?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

export async function generateKeys(
  req: GenerateRequest,
  signal?: AbortSignal,
): Promise<GeneratedKey[]> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/v1/keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError("Unable to connect to the server", 0);
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    const retryAfter = Number(res.headers.get("Retry-After")) || undefined;
    throw new ApiError(
      body?.error ?? `Request failed (${res.status})`,
      res.status,
      retryAfter,
    );
  }

  const data = (await res.json()) as GenerateResponse;
  return data.keys;
}

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, generateKeys } from "../api/keys";
import type { GenerateRequest, GeneratedKey } from "../types/key";

function toMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 429) {
      return err.retryAfter
        ? `Terlalu banyak permintaan. Coba lagi dalam ${err.retryAfter} detik.`
        : "Terlalu banyak permintaan. Coba lagi sebentar lagi.";
    }
    return err.message;
  }
  return "Terjadi kesalahan tak terduga";
}

export function useGenerateKeys() {
  const [keys, setKeys] = useState<GeneratedKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const generate = useCallback(async (req: GenerateRequest) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      setKeys(await generateKeys(req, controller.signal));
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(toMessage(err));
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setKeys([]);
    setError(null);
  }, []);

  return { keys, loading, error, generate, clear };
}

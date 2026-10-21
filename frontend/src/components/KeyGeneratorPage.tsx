import { KeyForm } from "./KeyForm";
import { KeyList } from "./KeyList";
import { Toast } from "./Toast";
import { useGenerateKeys } from "../hooks/useGenerateKeys";
import { useToast } from "../hooks/useToast";

export function KeyGeneratorPage() {
  const { keys, loading, error, generate, clear } = useGenerateKeys();
  const { toast, show } = useToast();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">API Key Generator</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Generate random keys with a CSPRNG. Choose the entropy size, format,
          and prefix.
        </p>
      </header>

      <KeyForm loading={loading} onSubmit={generate} />

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <KeyList keys={keys} onClear={clear} onNotify={show} />

      <p className="mt-10 text-xs text-neutral-500">
        Keys are generated on the server and shown only once; they are not
        stored. For testing and learning only; do not use keys from a public
        tool as production secrets.
      </p>

      <Toast toast={toast} />
    </main>
  );
}

import { KeyForm } from "./components/KeyForm";
import { KeyList } from "./components/KeyList";
import { Toast } from "./components/Toast";
import { useGenerateKeys } from "./hooks/useGenerateKeys";
import { useToast } from "./hooks/useToast";

export default function App() {
  const { keys, loading, error, generate, clear } = useGenerateKeys();
  const { toast, show } = useToast();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">API Key Generator</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Generate key acak dengan CSPRNG. Pilih ukuran entropi, format, dan
          prefix.
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
        Key dibuat di server dan hanya ditampilkan sekali, tidak disimpan. Untuk
        testing dan belajar; jangan pakai key dari tool publik sebagai secret
        production.
      </p>

      <Toast toast={toast} />
    </main>
  );
}

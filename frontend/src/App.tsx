import { KeyForm } from "./components/KeyForm";
import { LevelBadge } from "./components/LevelBadge";
import { useGenerateKeys } from "./hooks/useGenerateKeys";

export default function App() {
  const { keys, loading, error, generate } = useGenerateKeys();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">API Key Generator</h1>

      <KeyForm loading={loading} onSubmit={generate} />

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <ul className="mt-6 space-y-2 font-mono text-sm">
        {keys.map((k) => (
          <li
            key={k.value}
            className="flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <span className="break-all">{k.value}</span>
            <LevelBadge level={k.level} />
          </li>
        ))}
      </ul>
    </main>
  );
}

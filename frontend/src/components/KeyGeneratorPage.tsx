import { useState } from "react";
import { KeyForm } from "./KeyForm";
import { KeyList } from "./KeyList";
import { Toast } from "./Toast";
import { useGenerateKeys } from "../hooks/useGenerateKeys";
import { useToast } from "../hooks/useToast";

export function KeyGeneratorPage() {
  const { keys, loading, error, generate, clear } = useGenerateKeys();
  const { toast, show } = useToast();
  const [mobileView, setMobileView] = useState<"generate" | "results">(
    "generate",
  );

  return (
    <main className="h-svh overflow-hidden bg-neutral-50 text-neutral-900">
      <div className="mx-auto flex h-full max-w-5xl flex-col px-4 py-3 sm:px-6 sm:py-4 md:py-6">
        <header className="mb-3 shrink-0 sm:mb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            API Key Generator
          </h1>
          <p className="mt-1 hidden text-sm text-neutral-600 sm:block">
            Generate random keys with a CSPRNG. Choose the entropy size, format,
            and prefix.
          </p>
        </header>

        <div
          className="mb-2 grid shrink-0 grid-cols-2 gap-1 rounded-lg border border-neutral-200 bg-white p-1 md:hidden"
          aria-label="Generator sections"
        >
          {(["generate", "results"] as const).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setMobileView(view)}
              aria-pressed={mobileView === view}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                mobileView === view
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {view === "generate" ? "Configure" : `Results (${keys.length})`}
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] gap-3 md:grid-cols-2">
          <section
            className={`min-h-0 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-4 ${
              mobileView === "generate" ? "block" : "hidden"
            } md:block`}
            aria-label="Key settings"
          >
            <KeyForm
              loading={loading}
              onSubmit={async (request) => {
                await generate(request);
                setMobileView("results");
              }}
            />
          </section>

          <section
            className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 ${
              mobileView === "results" ? "flex" : "hidden"
            } md:flex`}
            aria-label="Generated keys"
          >
            {error && (
              <p role="alert" className="mb-4 shrink-0 text-sm text-red-600">
                {error}
              </p>
            )}

            {keys.length > 0 ? (
              <KeyList keys={keys} onClear={clear} onNotify={show} />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <h2 className="text-sm font-medium text-neutral-900">
                  Your keys will appear here
                </h2>
                <p className="mt-1 max-w-xs text-sm text-neutral-500">
                  Choose your settings and generate a key to get started.
                </p>
              </div>
            )}
          </section>
        </div>

        <p className="mt-2 shrink-0 text-center text-xs text-neutral-500">
          Keys are generated on the server and shown once. Never use public
          tools for production secrets.
        </p>

        <Toast toast={toast} />
      </div>
    </main>
  );
}

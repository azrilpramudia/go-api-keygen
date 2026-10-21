import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { KeyForm } from "./KeyForm";
import { KeyList } from "./KeyList";
import { Toast } from "./Toast";
import { useGenerateKeys } from "../hooks/useGenerateKeys";
import { useToast } from "../hooks/useToast";
import { useTheme } from "../hooks/useTheme";

export function KeyGeneratorPage() {
  const { keys, loading, error, generate, clear } = useGenerateKeys();
  const { toast, show } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [mobileView, setMobileView] = useState<"generate" | "results">(
    "generate",
  );

  return (
    <main className="h-svh overflow-hidden bg-neutral-50 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto flex h-full max-w-5xl flex-col px-4 py-3 sm:px-6 sm:py-4 md:py-6">
        <header className="mb-3 flex shrink-0 items-start justify-between sm:mb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              API Key Generator
            </h1>
            <p className="mt-1 hidden text-sm text-neutral-600 dark:text-neutral-400 sm:block">
              Generate random keys with a CSPRNG. Choose the entropy size,
              format, and prefix.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {theme === "light" ? (
              <Moon aria-hidden="true" className="size-4" />
            ) : (
              <Sun aria-hidden="true" className="size-4" />
            )}
          </button>
        </header>

        <div
          className="mb-2 grid shrink-0 grid-cols-2 gap-1 rounded-lg border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900 md:hidden"
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
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {view === "generate" ? "Configure" : `Results (${keys.length})`}
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] gap-3 md:grid-cols-2">
          <section
            className={`min-h-0 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 ${
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
            className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 ${
              mobileView === "results" ? "flex" : "hidden"
            } md:flex`}
            aria-label="Generated keys"
          >
            {error && (
              <p
                role="alert"
                className="mb-4 shrink-0 text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </p>
            )}

            {keys.length > 0 ? (
              <KeyList keys={keys} onClear={clear} onNotify={show} />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Your keys will appear here
                </h2>
                <p className="mt-1 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
                  Choose your settings and generate a key to get started.
                </p>
              </div>
            )}
          </section>
        </div>

        <p className="mt-2 shrink-0 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Keys are generated on the server and shown once. Never use public
          tools for production secrets.
        </p>

        <Toast toast={toast} />
      </div>
    </main>
  );
}

import type { GeneratedKey } from "../types/key";

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadTxt(keys: GeneratedKey[]) {
  const content = keys.map((k) => k.value).join("\n") + "\n";
  triggerDownload(content, "api-keys.txt", "text/plain;charset=utf-8");
}

export function downloadEnv(keys: GeneratedKey[], varName = "API_KEY") {
  const lines = keys.map(
    (k, i) =>
      `${keys.length === 1 ? varName : `${varName}_${i + 1}`}=${k.value}`,
  );
  triggerDownload(
    lines.join("\n") + "\n",
    "api-keys.env",
    "text/plain;charset=utf-8",
  );
}

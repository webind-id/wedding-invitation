/**
 * Contoh isian (placeholder) untuk formulir klien, diambil dari konten contoh bersama.
 * Murni & aman dipakai di browser. Indeks daftar (acara ke-2, bab kisah ke-3, …) yang tidak
 * ada di contoh memakai contoh terakhir yang ada, agar setiap baris tetap punya petunjuk.
 */
import { getIn, type Path } from "./immutable";
import { sampleContent } from "@/shared/sample";

const MAX_LENGTH = 140;

export function examplePlaceholder(path: Path, sample: unknown = sampleContent): string | undefined {
  let cur: unknown = sample;
  for (const key of path) {
    if (cur == null) return undefined;
    if (typeof key === "number" && Array.isArray(cur)) {
      if (cur.length === 0) return undefined;
      cur = cur[Math.min(key, cur.length - 1)];
    } else {
      cur = getIn(cur, [key]);
    }
  }
  if (typeof cur !== "string") return undefined;
  const text = cur.replace(/\s+/g, " ").trim();
  if (!text || /^(\/|https?:)/.test(text)) return undefined; // URL/berkas contoh tidak berguna sebagai petunjuk
  return `mis. ${text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH - 1).trimEnd()}…` : text}`;
}

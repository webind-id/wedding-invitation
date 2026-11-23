import type { InvitationContent, WeddingEvent } from "@/shared/contract";
import { formatClock } from "./datetime";

/** "08.00 – 10.00 WIB", atau "08.00 WIB s.d. selesai" bila acara ditandai sampai selesai. */
export function eventTimeLabel(event: Pick<WeddingEvent, "start" | "end" | "untilFinished">, content: Pick<InvitationContent, "timeZone">, zoneLabel: string): string {
  const start = formatClock(event.start, content.timeZone);
  if (event.untilFinished || !event.end) return `${start} ${zoneLabel} s.d. selesai`;
  return `${start} – ${formatClock(event.end, content.timeZone)} ${zoneLabel}`;
}

/** Tagar pasangan gaya Jawa: "Sekar", "Bayu" → "#SekarLanBayu" ("lan" = "dan"). */
export function coupleHashtag(first: string, second: string): string {
  const clean = (s: string) => s.replace(/[^\p{L}\p{N}]/gu, "");
  const a = clean(first);
  const b = clean(second);
  return a && b ? `#${a}Lan${b}` : "";
}

/**
 * Ukuran huruf (px) nama berhuruf Cinzel kapital di dalam panel gunungan selebar 270px.
 * Nama panjang dikecilkan agar tetap satu baris di dalam bingkai.
 */
export function panelNameSize(name: string): number {
  const length = name.trim().length;
  if (length <= 6) return 30;
  if (length <= 8) return 25;
  if (length <= 10) return 21;
  return 18;
}

/**
 * Salam "Assalamu'alaikum" hanya ditampilkan bila undangan memakai ayat berbahasa Arab —
 * undangan tanpa ayat Arab bisa saja bukan undangan Muslim.
 */
export function usesIslamicGreeting(content: Pick<InvitationContent, "verse">): boolean {
  return content.verse.arabic.trim().length > 0;
}

export type CeremonyIcon = "water" | "moon" | "rings" | "hand";

const ICON_CYCLE: CeremonyIcon[] = ["water", "moon", "rings", "hand"];

/** Kata kunci nama prosesi → ikon. Urutan penting: yang pertama cocok dipakai. */
const ICON_KEYWORDS: [RegExp, CeremonyIcon][] = [
  [/siram|mandi|banyu|air/i, "water"],
  [/midodareni|malam|bidadari/i, "moon"],
  [/panggih|temu|akad|ijab|cincin/i, "rings"],
  [/sungkem|restu|bakti/i, "hand"],
];

/** Ikon untuk satu prosesi: dari nama yang dikenal, selain itu bergiliran menurut urutan. */
export function ceremonyIcon(name: string, index: number): CeremonyIcon {
  const hit = ICON_KEYWORDS.find(([pattern]) => pattern.test(name));
  return hit ? hit[1] : ICON_CYCLE[index % ICON_CYCLE.length];
}

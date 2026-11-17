import type { InvitationContent, WeddingEvent } from "@/shared/contract";
import { formatClock } from "./datetime";

/** "10.00 – 12.00 WIB", atau "10.00 WIB s.d. selesai" bila acara ditandai sampai selesai. */
export function eventTimeLabel(event: Pick<WeddingEvent, "start" | "end" | "untilFinished">, content: Pick<InvitationContent, "timeZone">, zoneLabel: string): string {
  const start = formatClock(event.start, content.timeZone);
  if (event.untilFinished || !event.end) return `${start} ${zoneLabel} s.d. selesai`;
  return `${start} – ${formatClock(event.end, content.timeZone)} ${zoneLabel}`;
}

/**
 * Ukuran huruf (px) nama berhuruf Cinzel kapital di dalam gerbang rembulan selebar 290px.
 * Nama panjang dikecilkan agar tetap satu baris di dalam lingkaran.
 */
export function panelNameSize(name: string): number {
  const length = name.trim().length;
  if (length <= 6) return 28;
  if (length <= 8) return 24;
  if (length <= 10) return 20;
  return 17;
}

/** Jarak huruf nama di panel: lega untuk nama pendek, rapat untuk nama panjang. */
export function panelNameTracking(size: number): number {
  return size >= 24 ? 6 : 3;
}

import type { WeddingEvent } from "@/shared/contract";

/** 2027-06-12T08:00:00+07:00 → 20270612T010000Z */
export function toUtcStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function locationOf(event: WeddingEvent): string {
  return `${event.venue}, ${event.address}`;
}

export function googleCalendarLink(event: WeddingEvent, coupleLabel: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.name} · ${coupleLabel}`,
    dates: `${toUtcStamp(event.start)}/${toUtcStamp(event.end)}`,
    details: `${event.name} pernikahan ${coupleLabel}.`,
    location: locationOf(event),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Escape teks sesuai RFC 5545 (\\, ;, , dan baris baru). */
export function escapeIcsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Satu file .ics berisi semua acara — sekali unduh, semua tersimpan. */
export function buildIcs(events: WeddingEvent[], coupleLabel: string, now: Date = new Date()): string {
  const stamp = toUtcStamp(now.toISOString());
  const slug = coupleLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const vevents = events.flatMap((event) => [
    "BEGIN:VEVENT",
    `UID:${event.id}-${slug}@undangan`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toUtcStamp(event.start)}`,
    `DTEND:${toUtcStamp(event.end)}`,
    `SUMMARY:${escapeIcsText(`${event.name} · ${coupleLabel}`)}`,
    `LOCATION:${escapeIcsText(locationOf(event))}`,
    "END:VEVENT",
  ]);
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//KudoStack//Undangan//ID", ...vevents, "END:VCALENDAR"].join(
    "\r\n",
  );
}

/**
 * Unduh file .ics saat tombol diklik. Dibuat di browser saat itu juga —
 * bukan ditanam sebagai data: URL di HTML — karena DTSTAMP berisi waktu
 * "sekarang" yang pasti berbeda antara render server & client (hydration).
 */
export function downloadIcs(events: WeddingEvent[], coupleLabel: string, filename = "undangan.ics"): void {
  const url = URL.createObjectURL(new Blob([buildIcs(events, coupleLabel)], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function mapsSearchLink(event: WeddingEvent): string {
  if (event.mapsUrl) return event.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationOf(event))}`;
}

export function mapsEmbedLink(event: WeddingEvent): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(locationOf(event))}&z=15&output=embed`;
}

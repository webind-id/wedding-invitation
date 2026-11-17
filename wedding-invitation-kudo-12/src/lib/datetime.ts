const LOCALE = "id-ID";

/** "Sabtu, 12 Juni 2027" */
export function formatLongDate(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(new Date(iso));
}

/** "12 · 06 · 2027" */
export function formatDotDate(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")} · ${get("month")} · ${get("year")}`;
}

/** "08.00" */
export function formatClock(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  })
    .format(new Date(iso))
    .replace(":", ".");
}

/** Pecahan tanggal untuk stub tiket: { weekday: "Sab", day: "12", month: "Jun" }. */
export function dateStub(iso: string, timeZone: string): { weekday: string; day: string; month: string } {
  const date = new Date(iso);
  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(LOCALE, { ...opts, timeZone }).format(date);
  return {
    weekday: fmt({ weekday: "short" }),
    day: fmt({ day: "2-digit" }),
    month: fmt({ month: "short" }),
  };
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

export function timeLeftUntil(targetMs: number, nowMs: number): TimeLeft {
  const total = targetMs - nowMs;
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor(total / 3_600_000) % 24,
    minutes: Math.floor(total / 60_000) % 60,
    seconds: Math.floor(total / 1000) % 60,
    done: false,
  };
}

/** Label relatif untuk ucapan: "baru saja", "5 menit lalu", "3 hari lalu". */
export function relativeTime(iso: string, nowMs: number = Date.now()): string {
  const minutes = Math.floor((nowMs - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(iso),
  );
}

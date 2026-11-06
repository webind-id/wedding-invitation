const LOCALE = "id-ID";

/** "12 Jun 2027, 08.00" di zona Asia/Jakarta. */
export function formatDateTime(iso: string, timeZone = "Asia/Jakarta"): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  }).format(new Date(iso));
}

/** "Sabtu, 12 Juni 2027" */
export function formatLongDate(iso: string, timeZone = "Asia/Jakarta"): string {
  return new Intl.DateTimeFormat(LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone,
  }).format(new Date(iso));
}

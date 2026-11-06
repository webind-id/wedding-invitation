/** Rapikan spasi dan buang karakter kontrol (selain baris baru). */
export function cleanText(value: string): string {
  return value
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Potong teks per code point agar emoji/surrogate pair tidak terbelah. */
export function truncate(value: string, max: number): string {
  const chars = Array.from(value);
  return chars.length > max ? chars.slice(0, max).join("") : value;
}

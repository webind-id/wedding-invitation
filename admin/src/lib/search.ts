/** Buang karakter yang punya arti khusus di filter PostgREST (`,()%*.` dll.) agar pencarian tidak bisa menyuntik filter. */
export function sanitizeSearch(q: string): string {
  return q.replace(/[^\p{L}\p{N}\s-]/gu, "").trim().slice(0, 60);
}

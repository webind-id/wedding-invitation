/** Hasil server action yang seragam: sukses dengan data, atau gagal dengan pesan (+ error per field). */
export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function success<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function failure(error: string, fieldErrors?: Record<string, string>): ActionResult<never> {
  return { ok: false, error, fieldErrors };
}

/** Jalankan aksi; error tak terduga diubah jadi pesan aman (detail ke log server). */
export async function attempt<T>(fn: () => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  try {
    return await fn();
  } catch (err) {
    // redirect()/notFound() Next.js dilempar sebagai error khusus — teruskan.
    if (err instanceof Error && "digest" in err && String((err as { digest?: unknown }).digest).startsWith("NEXT_")) {
      throw err;
    }
    console.error("[action]", err);
    return failure(err instanceof Error && err.message.startsWith("Gagal") ? err.message : "Terjadi kesalahan. Coba lagi.");
  }
}

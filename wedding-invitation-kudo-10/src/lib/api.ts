/** Amplop respons API yang seragam untuk semua route /api. */
export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

export function ok<T>(data: T, init?: ResponseInit): Response {
  return Response.json({ success: true, data } satisfies ApiResponse<T>, init);
}

export function fail(error: string, status: number): Response {
  return Response.json({ success: false, error } satisfies ApiResponse<never>, { status });
}

/** fetch JSON di sisi klien; melempar Error berisi pesan dari server bila gagal. */
export async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = (await res.json().catch(() => null)) as ApiResponse<T> | null;
  if (!body) throw new Error(`Permintaan gagal (${res.status}).`);
  if (!body.success) throw new Error(body.error);
  return body.data;
}

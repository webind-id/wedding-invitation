import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "invitation-media";

export class ConfigError extends Error {
  constructor() {
    super("Server belum dikonfigurasi: isi SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET & PREVIEW_SECRET di .env.local.");
    this.name = "ConfigError";
  }
}

let client: SupabaseClient | undefined;

/** Klien service_role (melewati RLS). Hanya dipakai di server. */
export function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new ConfigError();
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

/** Lempar error dengan pesan aman; detail asli hanya ke log server. */
export function dbFail(context: string, error: unknown): never {
  console.error(`[db] ${context}`, error);
  throw new Error(`Gagal ${context}.`);
}

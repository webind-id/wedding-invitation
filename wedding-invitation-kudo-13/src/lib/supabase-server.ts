import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Satu-satunya akses ke database: klien service_role di server.
 * Semua tabel memakai RLS tanpa policy, jadi browser tidak pernah bisa
 * menyentuh database langsung — hanya lewat route /api.
 */
let client: SupabaseClient | null | undefined;

export function db(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return client;
}

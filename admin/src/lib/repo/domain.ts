import "server-only";
import { DEFAULT_DOMAIN, type DomainSettings, type Scheme } from "../domain";
import { db, dbFail } from "../supabase";

interface DomainRow {
  enabled: boolean;
  scheme: Scheme;
  root_domain: string;
  reserved: string[] | null;
  updated_at: string;
}

/** Tabel belum ada (migrasi 002 belum dijalankan): Postgres 42P01 / PostgREST PGRST205. */
const MISSING_TABLE = new Set(["42P01", "PGRST205"]);

export interface DomainState {
  settings: DomainSettings;
  /** false bila migrasi 002 belum dijalankan — pengaturan tidak bisa disimpan. */
  ready: boolean;
}

export async function loadDomainSettings(): Promise<DomainState> {
  const { data, error } = await db().from("domain_settings").select("*").eq("id", 1).maybeSingle();
  if (error && MISSING_TABLE.has(error.code)) return { settings: DEFAULT_DOMAIN, ready: false };
  if (error) dbFail("memuat pengaturan domain", error);
  const row = data as DomainRow | null;
  if (!row) return { settings: DEFAULT_DOMAIN, ready: true };
  return {
    ready: true,
    settings: {
      enabled: row.enabled,
      scheme: row.scheme,
      rootDomain: row.root_domain,
      reserved: row.reserved ?? [],
      updatedAt: row.updated_at,
    },
  };
}

export async function saveDomainSettings(input: Pick<DomainSettings, "enabled" | "scheme" | "rootDomain" | "reserved">): Promise<void> {
  const { error } = await db().from("domain_settings").upsert({
    id: 1,
    enabled: input.enabled,
    scheme: input.scheme,
    root_domain: input.rootDomain,
    reserved: input.reserved,
    updated_at: new Date().toISOString(),
  });
  if (error) dbFail("menyimpan pengaturan domain", error);
}

"use server";

import { revalidatePath } from "next/cache";
import { attempt, failure, success, type ActionResult } from "@/lib/action";
import { requireAdmin } from "@/lib/auth";
import { domainSettingsSchema, formToObject } from "@/lib/forms";
import { loadDomainSettings, saveDomainSettings } from "@/lib/repo/domain";
import { slugsInUse } from "@/lib/repo/invitations";
import { fieldErrors } from "@/shared/contract";

export async function saveDomainAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  await requireAdmin();
  return attempt(async () => {
    const parsed = domainSettingsSchema.safeParse(formToObject(form, ["enabled"]));
    if (!parsed.success) return failure("Periksa kembali isian yang ditandai.", fieldErrors(parsed.error));
    if (!(await loadDomainSettings()).ready) return failure("Jalankan migrasi supabase/migrations/002_domain_settings.sql dulu.");

    const { enabled, scheme, root_domain: rootDomain, reserved } = parsed.data;
    const clashes = await slugsInUse(reserved);
    if (clashes.length > 0) {
      return failure("Ada nama yang sudah dipakai undangan.", { reserved: `Sudah dipakai sebagai slug undangan: ${clashes.join(", ")}` });
    }

    await saveDomainSettings({ enabled, scheme, rootDomain, reserved });
    // Semua tautan undangan di admin ikut berubah.
    revalidatePath("/", "layout");
    return success(undefined);
  });
}

const HEALTH_SLUG = "kudo-health-check";
const HEALTH_TIMEOUT_MS = 8_000;

export interface GatewayReport {
  url: string;
  latencyMs: number;
  /** ROOT_DOMAIN di wrangler.toml gateway. */
  gatewayRootDomain: string;
  rootDomainMatches: boolean;
  database: "ok" | "error";
  gatewaySecret: boolean;
}

function isHealthBody(v: unknown): v is { service: string; rootDomain: string; database: "ok" | "error"; gatewaySecret: boolean } {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return o.service === "kudo-gateway" && typeof o.rootDomain === "string" && (o.database === "ok" || o.database === "error") && typeof o.gatewaySecret === "boolean";
}

/** Panggil https://kudo-health-check.{domain}/_kudo/health — membuktikan DNS wildcard + Worker sudah terpasang. */
export async function testGatewayAction(): Promise<ActionResult<GatewayReport>> {
  await requireAdmin();
  return attempt(async () => {
    const { settings } = await loadDomainSettings();
    if (!settings.rootDomain) return failure("Isi dan simpan domain induk dulu.");
    // Host berasal dari pengaturan yang sudah divalidasi; path tetap — bukan URL bebas.
    const url = `${settings.scheme}://${HEALTH_SLUG}.${settings.rootDomain}/_kudo/health`;

    const started = Date.now();
    let res: Response;
    try {
      res = await fetch(url, { cache: "no-store", redirect: "manual", signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS) });
    } catch (err) {
      console.error("[domain] uji gateway", err);
      return failure(`Tidak bisa menghubungi ${HEALTH_SLUG}.${settings.rootDomain}. Periksa record DNS wildcard (*) dan pastikan proxy Cloudflare aktif.`);
    }
    const latencyMs = Date.now() - started;

    const body: unknown = await res.json().catch(() => null);
    if (!isHealthBody(body)) {
      return failure(`Ada server yang menjawab (HTTP ${res.status}), tapi bukan gateway Kudo. Pastikan Worker sudah di-deploy dengan rute *.${settings.rootDomain.split(":")[0]}/*.`);
    }
    return success({
      url,
      latencyMs,
      gatewayRootDomain: body.rootDomain,
      rootDomainMatches: body.rootDomain === settings.rootDomain.split(":")[0],
      database: body.database,
      gatewaySecret: body.gatewaySecret,
    });
  });
}

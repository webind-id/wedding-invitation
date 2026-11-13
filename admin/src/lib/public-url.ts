import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { checkSlugLocally, subdomainPattern, type SlugAvailability } from "./domain";
import { loadDomainSettings } from "./repo/domain";
import { invitationIdBySlug } from "./repo/invitations";
import { isReservedSlug, publicUrl } from "./slug";

/**
 * Alamat publik undangan menurut pengaturan di menu "Domain" (tabel domain_settings):
 *   subdomain aktif   → https://{slug}.kudostack.com
 *   subdomain nonaktif → {alamat app template}/{slug}
 * Lihat docs/SUBDOMAIN.md.
 *
 * Hampir tidak pernah berubah tapi dibaca di banyak halaman, dan setiap query ke Supabase
 * memakan ratusan ms — jadi disimpan lintas permintaan (maks. 5 menit) dan dibuang seketika
 * saat menu Domain disimpan (revalidateTag(DOMAIN_SETTINGS_TAG)).
 */
export const DOMAIN_SETTINGS_TAG = "domain-settings";
const DOMAIN_CACHE_SECONDS = 300;

const cachedDomainSettings = unstable_cache(loadDomainSettings, [DOMAIN_SETTINGS_TAG], {
  tags: [DOMAIN_SETTINGS_TAG],
  revalidate: DOMAIN_CACHE_SECONDS,
});

export const getDomain = cache(cachedDomainSettings);

export async function urlPattern(): Promise<string | null> {
  return subdomainPattern((await getDomain()).settings);
}

export async function isSlugReserved(slug: string): Promise<boolean> {
  return isReservedSlug(slug, (await getDomain()).settings.reserved);
}

export async function publicInvitationUrl(templateBaseUrl: string, slug: string): Promise<string> {
  return publicUrl(await urlPattern(), templateBaseUrl, slug);
}

/** Bisakah slug ini dipakai? excludeId = undangan yang sedang diedit (slugnya sendiri tidak dihitung). */
export async function slugAvailability(slug: string, excludeId?: string): Promise<SlugAvailability> {
  const local = checkSlugLocally(slug, (await getDomain()).settings.reserved);
  if (local !== "available") return local;
  const owner = await invitationIdBySlug(slug);
  return owner && owner !== excludeId ? "taken" : "available";
}

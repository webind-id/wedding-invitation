import type { Metadata } from "next";
import { coupleLabel, type InvitationContent } from "@/shared/contract";

const GUEST_NAME_MAX = 80;

export type SearchParams = Promise<{ to?: string | string[]; preview?: string | string[] }>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Nama tamu dari ?to=…, dipotong & dirapikan; fallback ke sapaan bawaan. */
export function guestNameFrom(to: string | string[] | undefined, fallback: string): string {
  return first(to)?.trim().slice(0, GUEST_NAME_MAX) || fallback;
}

export function previewFrom(preview: string | string[] | undefined): string | undefined {
  return first(preview);
}

export function metadataFor(content: InvitationContent): Metadata {
  const title = content.seo.title || coupleLabel(content);
  const description = content.seo.description || `Undangan pernikahan ${coupleLabel(content)}.`;
  const image = content.coverPhoto.startsWith("https://") ? [content.coverPhoto] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: image },
    robots: { index: false, follow: false },
  };
}

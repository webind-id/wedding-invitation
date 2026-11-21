import type { Metadata } from "next";
import { headers } from "next/headers";
import { InvitationShell } from "@/components/InvitationShell";
import { ogVersion, requestOrigin } from "@/lib/og-meta";
import { guestNameFrom, metadataFor, type SearchParams } from "@/lib/page-props";
import { klentengDemoContent as demo } from "@/lib/klenteng-defaults";

export async function generateMetadata(): Promise<Metadata> {
  const origin = requestOrigin(await headers());
  return metadataFor(demo, { pageUrl: `${origin}/`, imageUrl: `${origin}/og?v=${ogVersion(demo)}` });
}

/** Halaman demo template dengan konten contoh — buku tamu nonaktif di sini. */
export default async function DemoPage({ searchParams }: { searchParams: SearchParams }) {
  const { to } = await searchParams;
  return (
    <InvitationShell
      content={demo}
      slug={null}
      guestName={guestNameFrom(to, demo.defaultGuest)}
      isPreview={false}
    />
  );
}

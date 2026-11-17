import type { Metadata } from "next";
import { headers } from "next/headers";
import { InvitationShell } from "@/components/InvitationShell";
import { ogVersion, requestOrigin } from "@/lib/og-meta";
import { guestNameFrom, metadataFor, type SearchParams } from "@/lib/page-props";
import { sampleContent } from "@/shared/sample";

export async function generateMetadata(): Promise<Metadata> {
  const origin = requestOrigin(await headers());
  return metadataFor(sampleContent, { pageUrl: `${origin}/`, imageUrl: `${origin}/og?v=${ogVersion(sampleContent)}` });
}

/** Halaman demo template dengan konten contoh — buku tamu nonaktif di sini. */
export default async function DemoPage({ searchParams }: { searchParams: SearchParams }) {
  const { to } = await searchParams;
  return (
    <InvitationShell
      content={sampleContent}
      slug={null}
      guestName={guestNameFrom(to, sampleContent.defaultGuest)}
      isPreview={false}
    />
  );
}

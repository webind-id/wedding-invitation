import { InvitationShell } from "@/components/InvitationShell";
import { guestNameFrom, metadataFor, type SearchParams } from "@/lib/page-props";
import { sampleContent } from "@/shared/sample";

export const metadata = metadataFor(sampleContent);

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

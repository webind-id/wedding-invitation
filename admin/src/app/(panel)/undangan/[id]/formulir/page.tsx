import { headers } from "next/headers";
import { ClientFormPanel, type PanelState } from "@/components/client-form/ClientFormPanel";
import { clientFormAvailability, clientFormLink, prepareClientSubmission, readClientPayload, submissionSummary } from "@/lib/client-form";
import { isUuid } from "@/lib/invitee";
import { loadInvitation } from "@/lib/load";
import { activeClientForm } from "@/lib/repo/client-forms";

export const dynamic = "force-dynamic";

/** Origin admin yang sedang dipakai (mis. https://undangan.kudostack.my.id) — tautan formulir ada di app ini. */
async function adminOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3001";
  const proto = h.get("x-forwarded-proto")?.split(",")[0]?.trim() || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function ClientFormTab({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [inv, lookup, origin] = await Promise.all([
    loadInvitation(id),
    isUuid(id) ? activeClientForm(id) : Promise.resolve({ ready: true as const, form: null }),
    adminOrigin(),
  ]);

  let state: PanelState;
  if (!lookup.ready) state = { kind: "not-ready" };
  else if (!lookup.form) state = { kind: "none" };
  else {
    const form = lookup.form;
    const prepared = form.status === "submitted" ? prepareClientSubmission(form.draft, form.guests) : null;
    const guestCount = readClientPayload({}, form.guests)?.guests.filter((g) => g.name || g.contact).length ?? 0;
    state = {
      kind: "form",
      link: clientFormLink(origin, form.token),
      availability: clientFormAvailability(form),
      status: form.status,
      expiresAt: form.expires_at,
      updatedAt: form.updated_at,
      submittedAt: form.submitted_at,
      importedAt: form.imported_at,
      hasDraft: form.draft !== null,
      summary: prepared?.ok ? submissionSummary(prepared.content, guestCount) : null,
    };
  }

  return <ClientFormPanel invitationId={inv.id} invitationTitle={inv.title} state={state} />;
}

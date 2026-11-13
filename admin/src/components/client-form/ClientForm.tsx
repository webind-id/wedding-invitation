"use client";

import { CheckCircle2, Save, Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { saveClientDraftAction, submitClientFormAction, uploadClientMediaAction } from "@/app/isi/[token]/actions";
import { EditorContext, type EditorContextValue } from "@/components/editor/EditorContext";
import { CoupleSection, EventsSection, StorySection } from "@/components/editor/sections-main";
import { GallerySection, GiftSection, MediaSection } from "@/components/editor/sections-media";
import type { ClientGuestRow } from "@/lib/client-form";
import { cn } from "@/lib/cn";
import { getIn, setIn, type Path } from "@/lib/immutable";
import type { MediaKind } from "@/lib/media";
import type { InvitationContent } from "@/shared/contract";
import { ClientGuestsSection, ClientTextsSection } from "./ClientSections";

const STEPS = [
  ["mempelai", "Mempelai"],
  ["acara", "Acara"],
  ["media", "Foto & musik"],
  ["teks", "Teks"],
  ["kisah", "Kisah"],
  ["galeri", "Galeri"],
  ["hadiah", "Hadiah"],
  ["tamu", "Tamu"],
] as const;

type Status = { kind: "idle" } | { kind: "saved" } | { kind: "sent"; skippedGuests: number } | { kind: "error"; message: string };

interface ClientFormProps {
  token: string;
  initialContent: InvitationContent;
  initialGuests: ClientGuestRow[];
  /** Klien sudah pernah mengirim (masih boleh merevisi sampai admin mengimpor). */
  wasSubmitted: boolean;
}

/**
 * Formulir data undangan untuk klien. Memakai bagian-bagian editor admin yang sama
 * (lewat EditorContext), tapi menyimpan ke draf formulir & mengunggah lewat token —
 * tidak pernah menyentuh undangan secara langsung.
 */
export function ClientForm({ token, initialContent, initialGuests, wasSubmitted }: ClientFormProps) {
  const [content, setContent] = useState(initialContent);
  const [guests, setGuests] = useState(initialGuests.length ? initialGuests : [{ name: "", contact: "", inviter: "" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [isBusy, startBusy] = useTransition();

  const touch = useCallback(() => {
    setIsDirty(true);
    setStatus((s) => (s.kind === "sent" ? s : { kind: "idle" }));
  }, []);

  const set = useCallback((path: Path, value: unknown) => {
    setContent((c) => setIn(c, path, value));
    touch();
  }, [touch]);

  const update = useCallback((path: Path, fn: (current: unknown) => unknown) => {
    setContent((c) => setIn(c, path, fn(getIn(c, path))));
    touch();
  }, [touch]);

  const upload = useCallback(async (file: File, kind: MediaKind) => {
    const data = new FormData();
    data.set("file", file);
    data.set("kind", kind);
    const result = await uploadClientMediaAction(token, data);
    if (!result.ok) throw new Error(result.error);
    return result.data.url;
  }, [token]);

  function changeGuests(next: ClientGuestRow[]) {
    setGuests(next);
    touch();
  }

  function saveDraft() {
    startBusy(async () => {
      const result = await saveClientDraftAction(token, content, guests);
      if (!result.ok) return setStatus({ kind: "error", message: result.error });
      setIsDirty(false);
      setStatus({ kind: "saved" });
    });
  }

  function submit() {
    startBusy(async () => {
      const result = await submitClientFormAction(token, content, guests);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setStatus({ kind: "error", message: result.error });
        return;
      }
      setErrors({});
      setIsDirty(false);
      setStatus({ kind: "sent", skippedGuests: result.data.skippedGuests });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const ctx = useMemo<EditorContextValue>(() => ({ invitationId: "", content, errors, set, update, upload }), [content, errors, set, update, upload]);
  const errorCount = Object.keys(errors).length;
  const isSent = status.kind === "sent" || (wasSubmitted && !isDirty && status.kind !== "error");

  return (
    <EditorContext.Provider value={ctx}>
      {isSent && (
        <div role="status" className="card mb-4 flex gap-3 border-moss/30 bg-moss/10 p-4 text-sm">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-moss" aria-hidden />
          <div>
            <p className="font-semibold text-ink">Data sudah terkirim ke admin.</p>
            <p className="mt-0.5 text-muted">
              Admin akan meninjau dan memasangnya di undangan. Anda masih bisa memperbaiki isian lalu mengirim ulang selama belum diproses.
              {status.kind === "sent" && status.skippedGuests > 0 && ` ${status.skippedGuests} baris tamu dilewati karena nama/kontak tidak valid atau ganda.`}
            </p>
          </div>
        </div>
      )}

      <nav aria-label="Lompat ke bagian" className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
        {STEPS.map(([id, label], i) => (
          <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-muted hover:border-ink hover:text-ink">
            {i + 1}. {label}
          </a>
        ))}
      </nav>

      <div className="space-y-4 pb-32">
        <CoupleSection />
        <EventsSection />
        <MediaSection />
        <ClientTextsSection />
        <StorySection />
        <GallerySection />
        <GiftSection />
        <ClientGuestsSection guests={guests} onChange={changeGuests} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-3">
          <p role="status" className={cn("min-w-0 flex-1 text-sm", status.kind === "error" ? "text-danger" : "text-muted")}>
            {status.kind === "error"
              ? `${status.message}${errorCount ? ` (${errorCount} isian ditandai merah)` : ""}`
              : status.kind === "saved"
                ? "Draf tersimpan. Anda bisa melanjutkan nanti lewat tautan yang sama."
                : isDirty
                  ? "Ada perubahan yang belum disimpan."
                  : "Isi semua bagian, lalu kirim ke admin."}
          </p>
          <button type="button" onClick={saveDraft} disabled={isBusy || !isDirty} className="btn-outline">
            <Save className="h-4 w-4" aria-hidden /> Simpan draf
          </button>
          <button type="button" onClick={submit} disabled={isBusy} className="btn-primary">
            <Send className="h-4 w-4" aria-hidden /> {isBusy ? "Memproses…" : isSent ? "Kirim ulang" : "Kirim ke admin"}
          </button>
        </div>
      </div>
    </EditorContext.Provider>
  );
}

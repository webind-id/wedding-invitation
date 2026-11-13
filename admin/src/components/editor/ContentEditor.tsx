"use client";

import { Check, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { saveContentAction } from "@/app/(panel)/undangan/[id]/_actions/content";
import { cn } from "@/lib/cn";
import { getIn, setIn, type Path } from "@/lib/immutable";
import type { MediaKind } from "@/lib/media";
import type { InvitationContent } from "@/shared/contract";
import { EditorContext, type EditorContextValue } from "./EditorContext";
import { uploadFile } from "./MediaInput";
import { CoupleSection, EventsSection, StorySection, TextsSection } from "./sections-main";
import { GallerySection, GiftSection, MediaSection } from "./sections-media";

const JUMP_LINKS = [
  ["mempelai", "Mempelai"],
  ["acara", "Acara"],
  ["media", "Foto & musik"],
  ["teks", "Teks"],
  ["kisah", "Kisah"],
  ["galeri", "Galeri"],
  ["hadiah", "Hadiah"],
] as const;

type SaveState = { kind: "idle" } | { kind: "saved" } | { kind: "error"; message: string };

export function ContentEditor({ invitationId, initial }: { invitationId: string; initial: InvitationContent }) {
  const [content, setContent] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({ kind: "idle" });
  const [isSaving, startSaving] = useTransition();

  const set = useCallback((path: Path, value: unknown) => {
    // Updater fungsional: beberapa set() berturut-turut tetap tersusun benar.
    setContent((c) => setIn(c, path, value));
    setIsDirty(true);
    setSaveState({ kind: "idle" });
  }, []);

  const update = useCallback((path: Path, fn: (current: unknown) => unknown) => {
    setContent((c) => setIn(c, path, fn(getIn(c, path))));
    setIsDirty(true);
    setSaveState({ kind: "idle" });
  }, []);

  const save = useCallback(() => {
    startSaving(async () => {
      const result = await saveContentAction(invitationId, content);
      if (result.ok) {
        setErrors({});
        setIsDirty(false);
        setSaveState({ kind: "saved" });
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setSaveState({ kind: "error", message: result.error });
    });
  }, [invitationId, content]);

  // Peringatkan sebelum meninggalkan halaman dengan perubahan belum tersimpan; Ctrl/Cmd+S untuk simpan.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) e.preventDefault();
    }
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("keydown", onKey);
    };
  }, [isDirty, save]);

  const upload = useCallback((file: File, kind: MediaKind) => uploadFile(invitationId, file, kind), [invitationId]);

  const ctx = useMemo<EditorContextValue>(() => ({ invitationId, content, errors, set, update, upload }),
    [invitationId, content, errors, set, update, upload],);
  const errorCount = Object.keys(errors).length;

  return (
    <EditorContext.Provider value={ctx}>
      <nav aria-label="Lompat ke bagian" className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
        {JUMP_LINKS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-muted hover:border-ink hover:text-ink">
            {label}
          </a>
        ))}
      </nav>

      <div className="space-y-4 pb-28">
        <CoupleSection />
        <EventsSection />
        <MediaSection />
        <TextsSection />
        <StorySection />
        <GallerySection />
        <GiftSection />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 backdrop-blur lg:left-60">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-8">
          <p role="status" className={cn("min-w-0 flex-1 truncate text-sm", saveState.kind === "error" ? "text-danger" : "text-muted")}>
            {saveState.kind === "error"
              ? `${saveState.message}${errorCount ? ` (${errorCount} isian)` : ""}`
              : saveState.kind === "saved"
                ? "Tersimpan."
                : isDirty
                  ? "Ada perubahan yang belum disimpan."
                  : "Semua perubahan tersimpan."}
          </p>
          <kbd className="hidden rounded border border-line px-1.5 text-[0.65rem] text-muted sm:block">Ctrl S</kbd>
          <button type="button" onClick={save} disabled={isSaving || !isDirty} className="btn-primary">
            {saveState.kind === "saved" && !isDirty ? <Check className="h-4 w-4" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
            {isSaving ? "Menyimpan…" : "Simpan konten"}
          </button>
        </div>
      </div>
    </EditorContext.Provider>
  );
}

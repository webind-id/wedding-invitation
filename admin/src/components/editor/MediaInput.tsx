"use client";

import { ImageIcon, Music, Upload, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { uploadMediaAction } from "@/app/(panel)/undangan/[id]/_actions/content";
import { cn } from "@/lib/cn";
import { getIn, pathKey, type Path } from "@/lib/immutable";
import type { MediaKind } from "@/lib/media";
import { useEditor } from "./EditorContext";

/** Unggah satu file lewat server action. Mengembalikan URL atau melempar Error berisi pesan. */
export async function uploadFile(invitationId: string, file: File, kind: MediaKind): Promise<string> {
  const form = new FormData();
  form.set("file", file);
  form.set("kind", kind);
  const result = await uploadMediaAction(invitationId, form);
  if (!result.ok) throw new Error(result.error);
  return result.data.url;
}

export const ACCEPT: Record<MediaKind, string> = {
  image: "image/jpeg,image/png,image/webp",
  audio: "audio/mpeg",
};

interface MediaInputProps {
  label: string;
  path: Path;
  kind?: MediaKind;
  hint?: string;
  /** Rasio kotak pratinjau foto, mis. "aspect-[3/4]". */
  aspect?: string;
}

export function MediaInput({ label, path, kind = "image", hint, aspect = "aspect-square" }: MediaInputProps) {
  const { content, errors, set, upload } = useEditor();
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const value = String(getIn(content, path) ?? "");
  const error = uploadError ?? errors[pathKey(path)];

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      set(path, await upload(file, kind));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal mengunggah.");
    } finally {
      setIsUploading(false);
    }
  }

  const Icon = kind === "image" ? ImageIcon : Music;

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="flex gap-3">
        {kind === "image" && (
          <div className={cn("relative w-20 shrink-0 overflow-hidden rounded-xl border border-line bg-paper", aspect)}>
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <Icon className="absolute inset-0 m-auto h-5 w-5 text-muted/40" aria-hidden />
            )}
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              id={id}
              value={value}
              onChange={(e) => set(path, e.target.value)}
              placeholder="https://… atau /images/…"
              aria-invalid={Boolean(error)}
              className={cn("input min-w-0 flex-1 text-xs", error && "input-error")}
            />
            {value && (
              <button type="button" onClick={() => set(path, "")} aria-label={`Kosongkan ${label}`} className="btn-outline px-2.5">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT[kind]}
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={isUploading} className="btn-outline btn-sm">
            <Upload className="h-3.5 w-3.5" aria-hidden />
            {isUploading ? "Mengunggah…" : `Unggah ${kind === "image" ? "foto" : "MP3"}`}
          </button>
          {kind === "audio" && value && <audio src={value} controls preload="none" className="h-8 w-full" />}
          {error ? <p className="error-text">{error}</p> : hint && <p className="hint">{hint}</p>}
        </div>
      </div>
    </div>
  );
}

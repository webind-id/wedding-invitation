"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { createInvitationAction } from "@/app/(panel)/undangan/actions";
import type { TemplateRow } from "@/lib/repo/templates";
import { slugify } from "@/lib/slug";
import { Field, FormError } from "../ui/Field";
import { Modal } from "../ui/Modal";
import { SlugField } from "./SlugField";

interface NewInvitationFormProps {
  templates: Pick<TemplateRow, "id" | "name" | "code" | "base_url">[];
  /** Pola subdomain dari menu Domain; null = {domain template}/{slug}. */
  urlPattern: string | null;
  defaultOpen?: boolean;
}

export function NewInvitationForm({ templates, urlPattern, defaultOpen = false }: NewInvitationFormProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [state, action, isPending] = useActionState(createInvitationAction, null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};
  const baseUrl = templates.find((t) => t.id === templateId)?.base_url ?? "https://…";

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="btn-accent">
        <Plus className="h-4 w-4" aria-hidden /> Undangan baru
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Undangan baru">
        {templates.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted">
            Belum ada template aktif.{" "}
            <Link href="/template" className="font-semibold text-clay hover:underline">
              Daftarkan template
            </Link>{" "}
            dulu.
          </div>
        ) : (
          <form action={action} className="space-y-4">
            <Field label="Judul (untuk admin)" error={errors.title}>
              {(p) => (
                <input
                  {...p}
                  name="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!isSlugEdited) setSlug(slugify(e.target.value));
                  }}
                  placeholder="Cahya & Wahyu"
                  required
                />
              )}
            </Field>
            <SlugField
              value={slug}
              onChange={(v) => {
                setIsSlugEdited(true);
                setSlug(v);
              }}
              urlPattern={urlPattern}
              templateBaseUrl={baseUrl}
              error={errors.slug}
            />
            <fieldset>
              <legend className="label">Template</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {templates.map((t) => (
                  <label
                    key={t.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-line p-3 has-[:checked]:border-clay has-[:checked]:bg-clay/5"
                  >
                    <input
                      type="radio"
                      name="template_id"
                      value={t.id}
                      checked={templateId === t.id}
                      onChange={() => setTemplateId(t.id)}
                      className="accent-clay"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{t.name}</span>
                      <span className="block font-mono text-[0.7rem] text-muted">{t.code}</span>
                    </span>
                  </label>
                ))}
              </div>
              {errors.template_id && <p className="error-text">{errors.template_id}</p>}
            </fieldset>
            <p className="text-xs text-muted">Undangan dibuat sebagai draft berisi konten contoh, lalu Anda isi di editor.</p>

            <FormError message={state && !state.ok ? state.error : null} />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsOpen(false)} className="btn-outline">
                Batal
              </button>
              <button type="submit" disabled={isPending} className="btn-primary">
                {isPending ? "Membuat…" : "Buat & isi konten"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}

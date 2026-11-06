"use client";

import { useActionState, useState } from "react";
import { updateMetaAction } from "@/app/(panel)/undangan/[id]/_actions/settings";
import type { TemplateRow } from "@/lib/repo/templates";
import { Field, FormError } from "../ui/Field";
import { SlugField } from "./SlugField";

interface MetaFormProps {
  invitationId: string;
  title: string;
  slug: string;
  templateId: string;
  /** Pola subdomain dari menu Domain; null = {domain template}/{slug}. */
  urlPattern: string | null;
  templates: Pick<TemplateRow, "id" | "name" | "code" | "base_url">[];
}

export function MetaForm({ invitationId, title, slug, templateId, urlPattern, templates }: MetaFormProps) {
  const [state, action, isPending] = useActionState(updateMetaAction.bind(null, invitationId), null);
  const [currentSlug, setCurrentSlug] = useState(slug);
  const [currentTemplate, setCurrentTemplate] = useState(templateId);
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};
  const baseUrl = templates.find((t) => t.id === currentTemplate)?.base_url ?? "";
  // Dengan subdomain, alamat hanya bergantung pada slug; tanpa subdomain, template juga ikut menentukan.
  const changesUrl = currentSlug !== slug || (!urlPattern && currentTemplate !== templateId);

  return (
    <form action={action} className="card space-y-4 p-6">
      <h2 className="font-semibold">Identitas & template</h2>
      <Field label="Judul (untuk admin)" error={errors.title}>
        {(p) => <input {...p} name="title" defaultValue={title} required />}
      </Field>
      <SlugField
        value={currentSlug}
        onChange={setCurrentSlug}
        urlPattern={urlPattern}
        templateBaseUrl={baseUrl}
        error={errors.slug}
        originalSlug={slug}
        excludeId={invitationId}
      />
      <Field
        label="Template"
        error={errors.template_id}
        hint="Konten tetap sama saat berganti template — hanya tampilannya yang berubah."
      >
        {(p) => (
          <select {...p} name="template_id" value={currentTemplate} onChange={(e) => setCurrentTemplate(e.target.value)}>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.code})
              </option>
            ))}
          </select>
        )}
      </Field>

      {changesUrl && (
        <p className="rounded-xl bg-clay/10 px-3.5 py-2.5 text-xs text-clay">
          Alamat undangan akan berubah. Tautan yang sudah terkirim ke tamu tidak akan berfungsi lagi.
        </p>
      )}
      <FormError message={state && !state.ok ? state.error : null} />
      {state?.ok && <p role="status" className="text-xs font-medium text-moss">Tersimpan.</p>}

      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </form>
  );
}

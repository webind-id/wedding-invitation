"use client";

import { Pencil, Plus } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { saveTemplateAction } from "@/app/(panel)/template/actions";
import type { TemplateRow, TemplateWithUsage } from "@/lib/repo/templates";
import { Field, FormError } from "../ui/Field";
import { Modal } from "../ui/Modal";

/** Tombol + modal untuk membuat template baru, atau mengedit bila `template` diberikan. */
export function TemplateForm({ template }: { template?: TemplateRow | TemplateWithUsage }) {
  const isCodeLocked = Boolean(template && "invitation_count" in template && template.invitation_count > 0);
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(saveTemplateAction, null);
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  useEffect(() => {
    if (state?.ok) setIsOpen(false);
  }, [state]);

  return (
    <>
      {template ? (
        <button type="button" onClick={() => setIsOpen(true)} className="btn-outline btn-sm">
          <Pencil className="h-3.5 w-3.5" aria-hidden /> Ubah
        </button>
      ) : (
        <button type="button" onClick={() => setIsOpen(true)} className="btn-accent">
          <Plus className="h-4 w-4" aria-hidden /> Daftarkan template
        </button>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={template ? `Ubah ${template.name}` : "Template baru"}>
        {/* key: form di-reset setiap kali modal dibuka */}
        <form key={String(isOpen)} action={action} className="space-y-4">
          {template && <input type="hidden" name="id" value={template.id} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama" error={errors.name}>
              {(p) => <input {...p} name="name" defaultValue={template?.name} placeholder="Botanical Letterpress" required />}
            </Field>
            <Field
              label="Kode"
              error={errors.code}
              hint={isCodeLocked ? "Terkunci — sedang dipakai undangan" : "Sama dengan TEMPLATE_CODE di app template"}
            >
              {(p) => <input {...p} name="code" defaultValue={template?.code} placeholder="kudo" readOnly={isCodeLocked} required />}
            </Field>
          </div>
          <Field
            label="Alamat app template"
            error={errors.base_url}
            hint="Mis. https://wedding3.kudostack.my.id. Pastikan nama subdomainnya (mis. wedding3) masuk daftar nama yang dicadangkan di menu Domain. Dengan subdomain aktif, tamu tidak melihat alamat ini — lihat menu Panduan."
          >
            {(p) => (
              <input {...p} name="base_url" type="url" defaultValue={template?.base_url} placeholder="https://wedding1.kudostack.my.id" required />
            )}
          </Field>
          <Field label="Deskripsi" error={errors.description}>
            {(p) => <textarea {...p} name="description" rows={2} defaultValue={template?.description} />}
          </Field>
          <Field label="Gambar pratinjau (opsional)" error={errors.preview_image} hint="URL https:// gambar tangkapan layar template">
            {(p) => <input {...p} name="preview_image" type="url" defaultValue={template?.preview_image} />}
          </Field>
          <label className="flex items-center gap-2.5 text-sm">
            <input type="checkbox" name="is_active" defaultChecked={template?.is_active ?? true} className="h-4 w-4 accent-clay" />
            Aktif — bisa dipilih saat membuat undangan baru
          </label>

          <FormError message={state && !state.ok ? state.error : null} />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsOpen(false)} className="btn-outline">
              Batal
            </button>
            <button type="submit" disabled={isPending} className="btn-primary">
              {isPending ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

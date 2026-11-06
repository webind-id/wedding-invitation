import { PageHeader } from "@/components/ui/PageHeader";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateForm } from "@/components/templates/TemplateForm";
import { listTemplates } from "@/lib/repo/templates";

export const dynamic = "force-dynamic";
export const metadata = { title: "Template" };

export default async function TemplatesPage() {
  const templates = await listTemplates();

  return (
    <>
      <PageHeader
        eyebrow="Desain"
        title="Template"
        description="Setiap template adalah app terpisah. Satu template bisa dipakai oleh banyak undangan."
        actions={<TemplateForm />}
      />

      {templates.length === 0 ? (
        <div className="card px-6 py-14 text-center">
          <p className="font-display text-xl italic">Belum ada template</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Daftarkan template yang sudah di-deploy, mis. kode <code className="text-clay">kudo</code> dengan alamat{" "}
            <code className="text-clay">https://kudo.domain-anda.com</code>. Kode harus sama dengan{" "}
            <code className="text-clay">TEMPLATE_CODE</code> di app template tersebut.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </ul>
      )}
    </>
  );
}

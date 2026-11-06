"use client";

import { ExternalLink, LayoutTemplate, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteTemplateAction } from "@/app/(panel)/template/actions";
import { cn } from "@/lib/cn";
import type { TemplateWithUsage } from "@/lib/repo/templates";
import { TemplateForm } from "./TemplateForm";

export function TemplateCard({ template }: { template: TemplateWithUsage }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Hapus template "${template.name}"?`)) return;
    startTransition(async () => {
      const result = await deleteTemplateAction(template.id);
      setError(result.ok ? null : result.error);
    });
  }

  return (
    <li className={cn("card flex flex-col overflow-hidden", !template.is_active && "opacity-70")}>
      <div className="relative aspect-[16/9] border-b border-line bg-paper">
        {template.preview_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={template.preview_image} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="grid h-full place-items-center text-muted/40">
            <LayoutTemplate className="h-10 w-10" aria-hidden />
          </div>
        )}
        {!template.is_active && <span className="badge absolute left-3 top-3 bg-ink text-paper">Nonaktif</span>}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl italic">{template.name}</h2>
            <p className="font-mono text-xs text-muted">{template.code}</p>
          </div>
          <Link
            href={`/undangan?template=${template.id}`}
            className="badge shrink-0 bg-clay/10 text-clay hover:bg-clay hover:text-white"
          >
            {template.invitation_count} undangan
          </Link>
        </div>
        {template.description && <p className="mt-2 line-clamp-2 text-sm text-muted">{template.description}</p>}

        <a
          href={template.base_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 truncate text-xs font-medium text-moss hover:underline"
        >
          {template.base_url} <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
        </a>

        {error && (
          <p role="alert" className="error-text">
            {error}
          </p>
        )}

        <div className="mt-auto flex gap-2 pt-5">
          <TemplateForm template={template} />
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending || template.invitation_count > 0}
            title={template.invitation_count > 0 ? "Masih dipakai undangan" : undefined}
            className="btn-danger btn-sm"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden /> Hapus
          </button>
        </div>
      </div>
    </li>
  );
}

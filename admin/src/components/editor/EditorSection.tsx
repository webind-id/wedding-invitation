"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { countErrors, useEditor } from "./EditorContext";

interface EditorSectionProps {
  id: string;
  title: string;
  description?: string;
  /** Prefix path error yang dihitung untuk badge, mis. ["bride", "groom"]. */
  errorPaths: string[];
  defaultOpen?: boolean;
  children: ReactNode;
}

export function EditorSection({ id, title, description, errorPaths, defaultOpen, children }: EditorSectionProps) {
  const { errors } = useEditor();
  const errorCount = countErrors(errors, errorPaths);

  return (
    <details id={id} open={defaultOpen || errorCount > 0} className="card group scroll-mt-6 open:shadow-sm">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{title}</h2>
          {description && <p className="text-xs text-muted">{description}</p>}
        </div>
        {errorCount > 0 && <span className="badge bg-danger/10 text-danger">{errorCount} perlu dicek</span>}
        <ChevronDown className="h-4 w-4 text-muted transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="space-y-4 border-t border-line px-5 py-5">{children}</div>
    </details>
  );
}

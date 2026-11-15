"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function CopyButton({
  text,
  label = "Salin",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Abaikan bila peramban memblokir clipboard
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Salin ${text}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-sand-deep bg-cream-50 px-3.5 py-1.5 font-sans text-xs font-semibold text-earth-ink shadow-sm transition-all hover:border-terracotta hover:bg-white active:scale-95",
        copied && "border-olive-600 bg-olive-50 text-olive-800",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-olive-700" aria-hidden />
          <span className="text-olive-700">Tersalin!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-terracotta" aria-hidden />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

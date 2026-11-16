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
        "inline-flex items-center gap-1.5 rounded-full border border-gold/35 bg-night-900/80 px-3.5 py-1.5 font-sans text-xs font-semibold text-moon transition-all hover:border-ember hover:shadow-glow-sm active:scale-95",
        copied && "border-ember bg-ember/15 text-ember-100",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-ember-300" aria-hidden />
          <span className="text-ember-200">Tersalin!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-ember-300" aria-hidden />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

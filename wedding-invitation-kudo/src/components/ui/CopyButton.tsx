"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const RESET_MS = 1800;

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, label = "Salin", className }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), RESET_MS);
    return () => clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-forest/20 px-3 py-1.5 text-xs font-semibold text-forest transition hover:border-forest hover:bg-forest hover:text-linen",
        state === "copied" && "border-moss bg-moss text-linen",
        className,
      )}
    >
      {state === "copied" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {state === "copied" ? "Tersalin" : state === "failed" ? "Gagal, salin manual" : label}
    </button>
  );
}

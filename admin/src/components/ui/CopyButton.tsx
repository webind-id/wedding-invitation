"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const RESET_MS = 1600;

export function CopyButton({ value, label = "Salin", className }: { value: string; label?: string; className?: string }) {
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
        "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-clay hover:bg-clay/10",
        state === "copied" && "text-moss",
        className,
      )}
    >
      {state === "copied" ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {state === "copied" ? "Tersalin" : state === "failed" ? "Gagal" : label}
    </button>
  );
}

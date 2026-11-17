"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

const FEEDBACK_MS = 2000;

/** Salin lewat Clipboard API; bila diblokir (WebView lama/HTTP), pakai textarea + execCommand. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyButton({ text, label = "Salin", className }: { text: string; label?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    setState((await copyText(text)) ? "copied" : "failed");
    window.setTimeout(() => setState("idle"), FEEDBACK_MS);
  }

  return (
    <button type="button" onClick={handleCopy} className={cn("btn-gold px-4 py-[9px] text-[10.5px]", className)}>
      {state === "copied" ? <Check className="h-[15px] w-[15px]" aria-hidden /> : <Copy className="h-[15px] w-[15px]" aria-hidden />}
      <span aria-live="polite">{state === "copied" ? "Tersalin" : state === "failed" ? "Salin manual" : label}</span>
    </button>
  );
}

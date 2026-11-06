"use client";

import { Landmark, Package, Wallet } from "lucide-react";
import { useId, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import type { GiftAccount } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { CopyButton } from "../ui/CopyButton";
import { FadeIn } from "../ui/FadeIn";
import { Heading } from "../ui/Heading";

type Tab = "transfer" | "kado";

function AccountCard({ account }: { account: GiftAccount }) {
  const Icon = account.kind === "bank" ? Landmark : Wallet;
  return (
    <li className="relative overflow-hidden rounded-3xl bg-forest p-5 text-linen">
      <span aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full border-[18px] border-linen/5" />
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blush">
        <Icon className="h-4 w-4" aria-hidden />
        {account.provider}
      </div>
      <p className="mt-5 font-mono text-xl tracking-[0.12em]">{account.number}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-linen/70">a.n. {account.holder}</p>
        <CopyButton value={account.number.replace(/\s/g, "")} className="border-linen/30 text-linen hover:bg-linen hover:text-forest" />
      </div>
    </li>
  );
}

export function Gift() {
  const { intro, accounts, shipping } = useInvitation().content.gift;
  const [tab, setTab] = useState<Tab>("transfer");
  const baseId = useId();
  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: "transfer", label: "Transfer", show: accounts.length > 0 },
    { id: "kado", label: "Kirim kado", show: Boolean(shipping) },
  ];
  const visibleTabs = tabs.filter((t) => t.show);
  if (visibleTabs.length === 0) return null;
  const current = visibleTabs.some((t) => t.id === tab) ? tab : visibleTabs[0].id;

  // Pola tablist WAI-ARIA: panah kiri/kanan berpindah tab, fokus ikut berpindah.
  function handleTabKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = visibleTabs.findIndex((t) => t.id === current);
    const next = visibleTabs[(i + (e.key === "ArrowRight" ? 1 : -1) + visibleTabs.length) % visibleTabs.length];
    setTab(next.id);
    document.getElementById(`${baseId}-${next.id}-tab`)?.focus();
  }

  return (
    <section id="hadiah" aria-labelledby="hadiah-title" className="bg-blush/40 px-5 py-20">
      <Heading eyebrow="Tanda kasih" id="hadiah-title">
        Hadiah pernikahan
      </Heading>
      <FadeIn className="mx-auto mt-5 max-w-xs text-center text-sm leading-relaxed text-bark/70">
        <p>{intro}</p>
      </FadeIn>

      {visibleTabs.length > 1 && (
        <div role="tablist" aria-label="Pilihan hadiah" className="mx-auto mt-8 flex w-fit rounded-full bg-white/60 p-1">
          {visibleTabs.map((t) => (
            <button
              key={t.id}
              id={`${baseId}-${t.id}-tab`}
              role="tab"
              type="button"
              aria-selected={current === t.id}
              tabIndex={current === t.id ? 0 : -1}
              onKeyDown={handleTabKey}
              aria-controls={`${baseId}-${t.id}-panel`}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-full px-5 py-2 text-xs font-semibold transition",
                current === t.id ? "bg-forest text-linen shadow" : "text-forest hover:bg-white",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div
        id={`${baseId}-${current}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${current}-tab`}
        className="mt-6"
      >
        {current === "transfer" ? (
          <ul className="space-y-4">
            {accounts.map((a) => (
              <AccountCard key={`${a.provider}-${a.number}`} account={a} />
            ))}
          </ul>
        ) : (
          shipping && (
            <div className="rounded-3xl border-2 border-dashed border-forest/20 bg-white/70 p-6 text-center">
              <Package className="mx-auto h-7 w-7 text-clay" aria-hidden />
              <p className="mt-3 font-display text-xl italic text-forest">{shipping.recipient}</p>
              {shipping.phone && <p className="mt-1 text-xs text-bark/60">{shipping.phone}</p>}
              <p className="mt-3 text-sm leading-relaxed text-bark/80">{shipping.address}</p>
              <CopyButton value={`${shipping.recipient}\n${shipping.phone ?? ""}\n${shipping.address}`.trim()} label="Salin alamat" className="mt-5" />
            </div>
          )
        )}
      </div>
    </section>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { ceremonyIcon, type CeremonyIcon } from "@/lib/labels";
import { useInvitation } from "../InvitationContext";
import { TopCorners } from "../jawa/Ornaments";
import { SectionHeading } from "../ui/SectionHeading";

const ICONS: Record<CeremonyIcon, ReactNode> = {
  water: (
    <>
      <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
      <path fill="none" stroke="currentColor" strokeWidth="1.4" d="M9 15a3 3 0 0 0 3 3" />
    </>
  ),
  moon: (
    <>
      <path fill="none" stroke="currentColor" strokeWidth="1.6" d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      <circle cx="17" cy="6" r="1" fill="currentColor" />
      <circle cx="20" cy="9" r=".8" fill="currentColor" />
    </>
  ),
  rings: (
    <>
      <circle cx="9" cy="14" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15" cy="14" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 5l2-2 2 2-2 2z" fill="currentColor" />
    </>
  ),
  hand: (
    <>
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" d="M4 13c2 0 4 1 5 3h5a2 2 0 0 0 0-4h-3M4 20h9l7-5a1.6 1.6 0 0 0-2-2.4L13 16" />
      <path d="M14 4c1.4-1.6 4-.6 4 1.4 0 2-4 4.6-4 4.6s-4-2.6-4-4.6C10 3.4 12.6 2.4 14 4z" fill="currentColor" />
    </>
  ),
};

/** Prosesi adat dari admin (`content.ceremonies`). Kosong → bagian disembunyikan. */
export function Prosesi() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const ceremonies = content.ceremonies;
  if (ceremonies.length === 0) return null;

  return (
    <section ref={ref} id="prosesi" aria-labelledby="prosesi-title" className="sec kawung-bg">
      <TopCorners />
      <SectionHeading
        id="prosesi-title"
        title="Prosesi Adat"
        variant="display"
        lead={<span className="text-base">Rangkaian upacara adat yang akan kami jalani, sebagai wujud doa dan penghormatan kepada leluhur.</span>}
      />
      <ol data-reveal-group className="mt-7 grid gap-4 text-left">
        {ceremonies.map((rite, i) => (
          <li key={`${rite.name}-${i}`} data-reveal-item className="flex items-start gap-3.5 rounded-2xl border border-cream-200 bg-cream-100 p-4">
            <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-sogan-800 text-gold-300">
              <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" aria-hidden>
                {ICONS[ceremonyIcon(rite.name, i)]}
              </svg>
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[2px] text-sogan-800">{rite.name}</h3>
              {rite.description && <p className="mt-1 text-[15px] leading-[1.55] text-sogan-700 [text-wrap:pretty]">{rite.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

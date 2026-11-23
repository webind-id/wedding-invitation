"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { useInvitation } from "../InvitationContext";
import { Babak } from "../taman/Babak";

/**
 * Babak "Upacara": prosesi adat dari admin (`content.ceremonies`) sebagai jalan setapak di taman —
 * batu pijakan terakota bernomor (warna jalan setapak joglo di adegan pembuka) yang disambung
 * kerikil, sedikit berkelok. Kosong → bagian disembunyikan.
 */
export function Prosesi() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const ceremonies = content.ceremonies;
  if (ceremonies.length === 0) return null;

  return (
    <section ref={ref} id="prosesi" aria-labelledby="prosesi-title" className="sec kawung-bg">
      <Babak
        id="prosesi-title"
        name="Upacara"
        title="Prosesi Adat"
        lead={<span className="text-base">Rangkaian upacara adat yang akan kami jalani, sebagai wujud doa dan penghormatan kepada leluhur.</span>}
      />

      <ol data-reveal-group className="mt-10">
        {ceremonies.map((rite, i) => (
          <li key={`${rite.name}-${i}`} data-reveal-item className="path-step relative grid grid-cols-[60px_1fr] gap-4 pb-9 last:pb-0">
            <span aria-hidden className={cn("path-stone", i % 2 === 1 && "translate-x-2.5")}>
              {i + 1}
            </span>
            <div className="pt-1.5">
              <h3 className="font-display text-[15px] font-semibold uppercase tracking-[2.5px] text-marun-800">{rite.name}</h3>
              {rite.description && <p className="mt-1.5 text-[15.5px] leading-[1.6] text-marun-700 [text-wrap:pretty]">{rite.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

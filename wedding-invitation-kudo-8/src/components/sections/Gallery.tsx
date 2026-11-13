"use client";

import { MoveRight } from "lucide-react";
import { useRef, useState } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { formatElevation, mountainAt } from "@/lib/mountains";
import type { Moment } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Slate, TitleCard } from "../film/Frame";
import { Lightbox } from "../ui/Lightbox";
import { Photo } from "../ui/Photo";

/** Lebar bingkai mengikuti bentuk foto; tinggi pita tetap. */
const FRAME_ASPECT: Record<Moment["shape"], string> = {
  tall: "aspect-[3/4]",
  wide: "aspect-[4/3]",
  square: "aspect-square",
};

const captionOf = (i: number) => {
  const m = mountainAt(i);
  return `${m.name} · ${formatElevation(m.elevation)}`;
};

/** Dokumentasi: pita film 35 mm yang digeser ke samping — sprocket, nomor frame, keterangan gunung. */
export function Gallery() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  useScrollScene(ref);
  const moments = content.moments;
  if (moments.length === 0) return null;

  return (
    <section ref={ref} id="galeri" aria-labelledby="gallery-title" className="relative bg-film pb-20 pt-28 sm:pb-24 sm:pt-40">
      <div className="px-6">
        <div data-reveal="fade" className="flex justify-center">
          <Slate scene={7} />
        </div>
        <TitleCard id="gallery-title" kicker="Dokumentasi" title="Jejak di setiap puncak" className="mt-6" />
      </div>

      <div data-reveal="fade" className="mt-16 bg-[#0B0D0F] py-1 shadow-[0_0_0_1px_rgba(243,239,230,0.06)]">
        <div aria-hidden className="sprockets h-6" />
        <ul aria-label="Foto kenangan" className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-[8vw] py-1 sm:gap-4">
          {moments.map((m, i) => (
            <li key={`${m.src}-${i}`} className="shrink-0 snap-center">
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`Perbesar foto ${i + 1}${m.alt ? `: ${m.alt}` : ""}`}
                className="group relative block h-[min(58svh,30rem)] text-left"
              >
                <Photo src={m.src} alt={m.alt} className={cn(FRAME_ASPECT[m.shape], "h-full [filter:saturate(0.85)_contrast(1.06)] transition duration-700 ease-film group-hover:[filter:saturate(1)_contrast(1.06)]")} />
                <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.45)]" />
              </button>
              <p className="mt-2 flex justify-between gap-4 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-amber/80">
                <span>{String(i + 1).padStart(2, "0")}A ▸</span>
                <span className="text-seluloid/45">{captionOf(i)}</span>
              </p>
            </li>
          ))}
        </ul>
        <div aria-hidden className="sprockets h-6" />
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-seluloid/45">
        Geser pita film <MoveRight className="h-3.5 w-3.5" aria-hidden />
      </p>

      <Lightbox moments={moments} index={openIndex} onIndex={setOpenIndex} captionOf={captionOf} />
    </section>
  );
}

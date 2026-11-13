"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { formatDotDate } from "@/lib/datetime";
import { useInvitation } from "../InvitationContext";
import { Gunungan } from "../three/Gunungan";
import { JogloRoof } from "../three/JogloRoof";
import { Ronce } from "../three/Ronce";
import { Photo } from "../ui/Photo";

/**
 * Panutup — "tancep kayon": seperti akhir pertunjukan wayang, dua gunungan datang dari
 * kedua sisi dan ditancapkan mengapit foto, lalu ucapan terima kasih & nama pasangan.
 */
export function Closing() {
  const { content, coupleLabel, monogram, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const photo = content.posterPhoto || content.coverPhoto;

  return (
    <section ref={ref} data-twirl-track aria-labelledby="closing-title" className="malam-sky relative overflow-hidden px-6 pb-16 pt-28 text-gading sm:pt-40">
      <div className="parang-band absolute inset-x-0 top-0 h-3" aria-hidden />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
        <div data-depth="-40" className="w-[min(90vw,34rem)]">
          <Ronce count={14} width={340} className="w-full opacity-90" />
        </div>
      </div>

      <div className="relative mx-auto w-[min(64vw,19rem)]">
        <div data-depth="-24">
          <div data-reveal="zoom">
            <JogloRoof className="relative z-10 -mb-1" />
            <div className="gapura bg-prada p-[3px]">
              <Photo src={photo} alt={`${pair[0].nickname} dan ${pair[1].nickname}`} parallax={6} className="gapura aspect-[4/5] w-full" />
            </div>
          </div>
        </div>

        {/* Gunungan datang dari luar layar & ditancapkan mengapit foto. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 [perspective:1000px]">
          <div data-drift="-240" className="preserve-3d absolute -left-[30%] bottom-[-4%]">
            <div data-twirl="-720" className="preserve-3d">
              <Gunungan size="clamp(5rem,18vw,8rem)" />
            </div>
          </div>
          <div data-drift="240" className="preserve-3d absolute -right-[30%] bottom-[-4%]">
            <div data-twirl="720" className="preserve-3d">
              <Gunungan size="clamp(5rem,18vw,8rem)" />
            </div>
          </div>
        </div>
      </div>

      <div data-depth="18" className="relative mx-auto mt-16 max-w-xl text-center">
        {content.closing.message && (
          <p data-reveal="up" className="text-[1.06rem] leading-relaxed text-gading/75 [text-wrap:pretty]">
            {content.closing.message}
          </p>
        )}
        <p data-reveal="up" className="label mt-10 text-prada-light">
          Matur nuwun · {content.closing.signature || "Kami yang berbahagia"}
        </p>
        <h2 id="closing-title" data-reveal="up" className="mt-3 font-serif text-[clamp(3rem,11vw,5rem)] italic leading-tight text-gading">
          {coupleLabel}
        </h2>
      </div>

      <footer className="relative mt-14 text-center">
        <p className="font-serif text-3xl italic text-prada-light">{monogram}</p>
        <p className="label mt-2 text-gading/45">{formatDotDate(content.events[0].start, content.timeZone)}</p>
      </footer>
    </section>
  );
}

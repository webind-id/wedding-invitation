"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { formatDotDate } from "@/lib/datetime";
import { useInvitation } from "../InvitationContext";
import { Flower } from "../three/Flower";
import { WisteriaCurtain } from "../three/Wisteria";
import { Photo } from "../ui/Photo";

/**
 * Penutup: foto bulat seperti bulan di atas kolam. Teratai besar di depannya mekar
 * seiring adegan di-scroll, daun-daun teratai berkumpul dari kedua sisi, dan wisteria
 * turun dari atas. Lalu tanda tangan pasangan.
 */
export function Closing() {
  const { content, coupleLabel, monogram, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const photo = content.posterPhoto || content.coverPhoto;

  return (
    <section ref={ref} data-bloom-track aria-labelledby="closing-title" className="dusk-paper relative overflow-hidden px-6 pb-16 pt-44 sm:pt-56">
      <WisteriaCurtain
        strands={[
          { left: 3, length: 18, width: "3.8rem", depth: 70, sway: 8, seed: 51 },
          { left: 16, length: 11, width: "3rem", depth: -30, sway: -6, seed: 52 },
          { left: 30, length: 7, width: "2.4rem", depth: 40, sway: 5, seed: 53 },
          { left: 64, length: 9, width: "2.6rem", depth: -40, sway: -5, seed: 54 },
          { left: 78, length: 14, width: "3.4rem", depth: 50, sway: 7, seed: 55 },
          { left: 91, length: 19, width: "4rem", depth: -20, sway: -9, seed: 56 },
        ]}
      />

      <div className="relative mx-auto w-[min(72vw,20rem)]">
        <div data-depth="-24">
          <div data-reveal="zoom">
            <Photo src={photo} alt={`${pair[0].nickname} dan ${pair[1].nickname}`} parallax={6} className="aspect-square rounded-full shadow-[0_40px_80px_-40px_rgba(78,49,89,0.7)] ring-[8px] ring-white/60" />
          </div>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-0 [perspective:1000px]">
          {/* Daun teratai berkumpul dari luar layar menuju dasar bingkai. */}
          <div data-drift="-240" className="preserve-3d absolute -left-[42%] bottom-[-22%]">
            <div data-spin="70" className="preserve-3d">
              <Flower kind="lotus" palette="lilac" size="clamp(7rem,20vw,10rem)" seed={60} pad rings={4} tilt={50} />
            </div>
          </div>
          <div data-drift="240" className="preserve-3d absolute -right-[40%] bottom-[-14%]">
            <div data-spin="-70" className="preserve-3d">
              <Flower kind="dahlia" palette="plum" size="clamp(6rem,16vw,8.5rem)" seed={61} tilt={30} />
            </div>
          </div>
          {/* Teratai utama: mekar mengikuti scroll (data-bloom-track ada di section). */}
          <div className="preserve-3d absolute -bottom-[30%] left-1/2 -translate-x-1/2">
            <div data-depth="50" className="preserve-3d">
              <Flower kind="lotus" palette="moon" size="clamp(9rem,26vw,13rem)" seed={62} pad tilt={58} opensOnScroll />
            </div>
          </div>
        </div>
      </div>

      <div data-depth="20" className="relative mx-auto mt-36 max-w-xl text-center">
        {content.closing.message && (
          <p data-reveal="up" className="text-[1.02rem] leading-relaxed text-ink/70 [text-wrap:pretty]">
            {content.closing.message}
          </p>
        )}
        <p data-reveal="up" className="label mt-10">
          {content.closing.signature || "Kami yang berbahagia"}
        </p>
        {/* Script hanya untuk nama (sesuai arahan tipografi). */}
        <h2 id="closing-title" data-reveal="up" className="mt-3 font-script text-[clamp(3.2rem,12vw,5.5rem)] leading-tight">
          {coupleLabel}
        </h2>
      </div>

      <footer className="relative mt-14 text-center">
        <p className="font-display text-3xl italic text-plum">{monogram}</p>
        <p className="label mt-2 text-ink/55">{formatDotDate(content.events[0].start, content.timeZone)}</p>
      </footer>
    </section>
  );
}

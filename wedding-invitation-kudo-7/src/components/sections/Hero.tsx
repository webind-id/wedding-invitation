"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { formatDotDate, formatLongDate } from "@/lib/datetime";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { useInvitation } from "../InvitationContext";
import { Gunungan } from "../three/Gunungan";
import { Ronce } from "../three/Ronce";
import { GununganFrame } from "../ui/GununganFrame";
import { Photo } from "../ui/Photo";

/**
 * Adegan pertama setelah pintu terbuka — bagian dalam pendopo. Lapisan kedalaman:
 * ronce melati (depan, cepat) → gunungan pengapit (tengah, berputar) → foto bergunungan (belakang).
 */
export function Hero({ isOpen }: { isOpen: boolean }) {
  const { content, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  useScrollScene(ref);
  useTilt(stageRef, 4);

  // Pembukaan diputar saat pintu selesai dibuka, bukan saat halaman dimuat di baliknya.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-intro]", ref.current);
        if (!isOpen) {
          gsap.set(items, { autoAlpha: 0, y: 26 });
          gsap.set("[data-intro-kayon]", { autoAlpha: 0, rotationY: 120, y: 30 });
          gsap.set("[data-intro-ronce]", { autoAlpha: 0, yPercent: -40 });
          return;
        }
        gsap.to(items, { autoAlpha: 1, y: 0, duration: 1.6, ease: "power3.out", stagger: 0.15, delay: 0.15 });
        gsap.to("[data-intro-kayon]", { autoAlpha: 1, rotationY: 0, y: 0, duration: 2.4, ease: "power3.out", stagger: 0.2, delay: 0.3 });
        gsap.to("[data-intro-ronce]", { autoAlpha: 1, yPercent: 0, duration: 1.8, ease: "power3.out", stagger: 0.15 });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [isOpen] },
  );

  const first = content.events[0];

  return (
    <section ref={ref} aria-labelledby="hero-title" className="gading-paper relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-14 pt-24">
      {/* Ronce melati menjuntai dari tepi atas */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex justify-between">
        <div data-depth="-60" className="w-[46%] max-w-sm">
          <div data-intro-ronce>
            <Ronce count={8} className="w-full" />
          </div>
        </div>
        <div data-depth="-60" className="w-[46%] max-w-sm">
          <div data-intro-ronce>
            <Ronce count={8} className="w-full -scale-x-100" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 [perspective:1200px]">
        <div ref={stageRef} className="preserve-3d absolute inset-0">
          <div data-depth="70" className="preserve-3d absolute -left-[6%] bottom-[8%] sm:left-[8%]">
            <div data-twirl="80" className="preserve-3d">
              <div data-intro-kayon className="preserve-3d">
                <Gunungan size="clamp(5rem,16vw,9rem)" />
              </div>
            </div>
          </div>
          <div data-depth="40" className="preserve-3d absolute -right-[6%] bottom-[14%] sm:right-[8%]">
            <div data-twirl="-80" className="preserve-3d">
              <div data-intro-kayon className="preserve-3d">
                <Gunungan size="clamp(4rem,12vw,7rem)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p data-intro className="label relative">
        Undangan Pawiwahan
      </p>

      <div className="relative mt-8 w-[min(62vw,18rem)]">
        <div data-depth="-30">
          <div data-intro>
            <GununganFrame className="w-full drop-shadow-[0_30px_30px_rgba(62,38,21,0.35)]">
              <Photo src={content.coverPhoto} alt={`Foto ${pair[0].nickname} dan ${pair[1].nickname}`} eager parallax={6} className="h-full w-full" />
            </GununganFrame>
          </div>
        </div>
      </div>

      <h1 id="hero-title" data-depth="30" className="relative mt-8 text-center font-serif italic leading-[0.95] text-ink">
        <span data-intro className="block text-[clamp(3.2rem,13vw,6rem)]">
          {pair[0].nickname}
        </span>
        <span data-intro className="my-1 block font-display text-[clamp(1rem,3vw,1.3rem)] not-italic tracking-[0.5em] text-prada-deep">
          &amp;
        </span>
        <span data-intro className="block text-[clamp(3.2rem,13vw,6rem)]">
          {pair[1].nickname}
        </span>
      </h1>

      <div data-depth="16" className="relative mt-8 text-center">
        <p data-intro className="font-display text-lg tracking-[0.4em] text-ink sm:text-xl">
          {formatDotDate(first.start, content.timeZone)}
        </p>
        <p data-intro className="mt-2 text-ink/60">
          {formatLongDate(first.start, content.timeZone)} · {first.venue}
        </p>
      </div>

      <div className="relative mt-12 flex justify-center">
        <p data-intro className="label flex flex-col items-center gap-3 text-ink/45">
          Gulir perlahan
          <span aria-hidden className="h-10 w-px bg-gradient-to-b from-prada to-transparent" />
        </p>
      </div>
    </section>
  );
}

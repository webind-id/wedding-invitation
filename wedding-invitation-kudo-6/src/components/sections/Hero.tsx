"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { formatDotDate, formatLongDate } from "@/lib/datetime";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { useInvitation } from "../InvitationContext";
import { Bloom } from "../three/Bloom";
import { Petal } from "../three/Petal";
import { Photo } from "../ui/Photo";

/**
 * Adegan pertama setelah amplop terbuka. Tiga lapisan kedalaman:
 * foto arch (belakang, bergerak lambat) → nama (tengah) → bunga (depan, bergerak cepat & berputar).
 */
export function Hero({ isOpen }: { isOpen: boolean }) {
  const { content, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  useScrollScene(ref);
  useTilt(stageRef, 4);

  // Pembukaan diputar saat amplop selesai dibuka, bukan saat halaman dimuat di balik amplop.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-intro]", ref.current);
        if (!isOpen) {
          gsap.set(items, { autoAlpha: 0, y: 26 });
          gsap.set("[data-intro-bloom]", { autoAlpha: 0, scale: 0.6, rotation: -25 });
          return;
        }
        gsap.to(items, { autoAlpha: 1, y: 0, duration: 1.6, ease: "power3.out", stagger: 0.16, delay: 0.15 });
        gsap.to("[data-intro-bloom]", { autoAlpha: 1, scale: 1, rotation: 0, duration: 2.2, ease: "power3.out", stagger: 0.2 });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [isOpen] },
  );

  const first = content.events[0];

  return (
    <section ref={ref} aria-labelledby="hero-title" className="pearl-paper relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-12 pt-16">
      <div className="pointer-events-none absolute inset-0 [perspective:1200px]">
        <div ref={stageRef} className="preserve-3d absolute inset-0">
          {/* Lapisan belakang */}
          <div data-depth="-70" className="preserve-3d absolute -right-[22%] -top-[4%] sm:right-[-6%] sm:top-[4%]">
            <div data-spin="-40" className="preserve-3d">
              <div data-intro-bloom>
                <Bloom palette="pearl" size="clamp(10rem,28vw,19rem)" seed={3} leaves={4} />
              </div>
            </div>
          </div>
          <div data-depth="-30" className="absolute left-[12%] top-[14%] hidden md:block">
            <Petal size="2.4rem" rotate={-30} />
          </div>
          <div data-depth="50" className="absolute right-[20%] top-[58%]">
            <Petal size="1.8rem" rotate={50} tone="#EAD9BF" />
          </div>

          {/* Lapisan depan */}
          <div data-depth="110" className="preserve-3d absolute -left-[10%] bottom-[2%] md:left-[4%]">
            <div data-spin="50" className="preserve-3d">
              <div data-intro-bloom>
                <Bloom palette="blush" size="clamp(11rem,30vw,21rem)" seed={1} leaves={3} />
              </div>
            </div>
          </div>
          <div data-depth="80" className="preserve-3d absolute bottom-[16%] right-[6%] md:right-[18%]">
            <div data-spin="-30" className="preserve-3d">
              <div data-intro-bloom>
                <Bloom palette="champagne" size="clamp(4.5rem,10vw,7rem)" seed={6} tilt={40} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p data-intro className="label relative">
        The Wedding of
      </p>

      <div className="relative mt-8 w-[min(64vw,19rem)]">
        <div data-depth="-36">
          <div data-intro>
            <Photo src={content.coverPhoto} alt={`Foto ${pair[0].nickname} dan ${pair[1].nickname}`} eager parallax={6} className="arch aspect-[3/4] shadow-[0_40px_80px_-40px_rgba(57,49,47,0.55)] ring-1 ring-white/70" />
          </div>
        </div>

        <h1 id="hero-title" data-depth="40" className="relative -mt-10 text-center font-script leading-[0.95] text-ink [text-shadow:0_0_18px_rgba(248,245,239,0.95),0_0_4px_rgba(248,245,239,0.9)] sm:-mt-24">
          {/* Geser horizontal di elemen dalam — elemen data-intro dianimasikan GSAP (transform-nya ditimpa). */}
          <span data-intro className="block">
            <span className="inline-block -translate-x-[12%] text-[clamp(3.6rem,15vw,6.5rem)]">{pair[0].nickname}</span>
          </span>
          <span data-intro className="block font-display text-[clamp(1.6rem,5vw,2.4rem)] italic text-champagne-deep">
            &amp;
          </span>
          <span data-intro className="block">
            <span className="inline-block translate-x-[12%] text-[clamp(3.6rem,15vw,6.5rem)]">{pair[1].nickname}</span>
          </span>
        </h1>
      </div>

      <div data-depth="20" className="relative mt-8 text-center">
        <p data-intro className="font-display text-xl tracking-[0.38em] text-ink sm:text-2xl">
          {formatDotDate(first.start, content.timeZone)}
        </p>
        <p data-intro className="mt-2 text-sm text-ink/60">
          {formatLongDate(first.start, content.timeZone)} · {first.venue}
        </p>
      </div>

      <div className="relative mt-12 flex justify-center">
        <p data-intro className="label flex flex-col items-center gap-3 text-ink/45">
          Gulir perlahan
          <span aria-hidden className="h-10 w-px bg-gradient-to-b from-champagne to-transparent" />
        </p>
      </div>
    </section>
  );
}

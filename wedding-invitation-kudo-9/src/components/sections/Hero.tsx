"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { formatDotDate, formatLongDate } from "@/lib/datetime";
import { photoAt, photosExcept } from "@/lib/photos";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { useInvitation } from "../InvitationContext";
import { Flower } from "../three/Flower";
import { Petal } from "../three/Petal";
import { WisteriaCurtain } from "../three/Wisteria";
import { Photo } from "../ui/Photo";


/**
 * Adegan pertama setelah kartu dibuka: triptych 3D — foto utama dalam bingkai kapsul tegak bercincin
 * di tengah, dua foto bulat di kiri-kanan yang condong ke arah tengah (rotateY) dan berada
 * di kedalaman berbeda. Wisteria menjuntai di depan, teratai mengapung di bawah.
 */
export function Hero({ isOpen }: { isOpen: boolean }) {
  const { content, pair, photos } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tripRef = useRef<HTMLDivElement>(null);
  useScrollScene(ref);
  useTilt(stageRef, 3);
  useTilt(tripRef, 6);

  // Pembukaan diputar saat kartu selesai dibuka, bukan saat halaman dimuat di baliknya.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-intro]", ref.current);
        const wings = gsap.utils.toArray<HTMLElement>("[data-intro-wing]", ref.current);
        if (!isOpen) {
          gsap.set(items, { autoAlpha: 0, y: 26 });
          gsap.set(wings, { autoAlpha: 0, scale: 0.7 });
          gsap.set("[data-intro-bloom]", { autoAlpha: 0, scale: 0.6, rotation: -25 });
          return;
        }
        gsap.to(items, { autoAlpha: 1, y: 0, duration: 1.6, ease: "power3.out", stagger: 0.14, delay: 0.1 });
        gsap.to(wings, { autoAlpha: 1, scale: 1, duration: 1.8, ease: "power3.out", stagger: 0.18, delay: 0.5 });
        gsap.to("[data-intro-bloom]", { autoAlpha: 1, scale: 1, rotation: 0, duration: 2.2, ease: "power3.out", stagger: 0.2 });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [isOpen] },
  );

  const first = content.events[0];
  const side = photosExcept(photos, [content.coverPhoto]);
  const label = `${pair[0].nickname} dan ${pair[1].nickname}`;

  return (
    <section ref={ref} aria-labelledby="hero-title" className="dusk-paper relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-14 pt-28">
      <div className="pointer-events-none absolute inset-0 [perspective:1200px]">
        <div ref={stageRef} className="preserve-3d absolute inset-0">
          <WisteriaCurtain />

          <div data-depth="40" className="absolute left-[8%] top-[46%] hidden md:block">
            <Petal size="2.2rem" rotate={-30} />
          </div>
          <div data-depth="-40" className="absolute right-[10%] top-[30%]">
            <Petal size="1.6rem" rotate={55} tone="#F0D1BA" />
          </div>

          {/* Kolam di dasar adegan — lapisan depan, bergerak paling cepat. */}
          <div data-depth="110" className="preserve-3d absolute -bottom-[4%] -left-[12%] md:left-[2%]">
            <div data-spin="40" className="preserve-3d">
              <div data-intro-bloom>
                <Flower kind="lotus" palette="lilac" size="clamp(10rem,28vw,18rem)" seed={1} pad />
              </div>
            </div>
          </div>
          <div data-depth="70" className="preserve-3d absolute -bottom-[2%] -right-[10%] md:right-[4%]">
            <div data-spin="-50" className="preserve-3d">
              <div data-intro-bloom>
                <Flower kind="dahlia" palette="plum" size="clamp(7rem,20vw,13rem)" seed={3} tilt={30} />
              </div>
            </div>
          </div>
          <div data-depth="90" className="preserve-3d absolute bottom-[6%] left-[30%] hidden sm:block">
            <div data-intro-bloom>
              <Flower kind="lotus" palette="apricot" size="clamp(4rem,9vw,6rem)" seed={6} pad tilt={46} />
            </div>
          </div>
        </div>
      </div>

      <p data-intro className="label relative">
        The Wedding of
      </p>

      {/* Triptych: kiri & kanan condong ke tengah, di kedalaman berbeda. */}
      <div className="relative mt-8 [perspective:1100px]">
        <div ref={tripRef} className="preserve-3d flex items-end justify-center">
          <div data-depth="30" className="preserve-3d -mr-6 mb-16 sm:-mr-10">
            <div data-intro-wing className="preserve-3d">
              <div style={{ transform: "rotateY(28deg) translateZ(-60px)" }}>
              <Photo src={photoAt(side, 0)} alt={`Momen ${label}`} parallax={5} className="aspect-square w-[min(26vw,12.5rem)] rounded-full ring-[6px] ring-white/70 shadow-[0_24px_40px_-24px_rgba(78,49,89,0.6)]" />
              </div>
            </div>
          </div>

          <div data-depth="-30" className="preserve-3d relative z-[1]">
            <div data-intro className="preserve-3d">
              <div className="preserve-3d relative">
                <Photo src={content.coverPhoto} alt={`Foto ${label}`} eager parallax={6} className="capsule aspect-[3/5] w-[min(44vw,17.5rem)] shadow-[0_40px_70px_-36px_rgba(78,49,89,0.65)] ring-[6px] ring-white/70" />
                {/* Cincin kapsul tipis yang melayang di depan foto — terasa saat triptych condong. */}
                <span aria-hidden className="capsule pointer-events-none absolute -inset-3 border border-lavender/70" style={{ transform: "translateZ(36px)" }} />
              </div>
            </div>
          </div>

          <div data-depth="50" className="preserve-3d -ml-6 mb-4 sm:-ml-10">
            <div data-intro-wing className="preserve-3d">
              <div style={{ transform: "rotateY(-28deg) translateZ(-40px)" }}>
              <Photo src={photoAt(side, 1)} alt={`Momen ${label}`} parallax={5} className="aspect-square w-[min(22vw,10.5rem)] rounded-full ring-[6px] ring-white/70 shadow-[0_24px_40px_-24px_rgba(78,49,89,0.6)]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <h1 id="hero-title" data-depth="36" className="relative z-[2] -mt-8 text-center font-script leading-[0.95] text-ink [text-shadow:0_0_20px_rgba(244,241,246,0.95),0_0_4px_rgba(244,241,246,0.9)]">
        <span data-intro className="block text-[clamp(3.4rem,14vw,6.2rem)]">
          {pair[0].nickname}{" "}
          <span className="mx-2 font-display text-[0.4em] italic text-lavender">&amp;</span>{" "}
        </span>
        <span data-intro className="block text-[clamp(3.4rem,14vw,6.2rem)]">
          {pair[1].nickname}
        </span>
      </h1>

      <div data-depth="20" className="relative mt-6 text-center">
        <p data-intro className="font-display text-lg tracking-[0.42em] text-ink sm:text-xl">
          {formatDotDate(first.start, content.timeZone)}
        </p>
        <p data-intro className="mt-2 text-sm text-ink/65">
          {formatLongDate(first.start, content.timeZone)} · {first.venue}
        </p>
      </div>

      <div className="relative mt-10 flex justify-center">
        <p data-intro className="label flex flex-col items-center gap-3 text-ink/55">
          Gulir perlahan
          <span aria-hidden className="h-10 w-px bg-gradient-to-b from-lavender to-transparent" />
        </p>
      </div>
    </section>
  );
}

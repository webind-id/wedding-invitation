"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { formatDotDate, formatLongDate } from "@/lib/datetime";
import { useInvitation } from "../InvitationContext";
import { Letterbox, Slate } from "../film/Frame";
import { SceneBackdrop } from "../film/SceneBackdrop";

/** Sama dengan TrailCover: bilah letterbox yang menutupi layar. */
const CLOSED_BARS = 9;

/**
 * Title sequence. Menyambung dari sampul yang menutup ke hitam: letterbox membuka di
 * adegan Sindoro saat fajar, lalu nama pasangan muncul seperti kredit pembuka film.
 */
export function Hero({ isOpen }: { isOpen: boolean }) {
  const { content, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-intro]", ref.current);
        if (!isOpen) {
          gsap.set(items, { autoAlpha: 0, y: 16 });
          gsap.set("[data-letterbox='top']", { scaleY: CLOSED_BARS, transformOrigin: "top" });
          gsap.set("[data-letterbox='bottom']", { scaleY: CLOSED_BARS, transformOrigin: "bottom" });
          return;
        }
        gsap
          .timeline({ defaults: { ease: "power3.inOut" } })
          .to("[data-letterbox]", { scaleY: 1, duration: 1.8 }, 0.1)
          .to(items, { autoAlpha: 1, y: 0, duration: 1.6, stagger: 0.22, ease: "power2.out" }, 0.9);
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [isOpen] },
  );

  const first = content.events[0];

  return (
    <section ref={ref} data-zoom-track aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <SceneBackdrop scene="sindoro" eager dim={0.45} zoom={0.14} />
      <Letterbox />

      <div className="on-photo relative z-10 flex min-h-[100svh] flex-col px-6 pb-[calc(6svh+2rem)] pt-[calc(6svh+1.25rem)] sm:px-10 sm:pb-[calc(8svh+2.5rem)] sm:pt-[calc(8svh+1.5rem)]">
        <div data-intro>
          <Slate scene={2} mountain="sindoro" />
        </div>

        <div className="mt-auto text-center">
          <p data-intro className="label">
            Sebuah kisah perjalanan
          </p>
          <h1 id="hero-title" className="mt-6">
            <span data-intro className="credit block text-[clamp(2.8rem,12vw,7rem)] leading-[0.95]">
              {pair[0].nickname}
            </span>
            <span data-intro className="my-2 block font-display text-[clamp(1.4rem,4vw,2.2rem)] italic text-amber">
              &amp;
            </span>
            <span data-intro className="credit block text-[clamp(2.8rem,12vw,7rem)] leading-[0.95]">
              {pair[1].nickname}
            </span>
          </h1>
          <p data-intro className="mt-8 font-mono text-[0.8rem] uppercase tracking-[0.42em] text-seluloid/85">
            {formatDotDate(first.start, content.timeZone)}
          </p>
          <p data-intro className="mt-2 font-display text-lg italic text-seluloid/65">
            {formatLongDate(first.start, content.timeZone)} · {first.venue}
          </p>
          <p data-intro className="mt-10 flex flex-col items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.34em] text-seluloid/45">
            Gulir untuk melanjutkan
            <span aria-hidden className="h-10 w-px bg-gradient-to-b from-amber to-transparent" />
          </p>
        </div>
      </div>
    </section>
  );
}

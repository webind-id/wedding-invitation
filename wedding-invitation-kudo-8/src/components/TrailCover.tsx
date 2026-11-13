"use client";

import { useGSAP } from "@gsap/react";
import { Play } from "lucide-react";
import { useRef } from "react";
import { gsap } from "@/hooks/useScrollScene";
import { formatDotDate } from "@/lib/datetime";
import { Letterbox, Slate } from "./film/Frame";
import { SceneBackdrop } from "./film/SceneBackdrop";
import { useInvitation } from "./InvitationContext";

/** Letterbox ditarik sampai menutupi layar: 50svh ÷ tinggi bilah (6–8svh). */
const CLOSED_BARS = 9;

interface TrailCoverProps {
  guestName: string;
  onOpen: () => void;
}

/**
 * Opening — The Journey Begins. Pagi di puncak Prau: Sindoro & Sumbing di atas lautan awan.
 * Saat dimuat, letterbox terbuka dari layar hitam seperti mata yang membuka; foto bergeser
 * pelan mengikuti kursor. Saat diketuk, letterbox menutup ke hitam dan film dimulai.
 */
export function TrailCover({ guestName, onOpen }: TrailCoverProps) {
  const { content, coupleLabel } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const first = content.events[0];

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.inOut" } })
          .from("[data-letterbox='top']", { scaleY: CLOSED_BARS, transformOrigin: "top", duration: 1.8 }, 0.2)
          .from("[data-letterbox='bottom']", { scaleY: CLOSED_BARS, transformOrigin: "bottom", duration: 1.8 }, 0.2)
          .from("[data-cover-photo]", { scale: 1.18, duration: 3.2, ease: "power2.out" }, 0)
          .from("[data-cover-text]", { autoAlpha: 0, y: 14, duration: 1.4, stagger: 0.14, ease: "power2.out" }, 1.1);
      });
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const toX = gsap.quickTo("[data-cover-pan]", "x", { duration: 1.6, ease: "power3.out" });
        const toY = gsap.quickTo("[data-cover-pan]", "y", { duration: 1.6, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          toX((e.clientX / window.innerWidth - 0.5) * -24);
          toY((e.clientY / window.innerHeight - 0.5) * -14);
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const handleOpen = contextSafe(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(ref.current, { autoAlpha: 0, duration: 0.5, onComplete: onOpen });
      return;
    }
    gsap
      .timeline({ defaults: { ease: "power3.inOut" }, onComplete: onOpen })
      .to("[data-cover-text]", { autoAlpha: 0, y: -10, duration: 0.6, stagger: 0.04, ease: "power2.in" })
      .to("[data-cover-photo]", { scale: 1.12, duration: 1.6 }, 0)
      .to("[data-letterbox='top']", { scaleY: CLOSED_BARS, transformOrigin: "top", duration: 1.1 }, 0.35)
      .to("[data-letterbox='bottom']", { scaleY: CLOSED_BARS, transformOrigin: "bottom", duration: 1.1 }, 0.35);
  });

  return (
    <section ref={ref} aria-label="Sampul undangan" className="fixed inset-0 z-[60] overflow-hidden bg-film text-seluloid">
      <div data-cover-pan className="absolute -inset-6">
        <div data-cover-photo className="absolute inset-0">
          <SceneBackdrop scene="prau" eager zoom={0} dim={0.5} />
        </div>
      </div>
      <Letterbox />

      <div className="on-photo relative z-10 flex h-full flex-col px-6 pb-[calc(8svh+1.5rem)] pt-[calc(6svh+1.25rem)] sm:px-10 sm:pt-[calc(8svh+1.5rem)]">
        <div data-cover-text className="flex items-start justify-between gap-4">
          <Slate scene={1} mountain="prau" />
          <p className="hidden font-mono text-[0.62rem] uppercase tracking-[0.24em] text-seluloid/60 sm:block">{formatDotDate(first.start, content.timeZone)}</p>
        </div>

        <div className="mt-[8svh] text-center sm:mt-[10svh]">
          <p data-cover-text className="label">
            Opening · The Journey Begins
          </p>
          <h2 data-cover-text className="mt-6">
            <span className="credit block text-[clamp(2.3rem,10vw,5.6rem)] leading-none">Every Journey</span>
            <span className="mt-2 block font-display text-[clamp(1.7rem,6.6vw,3.6rem)] italic leading-tight text-amber">has its destination.</span>
          </h2>
          <p data-cover-text className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.34em] text-seluloid/75">
            {coupleLabel} · {formatDotDate(first.start, content.timeZone)}
          </p>
        </div>

        <div className="mt-auto text-center">
          <p data-cover-text className="label text-seluloid/55">
            Kepada Yth.
          </p>
          <p data-cover-text className="mx-auto mt-2 max-w-md font-display text-[clamp(1.7rem,6vw,2.4rem)] italic leading-tight [text-wrap:balance]">
            {guestName}
          </p>
          <div data-cover-text className="mt-7">
            <button type="button" onClick={handleOpen} className="btn-film">
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden /> Mulai perjalanan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

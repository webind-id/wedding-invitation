"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { formatElevation, MOUNTAINS } from "@/lib/mountains";
import { trailScenes } from "@/lib/scenes";
import { altitudeAt, trailCheckpoints, type Checkpoint } from "@/lib/trail";
import { useInvitation } from "../InvitationContext";
import { Slate, TitleCard } from "../film/Frame";
import { SceneBackdrop } from "../film/SceneBackdrop";

const MERBABU = MOUNTAINS.merbabu;
/** Basecamp Selo, kurang lebih. */
const TRAIL_BASE = 1800;
const CROSSFADE_S = 1.2;

interface HudRefs {
  altitude: RefObject<HTMLSpanElement | null>;
  stop: RefObject<HTMLSpanElement | null>;
  bar: RefObject<HTMLSpanElement | null>;
}

/** HUD altimeter di atas adegan: ketinggian, pos saat ini, dan garis kemajuan menuju puncak. */
function Altimeter({ refs, first }: { refs: HudRefs; first: Checkpoint }) {
  return (
    <div className="absolute inset-x-0 top-0 z-10 px-4 pt-4 sm:px-10 sm:pt-6">
      <div className="glass mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] sm:gap-6 sm:px-6">
        <p className="shrink-0 text-seluloid/55">
          ALT <span ref={refs.altitude} className="ml-1 text-sm tracking-[0.08em] text-seluloid tabular-nums">{formatElevation(TRAIL_BASE)}</span>
        </p>
        <span aria-hidden className="relative h-px flex-1 bg-seluloid/20">
          <span ref={refs.bar} className="absolute inset-0 origin-left scale-x-0 bg-amber" />
        </span>
        <p className="shrink-0 truncate text-amber">
          <span ref={refs.stop}>{first.label}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Our Story — The Trail. Tiap bab kisah adalah satu pos di jalur Selo menuju Kenteng Songo.
 * Latar menempel & berganti (crossfade) di setiap pos; HUD mencatat ketinggian seiring scroll.
 */
export function Story() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const altitudeRef = useRef<HTMLSpanElement>(null);
  const stopRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  useScrollScene(ref);

  const count = content.story.length;
  const scenes = trailScenes(count);
  const checkpoints = trailCheckpoints(count, { base: TRAIL_BASE, summit: MERBABU.elevation, summitName: MERBABU.summit });

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list || count === 0) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const layers = gsap.utils.toArray<HTMLElement>("[data-trail-scene]", ref.current);
      const show = (index: number) => {
        layers.forEach((layer, i) => gsap.to(layer, { autoAlpha: i === index ? 1 : 0, duration: reduce ? 0 : CROSSFADE_S, ease: "power1.inOut", overwrite: true }));
        if (stopRef.current) stopRef.current.textContent = checkpoints[index].label;
      };
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]", list);
      const triggers = [
        ...chapters.map((li, i) =>
          ScrollTrigger.create({ trigger: li, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && show(i) }),
        ),
        ScrollTrigger.create({
          trigger: list,
          start: "top 60%",
          end: "bottom 60%",
          onUpdate: (self) => {
            if (altitudeRef.current) altitudeRef.current.textContent = formatElevation(altitudeAt(self.progress, TRAIL_BASE, MERBABU.elevation));
            gsap.set(barRef.current, { scaleX: self.progress });
          },
        }),
      ];
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: ref, dependencies: [count] },
  );

  if (count === 0) return null;

  return (
    <section ref={ref} aria-labelledby="story-title">
      <div data-zoom-track className="relative">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {scenes.map((id, i) => (
            <div key={`${id}-${i}`} data-trail-scene className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
              <SceneBackdrop scene={id} dim={0.6} zoom={0.1} />
            </div>
          ))}
          <Altimeter refs={{ altitude: altitudeRef, stop: stopRef, bar: barRef }} first={checkpoints[0]} />
        </div>

        <div className="on-photo relative -mt-[100svh]">
          <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 pt-20">
            <div data-reveal="fade" className="flex justify-center">
              <Slate scene={5} mountain="merbabu" />
            </div>
            <TitleCard id="story-title" kicker="Our Story · The Trail" title="Jalur yang kami tempuh" subtitle={`dari ${MERBABU.basecamp} menuju ${MERBABU.summit}`} className="mt-6" />
          </div>

          <ol ref={listRef} className="relative">
            {content.story.map((chapter, i) => {
              const cp = checkpoints[i];
              return (
                <li key={`${chapter.year}-${i}`} data-chapter className={cn("flex min-h-[95svh] items-center px-5 py-16 sm:px-10", i % 2 ? "justify-end" : "justify-start")}>
                  <div data-reveal="up" className="glass w-full max-w-md px-7 py-8 sm:px-9 sm:py-10 md:mx-[6vw]">
                    <div className="flex items-center justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.22em]">
                      <span className={cp.isSummit ? "text-amber" : "text-seluloid/70"}>{cp.isSummit ? `▲ ${cp.label}` : cp.label}</span>
                      <span className="text-seluloid/50">{formatElevation(cp.elevation)}</span>
                    </div>
                    <p className="credit mt-6 text-5xl text-amber">{chapter.year}</p>
                    <h3 className="mt-3 font-display text-[1.75rem] italic leading-snug">{chapter.title}</h3>
                    <p className="mt-4 text-[1.08rem] leading-relaxed text-seluloid/75 [text-wrap:pretty]">{chapter.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

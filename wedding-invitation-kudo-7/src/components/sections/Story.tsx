"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { useInvitation } from "../InvitationContext";
import { Gunungan } from "../three/Gunungan";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * Lelakon (kisah). Satu gunungan besar menempel di samping (sticky) dan diputar perlahan
 * seiring cerita dibaca — seperti dalang yang menandai pergantian babak.
 */
export function Story() {
  const { content } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  if (content.story.length === 0) return null;

  return (
    <section ref={ref} data-twirl-track aria-labelledby="story-title" className="relative bg-kertas px-6 py-28 sm:py-40">
      <SectionHeading id="story-title" label="Lelakon" title="Bagaimana semuanya bermula" />

      <div className="mx-auto mt-16 grid max-w-5xl gap-12 md:mt-24 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
        <div className="md:sticky md:top-[14vh] md:h-[72vh]">
          <div className="flex h-full items-center justify-center [perspective:1100px]">
            <div data-twirl="540" className="preserve-3d">
              <Gunungan size="clamp(9rem,26vw,15rem)" />
            </div>
          </div>
        </div>

        <ol className="relative space-y-10 md:space-y-16 md:py-[8vh]">
          {/* Benang tipis yang menghubungkan babak-babak. */}
          <span aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-transparent via-prada to-transparent md:left-0" />
          {content.story.map((chapter, i) => (
            <li key={`${chapter.year}-${i}`} data-depth={i % 2 ? -24 : 24} className="relative pl-12 md:pl-10">
              <span aria-hidden className="absolute left-[11px] top-9 h-2.5 w-2.5 rotate-45 bg-prada md:-left-[5px]" />
              <div data-reveal="up" className={cn("panel px-7 py-8 sm:px-9", i % 2 && "md:ml-10")}>
                <p className="font-display text-3xl tracking-wider text-prada-deep">{chapter.year}</p>
                <h3 className="mt-2 font-serif text-2xl italic leading-snug">{chapter.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/70 [text-wrap:pretty]">{chapter.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

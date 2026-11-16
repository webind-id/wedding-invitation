"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { LANTERN_VARIANTS } from "@/lib/lanterns";
import { photoAt, photosExcept } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Lantern3D } from "../lantern/Lantern3D";
import { LanternSky } from "../lantern/LanternSky";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

export function Story() {
  const { content, photos } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  if (!content.story || content.story.length === 0) return null;
  const pool = photosExcept(photos, [content.coverPhoto]);

  return (
    <section ref={ref} id="story" aria-labelledby="story-title" className="night-sky-deep relative overflow-hidden px-4 py-20 sm:py-28">
      <LanternSky count={8} seed={77} options={{ maxSize: 30 }} />

      <div className="relative mx-auto max-w-4xl">
        <SectionHeading
          id="story-title"
          badge="Our Love Journey"
          scriptTitle="Kisah Kasih"
          title="Lampion-Lampion Kenangan"
          subtitle="Setiap babak kisah kami ibarat lampion yang kami nyalakan satu per satu, hingga langit kami terang benderang."
        />

        <div className="relative mt-16">
          {/* Tali panjang tempat lampion-lampion kenangan digantung */}
          <div
            aria-hidden
            className="absolute bottom-4 left-5 top-4 w-px -translate-x-1/2 bg-gradient-to-b from-gold/10 via-gold/50 to-gold/10 md:left-1/2"
          />

          <ol className="space-y-16 md:space-y-24">
            {content.story.map((chapter, i) => {
              const isEven = i % 2 === 0;
              return (
                <li
                  key={`${chapter.year}-${i}`}
                  className={cn("relative flex flex-col items-center gap-8 pl-12 md:flex-row md:gap-16 md:pl-0", !isEven && "md:flex-row-reverse")}
                >
                  {/* Lampion penanda tiap babak */}
                  <div aria-hidden className="absolute left-5 top-0 z-10 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                    <Lantern3D size={30} variant={LANTERN_VARIANTS[i % LANTERN_VARIANTS.length]} spin={14 + i * 2} />
                  </div>

                  <div data-reveal="zoom" className="flex w-full justify-center md:w-1/2">
                    <div className="relative aspect-[4/5] w-full max-w-xs rounded-2xl border border-gold/25 bg-night-800 p-2.5 shadow-glow-sm transition-transform duration-500 hover:-rotate-1">
                      <div className="relative h-full w-full overflow-hidden rounded-xl">
                        <Photo src={photoAt(pool, i)} alt={chapter.title} parallax={5} className="h-full w-full" />
                      </div>
                    </div>
                  </div>

                  <div data-reveal="up" className={cn("w-full text-left md:w-1/2", !isEven && "md:text-right")}>
                    <div className="glass-night p-6">
                      <div className={cn("mb-3 flex items-center gap-3", !isEven && "md:justify-end")}>
                        <span className="badge-ember">Babak {String(i + 1).padStart(2, "0")}</span>
                        <span className="font-serif text-lg font-semibold text-gold-light">{chapter.year}</span>
                      </div>
                      <h3 className="mb-2 font-serif text-2xl font-semibold text-moon">{chapter.title}</h3>
                      <p className="text-sm leading-relaxed text-moon-muted [text-wrap:pretty]">{chapter.text}</p>
                    </div>
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

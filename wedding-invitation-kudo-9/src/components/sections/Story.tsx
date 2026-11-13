"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { photoAt, photosExcept } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Flower } from "../three/Flower";
import { Petal } from "../three/Petal";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * Kisah pasangan, berselang-seling: tiap bab punya foto berbingkai kelopak di satu sisi
 * dan teks editorial di sisi lain. Foto & teks di kedalaman berlawanan, dahlia kecil
 * berputar di sambungan antarbab, dan sulur tipis menghubungkan semuanya.
 */
export function Story() {
  const { content, photos } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  if (content.story.length === 0) return null;
  const pool = photosExcept(photos, [content.coverPhoto]);

  return (
    <section ref={ref} aria-labelledby="story-title" className="dusk-paper relative overflow-hidden px-6 py-28 sm:py-40">
      <SectionHeading id="story-title" label="Kisah kami" title="Bagaimana semuanya bermula" />

      <div className="relative mx-auto mt-20 max-w-5xl">
        {/* Sulur tipis di tengah (desktop) / kiri (ponsel). */}
        <span aria-hidden className="absolute bottom-0 left-1/2 top-0 hidden w-px bg-gradient-to-b from-transparent via-sage to-transparent md:block" />

        <ol className="space-y-24 md:space-y-32">
          {content.story.map((chapter, i) => {
            const isFlipped = i % 2 === 1;
            return (
              <li key={`${chapter.year}-${i}`} className="relative grid items-center gap-10 md:grid-cols-2 md:gap-20">
                <div data-depth={isFlipped ? -34 : 34} className={cn("relative", isFlipped && "md:order-2")}>
                  <div data-reveal="zoom" className="drop-shadow-[0_30px_36px_rgba(78,49,89,0.3)]">
                    <Photo
                      src={photoAt(pool, i)}
                      alt={chapter.title}
                      parallax={7}
                      className={cn("mx-auto aspect-[4/5] w-[min(80vw,22rem)]", isFlipped ? "petal-frame-alt" : "petal-frame")}
                    />
                  </div>
                  <div data-depth="60" className={cn("absolute -bottom-6", isFlipped ? "left-2 md:-left-4" : "right-2 md:-right-4")}>
                    <Petal size="2.6rem" rotate={isFlipped ? -40 : 40} tone={isFlipped ? "#F0D1BA" : "#CDBCDD"} />
                  </div>
                </div>

                <div data-depth={isFlipped ? 18 : -18} className={cn("relative text-center", isFlipped ? "md:order-1 md:text-right" : "md:text-left")}>
                  <div data-reveal-group>
                    {/* Tahun besar bergaris luar — lapisan paling belakang teks. */}
                    <p data-reveal-item className="font-display text-[clamp(4.5rem,13vw,7.5rem)] italic leading-none text-transparent [-webkit-text-stroke:1px_#A893C2]">
                      {chapter.year}
                    </p>
                    <h3 data-reveal-item className="-mt-2 font-display text-[clamp(1.6rem,4vw,2.2rem)] italic leading-snug">
                      {chapter.title}
                    </h3>
                    <p data-reveal-item className={cn("mt-4 max-w-md leading-relaxed text-ink/70 [text-wrap:pretty] max-md:mx-auto", isFlipped && "md:ml-auto")}>
                      {chapter.text}
                    </p>
                  </div>
                </div>

                {i < content.story.length - 1 && (
                  <div aria-hidden className="pointer-events-none absolute -bottom-20 left-1/2 hidden -translate-x-1/2 md:-bottom-24 md:block">
                    <div className="[perspective:800px]">
                      <div data-spin={isFlipped ? -140 : 140} className="preserve-3d">
                        <Flower kind="dahlia" palette={isFlipped ? "lilac" : "plum"} size="4rem" seed={30 + i} rings={4} tilt={16} />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

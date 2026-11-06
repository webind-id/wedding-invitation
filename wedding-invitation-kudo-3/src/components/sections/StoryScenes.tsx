"use client";

import { cn } from "@/lib/cn";
import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { ChapterHeading } from "../ui/ChapterHeading";
import { Reveal } from "../ui/Reveal";
import { Scene } from "../ui/Scene";

/**
 * Inti scrollytelling: setiap bab kisah adalah satu scene penuh layar.
 * Saat bab melintas, panggung berganti ke foto bab itu dengan crossfade lambat.
 */
export function StoryScenes() {
  const { content, photos } = useInvitation();
  if (content.story.length === 0) return null;

  return (
    <>
      <Scene chapter="kisah" photo={photoAt(photos, 6)} anchor label="Kisah" fullscreen={false} className="flex min-h-[70svh] items-end">
        <div className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10">
          <ChapterHeading chapter="kisah">
            Sebelum <em>hari ini</em>
          </ChapterHeading>
        </div>
      </Scene>

      {content.story.map((chapter, i) => {
        const isRight = i % 2 === 1;
        return (
          <Scene
            key={`${chapter.year}-${i}`}
            chapter="kisah"
            photo={photoAt(photos, 7 + i)}
            label={chapter.title}
            className="flex items-end"
          >
            <div className={cn("mx-auto flex w-full max-w-6xl px-6 pb-32 sm:px-10 sm:pb-40", isRight && "justify-end")}>
              <div className={cn("max-w-lg", isRight && "text-right")}>
                <Reveal effect="fade">
                  <p aria-hidden className="subtitle font-serif text-[clamp(4.5rem,14vw,8rem)] italic leading-none text-cream/25">
                    {chapter.year}
                  </p>
                </Reveal>
                <Reveal delay={0.25}>
                  <h3 className="subtitle -mt-6 font-serif text-4xl leading-tight sm:-mt-10 sm:text-5xl">{chapter.title}</h3>
                </Reveal>
                <Reveal delay={0.5} effect="fade">
                  <p className="subtitle mt-5 text-base leading-relaxed text-cream/80">{chapter.text}</p>
                </Reveal>
              </div>
            </div>
          </Scene>
        );
      })}
    </>
  );
}

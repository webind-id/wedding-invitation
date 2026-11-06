"use client";

import { Fragment } from "react";
import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Figure } from "../ui/Figure";
import { Opener } from "../ui/Opener";
import { Reveal } from "../ui/Reveal";

const FIRST_FIGURE = 4;

/**
 * Kisah sebagai artikel utama majalah: teks dua kolom dengan drop cap,
 * subjudul per bab (tahun dalam huruf kapital kecil), pull quote dari judul
 * bab tengah, dan foto berketerangan yang diselipkan di antara bab.
 */
export function FeatureStory() {
  const { content, pair, photos } = useInvitation();
  const { story } = content;
  if (story.length === 0) return null;

  const [first, second] = pair;
  const quoteAt = Math.floor(story.length / 2);

  return (
    <section id="kisah" data-rubric="kisah" aria-labelledby="kisah-title" className="mx-auto max-w-7xl px-5 py-20 sm:px-10 sm:py-28">
      <Opener
        id="kisah"
        titleId="kisah-title"
        deck={`Dari ${story[0].year} hingga hari ini — bagaimana ${first.nickname} dan ${second.nickname} menemukan jalan pulang satu sama lain.`}
      >
        Sebelum kata <em>“bersedia”</em>
      </Opener>

      <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Figure
          src={photoAt(photos, 4)}
          alt=""
          number={FIRST_FIGURE}
          caption={`${first.nickname} & ${second.nickname}, ${story.at(-1)!.year}.`}
          frameClassName="aspect-[3/4]"
          className="lg:sticky lg:top-20 lg:col-span-4 lg:self-start"
        />

        <div className="article lg:col-span-7 lg:col-start-6 lg:columns-2 lg:gap-10">
          {story.map((chapter, i) => (
            <Fragment key={`${chapter.year}-${i}`}>
              {i === quoteAt && story.length > 2 && (
                <Reveal as="article" className="my-10 break-inside-avoid border-y border-ink py-6 [column-span:all]">
                  <p className="font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] font-light italic leading-tight text-ink">“{chapter.title}.”</p>
                </Reveal>
              )}
              <Reveal className="break-inside-avoid pb-6">
                <p className="rubric mb-2 indent-0 text-gold">{chapter.year}</p>
                <h3 className="mb-2 font-serif text-xl font-medium text-ink">{chapter.title}</h3>
                <p className={i === 0 ? "drop-cap" : undefined}>{chapter.text}</p>
              </Reveal>
              {i === 1 && story.length > 3 && (
                <Figure
                  src={photoAt(photos, 5)}
                  alt=""
                  number={FIRST_FIGURE + 1}
                  frameClassName="aspect-[4/3]"
                  className="mb-8 break-inside-avoid"
                />
              )}
            </Fragment>
          ))}
          <p className="pb-2 font-serif text-lg italic">■</p>
        </div>
      </div>
    </section>
  );
}

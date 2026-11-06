"use client";

import { issueLabel } from "@/lib/issue";
import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Figure } from "../ui/Figure";
import { Opener } from "../ui/Opener";
import { Reveal } from "../ui/Reveal";

/** Kredit pembuat — milik template, bukan konten undangan. */
const CREDIT = "KudoStack";

/** Sampul belakang: foto besar, pesan penutup, dan kolofon (kredit penerbitan) edisi. */
export function Colophon() {
  const { content, pair, photos } = useInvitation();
  const [first, second] = pair;
  const venues = Array.from(new Set(content.events.map((e) => e.venue)));

  const credits: [string, string][] = [
    ["Mempelai", `${first.fullName} & ${second.fullName}`],
    [`Keluarga ${first.nickname}`, `${first.father} & ${first.mother}`],
    [`Keluarga ${second.nickname}`, `${second.father} & ${second.mother}`],
    ["Lokasi", venues.join(" · ")],
    ["Edisi", issueLabel(content.events[0].start, content.timeZone)],
    ["Desain undangan", CREDIT],
  ];

  return (
    <footer id="kolofon" data-rubric="kolofon" aria-labelledby="kolofon-title" className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-10 sm:pt-28">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Figure
          src={content.coverPhoto || photoAt(photos, 0)}
          alt=""
          frameClassName="aspect-[4/5]"
          className="lg:col-span-6"
        />
        <div className="flex flex-col lg:col-span-5 lg:col-start-8">
          <Opener id="kolofon" titleId="kolofon-title">
            Sampai <em>jumpa</em>
          </Opener>
          {content.closing.message && (
            <Reveal className="mt-8">
              <p className="font-serif text-2xl font-light leading-snug text-balance">{content.closing.message}</p>
            </Reveal>
          )}
          <Reveal className="mt-8">
            {content.closing.signature && <p className="font-serif italic text-stone">{content.closing.signature},</p>}
            <p className="mt-1 font-serif text-[clamp(2.6rem,5vw,3.8rem)] font-light leading-none tracking-[-0.03em]">
              {first.nickname} <span className="italic text-gold">&amp;</span> {second.nickname}
            </p>
          </Reveal>

          <Reveal className="mt-auto pt-14">
            <p className="rubric border-b border-ink pb-3 text-ink">Kolofon</p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              {credits.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="rubric pt-0.5">{k}</dt>
                  <dd className="font-serif text-ink/80">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
      <div className="rule mt-16 flex justify-between pt-3 font-serif text-sm italic text-stone">
        <span>
          {first.nickname} &amp; {second.nickname}
        </span>
        <span>— Tamat edisi —</span>
      </div>
    </footer>
  );
}

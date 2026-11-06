"use client";

import { dateInWords, timeInWords } from "@/lib/words";
import { useInvitation } from "../InvitationContext";
import { Crest, EngravedCard, Fleuron } from "../ui/Ornaments";
import { Reveal } from "../ui/Reveal";

/**
 * Kartu undangan resmi bercetak: kedua orang tua "dengan hormat mengundang"
 * nama tamu, nama mempelai, lalu tanggal & jam yang ditulis dengan kata-kata.
 */
export function FormalCard({ guestName }: { guestName: string }) {
  const { content, pair, monogram } = useInvitation();
  const [first, second] = pair;
  const premiere = content.events[0];
  const { verse } = content;

  return (
    <section aria-labelledby="undangan-title" className="px-4 pb-20 pt-16 sm:pb-28 sm:pt-24">
      <Reveal className="mx-auto max-w-2xl">
        <EngravedCard innerClassName="text-center">
          <Crest monogram={monogram} className="w-32" />
          <p className="smallcaps mt-8 text-burgundy">Dengan memohon rahmat Allah SWT</p>

          <p className="mt-8 font-serif text-xl leading-relaxed text-ink sm:text-2xl">
            <span className="whitespace-nowrap">{first.father}</span> <span className="italic text-umber">&amp;</span>{" "}
            <span className="whitespace-nowrap">{first.mother}</span>
          </p>
          <p className="my-1 font-fell italic text-umber">bersama</p>
          <p className="font-serif text-xl leading-relaxed text-ink sm:text-2xl">
            <span className="whitespace-nowrap">{second.father}</span> <span className="italic text-umber">&amp;</span>{" "}
            <span className="whitespace-nowrap">{second.mother}</span>
          </p>

          <p className="mt-6 font-fell italic text-umber">dengan hormat mengundang</p>
          <p className="mt-2 font-fell text-3xl italic text-wine">{guestName}</p>
          <p className="mt-2 font-fell italic text-umber">untuk menghadiri pernikahan putra-putri kami</p>

          <h1 id="undangan-title" className="mt-8 font-fell text-[clamp(2.4rem,7vw,3.6rem)] leading-[1.05] text-burgundy">
            {first.fullName}
            <span className="block py-2 text-[0.55em] italic text-umber">dengan</span>
            {second.fullName}
          </h1>

          <Fleuron className="mt-8" />

          <p className="mt-6 font-serif text-xl italic text-ink first-letter:uppercase">{dateInWords(premiere.start, content.timeZone)}</p>
          <p className="mt-1 font-serif text-lg italic text-umber">{timeInWords(premiere.start, content.timeZone)}</p>
          <p className="smallcaps mt-5 text-burgundy">{premiere.venue}</p>
          <p className="mx-auto mt-1 max-w-sm font-serif text-umber">{premiere.address}</p>
        </EngravedCard>
      </Reveal>

      {(verse.arabic || verse.translation) && (
        <Reveal className="mx-auto mt-16 max-w-xl text-center">
          {verse.arabic && (
            <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-[2.1] text-bottle sm:text-[1.7rem]">
              {verse.arabic}
            </p>
          )}
          {verse.translation && <p className="mt-6 font-serif text-lg italic leading-relaxed text-umber">“{verse.translation}”</p>}
          {verse.source && <p className="smallcaps mt-4 text-sm">{verse.source}</p>}
        </Reveal>
      )}
    </section>
  );
}

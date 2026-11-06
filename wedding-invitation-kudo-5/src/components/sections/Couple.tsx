"use client";

import { photoAt } from "@/lib/photos";
import type { Person } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Cameo, SectionTitle } from "../ui/Frames";
import { Reveal } from "../ui/Reveal";

function Portrait({ person, role, photo, delay }: { person: Person; role: string; photo: string; delay: number }) {
  return (
    <Reveal delay={delay} className="text-center">
      <Cameo src={photo} alt={person.fullName} />
      <p className="smallcaps mt-8">{role}</p>
      <h3 className="mt-2 font-fell text-[2.1rem] leading-tight text-burgundy">{person.fullName}</h3>
      {person.title && <p className="font-fell text-lg italic text-umber">{person.title}</p>}
      <p className="mx-auto mt-4 max-w-xs font-serif text-lg leading-relaxed text-ink/85">
        {person.childOrder}
        <br />
        <span className="italic">
          {person.father} &amp; {person.mother}
        </span>
      </p>
      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="smallcaps mt-4 inline-block border-b border-burgundy/40 text-sm text-burgundy transition hover:border-burgundy"
        >
          @{person.instagram}
        </a>
      )}
    </Reveal>
  );
}

/** Kedua mempelai sebagai potret kameo oval berdampingan. */
export function Couple() {
  const { content, pair, photos } = useInvitation();
  const [first, second] = pair;
  const roleOf = (p: Person) => (p === content.bride ? "Mempelai wanita" : "Mempelai pria");

  return (
    <section id="mempelai" aria-labelledby="mempelai-title" className="border-y border-burgundy/20 bg-parchment/50 px-4 py-20 sm:py-28">
      <SectionTitle label="Kedua mempelai" id="mempelai-title">
        Dua Hati, Satu Ikatan
      </SectionTitle>
      {content.invitationIntro && (
        <Reveal className="mx-auto mt-8 max-w-xl text-center font-serif text-lg italic leading-relaxed text-umber">
          <p>{content.invitationIntro}</p>
        </Reveal>
      )}
      <div className="mx-auto mt-14 grid max-w-4xl items-start gap-16 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        <Portrait person={first} role={roleOf(first)} photo={first.photo || photoAt(photos, 2)} delay={0} />
        <p aria-hidden className="self-center text-center font-fell text-7xl italic text-burgundy/50 md:pt-24">
          &amp;
        </p>
        <Portrait person={second} role={roleOf(second)} photo={second.photo || photoAt(photos, 3)} delay={0.15} />
      </div>
    </section>
  );
}

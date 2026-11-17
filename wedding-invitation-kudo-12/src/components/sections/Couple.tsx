"use client";

import { AtSign, MapPin } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { type Person, withHonorific } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { MelatiCorners, ParangEdges } from "../jawa/Ornaments";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

function PersonCard({ person }: { person: Person }) {
  const handle = person.instagram.replace(/^@/, "");
  return (
    <article data-reveal="zoom">
      <div className="arch h-[270px] w-[200px]">
        <div className="arch-in">
          <Photo src={person.photo} alt={person.fullName} parallax={4} className="h-full w-full" />
        </div>
        <MelatiCorners />
      </div>

      <h3 className="mt-5 font-script text-[52px] font-normal leading-none text-sogan-700">{person.nickname}</h3>
      <p className="mt-2 font-display text-base font-medium tracking-[1.5px] text-sogan-800">
        {person.title ? `${person.fullName}, ${person.title}` : person.fullName}
      </p>
      {(person.childOrder || person.father || person.mother) && (
        <p className="small-ui mb-3.5 mt-1.5">
          {person.childOrder && (
            <>
              {person.childOrder}
              <br />
            </>
          )}
          {withHonorific(person.father, "Bapak")} &amp; {withHonorific(person.mother, "Ibu")}
        </p>
      )}
      {person.address && (
        <p className="small-ui -mt-1.5 mb-3.5 inline-flex items-start gap-1.5">
          <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden />
          <span>{person.address}</span>
        </p>
      )}
      {handle && (
        <div>
          <a href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer" className="btn-sogan normal-case tracking-normal">
            <AtSign className="h-[15px] w-[15px]" aria-hidden />
            {handle}
          </a>
        </div>
      )}
    </article>
  );
}

export function Couple() {
  const { pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    <section ref={ref} id="mempelai" aria-labelledby="mempelai-title" className="sec kawung-bg bg-cream-100">
      <ParangEdges />
      <SectionHeading id="mempelai-title" title="Sang Mempelai" variant="display" />
      <PersonCard person={pair[0]} />
      <p data-reveal="up" aria-hidden className="mb-5 mt-[34px] font-serif text-[80px] italic leading-none text-blush-deep">
        &amp;
      </p>
      <PersonCard person={pair[1]} />
    </section>
  );
}

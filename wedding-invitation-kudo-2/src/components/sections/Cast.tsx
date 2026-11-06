"use client";

import { AtSign } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Person } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { Photo } from "../ui/Photo";
import { Reveal } from "../ui/Reveal";
import { Title } from "../ui/Title";

function CastCard({ person, role, offset }: { person: Person; role: string; offset: boolean }) {
  return (
    <Reveal as="article" className={cn("group", offset && "lg:mt-28")}>
      <div className="gold-frame">
        <Photo
          src={person.photo}
          alt={person.fullName}
          className="aspect-[3/4]"
          imgClassName="grayscale-[35%] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
        />
        <span className="absolute bottom-0 left-0 z-10 bg-void/80 px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.3em] text-gold backdrop-blur">
          {role}
        </span>
      </div>
      <h3 className="mt-8 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-tight">
        {person.fullName}
        {person.title && <span className="ml-2 align-middle font-sans text-xs tracking-[0.2em] text-gold">{person.title}</span>}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-smoke">
        {person.childOrder} <span className="text-ivory/85">{person.father}</span> &amp;{" "}
        <span className="text-ivory/85">{person.mother}</span>
      </p>
      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-gold/80 underline-offset-8 hover:text-gold hover:underline"
        >
          <AtSign className="h-3.5 w-3.5" aria-hidden />
          {person.instagram}
        </a>
      )}
    </Reveal>
  );
}

export function Cast() {
  const { content, pair } = useInvitation();
  const [first, second] = pair;
  const roleOf = (p: Person) => (p === content.bride ? "Pemeran utama wanita" : "Pemeran utama pria");

  return (
    <section id="pemeran" aria-labelledby="pemeran-title" className="film-grain">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Title reel="01" label="Pemeran utama" id="pemeran-title">
          Dua nama, <em className="text-gold">satu kisah</em>
        </Title>

        <div className="relative mt-16 grid gap-16 sm:grid-cols-2 sm:gap-10 lg:gap-24">
          <CastCard person={first} role={roleOf(first)} offset={false} />
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/3 hidden -translate-x-1/2 font-display text-[11rem] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,166,107,0.35)] sm:block"
          >
            &amp;
          </span>
          <CastCard person={second} role={roleOf(second)} offset />
        </div>
      </div>
    </section>
  );
}

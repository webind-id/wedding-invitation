"use client";

import { AtSign } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Person } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { FadeIn } from "../ui/FadeIn";
import { Heading } from "../ui/Heading";
import { Picture } from "../ui/Picture";

function PersonCard({ person, align }: { person: Person; align: "left" | "right" }) {
  const isRight = align === "right";
  return (
    <FadeIn className={cn("flex items-end gap-5", isRight && "flex-row-reverse text-right")}>
      <Picture
        src={person.photo}
        alt={person.fullName}
        className="aspect-[3/4] w-[44%] shrink-0 rounded-arch ring-1 ring-forest/10 ring-offset-4 ring-offset-linen"
      />
      <div className="min-w-0 pb-2">
        <h3 className="font-display text-[1.7rem] italic leading-tight text-forest">{person.fullName}</h3>
        {person.title && <p className="mt-0.5 text-xs font-semibold text-clay">{person.title}</p>}
        <p className="mt-3 text-xs leading-relaxed text-bark/70">
          {person.childOrder}
          <br />
          <span className="font-semibold text-bark">{person.father}</span>
          <br />& <span className="font-semibold text-bark">{person.mother}</span>
        </p>
        {person.instagram && (
          <a
            href={`https://instagram.com/${person.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-moss underline-offset-4 hover:text-clay hover:underline"
          >
            <AtSign className="h-3.5 w-3.5" aria-hidden />
            {person.instagram}
          </a>
        )}
      </div>
    </FadeIn>
  );
}

export function Couple() {
  const { content, pair } = useInvitation();
  const [first, second] = pair;
  return (
    <section id="mempelai" aria-labelledby="mempelai-title" className="grain px-6 py-20">
      <Heading eyebrow="Mempelai" id="mempelai-title">
        Dua hati, satu janji
      </Heading>
      <FadeIn className="mx-auto mt-5 max-w-xs text-center text-sm leading-relaxed text-bark/70">
        <p>{content.invitationIntro}</p>
      </FadeIn>

      <div className="mt-12 space-y-4">
        <PersonCard person={first} align="left" />
        <p aria-hidden className="text-center font-display text-7xl font-light italic leading-none text-clay/80">
          &amp;
        </p>
        <PersonCard person={second} align="right" />
      </div>
    </section>
  );
}

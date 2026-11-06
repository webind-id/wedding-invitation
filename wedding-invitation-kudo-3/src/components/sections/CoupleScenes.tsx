"use client";

import { AtSign } from "lucide-react";
import { cn } from "@/lib/cn";
import { photoAt } from "@/lib/photos";
import type { Person } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { ChapterHeading } from "../ui/ChapterHeading";
import { Reveal } from "../ui/Reveal";
import { Scene } from "../ui/Scene";

function PersonScene({ person, role, photo, side, isFirst }: { person: Person; role: string; photo: string; side: "left" | "right"; isFirst: boolean }) {
  const isRight = side === "right";
  return (
    <Scene chapter="mempelai" photo={photo} anchor={isFirst} label={person.fullName} className="flex items-end">
      <div className={cn("mx-auto flex w-full max-w-6xl px-6 pb-32 sm:px-10 sm:pb-36", isRight && "justify-end")}>
        <div className={cn("max-w-xl", isRight && "text-right")}>
          {isFirst ? (
            <ChapterHeading chapter="mempelai" align="left" className={cn(isRight && "text-right")}>
              {person.nickname}
            </ChapterHeading>
          ) : (
            <Reveal>
              <p className="kicker">{role}</p>
              <h2 className="subtitle mt-4 font-serif text-[clamp(2.6rem,7vw,5.25rem)] leading-[0.95]">{person.nickname}</h2>
            </Reveal>
          )}
          <Reveal delay={0.25}>
            <p className="subtitle mt-6 font-serif text-2xl italic text-cream/90 sm:text-3xl">
              {person.fullName}
              {person.title && <span className="not-italic text-cream/60">, {person.title}</span>}
            </p>
            <p className="subtitle mt-4 text-sm leading-relaxed text-cream/70">
              {person.childOrder}
              <br />
              {person.father} &amp; {person.mother}
            </p>
            {person.instagram && (
              <a
                href={`https://instagram.com/${person.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.25em] text-cream/70 underline-offset-8 transition duration-500 hover:text-cream hover:underline"
              >
                <AtSign className="h-3.5 w-3.5" aria-hidden />
                {person.instagram}
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </Scene>
  );
}

/** Dua scene penuh: satu untuk tiap mempelai, foto masing-masing menjadi panggung. */
export function CoupleScenes() {
  const { content, pair, photos } = useInvitation();
  const [first, second] = pair;
  const roleOf = (p: Person) => (p === content.bride ? "Mempelai wanita" : "Mempelai pria");

  return (
    <>
      <PersonScene person={first} role={roleOf(first)} photo={first.photo || photoAt(photos, 2)} side="left" isFirst />
      <PersonScene person={second} role={roleOf(second)} photo={second.photo || photoAt(photos, 3)} side="right" isFirst={false} />
    </>
  );
}

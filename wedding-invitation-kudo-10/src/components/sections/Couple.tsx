"use client";

import { AtSign, Heart, MapPin } from "lucide-react";
import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { type Person, withHonorific } from "@/shared/contract";
import { useInvitation } from "../InvitationContext";
import { DriedPalm } from "../rustic/DriedPalm";
import { EucalyptusStem } from "../rustic/EucalyptusStem";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

function RusticPortraitCard({
  person,
  roleBadge,
  accentColor,
}: {
  person: Person;
  roleBadge: string;
  accentColor: "terracotta" | "olive";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  useTilt(cardRef, 5);

  const isTerracotta = accentColor === "terracotta";

  return (
    <article
      ref={cardRef}
      data-reveal="zoom"
      className="rustic-card flex flex-col items-center p-6 sm:p-8 text-center bg-white/95 border border-sand-deep/60 transition-all hover:shadow-rustic-lg"
    >
      <div className="mb-4">
        <span className={isTerracotta ? "badge-terracotta" : "badge-olive"}>
          {roleBadge}
        </span>
      </div>

      {/* Frame Foto Lengkung Bohemian (Arch Frame) */}
      <div className="boho-arch-frame relative mb-5 w-44 sm:w-52 aspect-[4/5] p-2 bg-cream-50">
        <div className="boho-arch-inner relative h-full w-full">
          <Photo
            src={person.photo}
            alt={person.fullName}
            parallax={4}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <p className="font-script text-4xl sm:text-5xl text-terracotta my-1">
        {person.nickname}
      </p>

      <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-earth-ink">
        {person.title ? `${person.fullName}, ${person.title}` : person.fullName}
      </h3>

      {/* Keterangan Orang Tua */}
      {(person.childOrder || person.father || person.mother) && (
        <div className="mt-4 border-t border-dashed border-sand-deep/60 pt-3 text-xs sm:text-sm text-earth-muted leading-relaxed max-w-xs">
          {person.childOrder && <p className="font-medium text-earth-ink">{person.childOrder}</p>}
          {(person.father || person.mother) && (
            <p className="mt-1">
              {withHonorific(person.father, "Bapak")} &amp; {withHonorific(person.mother, "Ibu")}
            </p>
          )}
        </div>
      )}

      {/* Alamat Mempelai */}
      {person.address && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm text-earth-muted">
          <MapPin className="h-3.5 w-3.5 text-terracotta shrink-0" aria-hidden />
          <span>{person.address}</span>
        </p>
      )}

      {/* Akun Instagram */}
      {person.instagram && (
        <div className="mt-5">
          <a
            href={`https://instagram.com/${person.instagram.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-rustic-ghost text-xs px-4 py-2"
          >
            <AtSign className="h-3.5 w-3.5 text-terracotta" aria-hidden />
            <span>{person.instagram.startsWith("@") ? person.instagram : `@${person.instagram}`}</span>
          </a>
        </div>
      )}
    </article>
  );
}

export function Couple() {
  const { content, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  const isBrideFirst = content.headlineOrder === "bride-first";
  const firstRole = isBrideFirst ? "THE BRIDE" : "THE GROOM";
  const secondRole = isBrideFirst ? "THE GROOM" : "THE BRIDE";

  return (
    <section
      ref={ref}
      id="couple"
      aria-label="Profil Mempelai"
      className="rustic-paper relative overflow-hidden px-4 py-20 sm:py-28"
    >
      {/* ── Ornamen Daun Kering Parallax Latar (Tepian Aman) ─────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div data-depth="35" className="absolute -left-8 top-[12%] animate-sway-slow opacity-65">
          <DriedPalm size={150} color="#C86D51" opacity={0.5} />
        </div>
        <div data-depth="-35" className="absolute -right-8 bottom-[10%] animate-sway-reverse opacity-65">
          <EucalyptusStem size={140} color="#6B7A5C" opacity={0.55} mirror />
        </div>
      </div>
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          badge="THE HAPPY COUPLE"
          scriptTitle="Mempelai"
          title="Pengantin Pria &amp; Wanita"
          subtitle="Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon ridho-Nya, kami bermaksud melangsungkan pernikahan kami."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mt-8 items-stretch">
          <RusticPortraitCard
            person={pair[0]}
            roleBadge={firstRole}
            accentColor={isBrideFirst ? "terracotta" : "olive"}
          />
          <RusticPortraitCard
            person={pair[1]}
            roleBadge={secondRole}
            accentColor={isBrideFirst ? "olive" : "terracotta"}
          />
        </div>
      </div>
    </section>
  );
}

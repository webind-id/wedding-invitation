"use client";

import { Sparkles } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { formatLongDate } from "@/lib/datetime";
import { LANTERN_VARIANTS, seededRandom, type LanternVariant } from "@/lib/lanterns";
import { useInvitation } from "../InvitationContext";
import { Lantern3D } from "../lantern/Lantern3D";
import { LanternDivider } from "../lantern/LanternDivider";
import { LanternSky } from "../lantern/LanternSky";
import { Photo } from "../ui/Photo";
import { CREDIT } from "@/shared/credit";

interface Wish {
  id: number;
  x: number;
  variant: LanternVariant;
}

const MAX_WISHES = 12;

export function Closing() {
  const { content, coupleLabel, monogram, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  const counter = useRef(0);
  const rand = useRef(seededRandom(2027));
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [released, setReleased] = useState(0);
  useScrollScene(ref);

  const photo = content.posterPhoto || content.coverPhoto;
  const dateStr = content.events[0] ? formatLongDate(content.events[0].start, content.timeZone) : "";

  function releaseWish() {
    const id = ++counter.current;
    const r = rand.current;
    const wish: Wish = { id, x: Math.round((r() - 0.5) * 220), variant: LANTERN_VARIANTS[Math.floor(r() * LANTERN_VARIANTS.length)] };
    setWishes((list) => [...list.slice(-(MAX_WISHES - 1)), wish]);
    setReleased((n) => n + 1);
  }

  return (
    <section ref={ref} id="closing" aria-labelledby="closing-title" className="night-sky-deep relative px-4 py-24 text-center sm:py-36">
      <LanternSky count={10} seed={13} options={{ maxSize: 36 }} />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center">
        <div data-reveal="zoom" className="relative mb-10 mt-8 w-48 sm:w-56">
          <div aria-hidden className="absolute -top-16 left-1/2 z-10 -translate-x-1/2">
            <Lantern3D size={60} variant="amber" spin={18} label={monogram} />
          </div>
          <div className="lantern-frame">
            <div className="lantern-frame-inner aspect-[4/5] w-full">
              <Photo src={photo} alt={coupleLabel} parallax={5} className="h-full w-full" />
            </div>
          </div>
        </div>

        <div data-reveal="up" className="max-w-lg">
          <p className="text-glow mb-1 font-script text-5xl text-ember-300">Terima Kasih</p>
          <h2 id="closing-title" className="font-serif text-3xl font-semibold text-moon sm:text-4xl">
            Sampai Jumpa di Malam Bahagia
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-moon-muted [text-wrap:pretty] sm:text-base">
            {content.closing?.message ||
              "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restu Anda, kami ucapkan terima kasih."}
          </p>
          <LanternDivider className="mt-4" />
        </div>

        <div data-reveal="up" className="mt-4 w-full max-w-md">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-moon-subtle">Kami yang berbahagia,</p>
          <p className="text-glow my-3 font-script text-5xl text-ember-200 sm:text-6xl">
            {pair[0].nickname} <span className="font-serif italic">&amp;</span> {pair[1].nickname}
          </p>
          {dateStr && <p className="font-serif text-sm text-moon-muted">{dateStr}</p>}
        </div>

        {/* Lampion harapan: tiap ketukan menerbangkan satu lampion ke langit */}
        <div data-reveal="up" className="relative mt-12 flex flex-col items-center">
          <div aria-hidden className="pointer-events-none absolute bottom-full left-1/2 z-30 h-0 w-0">
            {wishes.map((w) => (
              <div
                key={w.id}
                className="animate-wish absolute -translate-x-1/2"
                style={{ "--wish-x": `${w.x}px` } as CSSProperties}
                onAnimationEnd={() => setWishes((list) => list.filter((item) => item.id !== w.id))}
              >
                <Lantern3D size={40} variant={w.variant} spin={10} />
              </div>
            ))}
          </div>

          <button type="button" onClick={releaseWish} className="btn-ember">
            <Sparkles className="h-4 w-4" aria-hidden />
            <span>Terbangkan Lampion Harapan</span>
          </button>
          <p className="mt-3 text-xs text-moon-subtle" aria-live="polite">
            {released === 0
              ? "Ketuk untuk menerbangkan doa Anda bersama kami"
              : `${released} lampion harapan telah Anda terbangkan ✦`}
          </p>
        </div>
        <p className="mt-14 text-[0.7rem] tracking-[0.08em] text-moon-subtle">
          Dibuat oleh{" "}
          <a href={CREDIT.siteUrl} target="_blank" rel="noopener noreferrer" className="inline-block py-1 underline underline-offset-4 transition text-gold-light decoration-gold-light/40 hover:text-moon hover:decoration-moon">
            {CREDIT.site}
          </a>
          <span aria-hidden="true"> · </span>
          <a href={CREDIT.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${CREDIT.instagram}`} className="inline-block py-1 underline underline-offset-4 transition text-gold-light decoration-gold-light/40 hover:text-moon hover:decoration-moon">
            {CREDIT.instagram}
          </a>
        </p>
      </div>
    </section>
  );
}

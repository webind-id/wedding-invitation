"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { formatDotDate } from "@/lib/datetime";
import { formatCoordinate, formatElevation, MOUNTAINS } from "@/lib/mountains";
import { photoCredits } from "@/lib/scenes";
import { useInvitation } from "../InvitationContext";
import { Letterbox, Slate } from "../film/Frame";
import { SceneBackdrop } from "../film/SceneBackdrop";

const SLAMET = MOUNTAINS.slamet;
const CREDITS = photoCredits();

function CreditBlock({ role, children }: { role: string; children: React.ReactNode }) {
  return (
    <div data-reveal="up" className="text-center">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-seluloid/45">{role}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/**
 * Final Chapter — See You at the Summit. Malam di bawah Bima Sakti, lalu end credits:
 * pasangan, keluarga, lokasi, dan kredit para fotografer gunung (wajib menurut CC BY-SA).
 */
export function Closing() {
  const { content, coupleLabel, monogram, pair } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);
  const first = content.events[0];

  return (
    <section ref={ref} aria-labelledby="closing-title" className="bg-film">
      <div data-zoom-track className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <SceneBackdrop scene="night" dim={0.35} zoom={0.16} />
        <Letterbox />
        <div className="on-photo relative z-10 my-auto px-6 py-[14svh] text-center">
          <div data-reveal="fade" className="flex justify-center">
            <Slate scene={10} />
          </div>
          <p data-reveal="fade" className="label mt-6">
            Final Chapter
          </p>
          <h2 id="closing-title" data-reveal="up" className="mt-6">
            <span className="credit block text-[clamp(2.8rem,12vw,7rem)] leading-none">See You</span>
            <span className="mt-2 block font-display text-[clamp(1.9rem,7vw,3.8rem)] italic text-amber">at the summit.</span>
          </h2>
          {content.closing.message && (
            <p data-reveal="up" className="mx-auto mt-8 max-w-xl text-[1.15rem] leading-relaxed text-seluloid/80 [text-wrap:pretty]">
              {content.closing.message}
            </p>
          )}
        </div>
      </div>

      {/* End credits */}
      <footer className="px-6 pb-20 pt-24 sm:pt-32">
        <div className="mx-auto max-w-xl space-y-14">
          <CreditBlock role={content.closing.signature || "Kami yang berbahagia"}>
            <p className="credit text-[clamp(2rem,8vw,3.4rem)] leading-tight">{coupleLabel}</p>
          </CreditBlock>

          <CreditBlock role="Dengan restu">
            {pair.map((p) => (
              <p key={p.fullName} className="font-display text-xl leading-relaxed text-seluloid/85">
                Keluarga {p.father} &amp; {p.mother}
              </p>
            ))}
          </CreditBlock>

          <CreditBlock role="Lokasi">
            <p className="font-display text-xl text-seluloid/85">{first.venue}</p>
            <p className="text-seluloid/55">{first.address}</p>
          </CreditBlock>

          <CreditBlock role="Foto gunung">
            <ul className="space-y-1.5 text-[0.95rem] text-seluloid/60">
              {CREDITS.map((c) => (
                <li key={c.source}>
                  <a href={c.source} target="_blank" rel="noopener noreferrer" className="transition hover:text-amber">
                    {c.mountain ? MOUNTAINS[c.mountain].name : "Bima Sakti"} — {c.artist}
                    <span className="ml-2 font-mono text-[0.56rem] tracking-[0.12em] text-seluloid/35">{c.license}</span>
                  </a>
                </li>
              ))}
            </ul>
          </CreditBlock>

          <div data-reveal="fade" className="pt-6 text-center">
            <p className="font-display text-4xl italic text-amber">{monogram}</p>
            <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-seluloid/45">
              {formatDotDate(first.start, content.timeZone)} · {SLAMET.summit} {formatElevation(SLAMET.elevation)}
            </p>
            <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.3em] text-seluloid/30">{formatCoordinate(SLAMET.lat, SLAMET.lon)}</p>
            <p className="mt-10 font-display text-lg italic text-seluloid/40">— Tamat —</p>
          </div>
        </div>
      </footer>
    </section>
  );
}

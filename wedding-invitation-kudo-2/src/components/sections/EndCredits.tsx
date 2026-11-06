"use client";

import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { Photo } from "../ui/Photo";
import { Reveal } from "../ui/Reveal";

/** Kredit pembuat — milik template, bukan konten undangan. */
const CREDIT = "KudoStack";

interface CreditLine {
  role: string;
  names: string[];
}

/** Penutup: kredit bergulir seperti akhir film, lalu pesan & nama pasangan. */
export function EndCredits() {
  const { content, pair, photos } = useInvitation();
  const [first, second] = pair;
  const venues = Array.from(new Set(content.events.map((e) => e.venue)));

  const lines: CreditLine[] = [
    { role: "Pemeran utama", names: [first.fullName, second.fullName] },
    { role: `Keluarga ${first.nickname}`, names: [first.father, first.mother] },
    { role: `Keluarga ${second.nickname}`, names: [second.father, second.mother] },
    ...content.events.map((e) => ({ role: e.name, names: [e.venue] })),
    { role: "Lokasi", names: venues },
    { role: "Bintang tamu", names: ["Anda"] },
  ];

  // Digandakan agar animasi gulir -50% menyambung tanpa lompatan.
  const rolling = [...lines, ...lines];

  return (
    <footer className="film-grain relative overflow-hidden bg-void pb-20 pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
        <div
          className="relative h-80 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] sm:h-96"
        >
          <ul className="animate-credits text-center">
            {rolling.map((line, i) => (
              <li key={`${line.role}-${i}`} aria-hidden={i >= lines.length || undefined} className="pb-8">
                <p className="text-[0.58rem] uppercase tracking-[0.35em] text-gold/80">{line.role}</p>
                {line.names.map((n) => (
                  <p key={n} className="mt-1 font-display text-lg text-ivory/85">
                    {n}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="text-center lg:text-left">
          <div className="mx-auto mb-10 w-40 lg:mx-0">
            <Photo src={photoAt(photos, photos.length - 1)} alt="" className="aspect-[3/4] grayscale" />
          </div>
          {content.closing.message && <p className="max-w-md text-sm leading-relaxed text-smoke max-lg:mx-auto">{content.closing.message}</p>}
          {content.closing.signature && <p className="credit mt-8">{content.closing.signature}</p>}
          <p className="mt-4 font-display text-[clamp(3rem,8vw,5.5rem)] leading-none">
            {first.nickname} <span className="italic text-gold">&amp;</span> {second.nickname}
          </p>
          <p className="mt-10 font-display text-sm italic tracking-[0.3em] text-ivory/40">— Tamat —</p>
        </Reveal>
      </div>

      <p className="mt-20 text-center text-[0.58rem] uppercase tracking-[0.35em] text-smoke/50">Dibuat oleh {CREDIT}</p>
    </footer>
  );
}

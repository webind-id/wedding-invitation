"use client";

import { photoAt } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { AlbumPhoto } from "../ui/Frames";
import { Crest, FlourishCorners } from "../ui/Ornaments";
import { Reveal } from "../ui/Reveal";

/** Kredit pembuat — milik template, bukan konten undangan. */
const CREDIT = "KudoStack";

/** Salam penutup di atas burgundy: foto, pesan, tanda tangan kedua keluarga. */
export function Valediction() {
  const { content, pair, photos, monogram } = useInvitation();
  const [first, second] = pair;

  return (
    <footer className="relative overflow-hidden bg-burgundy px-4 pb-16 pt-24 text-antique">
      <FlourishCorners size="h-16 w-16 sm:h-24 sm:w-24 text-antique/30" />
      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal className="mx-auto w-52 sm:w-60">
          <AlbumPhoto src={content.coverPhoto || photoAt(photos, 0)} alt="" tilt={-1.5} frameClassName="aspect-[4/5]" />
        </Reveal>

        {content.closing.message && (
          <Reveal className="mt-14">
            <p className="font-serif text-xl italic leading-relaxed text-antique/90 sm:text-2xl">{content.closing.message}</p>
          </Reveal>
        )}

        <Reveal className="mt-12">
          {content.closing.signature && <p className="font-fell text-lg italic text-antique/70">{content.closing.signature},</p>}
          <p className="mt-3 font-fell text-[clamp(2.6rem,7vw,3.6rem)] leading-tight">
            {first.nickname} <span className="italic text-antique/60">&amp;</span> {second.nickname}
          </p>
          <p className="mt-4 font-serif italic text-antique/70">
            beserta Keluarga Besar {first.father.replace(/^(Bapak|Bpk\.?)\s+/i, "")} dan Keluarga Besar{" "}
            {second.father.replace(/^(Bapak|Bpk\.?)\s+/i, "")}
          </p>
        </Reveal>

        <Reveal className="mt-14 [&_*]:text-antique">
          <Crest monogram={monogram} className="w-24 opacity-80" />
        </Reveal>

        <p className="mt-12 font-fell-sc text-sm tracking-[0.2em] text-antique/40">Dibuat oleh {CREDIT}</p>
      </div>
    </footer>
  );
}

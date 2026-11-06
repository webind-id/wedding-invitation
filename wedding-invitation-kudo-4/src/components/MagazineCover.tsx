"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { formatLongDate } from "@/lib/datetime";
import { folio, issueLabel, rubric } from "@/lib/issue";
import { useInvitation } from "./InvitationContext";
import { Photo } from "./ui/Photo";
import { EASE_EDITORIAL } from "./ui/Reveal";

interface MagazineCoverProps {
  guestName: string;
  onOpen: () => void;
}

/**
 * Sampul majalah: masthead nama pasangan selebar halaman, foto sampul
 * asimetris, nomor edisi, dan "cover lines" yang mengarah ke rubrik di dalam.
 */
export function MagazineCover({ guestName, onOpen }: MagazineCoverProps) {
  const { content, pair, photos } = useInvitation();
  const reduce = useReducedMotion();
  const [first, second] = pair;
  const premiere = content.events[0];
  const coverPhoto = content.coverPhoto || photos[0] || "";

  const item = (i: number): Variants => ({
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    shown: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE_EDITORIAL, delay: 0.2 + i * 0.12 } },
  });

  const coverLines = [
    { label: rubric("mempelai").label, text: `${first.nickname} & ${second.nickname}, dari dua keluarga`, page: rubric("mempelai").page },
    { label: rubric("agenda").label, text: formatLongDate(premiere.start, content.timeZone), page: rubric("agenda").page },
    ...(content.story.length > 0
      ? [{ label: rubric("kisah").label, text: `${content.story[0].year}–${content.story.at(-1)!.year}: perjalanan kami`, page: rubric("kisah").page }]
      : []),
  ];

  return (
    <motion.div
      initial="hidden"
      animate="shown"
      exit={{ y: "-100%", transition: { duration: 1.1, ease: EASE_EDITORIAL } }}
      className="fixed inset-0 z-50 overflow-y-auto bg-ivory"
    >
      <div className="mx-auto flex min-h-full max-w-7xl flex-col px-5 pb-10 pt-6 sm:px-10 sm:pt-8">
        {/* Baris edisi */}
        <motion.div variants={item(0)} className="flex items-baseline justify-between border-b border-ink pb-2">
          <p className="rubric text-ink">{issueLabel(premiere.start, content.timeZone)}</p>
          <p className="rubric hidden sm:block">Edisi Pernikahan · No. 01</p>
          <p className="font-serif text-sm italic text-stone">Edisi khusus</p>
        </motion.div>

        {/* Masthead */}
        <motion.h1
          variants={item(1)}
          className="relative z-10 mt-6 text-balance break-words text-center font-serif text-[clamp(3.4rem,13vw,11.5rem)] font-light leading-[0.86] tracking-[-0.045em] sm:mt-8"
        >
          {first.nickname}
          <span className="mx-[0.06em] align-[0.12em] text-[0.55em] italic text-gold">&amp;</span>
          {second.nickname}
        </motion.h1>

        {/*
          HP: foto → nama tamu & tombol → cover lines (tombol selalu dekat layar pertama).
          Desktop: cover lines kiri-atas, tombol kiri-bawah, foto setinggi layar di kanan.
        */}
        <div className="mt-6 grid gap-8 lg:-mt-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-0">
          <motion.div variants={item(1)} className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <motion.div
              initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
              animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 1.6, ease: EASE_EDITORIAL, delay: 0.3 }}
            >
              <Photo
                src={coverPhoto}
                alt={`${first.nickname} dan ${second.nickname}`}
                eager
                className="aspect-[4/5] max-h-[48svh] w-full lg:aspect-auto lg:h-[calc(100svh-15rem)] lg:max-h-none lg:min-h-[26rem]"
              />
            </motion.div>
          </motion.div>

          <motion.div variants={item(5)} className="lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:self-end">
            <p className="rubric">Diterbitkan khusus untuk</p>
            <p className="mt-2 font-serif text-3xl italic leading-tight">{guestName}</p>
            <button type="button" onClick={onOpen} className="btn-ink mt-6 w-full sm:w-auto">
              Buka edisi <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </motion.div>

          <ul className="space-y-5 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:pt-16">
            {coverLines.map((c, i) => (
              <motion.li key={c.label} variants={item(2 + i)} className="rule pt-3">
                <p className="rubric flex justify-between">
                  {c.label}
                  <span className="font-serif text-xs normal-case italic tracking-normal">hal. {folio(c.page)}</span>
                </p>
                <p className="mt-2 font-serif text-2xl leading-snug">{c.text}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

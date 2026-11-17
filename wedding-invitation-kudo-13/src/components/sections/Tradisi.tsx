"use client";

import { useRef, type ReactNode } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { TopCorners } from "../klenteng/Ornaments";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * Tradisi pernikahan Tionghoa. Teks tetap milik template (ciri khas tema ini) — template ini
 * sengaja TIDAK memakai `content.ceremonies` (prosesi adat dari admin), sesuai permintaan pemilik.
 */
const TRADITIONS: { name: string; text: string; icon: ReactNode }[] = [
  {
    name: "Sangjit",
    text: "Keluarga mempelai pria mengantarkan seserahan dalam nampan berjumlah genap kepada keluarga mempelai wanita, sebagai lambang kesungguhan meminang.",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 15h18l-2 4H5z" />
        <path d="M7 15c0-3 2-5 5-5s5 2 5 5" />
        <circle cx="12" cy="7" r="2" />
      </g>
    ),
  },
  {
    name: "Chio Thau",
    text: "Upacara menyisir rambut sebagai tanda kedua mempelai memasuki kedewasaan, disertai doa agar rumah tangga rukun dan langgeng.",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 10c4-4 12-4 16 0v2H4z" />
        <path d="M6 12v6M9 12v7M12 12v7M15 12v7M18 12v6" />
      </g>
    ),
  },
  {
    name: "Penjemputan Pengantin",
    text: "Mempelai pria datang menjemput mempelai wanita di rumahnya, disambut keluarga dengan penuh sukacita.",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 21V8a7 7 0 0 1 14 0v13" />
        <path d="M12 3v18M3 21h18" />
        <circle cx="10" cy="13" r=".8" fill="currentColor" />
        <circle cx="14" cy="13" r=".8" fill="currentColor" />
      </g>
    ),
  },
  {
    name: "Tea Pai",
    text: "Kedua mempelai menyuguhkan teh kepada orang tua dan kerabat yang lebih tua sebagai tanda bakti, lalu menerima doa restu.",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 10h13v3a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" />
        <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H16" />
        <path d="M8 4c0 2 2 2 2 4M12 4c0 2 2 2 2 4" />
        <path d="M3 21h16" />
      </g>
    ),
  },
];

export function Tradisi() {
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  return (
    <section ref={ref} id="tradisi" aria-labelledby="tradisi-title" className="sec coin-bg">
      <TopCorners />
      <SectionHeading
        id="tradisi-title"
        title="Tradisi Pernikahan"
        variant="display"
        lead={<span className="text-base">Rangkaian tradisi Tionghoa yang kami jalani sebagai wujud hormat kepada orang tua dan leluhur.</span>}
      />
      <ol data-reveal-group className="mt-7 grid gap-4 text-left">
        {TRADITIONS.map((item) => (
          <li key={item.name} data-reveal-item className="flex items-start gap-3.5 rounded-2xl border border-cream-200 bg-cream-100 p-4">
            <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-red-700 text-gold-300 shadow-[0_0_0_2px_#C9A24B]">
              <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" aria-hidden>
                {item.icon}
              </svg>
            </span>
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[2px] text-red-800">{item.name}</h3>
              <p className="mt-1 text-[15px] leading-[1.55] text-ink-700">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

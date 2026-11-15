"use client";

import { useRef } from "react";
import { useScrollScene } from "@/hooks/useScrollScene";
import { cn } from "@/lib/cn";
import { photoAt, photosExcept } from "@/lib/photos";
import { useInvitation } from "../InvitationContext";
import { DriedPalm } from "../rustic/DriedPalm";
import { EucalyptusStem } from "../rustic/EucalyptusStem";
import { Photo } from "../ui/Photo";
import { SectionHeading } from "../ui/SectionHeading";

export function Story() {
  const { content, photos } = useInvitation();
  const ref = useRef<HTMLElement>(null);
  useScrollScene(ref);

  if (!content.story || content.story.length === 0) return null;
  const pool = photosExcept(photos, [content.coverPhoto]);

  return (
    <section
      ref={ref}
      id="story"
      aria-labelledby="story-title"
      className="rustic-paper-warm relative overflow-hidden px-4 py-20 sm:py-28"
    >
      {/* ── Ornamen Daun Kering Parallax Latar (Tepian Aman) ─────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div data-depth="40" className="absolute -left-8 top-[15%] opacity-65">
          <DriedPalm size={140} color="#C86D51" opacity={0.5} />
        </div>
        <div data-depth="-40" className="absolute -right-8 bottom-[20%] opacity-65">
          <EucalyptusStem size={140} color="#6B7A5C" opacity={0.55} mirror />
        </div>
      </div>
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          badge="OUR LOVE JOURNEY"
          scriptTitle="Kisah Kasih"
          title="Perjalanan Menuju Pelaminan"
          subtitle="Setiap babak cerita yang mengantarkan langkah kami hingga ke hari bahagia di bawah langit terbuka."
        />

        <div className="relative mt-16">
          {/* Garis koneksi batang tanaman vertikal */}
          <div
            aria-hidden
            className="absolute left-4 md:left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-terracotta/30 via-olive/40 to-terracotta/30"
          />

          <ol className="space-y-16 md:space-y-24">
            {content.story.map((chapter, i) => {
              const isEven = i % 2 === 0;
              const photo = photoAt(pool, i);

              return (
                <li
                  key={`${chapter.year}-${i}`}
                  className={cn(
                    "relative flex flex-col md:flex-row items-center gap-8 md:gap-14",
                    isEven ? "md:flex-row" : "md:flex-row-reverse",
                  )}
                >
                  {/* Foto Bab Cerita (Polaroid / Rustic Paper Frame) */}
                  <div
                    data-reveal="zoom"
                    className="w-full md:w-1/2 flex justify-center"
                  >
                    <div className="relative w-full max-w-xs aspect-[4/5] p-3 bg-white rounded-2xl border border-sand-deep/60 shadow-rustic transform hover:rotate-1 transition-transform">
                      <div className="relative h-full w-full overflow-hidden rounded-xl">
                        <Photo
                          src={photo}
                          alt={chapter.title}
                          parallax={5}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Node Indikator Tengah */}
                  <div
                    data-reveal="zoom"
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-20 items-center justify-center h-10 w-10 rounded-full border-2 border-white bg-terracotta text-white shadow-rustic font-serif text-xs font-bold"
                  >
                    0{i + 1}
                  </div>

                  {/* Konten Teks Cerita */}
                  <div
                    data-reveal="up"
                    className={cn(
                      "w-full md:w-1/2 text-left",
                      isEven ? "md:text-left" : "md:text-right",
                    )}
                  >
                    <div className="rustic-card p-6 bg-cream-50/90 border border-sand-deep/60">
                      <div className={cn("flex items-center gap-2 mb-3", !isEven && "md:justify-end")}>
                        <span className="badge-terracotta">
                          BABAK 0{i + 1}
                        </span>
                        <span className="font-serif text-sm font-bold text-olive-700">
                          {chapter.year}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-earth-ink mb-2">
                        {chapter.title}
                      </h3>

                      <p className="text-sm text-earth-muted leading-relaxed [text-wrap:pretty]">
                        {chapter.text}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

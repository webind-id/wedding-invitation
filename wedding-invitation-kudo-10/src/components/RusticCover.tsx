"use client";

import { useGSAP } from "@gsap/react";
import { MailOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatLongDate } from "@/lib/datetime";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap } from "@/hooks/useScrollScene";
import { useTilt } from "@/hooks/useTilt";
import { useInvitation } from "./InvitationContext";
import { DriedPalm } from "./rustic/DriedPalm";
import { EucalyptusStem } from "./rustic/EucalyptusStem";
import { PampasGrass } from "./rustic/PampasGrass";
import { WaxSeal } from "./rustic/WaxSeal";

interface RusticCoverProps {
  guestName: string;
  /** Dipanggil setelah urutan pembukaan 3D selesai */
  onOpen: () => void;
}

/**
 * Gambar garis botanikal gerbang bohemian lengkung (Boho Arch & Sun Palm)
 * Satu gambar utuh yang terbelah dua secara presisi oleh kedua daun pintu 3D.
 */
function RusticGateArt() {
  return (
    <svg
      viewBox="0 0 200 250"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden
    >
      {/* Garis lengkung gerbang bohemian luar & dalam */}
      <path
        d="M 14 240 L 14 90 A 86 86 0 0 1 186 90 L 186 240"
        fill="none"
        stroke="rgba(250, 246, 240, 0.45)"
        strokeWidth="1.2"
      />
      <path
        d="M 20 240 L 20 92 A 80 80 0 0 1 180 92 L 180 240"
        fill="none"
        stroke="rgba(250, 246, 240, 0.25)"
        strokeWidth="0.8"
        strokeDasharray="4 3"
      />

      {/* Sun Palm Spear / Kipas Palem Kering di Puncak Lengkungan */}
      <g fill="none" stroke="rgba(250, 246, 240, 0.55)" strokeWidth="0.9" transform="translate(100 88)">
        <path d="M0 0 L0 -52" />
        <path d="M0 0 L-14 -48" />
        <path d="M0 0 L14 -48" />
        <path d="M0 0 L-26 -40" />
        <path d="M0 0 L26 -40" />
        <path d="M0 0 L-36 -28" />
        <path d="M0 0 L36 -28" />
        <path d="M0 0 L-42 -14" />
        <path d="M0 0 L42 -14" />
        <circle cx="0" cy="0" r="3.5" fill="rgba(250, 246, 240, 0.7)" />
      </g>

      {/* Ranting Daun Zaitun / Eukaliptus di Sisi Bawah */}
      <g fill="none" stroke="rgba(250, 246, 240, 0.4)" strokeWidth="0.8" transform="translate(100 215)">
        <path d="M-60 12 C-30 6 30 6 60 12" />
        <path d="M-45 18 C-20 14 20 14 45 18" opacity="0.6" />
        {[-48, -32, -16, 0, 16, 32, 48].map((x) => (
          <circle key={x} cx={x} cy={10 - Math.abs(x) * 0.08} r="1.5" fill="rgba(250, 246, 240, 0.5)" />
        ))}
      </g>
    </svg>
  );
}

/**
 * Kartu Undangan 3D Lipat Bohemian Arch (Boho Gatefold Card).
 *
 * Struktur Lapisan:
 * - Latar Taman Parallax 3D (Daun palem, pampas, zaitun yang condong mengikuti kursor)
 * - Panggung Perspektif 3D ([perspective:1600px] + useTilt)
 *   - Kartu Dalam (Nama pengantin, tanggal, pesan puitis di atas kertas katun bertekstur)
 *   - Daun Pintu Kiri (Lengkung arch kiri, terakota linen, rotasi 3D ke kiri)
 *   - Daun Pintu Kanan (Lengkung arch kanan, terakota linen, rotasi 3D ke kanan)
 *   - Segel Lilin Fisik (Wax Seal Monogram timbul 3D di translateZ(8px) tepat di pertemuan pintu)
 * - Kontrol & Nama Tamu (Kepada Yth. & Tombol Buka Undangan)
 */
export function RusticCover({ guestName, onOpen }: RusticCoverProps) {
  const { content, pair, monogram } = useInvitation();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gardenRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isReduced = useReducedMotion();
  const [isOpening, setIsOpening] = useState(false);

  // 3D Tilt dinamis mengikuti gerakan pointer/mouse
  useTilt(stageRef, 8);
  useTilt(gardenRef, 3);

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  // Posisi awal lapisan transform 3D untuk GSAP
  useGSAP(
    () => {
      gsap.set(leftRef.current, { z: 2, rotationY: 0, transformOrigin: "0% 50%" });
      gsap.set(rightRef.current, { z: 2, rotationY: 0, transformOrigin: "100% 50%" });
      gsap.set(innerRef.current, { z: 0 });
    },
    { scope: rootRef },
  );

  function handleOpen() {
    if (isOpening) return;
    setIsOpening(true);

    if (isReduced) {
      gsap.to(rootRef.current, { autoAlpha: 0, duration: 0.4, onComplete: onOpen });
      return;
    }

    const chrome = rootRef.current?.querySelectorAll("[data-chrome]") ?? [];

    gsap
      .timeline({ onComplete: onOpen })
      // 1. Teks chrome memudar lembut
      .to(chrome, { autoAlpha: 0, y: 10, duration: 0.4, ease: "power2.out" }, 0)
      // 2. Sudut kartu 3D kembali tegak lurus ke kamera
      .to(stageRef.current, { rotationX: 0, rotationY: 0, duration: 0.5, ease: "power2.out" }, 0)
      // 3. Segel lilin membesar sebentar lalu terangkat / pecah terbuka
      .to(sealRef.current, { scale: 1.15, duration: 0.18, ease: "power1.out" }, 0)
      .to(sealRef.current, { scale: 0.25, autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 0.18)
      // 4. Kedua daun gerbang bohemian berputar membuka ke samping dalam ruang 3D
      .to(leftRef.current, { rotationY: -158, duration: 1.3, ease: "power3.inOut" }, 0.4)
      .to(rightRef.current, { rotationY: 158, duration: 1.3, ease: "power3.inOut" }, 0.48)
      // 5. Daun gerbang memudar setelah terbuka penuh
      .to([leftRef.current, rightRef.current], { autoAlpha: 0, duration: 0.5, ease: "power1.in" }, 1.6)
      // 6. Kartu dalam membesar mendekati pandangan
      .to(innerRef.current, { scale: 1.32, duration: 1.1, ease: "power2.inOut" }, 1.55)
      // 7. Seluruh layar sampul memudar dan masuk ke halaman utama
      .to(rootRef.current, { autoAlpha: 0, duration: 0.7, ease: "power2.inOut" }, 2.3);
  }

  const firstEvent = content.events[0];
  const dateStr = firstEvent ? formatLongDate(firstEvent.start, content.timeZone) : "";

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-couple-title"
      className="rustic-paper fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4 select-none"
    >
      {/* ── Latar Belakang 3D Botanikal Parallax (Tepian Aman, Tidak Masuk Frame) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden [perspective:1200px]">
        <div ref={gardenRef} className="preserve-3d absolute inset-0">
          {/* Daun Palem Kering Kiri Atas */}
          <div className="absolute -left-12 -top-10 animate-sway-slow opacity-75">
            <DriedPalm size={180} color="#C86D51" opacity={0.6} />
          </div>

          {/* Rumput Pampas Kanan Atas */}
          <div className="absolute -right-12 -top-8 animate-sway-reverse opacity-70">
            <PampasGrass size={170} color="#D4A373" opacity={0.65} mirror />
          </div>

          {/* Eukaliptus Kiri Bawah */}
          <div className="absolute -left-10 -bottom-10 opacity-70">
            <EucalyptusStem size={150} color="#6B7A5C" opacity={0.65} />
          </div>

          {/* Daun Palem Kering Kanan Bawah */}
          <div className="absolute -right-12 -bottom-12 animate-sway-slow opacity-75">
            <DriedPalm size={190} color="#C86D51" opacity={0.6} mirror />
          </div>
        </div>
      </div>

      {/* ── Label Atas ─────────────────────────────────────────────────── */}
      <div data-chrome className="rise-in relative mb-4 text-center">
        <span className="badge-olive">
          OUTDOOR &amp; GARDEN WEDDING
        </span>
      </div>

      {/* ── Panggung Kartu 3D (Gatefold Arch Card Stage) ─────────────────── */}
      <div className="rise-in relative [perspective:1600px]">
        <div ref={stageRef} className="preserve-3d">
          <div className="preserve-3d relative aspect-[4/5] w-[min(80vw,340px)] sm:w-[350px]">
            {/* 1. KARTU DALAM (Inner Card): Muncul saat kedua pintu 3D terbuka */}
            <div
              ref={innerRef}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-t-[140px] sm:rounded-t-[160px] rounded-b-2xl border-2 border-sand-deep/60 bg-cream-50 p-6 sm:p-8 text-center shadow-rustic-lg"
            >
              {/* Garis batas dalam bertekstur kertas katun */}
              <div className="pointer-events-none absolute inset-2.5 rounded-t-[130px] sm:rounded-t-[150px] rounded-b-xl border border-dashed border-sand-deep/50" />

              <div className="relative z-10 flex flex-col items-center">
                <p className="font-sans text-[0.68rem] tracking-widest text-olive-700 uppercase font-semibold mb-1">
                  THE WEDDING OF
                </p>

                <h1
                  id="cover-couple-title"
                  className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-earth-ink my-2 leading-tight"
                >
                  {pair[0].nickname}
                  <span className="block font-script font-normal text-terracotta text-3xl sm:text-4xl my-0.5">
                    &amp;
                  </span>
                  {pair[1].nickname}
                </h1>

                <div className="mt-3 w-12 h-[1px] bg-sand-deep/60" />

                <p className="mt-3 font-serif text-xs sm:text-sm text-earth-muted uppercase tracking-wider">
                  {dateStr}
                </p>

                <p className="mt-4 font-sans text-[0.68rem] text-terracotta-700 font-medium tracking-wider uppercase">
                  KAMI MENGUNDANG ANDA
                </p>
              </div>
            </div>

            {/* 2. PINTU GERBANG KIRI 3D (Left Gate Door) */}
            <div
              ref={leftRef}
              className="preserve-3d absolute inset-y-0 left-0 w-1/2 cursor-pointer"
              onClick={handleOpen}
            >
              {/* Sisi Luar Pintu Kiri: Terakota Linen + Setengah Seni Arch */}
              <div className="backface-hidden absolute inset-0 overflow-hidden rounded-tl-[140px] sm:rounded-tl-[160px] rounded-bl-2xl bg-gradient-to-br from-[#C86D51] via-[#B85C42] to-[#98442B] border-t-2 border-l-2 border-b-2 border-sand/40 shadow-[0_35px_60px_-25px_rgba(43,35,29,0.55)]">
                <div className="absolute inset-y-0 left-0 w-[200%]">
                  <RusticGateArt />
                </div>
              </div>
              {/* Sisi Dalam Pintu Kiri (Liner saat terbuka) */}
              <div
                className="backface-hidden rustic-gate-liner absolute inset-0 rounded-tr-[140px] sm:rounded-tr-[160px] rounded-br-2xl border border-sand-deep/40"
                style={{ transform: "rotateY(180deg)" }}
              />
            </div>

            {/* 3. PINTU GERBANG KANAN 3D (Right Gate Door) */}
            <div
              ref={rightRef}
              className="preserve-3d absolute inset-y-0 right-0 w-1/2 cursor-pointer"
              onClick={handleOpen}
            >
              {/* Sisi Luar Pintu Kiri: Terakota Linen + Setengah Seni Arch */}
              <div className="backface-hidden absolute inset-0 overflow-hidden rounded-tr-[140px] sm:rounded-tr-[160px] rounded-br-2xl bg-gradient-to-bl from-[#C86D51] via-[#B85C42] to-[#98442B] border-t-2 border-r-2 border-b-2 border-sand/40 shadow-[0_35px_60px_-25px_rgba(43,35,29,0.55)]">
                <div className="absolute inset-y-0 right-0 w-[200%]">
                  <RusticGateArt />
                </div>
                {/* Garis bayangan celah pertemuan dua pintu */}
                <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-black/25" />
              </div>
              {/* Sisi Dalam Pintu Kanan (Liner saat terbuka) */}
              <div
                className="backface-hidden rustic-gate-liner absolute inset-0 rounded-tl-[140px] sm:rounded-tl-[160px] rounded-bl-2xl border border-sand-deep/40"
                style={{ transform: "rotateY(180deg)" }}
              />
            </div>

            {/* 4. SEGEL LILIN FISIK 3D (Wax Seal Monogram di translateZ(8px)) */}
            <div
              className="absolute left-1/2 top-1/2 z-30"
              style={{ transform: "translate(-50%, -50%) translateZ(8px)" }}
            >
              <div ref={sealRef}>
                <button
                  type="button"
                  onClick={handleOpen}
                  disabled={isOpening}
                  aria-label="Sentuh segel lilin untuk membuka undangan"
                  className="group relative block rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline-offset-8"
                >
                  <WaxSeal monogram={monogram} size={64} variant="terracotta" />
                  <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-[0.62rem] text-earth-ink/75 bg-cream-50/90 px-2 py-0.5 rounded-full border border-sand-deep/40 shadow-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Buka Kartu
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Kotak Nama Tamu & Tombol Buka Undangan ───────────────────────── */}
      <div data-chrome className="rise-in relative mt-6 w-full max-w-xs flex flex-col items-center text-center">
        <div className="w-full rounded-xl border border-sand-deep/50 bg-white/90 px-4 py-2.5 shadow-rustic-sm backdrop-blur-sm">
          <p className="font-sans text-[0.68rem] text-earth-muted uppercase tracking-wider mb-0.5">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <p className="font-serif text-base sm:text-lg font-bold text-terracotta-700 truncate">
            {guestName}
          </p>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleOpen}
          disabled={isOpening}
          className="btn-rustic-terracotta group relative mt-4 overflow-hidden px-8 py-3 w-full"
        >
          <MailOpen className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden />
          <span>BUKA UNDANGAN</span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>

        <p className="mt-2 text-[0.68rem] text-earth-muted">
          Sentuh segel lilin atau tombol untuk membuka kartu 3D
        </p>
      </div>
    </div>
  );
}

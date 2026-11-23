import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BabakProps {
  id: string;
  /** Nama babak pedalangan, mis. "Jejer" — tampil kecil di atas judul. */
  name: string;
  title: string;
  /** Teks pengantar di bawah sulur. */
  lead?: ReactNode;
  className?: string;
}

/**
 * Judul bagian bergaya babak lakon wayang: nama babak + kupu-kupu kecil, judul huruf sambung
 * besar, dan sulur emas yang tergambar mengikuti scroll (`data-draw`, useScrollScene).
 * Rata kiri — ciri khas kudo-14, berbeda dari judul rata tengah template lain.
 */
export function Babak({ id, name, title, lead, className }: BabakProps) {
  return (
    <header data-reveal="up" className={cn("babak", className)}>
      <p className="babak-name">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/taman/kupukupu.webp" alt="" width={240} height={134} loading="lazy" className="h-auto w-[26px] -rotate-12" />
        {name}
      </p>
      <h2 id={id} className="babak-title">
        {title}
      </h2>
      <Vine />
      {lead && <div className="lead">{lead}</div>}
    </header>
  );
}

/** Sulur emas: batang melengkung dengan dua ikal dan daun kecil. */
function Vine() {
  return (
    <svg viewBox="0 0 180 22" className="babak-vine" aria-hidden focusable="false">
      <path data-draw d="M2 12 C 30 4, 52 20, 80 12 S 128 4, 150 12 C 160 15, 168 10, 166 5 C 164 1, 157 3, 159 8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M44 11 C 40 3, 50 1, 52 7 C 50 10, 47 11, 44 11Z M108 9 C 112 1, 122 3, 120 9 C 116 11, 112 11, 108 9Z" fill="currentColor" opacity=".75" />
      <circle cx="2" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

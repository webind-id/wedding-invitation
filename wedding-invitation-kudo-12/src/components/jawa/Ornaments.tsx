import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type SymbolId = "gunungan" | "joglo" | "mountains" | "melati" | "melati-cluster" | "corner" | "divider";

const VIEWBOX: Record<SymbolId, string> = {
  gunungan: "0 0 200 300",
  joglo: "0 0 400 230",
  mountains: "0 0 460 180",
  melati: "0 0 20 20",
  "melati-cluster": "0 0 80 80",
  corner: "0 0 80 80",
  divider: "0 0 180 22",
};

/** Satu simbol dari <Sprite />. Dekoratif: selalu aria-hidden. */
export function Glyph({ id, className, style }: { id: SymbolId; className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox={VIEWBOX[id]}
      preserveAspectRatio={id === "mountains" ? "none" : undefined}
      className={className}
      style={style}
      aria-hidden
      focusable="false"
    >
      <use href={`#rm-${id}`} />
    </svg>
  );
}

/** Pemisah sulur emas di bawah judul. */
export function Divider({ className }: { className?: string }) {
  return <Glyph id="divider" className={cn("mx-auto my-4 block h-[22px] w-[180px] text-gold-500", className)} />;
}

/** Sulur di dua sudut atas bagian berlatar terang. */
export function TopCorners() {
  return (
    <>
      <Glyph id="corner" className="pointer-events-none absolute left-[26px] top-3.5 z-[2] h-[74px] w-[74px] text-gold-500 opacity-90" />
      <Glyph id="corner" className="pointer-events-none absolute right-[26px] top-3.5 z-[2] h-[74px] w-[74px] -scale-x-100 text-gold-500 opacity-90" />
    </>
  );
}

/** Pinggiran parang di sisi kiri & kanan bagian. */
export function ParangEdges() {
  return (
    <>
      <span aria-hidden className="parang parang-l" />
      <span aria-hidden className="parang parang-r" />
    </>
  );
}

const STRAND_SPACING = 8;

/**
 * Ronce melati: beberapa untai bunga melati yang menggantung dari atas. Diam — hanya turun
 * sekali saat induknya diberi kelas `ronce-show` (lihat globals.css).
 */
export function Ronce({ strands, side, delay = 0, className }: { strands: number; side: "left" | "right"; delay?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("ronce pointer-events-none absolute top-0 z-[3] flex", side === "left" ? "left-[22px]" : "right-[22px]", className)}
      style={{ "--ronce-delay": `${delay}s` } as CSSProperties}
    >
      {Array.from({ length: strands }, (_, i) => {
        // Panjang untai bervariasi (5–8 bunga) agar tidak terlihat seragam.
        const flowers = 5 + ((i * 3) % 4);
        return (
          <div key={i} className="relative flex flex-col items-center" style={{ marginLeft: i ? STRAND_SPACING : 0 }}>
            <span className="absolute inset-y-0 w-px bg-gold-500/60" />
            {Array.from({ length: flowers }, (_, k) => (
              <svg key={k} viewBox="0 0 20 20" className="relative -mt-0.5 h-[13px] w-[13px]">
                <use href="#rm-melati" />
              </svg>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** Rangkaian melati & daun di pojok bingkai foto. */
export function MelatiCorners() {
  return (
    <>
      <Glyph id="melati-cluster" className="pointer-events-none absolute -left-7 bottom-4 z-[2] h-[74px] w-[74px]" />
      <Glyph id="melati-cluster" className="pointer-events-none absolute -right-[26px] top-10 z-[2] h-[74px] w-[74px] rotate-[140deg]" />
    </>
  );
}

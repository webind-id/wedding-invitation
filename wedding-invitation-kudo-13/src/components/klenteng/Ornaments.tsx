import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type SymbolId = "temple" | "mountains" | "cloud" | "mei" | "branch" | "lantern" | "corner" | "divider";

const VIEWBOX: Record<SymbolId, string> = {
  temple: "0 0 400 240",
  mountains: "0 0 460 230",
  cloud: "0 0 150 40",
  mei: "0 0 20 20",
  branch: "0 0 120 90",
  lantern: "0 0 30 48",
  corner: "0 0 64 64",
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
      <use href={`#kl-${id}`} />
    </svg>
  );
}

/** Pemisah koin emas di bawah judul. */
export function Divider({ className }: { className?: string }) {
  return <Glyph id="divider" className={cn("mx-auto my-4 block h-[22px] w-[180px] text-gold-500", className)} />;
}

/** Sudut meander di dua sudut atas bagian berlatar terang. */
export function TopCorners() {
  return (
    <>
      <Glyph id="corner" className="pointer-events-none absolute left-[26px] top-4 z-[2] h-16 w-16 text-gold-500" />
      <Glyph id="corner" className="pointer-events-none absolute right-[26px] top-4 z-[2] h-16 w-16 -scale-x-100 text-gold-500" />
    </>
  );
}

/** Pinggiran meander (回纹) di sisi kiri & kanan bagian. */
export function FretEdges() {
  return (
    <>
      <span aria-hidden className="fret fret-l" />
      <span aria-hidden className="fret fret-r" />
    </>
  );
}

/**
 * Lampion merah tergantung dari atas, tali beragam panjang. Diam — hanya turun sekali saat
 * induknya diberi kelas `lanterns-show` (lihat globals.css). Tanpa ayunan berulang.
 */
export function Lanterns({ count, side, delay = 0, className }: { count: number; side: "left" | "right"; delay?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("lanterns pointer-events-none absolute top-0 z-[3] flex gap-3.5", side === "left" ? "left-5" : "right-5", className)}
      style={{ "--lantern-delay": `${delay}s` } as CSSProperties}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="w-px bg-gold-500" style={{ height: 30 + ((i * 37) % 50) }} />
          <Glyph id="lantern" className="h-12 w-[30px] drop-shadow-[0_0_10px_rgba(255,120,60,0.45)]" />
        </div>
      ))}
    </div>
  );
}

/**
 * Ranting mei menggantung di dua sudut atas, bergoyang pelan dari titik gantungnya. Goyangan ada
 * di pembungkus (`rotate`), cermin ada di SVG (`transform`) — keduanya tidak saling menimpa.
 */
export function HangingBranches() {
  return (
    <>
      <div
        aria-hidden
        className="sway-branch pointer-events-none absolute -left-3.5 -top-2.5 z-[2] h-[142px] w-[190px] origin-top-left"
        style={{ ["--sway-dur" as string]: "6.5s" }}
      >
        <Glyph id="branch" className="h-full w-full -scale-y-100" />
      </div>
      <div
        aria-hidden
        className="sway-branch pointer-events-none absolute -right-3.5 -top-2.5 z-[2] h-[142px] w-[190px] origin-top-right"
        style={{ ["--sway-dur" as string]: "6.5s", ["--sway-delay" as string]: "-2.4s" }}
      >
        <Glyph id="branch" className="h-full w-full -scale-100" />
      </div>
    </>
  );
}

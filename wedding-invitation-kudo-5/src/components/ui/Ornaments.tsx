import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Sudut filigri: gulungan & daun kecil. Putar untuk empat sudut. */
export function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden className={cn("text-burgundy/70", className)}>
      <path d="M6 114V30C6 16 16 6 30 6h84" />
      <path d="M14 114V36c0-12 10-22 22-22h78" strokeWidth="0.6" />
      <path d="M30 6c0 14-6 24-16 24-6 0-9-4-9-8s3-7 7-7c5 0 8 4 8 9" />
      <path d="M6 30c14 0 24 6 24 16 0 6-4 9-8 9s-7-3-7-7c0-5 4-8 9-8" />
      <path d="M38 30c10-2 18 2 22 10M30 38c-2 10 2 18 10 22" strokeWidth="0.8" />
      <path d="M60 40c3-6 9-8 14-6-2 6-8 9-14 6ZM40 60c-6 3-8 9-6 14 6-2 9-8 6-14Z" fill="currentColor" fillOpacity="0.15" />
      <circle cx="22" cy="22" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Empat sudut filigri mengelilingi isi. */
export function FlourishCorners({ size = "h-14 w-14 sm:h-20 sm:w-20" }: { size?: string }) {
  return (
    <>
      <CornerFlourish className={cn("absolute left-2 top-2", size)} />
      <CornerFlourish className={cn("absolute right-2 top-2 rotate-90", size)} />
      <CornerFlourish className={cn("absolute bottom-2 right-2 rotate-180", size)} />
      <CornerFlourish className={cn("absolute bottom-2 left-2 -rotate-90", size)} />
    </>
  );
}

// Batang laurel: kurva Bézier kubik dari pangkal bawah ke ujung atas.
const STEM = { p0: [100, 180], p1: [42, 172], p2: [18, 96], p3: [54, 26] } as const;

function bezier(t: number): { x: number; y: number; angle: number } {
  const { p0, p1, p2, p3 } = STEM;
  const u = 1 - t;
  const at = (i: 0 | 1) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i];
  const d = (i: 0 | 1) => 3 * u * u * (p1[i] - p0[i]) + 6 * u * t * (p2[i] - p1[i]) + 3 * t * t * (p3[i] - p2[i]);
  return { x: at(0), y: at(1), angle: (Math.atan2(d(1), d(0)) * 180) / Math.PI };
}

const LEAF_STEPS = [0.14, 0.27, 0.4, 0.53, 0.66, 0.79, 0.92];

/** Ranting laurel melengkung — satu sisi karangan; daun berpasangan mengikuti arah batang. */
function LaurelBranch({ flip }: { flip?: boolean }) {
  const { p0, p1, p2, p3 } = STEM;
  return (
    <g transform={flip ? "translate(200 0) scale(-1 1)" : undefined}>
      <path d={`M${p0}C${p1} ${p2} ${p3}`} />
      {LEAF_STEPS.map((t) => {
        const { x, y, angle } = bezier(t);
        return (
          <g key={t} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)})`}>
            {/* Daun luar & dalam, condong ke arah ujung batang. */}
            <path d="M0 0c4-9 13-13 20-11-4 8-12 12-20 11Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M0 0c4 9 13 13 20 11-4-8-12-12-20-11Z" fill="currentColor" fillOpacity="0.2" />
          </g>
        );
      })}
      <circle cx={p3[0]} cy={p3[1]} r="2.2" fill="currentColor" stroke="none" />
    </g>
  );
}

/** Lambang: karangan laurel mengelilingi monogram, dengan pita tanggal di bawah. */
export function Crest({ monogram, caption, className }: { monogram: string; caption?: string; className?: string }) {
  return (
    <div className={cn("relative mx-auto w-40 text-burgundy", className)} aria-hidden>
      <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="w-full">
        <LaurelBranch />
        <LaurelBranch flip />
        <circle cx="100" cy="98" r="50" strokeWidth="0.8" />
        <circle cx="100" cy="98" r="45" strokeWidth="0.5" strokeDasharray="1 3" />
        <path d="M92 182l8-8 8 8-8 8Z" fill="currentColor" fillOpacity="0.25" />
      </svg>
      <span className="absolute inset-x-0 top-[49%] -translate-y-1/2 text-center font-fell text-[2.4rem] italic leading-none">{monogram}</span>
      {caption && <span className="smallcaps mt-1 block text-center text-sm text-burgundy">{caption}</span>}
    </div>
  );
}

/** Pemisah: garis — fleuron — garis. */
export function Fleuron({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center gap-4 text-burgundy/80", className)}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-current" />
      <svg viewBox="0 0 40 24" className="h-5 w-8" fill="currentColor">
        <path d="M20 22c-6-4-12-7-12-13 0-4 3-6 6-6 3 0 5 2 6 5 1-3 3-5 6-5 3 0 6 2 6 6 0 6-6 9-12 13Z" fillOpacity="0.85" />
        <path d="M2 12h5M33 12h5" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}

/** Kartu bercetak: kertas bertekstur, bingkai garis ganda, opsional sudut filigri. */
export function EngravedCard({
  children,
  className,
  innerClassName,
  corners = true,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  corners?: boolean;
}) {
  return (
    <div className={cn("paper bg-antique p-2 shadow-[0_24px_50px_-30px_rgba(43,33,27,0.55)] ring-1 ring-burgundy/60", className)}>
      <div className={cn("relative h-full border-[3px] border-double border-burgundy/55 px-6 py-12 sm:px-12 sm:py-16", innerClassName)}>
        {corners && <FlourishCorners />}
        {children}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Photo } from "./Photo";
import { Fleuron } from "./Ornaments";
import { Reveal } from "./Reveal";

/** Sudut penjepit foto album (segitiga kertas cokelat). */
function PhotoCorner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={cn("absolute z-10 h-7 w-7 bg-umber/85 shadow-sm [clip-path:polygon(0_0,100%_0,0_100%)]", className)}
    />
  );
}

/**
 * Foto yang "ditempel" di halaman album: pinggiran putih, sudut penjepit,
 * sedikit miring, dan keterangan bergaya tulisan tangan di bawahnya.
 */
export function AlbumPhoto({
  src,
  alt,
  caption,
  tilt = 0,
  frameClassName,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  /** Derajat kemiringan, mis. -2 atau 1.5. */
  tilt?: number;
  frameClassName?: string;
  className?: string;
}) {
  return (
    <figure className={className} style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="relative bg-[#FBF6EC] p-2.5 pb-3 shadow-[0_12px_24px_-14px_rgba(43,33,27,0.55)] sm:p-3">
        <PhotoCorner className="-left-1.5 -top-1.5" />
        <PhotoCorner className="-right-1.5 -top-1.5 rotate-90" />
        <PhotoCorner className="-bottom-1.5 -right-1.5 rotate-180" />
        <PhotoCorner className="-bottom-1.5 -left-1.5 -rotate-90" />
        <Photo src={src} alt={alt} className={cn("w-full", frameClassName)} />
      </div>
      {caption && <figcaption className="mt-3 text-center font-fell text-base italic text-umber">{caption}</figcaption>}
    </figure>
  );
}

/** Potret oval ala kameo dengan cincin ganda burgundy. */
export function Cameo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("relative mx-auto aspect-[3/4] w-56 sm:w-64", className)}>
      <div className="absolute inset-0 rounded-[50%] border border-burgundy/70" />
      <div className="absolute inset-[7px] rounded-[50%] border-[3px] border-double border-burgundy/50" />
      <Photo src={src} alt={alt} className="absolute inset-[16px] rounded-[50%]" />
    </div>
  );
}

/** Judul bagian: label kapital kecil, judul Fell besar, fleuron di bawah. */
export function SectionTitle({ label, children, id, light = false }: { label: string; children: ReactNode; id?: string; light?: boolean }) {
  return (
    <Reveal as="header" className="text-center">
      <p className={cn("smallcaps", light && "text-antique/70")}>{label}</p>
      <h2 id={id} className={cn("mt-3 font-fell text-[clamp(2.4rem,6vw,3.8rem)] leading-tight text-balance", light ? "text-antique" : "text-burgundy")}>
        {children}
      </h2>
      <Fleuron className={cn("mt-5", light && "text-antique/70")} />
    </Reveal>
  );
}

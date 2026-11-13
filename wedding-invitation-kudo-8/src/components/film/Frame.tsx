import { cn } from "@/lib/cn";
import { formatCoordinate, formatElevation, MOUNTAINS, type MountainId } from "@/lib/mountains";

/** Pita hitam atas–bawah: rasio layar lebar bioskop. */
export function Letterbox({ className }: { className?: string }) {
  return (
    <>
      <div aria-hidden data-letterbox="top" className={cn("pointer-events-none absolute inset-x-0 top-0 z-20 h-[6svh] bg-film sm:h-[8svh]", className)} />
      <div aria-hidden data-letterbox="bottom" className={cn("pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[6svh] bg-film sm:h-[8svh]", className)} />
    </>
  );
}

interface SlateProps {
  /** Nomor adegan, mis. 3 → "SC 03". */
  scene: number;
  mountain?: MountainId;
  className?: string;
}

/** Keterangan adegan bergaya slate: nomor adegan, gunung, ketinggian, koordinat. */
export function Slate({ scene, mountain, className }: SlateProps) {
  const m = mountain ? MOUNTAINS[mountain] : null;
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-seluloid/60", className)}>
      <span className="text-amber">SC {String(scene).padStart(2, "0")}</span>
      {m && (
        <>
          <span aria-hidden className="h-px w-5 bg-seluloid/30" />
          <span>
            {m.name} · {formatElevation(m.elevation)}
          </span>
          <span className="hidden sm:inline">{formatCoordinate(m.lat, m.lon)}</span>
        </>
      )}
    </p>
  );
}

interface TitleCardProps {
  id: string;
  /** Penanda bab, mis. "Chapter II · The Trail". */
  kicker: string;
  title: string;
  /** Anak judul italic (bahasa Indonesia). */
  subtitle?: string;
  intro?: string;
  className?: string;
}

/** Kartu judul bab: penanda mono, judul kapital tipis yang renggang, anak judul italic. */
export function TitleCard({ id, kicker, title, subtitle, intro, className }: TitleCardProps) {
  return (
    <header className={cn("mx-auto max-w-3xl text-center", className)}>
      <p data-reveal="fade" className="label">
        {kicker}
      </p>
      <h2 id={id} data-reveal="up" className="credit mt-5 text-[clamp(2.2rem,7.5vw,4.6rem)] leading-[1.02] [text-wrap:balance]">
        {title}
      </h2>
      {subtitle && (
        <p data-reveal="up" className="mt-3 font-display text-[clamp(1.3rem,3.6vw,1.9rem)] italic text-amber">
          {subtitle}
        </p>
      )}
      {intro && (
        <p data-reveal="up" className="mx-auto mt-6 max-w-lg text-seluloid/75 [text-wrap:pretty]">
          {intro}
        </p>
      )}
    </header>
  );
}

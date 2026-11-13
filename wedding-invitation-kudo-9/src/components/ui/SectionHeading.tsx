import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  id: string;
  label: string;
  title: string;
  intro?: string;
  /** Rata kiri untuk tata letak editorial (default: tengah). */
  align?: "center" | "left";
  className?: string;
}

/** Ornamen kuncup teratai kecil di antara dua garis. */
function LotusRule({ align }: { align: "center" | "left" }) {
  return (
    <div data-reveal="fade" aria-hidden className={cn("mt-6 flex items-center gap-3", align === "center" && "justify-center")}>
      <span className="h-px w-12 bg-lavender/70" />
      <svg viewBox="-12 -14 24 16" className="h-3.5 w-5 text-lavender">
        <path d="M0 -13 C-4 -9 -4 -4 0 0 C4 -4 4 -9 0 -13Z M-8 -9 C-10 -4 -6 0 0 0 C-3 -3 -5 -7 -8 -9Z M8 -9 C10 -4 6 0 0 0 C3 -3 5 -7 8 -9Z" fill="currentColor" />
      </svg>
      <span className="h-px w-12 bg-lavender/70" />
    </div>
  );
}

/**
 * Judul adegan: label kecil, judul display besar, dan ornamen kuncup teratai.
 * Judul berada di lapisan parallax tersendiri (data-depth) agar terasa melayang di atas foto.
 */
export function SectionHeading({ id, label, title, intro, align = "center", className }: SectionHeadingProps) {
  return (
    <header className={cn("mx-auto max-w-2xl", align === "center" ? "text-center" : "text-left", className)}>
      <div data-depth="18">
        <p data-reveal="up" className="label">
          {label}
        </p>
        <h2 id={id} data-reveal="up" className="mt-4 font-display text-[clamp(2.4rem,6.5vw,4.2rem)] italic leading-[1.04] [text-wrap:balance]">
          {title}
        </h2>
        <LotusRule align={align} />
        {intro && (
          <p data-reveal="up" className={cn("mt-6 max-w-lg text-ink/70 [text-wrap:pretty]", align === "center" && "mx-auto")}>
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}

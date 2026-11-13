import { cn } from "@/lib/cn";
import { gununganOutline } from "@/lib/gunungan";

const MINI_GUNUNGAN = gununganOutline();

interface SectionHeadingProps {
  id: string;
  /** Label berbahasa Jawa (mis. "Adicara"). */
  label: string;
  title: string;
  intro?: string;
  /** Untuk latar gelap (malam / sogan). */
  isDark?: boolean;
  className?: string;
}

/**
 * Judul adegan: label prasasti, judul italic besar, dan pemisah berupa gunungan mungil
 * di antara dua garis prada. Berada di lapisan parallax tersendiri (data-depth).
 */
export function SectionHeading({ id, label, title, intro, isDark, className }: SectionHeadingProps) {
  return (
    <header className={cn("mx-auto max-w-2xl text-center", className)}>
      <div data-depth="18">
        <p data-reveal="up" className={cn("label", isDark && "text-prada-light")}>
          {label}
        </p>
        <h2 id={id} data-reveal="up" className={cn("mt-4 font-serif text-[clamp(2.5rem,7vw,4.25rem)] italic leading-[1.04] [text-wrap:balance]", isDark && "text-gading")}>
          {title}
        </h2>
        <div data-reveal="fade" aria-hidden className="mx-auto mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-14 bg-gradient-to-l from-prada to-transparent" />
          <svg viewBox="0 0 200 300" className="h-6 w-4">
            <path d={MINI_GUNUNGAN} fill="#B8914E" />
          </svg>
          <span className="h-px w-14 bg-gradient-to-r from-prada to-transparent" />
        </div>
        {intro && (
          <p data-reveal="up" className={cn("mx-auto mt-6 max-w-lg [text-wrap:pretty]", isDark ? "text-gading/75" : "text-ink/70")}>
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}

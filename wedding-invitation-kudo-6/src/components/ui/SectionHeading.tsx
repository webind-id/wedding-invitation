import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  id: string;
  label: string;
  title: string;
  intro?: string;
  className?: string;
}

/**
 * Judul adegan: label kecil, judul display besar, dan garis champagne tipis.
 * Judul berada di lapisan parallax tersendiri (data-depth) agar terasa melayang di atas foto.
 */
export function SectionHeading({ id, label, title, intro, className }: SectionHeadingProps) {
  return (
    <header className={cn("mx-auto max-w-2xl text-center", className)}>
      <div data-depth="18">
        <p data-reveal="up" className="label">
          {label}
        </p>
        <h2 id={id} data-reveal="up" className="mt-4 font-display text-[clamp(2.6rem,7vw,4.5rem)] font-light italic leading-[1.02] [text-wrap:balance]">
          {title}
        </h2>
        <div data-reveal="fade" aria-hidden className="mx-auto mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-champagne" />
          <span className="h-1.5 w-1.5 rotate-45 bg-champagne" />
          <span className="h-px w-12 bg-champagne" />
        </div>
        {intro && (
          <p data-reveal="up" className="mx-auto mt-6 max-w-lg text-ink/70 [text-wrap:pretty]">
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}

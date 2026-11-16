import { cn } from "@/lib/cn";
import { LanternDivider } from "../lantern/LanternDivider";

interface SectionHeadingProps {
  id?: string;
  badge?: string;
  scriptTitle?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ id, badge, scriptTitle, title, subtitle, className }: SectionHeadingProps) {
  return (
    <div data-reveal="up" className={cn("relative mb-10 text-center md:mb-14", className)}>
      {badge && (
        <div className="mb-3 flex justify-center">
          <span className="badge-gold">{badge}</span>
        </div>
      )}

      {scriptTitle && (
        <p className="text-glow mb-1 font-script text-4xl leading-tight text-ember-300 sm:text-5xl">
          {scriptTitle.split("&").map((part, i) => (
            <span key={i}>
              {i > 0 && <span className="font-serif italic">&amp;</span>}
              {part}
            </span>
          ))}
        </p>
      )}

      <h2 id={id} className="font-serif text-3xl font-semibold tracking-tight text-moon sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-moon-muted [text-wrap:pretty] sm:text-base">
          {subtitle}
        </p>
      )}

      <LanternDivider />
    </div>
  );
}

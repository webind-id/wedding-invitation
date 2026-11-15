import { cn } from "@/lib/cn";
import { EarthyDivider } from "../rustic/EarthyDivider";

interface SectionHeadingProps {
  badge?: string;
  scriptTitle?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  badge,
  scriptTitle,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      data-reveal="up"
      className={cn(
        "relative mb-10 md:mb-14",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {badge && (
        <div className={cn("mb-3 flex items-center", align === "center" ? "justify-center" : "justify-start")}>
          <span className="badge-terracotta">
            {badge}
          </span>
        </div>
      )}

      {scriptTitle && (
        <p className="font-script text-3xl sm:text-4xl text-terracotta mb-1 leading-none">
          {scriptTitle}
        </p>
      )}

      <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-earth-ink">
        {title}
      </h2>

      {subtitle && (
        <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-earth-muted leading-relaxed [text-wrap:pretty]">
          {subtitle}
        </p>
      )}

      <EarthyDivider className={align === "left" ? "justify-start pl-2" : ""} />
    </div>
  );
}

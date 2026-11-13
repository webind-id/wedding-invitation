import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GUNUNGAN_HEIGHT, GUNUNGAN_WIDTH, gununganOutline } from "@/lib/gunungan";

const NORMALIZED = gununganOutline(1 / GUNUNGAN_WIDTH, 1 / GUNUNGAN_HEIGHT);
const OUTLINE = gununganOutline();

/**
 * Bingkai berbentuk gunungan untuk foto: isi dipotong mengikuti garis luar
 * gunungan, lalu ditimpa garis prada ganda + cecek. Lebar diatur lewat className.
 */
export function GununganFrame({ children, className }: { children: ReactNode; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <div className={cn("relative", className)} style={{ aspectRatio: `${GUNUNGAN_WIDTH} / ${GUNUNGAN_HEIGHT}` }}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <clipPath id={`${uid}-clip`} clipPathUnits="objectBoundingBox">
          <path d={NORMALIZED} />
        </clipPath>
      </svg>
      <div className="absolute inset-0" style={{ clipPath: `url(#${uid}-clip)` }}>
        {children}
      </div>
      <svg viewBox={`0 0 ${GUNUNGAN_WIDTH} ${GUNUNGAN_HEIGHT}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <path d={OUTLINE} fill="none" stroke="#B8914E" strokeWidth="3" />
        <path d={OUTLINE} transform="translate(100 160) scale(0.955) translate(-100 -160)" fill="none" stroke="#FBF8F1" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0 6" />
        <path d={OUTLINE} transform="translate(100 160) scale(1.035) translate(-100 -160)" fill="none" stroke="#B8914E" strokeOpacity="0.5" strokeWidth="1" />
      </svg>
    </div>
  );
}

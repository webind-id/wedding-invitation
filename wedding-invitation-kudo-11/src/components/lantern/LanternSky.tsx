import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { skyLanterns, type SkyOptions } from "@/lib/lanterns";
import { Lantern3D } from "./Lantern3D";

interface LanternSkyProps {
  count?: number;
  seed?: number;
  /**
   * rise  = lampion terbang dari bawah ke atas tanpa henti (sampul, hero).
   * drift = lampion mengapung di tempat dan bergeser mengikuti scroll (bagian lain).
   */
  mode?: "rise" | "drift";
  /** Lampion dengan kedalaman ≥ nilai ini digambar 3D berputar; sisanya datar & ringan. */
  near3D?: number;
  /** Tampilkan bintang berkelip. */
  stars?: boolean;
  /** Di layar kecil sembunyikan separuh lampion agar tetap ringan. */
  thinOnMobile?: boolean;
  options?: SkyOptions;
  className?: string;
}

/**
 * Langit penuh lampion. Susunannya deterministik (seed), lampion jauh lebih kecil,
 * redup, buram, dan lambat — memberi kedalaman paralaks tanpa WebGL.
 */
export function LanternSky({
  count = 14,
  seed = 11,
  mode = "drift",
  near3D = 0.62,
  stars = true,
  thinOnMobile = true,
  options,
  className,
}: LanternSkyProps) {
  const lanterns = skyLanterns(count, seed, options);

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}>
      {stars && (
        <>
          <div className="starfield absolute inset-0 opacity-60" />
          <div className="starfield animate-twinkle absolute inset-0 [background-position:90px_60px]" />
        </>
      )}

      {lanterns.map((l) => {
        const vars = {
          "--duration": `${l.duration}s`,
          "--delay": `${l.delay}s`,
          "--sway": `${l.sway}px`,
          "--lantern-opacity": 0.45 + l.depth * 0.55,
        } as CSSProperties;
        const is3D = l.depth >= near3D;
        const lantern = (
          <Lantern3D
            size={l.size}
            variant={l.variant}
            flat={!is3D}
            spin={is3D ? 10 + (1 - l.depth) * 14 : 0}
            glow={l.depth > 0.25}
          />
        );
        const hideOnMobile = thinOnMobile && l.id % 2 === 1;

        if (mode === "rise") {
          return (
            <div
              key={l.id}
              className={cn("animate-lantern-rise absolute top-full", hideOnMobile && "hidden sm:block")}
              style={{ ...vars, left: `${l.left}%`, zIndex: Math.round(l.depth * 10), filter: l.depth < 0.3 ? "blur(1.2px)" : undefined }}
            >
              <div className="animate-lantern-sway" style={vars}>
                {lantern}
              </div>
            </div>
          );
        }

        return (
          <div
            key={l.id}
            data-depth={Math.round(20 + l.depth * 60)}
            className={cn("absolute", hideOnMobile && "hidden sm:block")}
            style={{
              left: `${l.left}%`,
              top: `${l.top}%`,
              zIndex: Math.round(l.depth * 10),
              opacity: 0.4 + l.depth * 0.5,
              filter: l.depth < 0.3 ? "blur(1.2px)" : undefined,
            }}
          >
            <div className="animate-lantern-bob" style={{ ...vars, "--duration": `${6 + l.depth * 5}s` } as CSSProperties}>
              {lantern}
            </div>
          </div>
        );
      })}
    </div>
  );
}

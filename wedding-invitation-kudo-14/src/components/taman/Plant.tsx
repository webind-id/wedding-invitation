import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { swayTiming } from "@/lib/sway";

interface PlantProps {
  src: string;
  width: number;
  height: number;
  /** Kelas posisi & ukuran (lihat globals.css, mis. "tree-far is-l"). */
  className: string;
  /** Cara muncul: pohon tumbuh dari tanah, bunga mekar. */
  grow: "tree" | "bloom";
  /** Detik setelah taman mulai tumbuh. */
  delay: number;
  /** Seed goyangan — tiap tanaman bergoyang di fase berbeda. */
  seed: number;
  /** Cermin horizontal. */
  mirror?: boolean;
}

const SWAY_BASE_S = 7;
const SWAY_SPREAD_S = 3;

/**
 * Satu tanaman di adegan pembuka, tiga lapis agar tiap gerak punya transform sendiri:
 *   luar  → posisi + menyibak ke samping saat dibuka (`translate`, globals.css `.played`)
 *   tengah→ tumbuh dari tanah / mekar sekali (`.grow-tree` / `.grow-bloom`, saat `.grown`)
 *   dalam → bergoyang pelan dari pangkalnya (`.sway-plant`, hanya saat terlihat)
 */
export function Plant({ src, width, height, className, grow, delay, seed, mirror }: PlantProps) {
  const timing = swayTiming(seed, 0, SWAY_BASE_S, SWAY_SPREAD_S);
  return (
    <div className={cn("scene-el plant", className)}>
      <div className={grow === "tree" ? "grow-tree" : "grow-bloom"} style={{ "--d": `${delay}s` } as CSSProperties}>
        <div className="sway-plant" style={{ "--sway-delay": `${timing.delay}s`, "--sway-dur": `${timing.duration}s` } as CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" width={width} height={height} decoding="async" draggable={false} className={cn(mirror && "-scale-x-100")} />
        </div>
      </div>
    </div>
  );
}

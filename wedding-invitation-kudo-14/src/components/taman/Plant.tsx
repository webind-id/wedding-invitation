import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { swayTiming } from "@/lib/sway";

interface PlantProps {
  src: string;
  width: number;
  height: number;
  /** Kelas posisi & ukuran (lihat globals.css, mis. "tree-far is-l", atau utilitas Tailwind). */
  className: string;
  /**
   * Cara muncul: pohon tumbuh dari tanah, bunga mekar (keduanya saat hero `.played`), atau
   * `"none"` — langsung tampil, hanya berayun (mis. di jendela penutup).
   */
  grow: "tree" | "bloom" | "none";
  /** Detik setelah taman mulai tumbuh (diabaikan untuk `grow="none"`). */
  delay?: number;
  /** Seed goyangan — tiap tanaman bergoyang di fase berbeda. */
  seed: number;
  /** Cermin horizontal. */
  mirror?: boolean;
  /** Muat saat mendekati layar (tanaman di bawah lipatan). */
  lazy?: boolean;
}

const SWAY_BASE_S = 7;
const SWAY_SPREAD_S = 3;
const GROW_CLASS = { tree: "grow-tree", bloom: "grow-bloom", none: "" } as const;

/**
 * Satu tanaman, tiga lapis agar tiap gerak punya transform sendiri:
 *   luar  → posisi + menyibak ke samping saat gerbang terbuka (`translate`, globals.css `.parted`)
 *   tengah→ tumbuh dari tanah / mekar sekali (`.grow-tree` / `.grow-bloom`, saat `.played`)
 *   dalam → berayun pelan dari pangkalnya (`.sway-plant`, hanya saat bagiannya terlihat)
 */
export function Plant({ src, width, height, className, grow, delay = 0, seed, mirror, lazy }: PlantProps) {
  const timing = swayTiming(seed, 0, SWAY_BASE_S, SWAY_SPREAD_S);
  return (
    <div className={cn("scene-el plant", className)}>
      <div className={GROW_CLASS[grow]} style={{ "--d": `${delay}s` } as CSSProperties}>
        <div className="sway-plant" style={{ "--sway-delay": `${timing.delay}s`, "--sway-dur": `${timing.duration}s` } as CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            width={width}
            height={height}
            decoding="async"
            loading={lazy ? "lazy" : undefined}
            draggable={false}
            className={cn(mirror && "-scale-x-100")}
          />
        </div>
      </div>
    </div>
  );
}

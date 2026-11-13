/**
 * Adegan film undangan: foto gunung asli yang menjadi latar tiap bab.
 * Foto Wikimedia Commons berlisensi CC BY-SA 4.0 — kredit wajib tampil (lihat
 * Closing → end credits). Foto tanpa `credit` disediakan pemilik template.
 */
import type { MountainId } from "./mountains";

export type SceneId = "prau" | "sindoro" | "sumbing" | "merbabu-trail" | "merbabu-sabana" | "merbabu" | "merbabu-sunrise" | "lawu" | "slamet" | "night";

export interface PhotoCredit {
  artist: string;
  license: string;
  /** Halaman berkas di Wikimedia Commons. */
  source: string;
}

export interface Scene {
  id: SceneId;
  src: string;
  alt: string;
  mountain: MountainId | null;
  /** object-position: titik fokus yang dipertahankan saat foto dipotong (mis. layar ponsel tegak). */
  focus: string;
  credit: PhotoCredit | null;
  /** Versi lanskap untuk layar ≥ 768px, bila `src` berorientasi potret. */
  wide?: { src: string; focus: string; credit: PhotoCredit };
}

const commons = (file: string, artist: string): PhotoCredit => ({
  artist,
  license: "CC BY-SA 4.0",
  source: `https://commons.wikimedia.org/wiki/File:${file}`,
});

export const SCENES: Record<SceneId, Scene> = {
  prau: { id: "prau", src: "/images/mountains/prau.webp", alt: "Sindoro dan Sumbing di atas lautan awan, dilihat dari Gunung Prau", mountain: "prau", focus: "50% 55%", credit: null, wide: { src: "/images/mountains/prau-wide.webp", focus: "45% 92%", credit: commons("Beautiful_Sunrise_at_Mt._Prau.jpg", "Van Monlak") } },
  sindoro: { id: "sindoro", src: "/images/mountains/sindoro.webp", alt: "Pendaki memandang Gunung Sindoro saat fajar dari puncak Sumbing", mountain: "sindoro", focus: "50% 50%", credit: commons("Gunung_Sindoro_dari_puncak_Gunung_Sumbing.jpg", "Endah both") },
  sumbing: { id: "sumbing", src: "/images/mountains/sumbing.webp", alt: "Pendaki berjaket menatap Gunung Sumbing", mountain: "sumbing", focus: "42% 50%", credit: commons("Mount_Sumbing,_Central_Java.jpg", "Muhammad Rinandar") },
  "merbabu-trail": { id: "merbabu-trail", src: "/images/mountains/merbabu-trail.webp", alt: "Rombongan pendaki di jalur sabana Merbabu dengan Merapi di kejauhan", mountain: "merbabu", focus: "40% 50%", credit: commons("Jalan_Sabana_2_Selo_TNGM.jpg", "Daryant.id") },
  "merbabu-sabana": { id: "merbabu-sabana", src: "/images/mountains/merbabu-sabana.webp", alt: "Sabana 1 Merbabu dan Merapi berselimut awan", mountain: "merbabu", focus: "70% 50%", credit: commons("Sabana_1_Merbabu.jpg", "LiburanBoongan") },
  merbabu: { id: "merbabu", src: "/images/mountains/merbabu.webp", alt: "Pohon di sabana Merbabu dengan Merapi di kejauhan", mountain: "merbabu", focus: "50% 60%", credit: null, wide: { src: "/images/mountains/merbabu-wide.webp", focus: "60% 50%", credit: commons("Sabana_3.jpg", "Daryant.id") } },
  "merbabu-sunrise": { id: "merbabu-sunrise", src: "/images/mountains/merbabu-sunrise.webp", alt: "Matahari terbit di atas awan dari sabana Merbabu", mountain: "merbabu", focus: "60% 60%", credit: commons("View_sunrise_dari_puncak_sabana_satu_Gunung_Merbabu.jpg", "Ryanf123") },
  lawu: { id: "lawu", src: "/images/mountains/lawu.webp", alt: "Siluet pendaki menyambut matahari terbit di puncak Lawu", mountain: "lawu", focus: "62% 70%", credit: commons("Pendaki_menikmati_Sunrise_di_Puncak_Gunung_Lawu.jpg", "Hendrojkson") },
  slamet: { id: "slamet", src: "/images/mountains/slamet.webp", alt: "Pendaki duduk di puncak Slamet di atas lautan awan", mountain: "slamet", focus: "55% 50%", credit: commons("Puncak_Gunung_Slamet_-_Farhan_Journey.jpg", "Farhan Journey") },
  night: { id: "night", src: "/images/mountains/night.webp", alt: "Bima Sakti di atas gunung pada malam hari", mountain: null, focus: "50% 40%", credit: commons("Alaksi_bimasakti_di_atas_gunung_pedesaan.jpg", "RahmadHimawan Photography") },
};

/** Adegan pos-pos jalur pendakian (Merbabu via Selo), dipakai bergantian. */
const TRAIL_STOPS: SceneId[] = ["merbabu-trail", "merbabu-sabana", "merbabu"];
export const SUMMIT_SCENE: SceneId = "merbabu-sunrise";

/** Satu adegan per bab kisah; bab terakhir selalu adegan puncak. */
export function trailScenes(count: number): SceneId[] {
  const n = Math.max(0, Math.floor(count));
  return Array.from({ length: n }, (_, i) => (i === n - 1 ? SUMMIT_SCENE : TRAIL_STOPS[i % TRAIL_STOPS.length]));
}

export interface CreditLine extends PhotoCredit {
  scene: SceneId;
  mountain: MountainId | null;
}

/** Daftar kredit foto untuk end credits — satu baris per foto berlisensi. */
export function photoCredits(): CreditLine[] {
  return Object.values(SCENES).flatMap((s) => [
    ...(s.credit ? [{ ...s.credit, scene: s.id, mountain: s.mountain }] : []),
    ...(s.wide ? [{ ...s.wide.credit, scene: s.id, mountain: s.mountain }] : []),
  ]);
}

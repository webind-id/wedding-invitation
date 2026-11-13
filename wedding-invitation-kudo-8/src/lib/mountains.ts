/**
 * Enam gunung yang menjadi "jalur" undangan ini. Tinggi & koordinat puncak
 * adalah angka yang lazim dipakai pendaki (pembulatan), bukan data survei.
 */

export type MountainId = "prau" | "sindoro" | "sumbing" | "merbabu" | "lawu" | "slamet";

export interface Mountain {
  id: MountainId;
  name: string;
  /** Meter di atas permukaan laut. */
  elevation: number;
  lat: number;
  lon: number;
  region: string;
  /** Basecamp jalur pendakian yang paling dikenal. */
  basecamp: string;
  summit: string;
}

export const MOUNTAINS: Record<MountainId, Mountain> = {
  prau: { id: "prau", name: "Prau", elevation: 2565, lat: -7.187, lon: 109.923, region: "Dieng, Wonosobo", basecamp: "Patak Banteng", summit: "Puncak Prau" },
  sindoro: { id: "sindoro", name: "Sindoro", elevation: 3153, lat: -7.3, lon: 109.998, region: "Temanggung", basecamp: "Kledung", summit: "Puncak Sindoro" },
  sumbing: { id: "sumbing", name: "Sumbing", elevation: 3371, lat: -7.384, lon: 110.066, region: "Wonosobo", basecamp: "Garung", summit: "Puncak Rajawali" },
  merbabu: { id: "merbabu", name: "Merbabu", elevation: 3145, lat: -7.455, lon: 110.44, region: "Boyolali", basecamp: "Selo", summit: "Kenteng Songo" },
  lawu: { id: "lawu", name: "Lawu", elevation: 3265, lat: -7.625, lon: 111.194, region: "Magetan", basecamp: "Cemoro Sewu", summit: "Hargo Dumilah" },
  slamet: { id: "slamet", name: "Slamet", elevation: 3428, lat: -7.242, lon: 109.208, region: "Purbalingga", basecamp: "Bambangan", summit: "Puncak Surono" },
};

export const MOUNTAIN_ORDER: MountainId[] = ["prau", "sindoro", "sumbing", "merbabu", "lawu", "slamet"];

/** Gunung ke-i secara berputar (untuk keterangan foto, dsb.). */
export function mountainAt(index: number): Mountain {
  const n = MOUNTAIN_ORDER.length;
  return MOUNTAINS[MOUNTAIN_ORDER[((index % n) + n) % n]];
}

function degMin(value: number): string {
  const abs = Math.abs(value);
  let deg = Math.floor(abs);
  let min = Math.round((abs - deg) * 60);
  if (min === 60) {
    deg += 1;
    min = 0;
  }
  return `${deg}°${String(min).padStart(2, "0")}′`;
}

/** "7°11′ LS · 109°55′ BT" — lintang selatan/utara, bujur timur/barat. */
export function formatCoordinate(lat: number, lon: number): string {
  return `${degMin(lat)} ${lat < 0 ? "LS" : "LU"} · ${degMin(lon)} ${lon < 0 ? "BB" : "BT"}`;
}

const ELEVATION = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

/** "3.428 mdpl" */
export function formatElevation(meters: number): string {
  return `${ELEVATION.format(meters)} mdpl`;
}

/**
 * Kartu pratinjau tautan 1200×630 bergaya "Tapak Puncak" (kudo-8): bingkai film sinematik —
 * foto penuh, letterbox hitam, keterangan adegan monospasi. Dirender oleh next/og (Satori):
 * hanya flexbox & properti CSS dasar, setiap div berisi >1 anak wajib display:flex.
 */
export const OG_PHOTO = { width: 1200, height: 630 } as const;

/** Berkas di public/og/fonts (WOFF statis Fontsource, OFL). Bentuk & nama diekspor untuk lib/og-image.ts. */
export interface OgFontFile {
  file: string;
  name: string;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFontFile[] = [
  { file: "cormorant-garamond-latin-300-normal.woff", name: "Cormorant", weight: 300, style: "normal" },
  { file: "cormorant-garamond-latin-400-italic.woff", name: "Cormorant", weight: 400, style: "italic" },
  { file: "jetbrains-mono-latin-400-normal.woff", name: "Mono", weight: 400, style: "normal" },
  { file: "jetbrains-mono-latin-500-normal.woff", name: "Mono", weight: 500, style: "normal" },
];

const C = {
  film: "#07090B",
  filmSoft: "#11161A",
  seluloid: "#F3EFE6",
  amber: "#E8B25C",
  amberDeep: "#B98235",
  kabut: "#9FB3B4",
  abu: "#8E8A82",
};

const BAR = 64;

export interface OgCardProps {
  first: string;
  second: string;
  /** "Sabtu, 12 Juni 2027" */
  date: string;
  venue: string;
  /** Data URL foto sampul yang sudah dipotong; null → langit fajar berkabut. */
  photo: string | null;
}

/** Kedua nama sebaris, jadi ukuran mengikuti panjang gabungan; nama yang sangat panjang turun ke baris kedua. */
function nameSize(a: string, b: string): number {
  const total = a.length + b.length;
  return total > 18 ? 64 : total > 12 ? 84 : 104;
}

export function OgCard({ first, second, date, venue, photo }: OgCardProps) {
  const size = nameSize(first, second);
  const caption = [date, venue].filter(Boolean).join("  ·  ").toUpperCase();
  return (
    <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "column", background: C.film, position: "relative" }}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img src={photo} width={OG_PHOTO.width} height={OG_PHOTO.height} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} />
      ) : (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            background: `linear-gradient(180deg, ${C.filmSoft} 0%, #2B3A40 45%, ${C.kabut} 72%, ${C.amberDeep} 100%)`,
          }}
        />
      )}
      {/* Gradasi tengah agar nama terbaca di atas foto gunung */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", background: "radial-gradient(ellipse at 50% 50%, rgba(7,9,11,0.62) 0%, rgba(7,9,11,0.35) 55%, rgba(7,9,11,0.15) 100%)" }} />

      {/* Letterbox atas */}
      <div style={{ position: "relative", height: BAR, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px", background: C.film }}>
        <div style={{ fontFamily: "Mono", fontWeight: 500, fontSize: 15, letterSpacing: 3, color: C.amber }}>SC. 01 — UNDANGAN PERNIKAHAN</div>
        <div style={{ fontFamily: "Mono", fontSize: 15, letterSpacing: 3, color: C.abu }}>THE JOURNEY BEGINS</div>
      </div>

      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", maxWidth: 1100 }}>
          <div style={{ fontFamily: "Cormorant", fontWeight: 300, fontSize: size, letterSpacing: 10, color: C.seluloid, textTransform: "uppercase" }}>{first}</div>
          <div style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: Math.round(size * 0.7), color: C.amber, margin: "0 28px" }}>&amp;</div>
          <div style={{ fontFamily: "Cormorant", fontWeight: 300, fontSize: size, letterSpacing: 10, color: C.seluloid, textTransform: "uppercase" }}>{second}</div>
        </div>
        <div style={{ width: 90, height: 1, background: C.amber, marginTop: 18, display: "flex" }} />
        <div style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: 30, color: C.seluloid, marginTop: 18 }}>sampai jumpa di puncak</div>
      </div>

      {/* Letterbox bawah */}
      <div style={{ position: "relative", height: BAR, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 44px", background: C.film }}>
        <div style={{ fontFamily: "Mono", fontSize: 16, letterSpacing: 2, color: C.seluloid }}>{caption}</div>
      </div>
    </div>
  );
}

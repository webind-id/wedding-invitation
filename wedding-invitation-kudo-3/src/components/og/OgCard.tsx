/**
 * Kartu pratinjau tautan 1200×630 bergaya "Chiaroscuro" (kudo-3): foto penuh, cahaya dari kanan,
 * teks di bayangan kiri. Dirender oleh next/og (Satori): hanya flexbox & properti CSS dasar,
 * setiap div berisi >1 anak wajib display:flex.
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
  { file: "instrument-serif-latin-400-normal.woff", name: "Instrument", weight: 400, style: "normal" },
  { file: "instrument-serif-latin-400-italic.woff", name: "Instrument", weight: 400, style: "italic" },
  { file: "manrope-latin-500-normal.woff", name: "Manrope", weight: 500, style: "normal" },
  { file: "manrope-latin-700-normal.woff", name: "Manrope", weight: 700, style: "normal" },
];

const C = {
  ink: "#0A0908",
  charcoal: "#1B1A19",
  umber: "#3B2A20",
  bronze: "#9A7656",
  cream: "#EFE6D6",
  haze: "#A39A8C",
};

export interface OgCardProps {
  first: string;
  second: string;
  /** "Sabtu, 12 Juni 2027" */
  date: string;
  venue: string;
  /** Data URL foto sampul yang sudah dipotong; null → gradasi umber bermonogram. */
  photo: string | null;
}

function nameSize(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  return longest > 12 ? 84 : longest > 9 ? 100 : 124;
}

export function OgCard({ first, second, date, venue, photo }: OgCardProps) {
  const size = nameSize(first, second);
  return (
    <div style={{ width: 1200, height: 630, display: "flex", background: C.ink, position: "relative" }}>
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
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 150,
            background: `radial-gradient(circle at 78% 45%, ${C.umber} 0%, ${C.charcoal} 40%, ${C.ink} 80%)`,
          }}
        >
          <div style={{ fontFamily: "Instrument", fontStyle: "italic", fontSize: 220, color: "rgba(154,118,86,0.55)" }}>{`${first[0] ?? ""}${second[0] ?? ""}`}</div>
        </div>
      )}
      {/* Bayangan: kiri gelap pekat untuk teks, kanan membiarkan cahaya foto */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", background: "linear-gradient(90deg, rgba(10,9,8,0.94) 0%, rgba(10,9,8,0.78) 38%, rgba(10,9,8,0.15) 75%, rgba(10,9,8,0.05) 100%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, display: "flex", background: "linear-gradient(0deg, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0) 35%)" }} />

      <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 84px", width: 760 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 40, height: 1, background: C.bronze, display: "flex" }} />
          <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 16, letterSpacing: 7, color: C.bronze, marginLeft: 16 }}>UNDANGAN PERNIKAHAN</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
          <div style={{ fontFamily: "Instrument", fontSize: size, lineHeight: 1, color: C.cream }}>{first}</div>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{ fontFamily: "Instrument", fontStyle: "italic", fontSize: Math.round(size * 0.7), lineHeight: 1, color: C.bronze, marginRight: 18 }}>&amp;</div>
            <div style={{ fontFamily: "Instrument", fontSize: size, lineHeight: 1, color: C.cream }}>{second}</div>
          </div>
        </div>
        <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 22, letterSpacing: 2, color: C.cream, marginTop: 36 }}>{date}</div>
        <div style={{ fontFamily: "Manrope", fontWeight: 500, fontSize: 19, color: C.haze, marginTop: 8, maxWidth: 600 }}>{venue}</div>
      </div>
    </div>
  );
}

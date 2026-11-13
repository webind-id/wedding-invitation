/**
 * Kartu pratinjau tautan 1200×630 bergaya "Immersive Romance" (kudo-6), dirender oleh
 * next/og (Satori): hanya flexbox & properti CSS dasar, setiap div berisi >1 anak wajib display:flex.
 */
export const OG_PHOTO = { width: 470, height: 630 } as const;

/** Berkas di public/og/fonts (WOFF statis Fontsource, OFL). Bentuk & nama diekspor untuk lib/og-image.ts. */
export interface OgFontFile {
  file: string;
  name: string;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFontFile[] = [
  { file: "allura-latin-400-normal.woff", name: "Allura", weight: 400, style: "normal" },
  { file: "cormorant-garamond-latin-500-normal.woff", name: "Cormorant", weight: 500, style: "normal" },
  { file: "cormorant-garamond-latin-500-italic.woff", name: "Cormorant", weight: 500, style: "italic" },
  { file: "manrope-latin-500-normal.woff", name: "Manrope", weight: 500, style: "normal" },
  { file: "manrope-latin-700-normal.woff", name: "Manrope", weight: 700, style: "normal" },
];

const C = {
  ivory: "#F8F5EF",
  pearl: "#E9E3DA",
  champagne: "#D7BE99",
  champagneDeep: "#A88B62",
  blush: "#E8C9CC",
  rose: "#B9858B",
  mauve: "#8A5D63",
  ink: "#39312F",
};

export interface OgCardProps {
  first: string;
  second: string;
  /** "Sabtu, 12 Juni 2027" */
  date: string;
  venue: string;
  /** Data URL foto sampul yang sudah dipotong; null → panel bunga bermonogram. */
  photo: string | null;
}

function nameSize(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  return longest > 12 ? 76 : longest > 9 ? 92 : 112;
}

export function OgCard({ first, second, date, venue, photo }: OgCardProps) {
  const size = nameSize(first, second);
  return (
    <div style={{ width: 1200, height: 630, display: "flex", background: C.ivory }}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img src={photo} width={OG_PHOTO.width} height={OG_PHOTO.height} style={{ objectFit: "cover" }} />
      ) : (
        <div
          style={{
            width: OG_PHOTO.width,
            height: OG_PHOTO.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(circle at 50% 40%, ${C.ivory} 0%, ${C.blush} 75%, ${C.rose} 140%)`,
          }}
        >
          <div style={{ fontFamily: "Allura", fontSize: 150, color: C.mauve }}>{`${first[0] ?? ""}${second[0] ?? ""}`}</div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", position: "relative", alignItems: "center", justifyContent: "center", background: C.ivory }}>
        {/* Bingkai ganda champagne */}
        <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, border: `1.5px solid ${C.champagne}`, borderRadius: 6, display: "flex" }} />
        <div style={{ position: "absolute", top: 36, left: 36, right: 36, bottom: 36, border: `1px solid ${C.pearl}`, borderRadius: 4, display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 70px" }}>
          <div style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: 17, letterSpacing: 7, color: C.champagneDeep }}>UNDANGAN PERNIKAHAN</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 18 }}>
            <div style={{ fontFamily: "Allura", fontSize: size, lineHeight: 1.05, color: C.ink }}>{first}</div>
            <div style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: 44, lineHeight: 1, color: C.rose, margin: "2px 0 6px" }}>&amp;</div>
            <div style={{ fontFamily: "Allura", fontSize: size, lineHeight: 1.05, color: C.ink }}>{second}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 26 }}>
            <div style={{ width: 70, height: 1, background: C.champagne, display: "flex" }} />
            <div style={{ width: 8, height: 8, margin: "0 14px", transform: "rotate(45deg)", background: C.champagne, display: "flex" }} />
            <div style={{ width: 70, height: 1, background: C.champagne, display: "flex" }} />
          </div>
          <div style={{ fontFamily: "Cormorant", fontWeight: 500, fontSize: 36, color: C.ink, marginTop: 22 }}>{date}</div>
          <div style={{ fontFamily: "Manrope", fontWeight: 500, fontSize: 20, color: C.mauve, marginTop: 8, maxWidth: 560 }}>{venue}</div>
        </div>
      </div>
    </div>
  );
}

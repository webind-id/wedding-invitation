/**
 * Kartu pratinjau tautan 1200×630 bergaya "Teratai Senja" (kudo-9): kabut lilac, nama berhuruf
 * kaligrafi, foto dalam lengkung berbingkai. Dirender oleh next/og (Satori): hanya flexbox &
 * properti CSS dasar, setiap div berisi >1 anak wajib display:flex.
 */
export const OG_PHOTO = { width: 380, height: 500 } as const;

/** Berkas di public/og/fonts (WOFF statis Fontsource, OFL). Bentuk & nama diekspor untuk lib/og-image.ts. */
export interface OgFontFile {
  file: string;
  name: string;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFontFile[] = [
  { file: "pinyon-script-latin-400-normal.woff", name: "Pinyon", weight: 400, style: "normal" },
  { file: "bodoni-moda-latin-400-normal.woff", name: "Bodoni", weight: 400, style: "normal" },
  { file: "bodoni-moda-latin-500-italic.woff", name: "Bodoni", weight: 500, style: "italic" },
  { file: "jost-latin-400-normal.woff", name: "Jost", weight: 400, style: "normal" },
  { file: "jost-latin-500-normal.woff", name: "Jost", weight: 500, style: "normal" },
];

const C = {
  mist: "#F4F1F6",
  haze: "#E7E0EE",
  lilac: "#CDBCDD",
  lavender: "#A893C2",
  plum: "#5E3D6B",
  plumDeep: "#4E3159",
  apricot: "#E9B48A",
  ink: "#2E2733",
};

const ARCH = `${OG_PHOTO.width / 2}px ${OG_PHOTO.width / 2}px 0 0`;

export interface OgCardProps {
  first: string;
  second: string;
  /** "Sabtu, 12 Juni 2027" */
  date: string;
  venue: string;
  /** Data URL foto sampul yang sudah dipotong; null → lengkung lilac bermonogram. */
  photo: string | null;
}

function nameSize(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  return longest > 12 ? 82 : longest > 9 ? 98 : 118;
}

export function OgCard({ first, second, date, venue, photo }: OgCardProps) {
  const size = nameSize(first, second);
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        alignItems: "center",
        background: `radial-gradient(circle at 78% 30%, ${C.haze} 0%, ${C.mist} 55%)`,
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 40px 0 80px" }}>
        <div style={{ fontFamily: "Jost", fontWeight: 500, fontSize: 16, letterSpacing: 8, color: C.plum }}>UNDANGAN PERNIKAHAN</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 14 }}>
          <div style={{ fontFamily: "Pinyon", fontSize: size, lineHeight: 1.12, color: C.plumDeep }}>{first}</div>
          <div style={{ fontFamily: "Bodoni", fontStyle: "italic", fontWeight: 500, fontSize: 40, lineHeight: 1, color: C.lavender }}>&amp;</div>
          <div style={{ fontFamily: "Pinyon", fontSize: size, lineHeight: 1.12, color: C.plumDeep }}>{second}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 22 }}>
          <div style={{ width: 70, height: 1, background: C.lilac, display: "flex" }} />
          <div style={{ width: 9, height: 9, margin: "0 14px", borderRadius: "50%", background: C.apricot, display: "flex" }} />
          <div style={{ width: 70, height: 1, background: C.lilac, display: "flex" }} />
        </div>
        <div style={{ fontFamily: "Bodoni", fontSize: 30, color: C.ink, marginTop: 20 }}>{date}</div>
        <div style={{ fontFamily: "Jost", fontSize: 19, color: C.plum, marginTop: 8, maxWidth: 560 }}>{venue}</div>
      </div>

      {/* Lengkung foto dengan bingkai lilac yang bergeser */}
      <div style={{ display: "flex", position: "relative", marginRight: 100, marginTop: 30 }}>
        <div style={{ position: "absolute", top: -22, left: 22, width: OG_PHOTO.width, height: OG_PHOTO.height, border: `1.5px solid ${C.lavender}`, borderRadius: ARCH, display: "flex" }} />
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={photo} width={OG_PHOTO.width} height={OG_PHOTO.height} style={{ objectFit: "cover", borderRadius: ARCH }} />
        ) : (
          <div
            style={{
              width: OG_PHOTO.width,
              height: OG_PHOTO.height,
              borderRadius: ARCH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(180deg, ${C.lilac} 0%, ${C.lavender} 100%)`,
            }}
          >
            <div style={{ fontFamily: "Pinyon", fontSize: 150, color: C.mist }}>{`${first[0] ?? ""}${second[0] ?? ""}`}</div>
          </div>
        )}
      </div>
    </div>
  );
}

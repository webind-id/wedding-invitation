/**
 * Kartu pratinjau tautan 1200×630 bergaya "Gerbang Rembulan" (kudo-13): merah imperial, bingkai
 * emas ganda, foto dalam lingkaran rembulan, lencana 囍, nama berhuruf Pinyon Script.
 * Dirender oleh next/og (Satori): hanya flexbox & properti CSS dasar, setiap div berisi >1 anak
 * wajib display:flex.
 */
export const OG_PHOTO = { width: 400, height: 400 } as const;

/** Berkas di public/og/fonts (WOFF/TTF statis, OFL). Bentuk & nama diekspor untuk lib/og-image.ts. */
export interface OgFontFile {
  file: string;
  name: string;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFontFile[] = [
  { file: "cinzel-latin-500-normal.woff", name: "Cinzel", weight: 500, style: "normal" },
  { file: "pinyon-script-latin-400-normal.woff", name: "Pinyon", weight: 400, style: "normal" },
  { file: "cormorant-garamond-latin-400-italic.woff", name: "Cormorant", weight: 400, style: "italic" },
  { file: "poppins-latin-500-normal.woff", name: "Poppins", weight: 500, style: "normal" },
  // Subset hanya aksara Han template (囍百年好合…) — Satori butuh TTF/WOFF, bukan WOFF2.
  { file: "noto-serif-sc-600-han.ttf", name: "Han", weight: 600, style: "normal" },
];

const C = {
  red950: "#2A0505",
  red900: "#4A0909",
  red800: "#6E0F0F",
  red500: "#C2302A",
  gold600: "#A9842F",
  gold500: "#C9A24B",
  gold300: "#EDD9A0",
  cream200: "#F0DCC0",
  mei: "#F7C4C9",
};

export interface OgCardProps {
  first: string;
  second: string;
  /** "Sabtu, 12 Juni 2027" */
  date: string;
  venue: string;
  /** Data URL foto sampul yang sudah dipotong; null → lingkaran merah bermonogram. */
  photo: string | null;
}

function nameSize(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  return longest > 12 ? 82 : longest > 9 ? 98 : 116;
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
        position: "relative",
        backgroundColor: C.red950,
        backgroundImage: `radial-gradient(ellipse at 30% 50%, ${C.red800} 0%, ${C.red900} 45%, ${C.red950} 100%)`,
      }}
    >
      <div style={{ position: "absolute", top: 24, left: 24, right: 24, bottom: 24, border: `2px solid ${C.gold500}`, borderRadius: 6, display: "flex" }} />
      <div style={{ position: "absolute", top: 32, left: 32, right: 32, bottom: 32, border: "1px solid rgba(201,162,75,0.4)", borderRadius: 4, display: "flex" }} />

      {/* Foto dalam lingkaran rembulan bertepi emas */}
      <div
        style={{
          display: "flex",
          marginLeft: 100,
          padding: 8,
          borderRadius: 9999,
          backgroundImage: `linear-gradient(160deg, ${C.gold300}, ${C.gold600})`,
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={photo} width={OG_PHOTO.width} height={OG_PHOTO.height} style={{ objectFit: "cover", borderRadius: 9999 }} />
        ) : (
          <div
            style={{
              width: OG_PHOTO.width,
              height: OG_PHOTO.height,
              borderRadius: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `radial-gradient(circle at 50% 35%, ${C.red500}, ${C.red900} 78%)`,
            }}
          >
            <div style={{ fontFamily: "Pinyon", fontSize: 150, color: C.gold300 }}>{`${first[0] ?? ""}${second[0] ?? ""}`}</div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 60px" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `radial-gradient(circle, ${C.red500}, ${C.red800})`,
            border: `2px solid ${C.gold500}`,
            fontFamily: "Han",
            fontSize: 40,
            color: C.gold300,
          }}
        >
          囍
        </div>
        <div style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 16, letterSpacing: 6, color: C.gold300, marginTop: 14 }}>THE WEDDING OF</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 4 }}>
          <div style={{ fontFamily: "Pinyon", fontSize: size, lineHeight: 1.15, color: C.gold300 }}>{first}</div>
          <div style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: 48, lineHeight: 1, color: C.mei }}>&amp;</div>
          <div style={{ fontFamily: "Pinyon", fontSize: size, lineHeight: 1.15, color: C.gold300 }}>{second}</div>
        </div>
        <div style={{ fontFamily: "Cinzel", fontWeight: 500, fontSize: 26, letterSpacing: 3, color: C.cream200, marginTop: 16 }}>{date.toUpperCase()}</div>
        <div style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: 26, color: C.gold300, marginTop: 6, maxWidth: 560 }}>{venue}</div>
      </div>
    </div>
  );
}

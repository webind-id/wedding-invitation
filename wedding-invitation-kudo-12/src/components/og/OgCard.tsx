/**
 * Kartu pratinjau tautan 1200×630 bergaya "Ronce Melati" (kudo-12): batik sogan gelap, bingkai
 * prada ganda, foto dalam lengkung bertepi emas, gunungan kecil, nama berhuruf Pinyon Script.
 * Dirender oleh next/og (Satori): hanya flexbox & properti CSS dasar, setiap div berisi >1 anak
 * wajib display:flex.
 */
export const OG_PHOTO = { width: 340, height: 460 } as const;

/** Berkas di public/og/fonts (WOFF statis Fontsource, OFL). Bentuk & nama diekspor untuk lib/og-image.ts. */
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
];

const C = {
  sogan950: "#22160D",
  sogan900: "#2E1E12",
  sogan800: "#3A2618",
  sogan500: "#7A5A3E",
  gold600: "#A8873A",
  gold500: "#CEAC59",
  gold300: "#E9D6A0",
  cream200: "#EADDCB",
  blush: "#F4B8C8",
};

export interface OgCardProps {
  first: string;
  second: string;
  /** "Sabtu, 12 Juni 2027" */
  date: string;
  venue: string;
  /** Data URL foto sampul yang sudah dipotong; null → lengkung sogan bermonogram. */
  photo: string | null;
}

const ARCH_RADIUS = `${OG_PHOTO.width / 2}px ${OG_PHOTO.width / 2}px 14px 14px`;

function nameSize(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  return longest > 12 ? 82 : longest > 9 ? 98 : 118;
}

function Gunungan() {
  return (
    <svg width="44" height="66" viewBox="0 0 200 300">
      <path d="M100 4 C118 46 168 104 184 176 C192 214 186 250 172 282 L28 282 C14 250 8 214 16 176 C32 104 82 46 100 4Z" fill={C.gold500} stroke={C.sogan800} strokeWidth="4" />
      <path d="M100 222 V42" stroke={C.sogan800} strokeWidth="5" />
      <path d="M72 282 V236 Q72 218 100 214 Q128 218 128 236 V282Z" fill={C.sogan800} />
    </svg>
  );
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
        backgroundColor: C.sogan950,
        backgroundImage: `radial-gradient(ellipse at 30% 50%, ${C.sogan800} 0%, ${C.sogan900} 45%, ${C.sogan950} 100%)`,
      }}
    >
      {/* Bingkai prada ganda */}
      <div style={{ position: "absolute", top: 24, left: 24, right: 24, bottom: 24, border: `2px solid ${C.gold500}`, borderRadius: 6, display: "flex" }} />
      <div style={{ position: "absolute", top: 32, left: 32, right: 32, bottom: 32, border: `1px solid rgba(206,172,89,0.4)`, borderRadius: 4, display: "flex" }} />

      <div
        style={{
          display: "flex",
          marginLeft: 110,
          padding: 7,
          borderRadius: `${OG_PHOTO.width / 2 + 7}px ${OG_PHOTO.width / 2 + 7}px 20px 20px`,
          backgroundImage: `linear-gradient(160deg, ${C.gold300}, ${C.gold600})`,
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={photo} width={OG_PHOTO.width} height={OG_PHOTO.height} style={{ objectFit: "cover", borderRadius: ARCH_RADIUS }} />
        ) : (
          <div
            style={{
              width: OG_PHOTO.width,
              height: OG_PHOTO.height,
              borderRadius: ARCH_RADIUS,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: `radial-gradient(circle at 50% 30%, ${C.sogan500}, ${C.sogan800} 75%)`,
            }}
          >
            <div style={{ fontFamily: "Pinyon", fontSize: 150, color: C.gold300 }}>{`${first[0] ?? ""}${second[0] ?? ""}`}</div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 70px" }}>
        <Gunungan />
        <div style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 16, letterSpacing: 6, color: C.gold300, marginTop: 14 }}>PAWIWAHAN · UNDANGAN PERNIKAHAN</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 8 }}>
          <div style={{ fontFamily: "Pinyon", fontSize: size, lineHeight: 1.15, color: C.gold300 }}>{first}</div>
          <div style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: 48, lineHeight: 1, color: C.blush }}>&amp;</div>
          <div style={{ fontFamily: "Pinyon", fontSize: size, lineHeight: 1.15, color: C.gold300 }}>{second}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
          <div style={{ width: 70, height: 1, background: C.gold500, display: "flex" }} />
          <div style={{ width: 9, height: 9, margin: "0 12px", transform: "rotate(45deg)", border: `1.5px solid ${C.gold500}`, display: "flex" }} />
          <div style={{ width: 70, height: 1, background: C.gold500, display: "flex" }} />
        </div>
        <div style={{ fontFamily: "Cinzel", fontWeight: 500, fontSize: 26, letterSpacing: 3, color: C.cream200, marginTop: 18 }}>{date.toUpperCase()}</div>
        <div style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: 26, color: C.gold300, marginTop: 6, maxWidth: 560 }}>{venue}</div>
      </div>
    </div>
  );
}

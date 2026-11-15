/**
 * Kartu pratinjau tautan 1200×630 bergaya "Rustic Bohemian":
 * Nuansa Terracotta, Olive, Cream, font serif elegan, dan foto sampul berbingkai lengkung.
 * Dirender oleh next/og (Satori).
 */
export const OG_PHOTO = { width: 440, height: 480 } as const;

export interface OgFontFile {
  file: string;
  name: string;
  weight: 300 | 400 | 500 | 600 | 700;
  style: "normal" | "italic";
}

export const OG_FONTS: OgFontFile[] = [
  { file: "cormorant-garamond-latin-300-normal.woff", name: "Cormorant", weight: 300, style: "normal" },
  { file: "jetbrains-mono-latin-400-normal.woff", name: "Mono", weight: 400, style: "normal" },
];

const C = {
  cream: "#FAF6F0",
  earthInk: "#2B231D",
  terracotta: "#C86D51",
  terracottaDeep: "#98442B",
  olive: "#6B7A5C",
  sandDeep: "#D1C3B0",
  muted: "#6E6259",
  white: "#FFFFFF",
};

export interface OgCardProps {
  first: string;
  second: string;
  date: string;
  venue: string;
  photo: string | null;
}

export function OgCard({ first, second, date, venue, photo }: OgCardProps) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: C.cream,
        padding: "60px 80px",
        border: `12px solid ${C.terracotta}`,
        fontFamily: "Cormorant",
      }}
    >
      {/* Kolom Kiri: Informasi Undangan */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: 580,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: C.olive,
            borderRadius: 30,
            padding: "8px 22px",
            fontSize: 16,
            fontWeight: 600,
            color: C.white,
            alignSelf: "flex-start",
            marginBottom: 24,
            letterSpacing: 2,
            fontFamily: "Mono",
          }}
        >
          OUTDOOR &amp; GARDEN WEDDING
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 70,
            fontWeight: 700,
            color: C.earthInk,
            lineHeight: 1.1,
          }}
        >
          <span>{first}</span>
          <span style={{ color: C.terracotta, fontSize: 44, margin: "4px 0" }}>&amp;</span>
          <span>{second}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            paddingTop: 20,
            borderTop: `2px dashed ${C.sandDeep}`,
          }}
        >
          <div style={{ display: "flex", fontSize: 24, color: C.earthInk, fontWeight: 600 }}>
            {date}
          </div>
          {venue && (
            <div style={{ display: "flex", fontSize: 20, color: C.muted, marginTop: 6 }}>
              {venue}
            </div>
          )}
        </div>
      </div>

      {/* Kolom Kanan: Foto Sampul dengan Bingkai Bohemian Lengkung */}
      <div
        style={{
          display: "flex",
          width: OG_PHOTO.width,
          height: OG_PHOTO.height,
          border: `6px solid ${C.white}`,
          borderRadius: "140px 140px 24px 24px",
          backgroundColor: C.white,
          boxShadow: `0 20px 40px rgba(69, 48, 33, 0.15)`,
          overflow: "hidden",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              color: C.terracotta,
            }}
          >
            <span>♥</span>
            <span style={{ fontSize: 24, marginTop: 12 }}>UNDANGAN PERNIKAHAN</span>
          </div>
        )}
      </div>
    </div>
  );
}

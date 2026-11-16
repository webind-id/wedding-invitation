import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/*
 * Font di-host sendiri (src/app/fonts, lisensi SIL OFL) — bukan next/font/google —
 * agar build tidak bergantung pada Google Fonts. Respons Google kadang berisi URL
 * font tanpa ekstensi sehingga `next build` gagal secara acak (terjadi di CI).
 */
const cormorant = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-normal.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-italic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const pinyon = localFont({
  src: "./fonts/pinyon-script-latin.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
  fallback: ["cursive"],
});

const jost = localFont({
  src: "./fonts/jost-latin.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const amiri = localFont({
  src: "./fonts/amiri-arabic-400.woff2",
  weight: "400",
  variable: "--font-arabic",
  display: "swap",
  preload: false,
  fallback: ["serif"],
});

export const metadata: Metadata = {
  title: "Undangan Pernikahan Lampion Malam",
  description: "Undangan pernikahan bertema lampion 3D di bawah langit malam berbintang, bernuansa indigo, amber, dan emas.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0B1026",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${pinyon.variable} ${jost.variable} ${amiri.variable}`}>
      <body className="bg-night font-sans text-moon antialiased">{children}</body>
    </html>
  );
}

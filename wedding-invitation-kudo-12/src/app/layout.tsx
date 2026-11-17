import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/*
 * Font di-host sendiri (src/app/fonts, lisensi SIL OFL) — bukan next/font/google —
 * agar build tidak bergantung pada Google Fonts.
 */
const cinzel = localFont({
  src: "./fonts/cinzel-latin.woff2",
  weight: "400 900",
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

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

const poppins = localFont({
  src: [
    { path: "./fonts/poppins-latin-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/poppins-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-latin-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const javanese = localFont({
  src: "./fonts/noto-sans-javanese-400.woff2",
  weight: "400",
  variable: "--font-jawa",
  display: "swap",
  preload: false,
  fallback: ["sans-serif"],
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
  title: "Undangan Pernikahan Ronce Melati",
  description: "Undangan pernikahan adat Jawa: pendopo joglo saat senja, gunungan wayang, batik kawung, dan ronce melati.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#22160D",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const FONT_VARS = [cinzel, cormorant, pinyon, poppins, javanese, amiri].map((f) => f.variable).join(" ");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={FONT_VARS}>
      <body className="kawung-body font-serif text-sogan-800 antialiased">{children}</body>
    </html>
  );
}

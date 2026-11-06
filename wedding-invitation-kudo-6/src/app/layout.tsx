import type { Metadata, Viewport } from "next";
import { Allura, Amiri, Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

// Hanya untuk nama & tanda tangan.
const allura = Allura({ subsets: ["latin"], weight: ["400"], variable: "--font-allura", display: "swap" });

const amiri = Amiri({ subsets: ["arabic"], weight: ["400"], variable: "--font-arabic", display: "swap", preload: false });

// Judul & deskripsi diisi per halaman dari konten undangan (lib/page-props.ts).
export const metadata: Metadata = {
  title: "Undangan Pernikahan",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#F8F5EF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${manrope.variable} ${allura.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}

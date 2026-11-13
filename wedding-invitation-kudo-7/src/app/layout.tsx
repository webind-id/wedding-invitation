import type { Metadata, Viewport } from "next";
import { Amiri, EB_Garamond, Marcellus } from "next/font/google";
import "./globals.css";

// Huruf berukir ala prasasti — judul, label, tombol.
const marcellus = Marcellus({ subsets: ["latin"], weight: ["400"], variable: "--font-marcellus", display: "swap" });

// Teks & nama (italic).
const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
});

const amiri = Amiri({ subsets: ["arabic"], weight: ["400"], variable: "--font-arabic", display: "swap", preload: false });

// Judul & deskripsi diisi per halaman dari konten undangan (lib/page-props.ts).
export const metadata: Metadata = {
  title: "Undangan Pernikahan",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1A120C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${marcellus.variable} ${garamond.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}

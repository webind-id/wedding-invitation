import type { Metadata, Viewport } from "next";
import { Amiri, EB_Garamond, IM_Fell_English, IM_Fell_English_SC } from "next/font/google";
import "./globals.css";

const fell = IM_Fell_English({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-fell",
  display: "swap",
});

const fellSc = IM_Fell_English_SC({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-fell-sc",
  display: "swap",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

// Judul & deskripsi diisi per halaman dari konten undangan (lib/page-props.ts).
export const metadata: Metadata = {
  title: "Undangan Pernikahan",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#6B1E2A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${fell.variable} ${fellSc.variable} ${garamond.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}

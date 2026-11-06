import type { Metadata, Viewport } from "next";
import { Amiri, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-amiri",
  display: "swap",
  preload: false,
});

// Judul & deskripsi diisi per halaman dari konten undangan (lib/page-props.ts).
export const metadata: Metadata = {
  title: "Undangan Pernikahan",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1F3A2E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${fraunces.variable} ${jakarta.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}

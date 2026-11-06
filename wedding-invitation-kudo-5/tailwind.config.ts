import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Old Money — kertas antik, tinta burgundy, hijau botol, cokelat tinta.
        antique: "#F3EBDD",
        parchment: "#E7DAC2",
        burgundy: "#6B1E2A",
        wine: "#4A1520",
        bottle: "#1E3226",
        umber: "#5A4030",
        sepia: "#8A7258",
        ink: "#2B211B",
      },
      fontFamily: {
        fell: ["var(--font-fell)", "Georgia", "serif"],
        "fell-sc": ["var(--font-fell-sc)", "Georgia", "serif"],
        serif: ["var(--font-garamond)", "Georgia", "serif"],
        arabic: ["var(--font-arabic)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

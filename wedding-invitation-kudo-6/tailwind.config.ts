import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Immersive Romance — ivory dominan, pearl permukaan, champagne aksen metalik (matte), pink untuk bunga.
        ivory: "#F8F5EF",
        pearl: "#E9E3DA",
        champagne: "#D7BE99",
        "champagne-deep": "#A88B62",
        blush: "#E8C9CC",
        rose: "#B9858B",
        /** Teks aksen kecil di atas ivory (kontras ≥ 4.5:1). */
        mauve: "#8A5D63",
        ink: "#39312F",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        script: ["var(--font-allura)", "cursive"],
        arabic: ["var(--font-arabic)", "serif"],
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

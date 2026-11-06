import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Luxury Editorial — kertas majalah ivory, champagne, tinta hitam, emas redup.
        ivory: "#F7F2E8",
        champagne: "#E9DCC3",
        bone: "#EFE7D8",
        ink: "#141210",
        stone: "#77706A",
        rule: "#D8CCB5",
        gold: "#A8895A",
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "serif"],
      },
      letterSpacing: {
        rubric: "0.32em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tapak Puncak — palet bioskop: hitam film, putih seluloid untuk teks,
        // amber cahaya fajar sebagai aksen, teal kabut untuk detail dingin.
        film: "#07090B",
        "film-soft": "#11161A",
        seluloid: "#F3EFE6",
        amber: "#E8B25C",
        "amber-deep": "#B98235",
        kabut: "#9FB3B4",
        abu: "#8E8A82",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        arabic: ["var(--font-arabic)", "serif"],
      },
      transitionTimingFunction: {
        film: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Teratai Senja — kabut lilac dominan, lavender & plum untuk bunga, sage untuk daun,
        // aprikot hangat seperti cahaya senja di putik teratai.
        mist: "#F4F1F6",
        haze: "#E7E0EE",
        lilac: "#CDBCDD",
        lavender: "#A893C2",
        plum: "#5E3D6B",
        /** Teks aksen kecil di atas mist (kontras ≥ 4.5:1). */
        "plum-deep": "#4E3159",
        sage: "#9DB09B",
        "sage-deep": "#5F7560",
        apricot: "#E9B48A",
        ink: "#2E2733",
      },
      fontFamily: {
        display: ["var(--font-bodoni)", "Didot", "Georgia", "serif"],
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
        script: ["var(--font-pinyon)", "cursive"],
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

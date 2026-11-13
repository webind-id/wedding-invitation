import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Keraton Sogan — gading dominan, sogan (cokelat batik) & prada (emas matte) sebagai aksen,
        // malam untuk adegan pembuka & penutup, bata & nila hanya di sunggingan gunungan.
        gading: "#F5EEE1",
        kertas: "#EDE3D1",
        prada: "#B8914E",
        /** Teks aksen kecil di atas gading (kontras ≥ 4.5:1). */
        "prada-deep": "#7E5C28",
        "prada-light": "#DCC08A",
        sogan: "#6E4426",
        "sogan-deep": "#3E2615",
        malam: "#1A120C",
        bata: "#8E3B2A",
        nila: "#2E4756",
        melati: "#FBF8F1",
        daun: "#4F5B3A",
        ink: "#2B1D14",
      },
      fontFamily: {
        display: ["var(--font-marcellus)", "Georgia", "serif"],
        serif: ["var(--font-garamond)", "Georgia", "serif"],
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

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tema: Ronce Melati — palet diambil dari ilustrasi wayang Rama & Shinta:
        // espresso #22160D (garis, rambut, batik), antique gold #CEAC59 (kulit wayang, jamang, perhiasan),
        // ivory #FAF6F0 (wajah Shinta, latar), blush #F4B8C8 (sorot selendang), deep rose #D95B82 (bayangan busana).
        blush: {
          DEFAULT: "#F4B8C8",
          deep: "#D95B82",
          // Teks kecil berwarna mawar di atas ivory (kontras ≥ 4.5:1); #D95B82 hanya untuk aksen besar.
          ink: "#A8385E",
        },
        sogan: {
          950: "#22160D",
          900: "#2E1E12",
          800: "#3A2618",
          700: "#4E3421",
          500: "#7A5A3E",
        },
        gold: {
          600: "#A8873A",
          500: "#CEAC59",
          400: "#DABE76",
          300: "#E9D6A0",
        },
        cream: {
          200: "#EADDCB",
          100: "#F4ECE2",
        },
        ivory: "#FAF6F0",
        leaf: "#3E5A3A",
        melati: "#FFFDF6",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cinzel", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        script: ["var(--font-script)", "Pinyon Script", "cursive"],
        sans: ["var(--font-sans)", "Poppins", "system-ui", "sans-serif"],
        jawa: ["var(--font-jawa)", "Noto Sans Javanese", "sans-serif"],
        arabic: ["var(--font-arabic)", "Amiri", "serif"],
      },
      maxWidth: {
        column: "460px",
      },
      boxShadow: {
        column: "0 0 80px rgba(0, 0, 0, 0.55)",
        gold: "0 6px 18px rgba(168, 135, 58, 0.35)",
        "gold-lg": "0 10px 24px rgba(168, 135, 58, 0.45)",
        card: "0 14px 34px rgba(58, 38, 24, 0.25)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 0.8, 0.26, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

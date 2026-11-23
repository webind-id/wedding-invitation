import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tema: Taman Asmara — palet diambil dari aset (public/images/taman): marun sayap kupu-kupu,
        // atap joglo & dedaunan (#2B0A14 … #9A4A5E), antique gold #CEAC59 (kulit wayang, sulur bunga),
        // ivory #FAF6F0 (latar gunung), blush #F4B8C8 & deep rose #D95B82 (kelopak, daun muda).
        blush: {
          DEFAULT: "#F4B8C8",
          deep: "#D95B82",
          // Teks kecil berwarna mawar di atas ivory (kontras ≥ 4.5:1); #D95B82 hanya untuk aksen besar.
          ink: "#A8385E",
        },
        marun: {
          950: "#2B0A14",
          900: "#3E1020",
          800: "#561629",
          700: "#701D35",
          500: "#9A4A5E",
        },
        gold: {
          600: "#A8873A",
          500: "#CEAC59",
          400: "#DABE76",
          300: "#E9D6A0",
        },
        cream: {
          200: "#EFDCD8",
          100: "#F7ECEA",
        },
        ivory: "#FAF6F0",
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
        card: "0 14px 34px rgba(86, 22, 41, 0.25)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.22, 0.8, 0.26, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

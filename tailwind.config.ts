import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ["var(--font-pretendard)"],
      },
      colors: {
        "gallery-bg": "#000000",
        "gallery-card": "#18181b",
        "gallery-accent": "#3b82f6",
      },
    },
  },
  plugins: [],
} satisfies Config;

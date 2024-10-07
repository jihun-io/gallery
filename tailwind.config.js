/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#202221",
        foreground: "#f5f6f5",
        shark: {
          50: "#f5f6f5",
          100: "#e6e7e6",
          200: "#cfd2d0",
          300: "#adb3af",
          400: "#848c87",
          500: "#69716c",
          600: "#5a605c",
          700: "#4d514f",
          800: "#434745",
          900: "#3b3e3d",
          950: "#202221",
        },
      },
    },
  },
  plugins: [],
};

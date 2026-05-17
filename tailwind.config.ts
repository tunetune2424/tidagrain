import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F7F4EF",
        "t-text": "#1E1814",
        accent: "#C4A882",
        border: "#E5E1DC",
        muted: "#8B7B6A",
        muted2: "#6B6157",
      },
      fontFamily: {
        "serif-en": ["Cormorant Garamond", "serif"],
        "serif-jp": ["Noto Serif JP", "serif"],
        sans: ["Noto Sans JP", "sans-serif"],
        ui: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

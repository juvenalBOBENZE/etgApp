import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e8edf7",
          100: "#c5d0ea",
          200: "#9eb0dc",
          300: "#7790ce",
          400: "#5a77c4",
          500: "#3d5eba",
          600: "#1a3a8f", // ETG blue
          700: "#152e72",
          800: "#102255",
          900: "#0a1638",
        },
      },
    },
  },
  plugins: [],
};
export default config;

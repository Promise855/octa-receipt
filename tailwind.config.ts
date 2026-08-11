// tailwind.config.ts
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
        primary: {
          DEFAULT: "#DC2626", // Brand Red
          hover: "#B91C1C",   // Dark Red Hover
          light: "#FEE2E2",
        },
        secondary: {
          DEFAULT: "#09090B", // Brand Black
          card: "#18181B",
        },
        surface: {
          light: "#F4F4F5",   // Zebra striping
          border: "#E4E4E7",  // Element borders
        },
      },
    },
  },
  plugins: [],
};

export default config;
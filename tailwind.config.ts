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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-montserrat-alt)", "sans-serif"],
        mono: ["var(--font-orbitron)", "monospace"],
      },
      fontSize: {
        'hero':    'var(--text-hero)',
        'heading': 'var(--text-heading)',
        'label':   'var(--text-label)',
        'body':    'var(--text-body)',
      },
    },
  },
  plugins: [],
};
export default config;

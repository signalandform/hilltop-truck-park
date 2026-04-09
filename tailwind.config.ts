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
        "htp-red": "var(--htp-red)",
        "htp-navy": "var(--htp-navy)",
        "htp-ink": "var(--htp-ink)",
        "htp-bg": "var(--htp-bg)",
        "htp-cream": "var(--htp-cream)",
        "htp-line": "var(--htp-line)",
        "htp-success": "var(--htp-success)",
        "htp-warning": "var(--htp-warning)",
        "htp-danger": "var(--htp-danger)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-oswald)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        btn: "var(--radius-btn)",
        card: "var(--radius-card)",
      },
      maxWidth: {
        content: "1200px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      fontSize: {
        "htp-h1": ["3rem", { lineHeight: "1.05" }],
        "htp-h2": ["2.125rem", { lineHeight: "1.15" }],
        "htp-h3": ["1.5rem", { lineHeight: "1.2" }],
      },
    },
  },
  plugins: [],
};
export default config;

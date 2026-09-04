import type { Config } from "tailwindcss";

/**
 * Tokey design tokens. Single source of truth for the visual system.
 * Restrained, dense, financial. See DESIGN_SOURCES.md for provenance.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f8f8f7",
        surface: "#ffffff",
        inset: "#f3f3f1",
        sunken: "#f3f3f1",
        hover: "#eeeeeb",
        line: { DEFAULT: "#e7e7e4", strong: "#d9d9d5" },
        ink: { DEFAULT: "#1c1c1a", 2: "#5d5d58", 3: "#94948d", soft: "#5d5d58", faint: "#94948d", ghost: "#b9b9b2" },
        accent: { DEFAULT: "#4f46e5", soft: "#eef0fd", strong: "#4338ca" },
        ok: { DEFAULT: "#0a7d55", soft: "#e8f5ef", strong: "#086747" },
        warn: { DEFAULT: "#a05a03", soft: "#fdf3e4", strong: "#7d4702" },
        danger: { DEFAULT: "#c4320a", soft: "#fdeeec", strong: "#9c2807" },
        info: { DEFAULT: "#1f5fd0", soft: "#ecf2fd", strong: "#1a4da8" },
        mystery: { DEFAULT: "#6941c6", soft: "#f2eefd", strong: "#53389e" },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        DEFAULT: "7px",
        control: "7px",
        card: "12px",
      },
      boxShadow: {
        hairline: "0 0 0 1px rgb(28 28 26 / 0.03)",
        btn: "0 1px 1px rgb(28 28 26 / 0.04)",
        card: "0 1px 2px rgb(28 28 26 / 0.04), 0 0 0 1px rgb(28 28 26 / 0.025)",
        raised: "0 10px 24px rgb(28 28 26 / 0.08), 0 1px 3px rgb(28 28 26 / 0.05)",
        pop: "0 8px 30px 0 rgb(24 24 27 / 0.12), 0 1px 3px 0 rgb(24 24 27 / 0.06)",
        ring: "0 0 0 3px rgb(79 70 229 / 0.12)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0", transform: "translateY(2px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "pop-in": { from: { opacity: "0", transform: "translateY(3px) scale(0.96)" }, to: { opacity: "1", transform: "translateY(0) scale(1)" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
      },
      animation: {
        "fade-in": "fade-in 400ms ease-out both",
        "fade-up": "fade-up 400ms cubic-bezier(0.23, 1, 0.32, 1) both",
        "pop-in": "pop-in 240ms cubic-bezier(0.23, 1, 0.32, 1) both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

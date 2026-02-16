import type { Config } from "tailwindcss";

/**
 * Tailwind Configuration
 * 
 * Since we're using CSS variables for colors at runtime, we don't need to
 * import the theme system here. Tailwind just needs to know about the CSS variable
 * references. The actual color values are defined in app/globals.css
 */

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors with opacity support
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)",
        },
        // Secondary colors
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          foreground: "rgb(var(--color-secondary-foreground) / <alpha-value>)",
        },
        // Accent colors
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          foreground: "rgb(var(--color-accent-foreground) / <alpha-value>)",
        },
        // Destructive colors
        destructive: {
          DEFAULT: "rgb(var(--color-destructive) / <alpha-value>)",
          foreground: "rgb(var(--color-destructive-foreground) / <alpha-value>)",
        },
        // Muted colors
        muted: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-muted-foreground) / <alpha-value>)",
        },
        // UI Colors
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",
        ring: "rgb(var(--color-ring) / <alpha-value>)",
        // Card
        card: {
          DEFAULT: "rgb(var(--color-card) / <alpha-value>)",
          foreground: "rgb(var(--color-card-foreground) / <alpha-value>)",
        },
        // Popover
        popover: {
          DEFAULT: "rgb(var(--color-popover) / <alpha-value>)",
          foreground: "rgb(var(--color-popover-foreground) / <alpha-value>)",
        },
        // Chart colors
        chart: {
          1: "rgb(var(--color-chart-1) / <alpha-value>)",
          2: "rgb(var(--color-chart-2) / <alpha-value>)",
          3: "rgb(var(--color-chart-3) / <alpha-value>)",
          4: "rgb(var(--color-chart-4) / <alpha-value>)",
          5: "rgb(var(--color-chart-5) / <alpha-value>)",
        },
        // Sidebar colors
        sidebar: {
          DEFAULT: "rgb(var(--color-sidebar) / <alpha-value>)",
          foreground: "rgb(var(--color-sidebar-foreground) / <alpha-value>)",
          primary: "rgb(var(--color-sidebar-primary) / <alpha-value>)",
          "primary-foreground":
            "rgb(var(--color-sidebar-primary-foreground) / <alpha-value>)",
          accent: "rgb(var(--color-sidebar-accent) / <alpha-value>)",
          "accent-foreground":
            "rgb(var(--color-sidebar-accent-foreground) / <alpha-value>)",
          border: "rgb(var(--color-sidebar-border) / <alpha-value>)",
          ring: "rgb(var(--color-sidebar-ring) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "calc(var(--radius-lg))",
        md: "calc(var(--radius-md))",
        sm: "calc(var(--radius-sm))",
        xl: "calc(var(--radius-xl))",
        "2xl": "calc(var(--radius-2xl))",
        "3xl": "calc(var(--radius-3xl))",
        "4xl": "calc(var(--radius-4xl))",
      },
    },
  },
  plugins: [],
};

export default config;

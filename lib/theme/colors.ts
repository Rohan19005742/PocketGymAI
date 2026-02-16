/**
 * Color Palette System
 * 
 * This file defines all color palettes for the application.
 * Change the active theme in theme-config.ts to switch palettes.
 * 
 * All colors are defined in RGB format for easy CSS variable usage.
 */

export type ColorPalette = {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Accent colors
  accent: string;
  accentLight: string;
  accentDark: string;

  // Neutral colors
  neutral50: string;
  neutral100: string;
  neutral200: string;
  neutral300: string;
  neutral400: string;
  neutral500: string;
  neutral600: string;
  neutral700: string;
  neutral800: string;
  neutral900: string;
  neutral950: string;

  // Gradient colors (for animations and effects)
  gradient1: string;
  gradient2: string;
  gradient3: string;
  gradient4: string;
  gradient5: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // UI specific
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  ring: string;
};

/**
 * Modern Blue Theme (Default)
 * Blues, purples, and greens with modern feel
 */
export const blueModernTheme: ColorPalette = {
  // Primary - Blue
  primary: "59 130 246",           // #3B82F6
  primaryLight: "96 165 250",      // #60A5FA
  primaryDark: "37 99 235",        // #2563EB

  // Secondary - Purple
  secondary: "147 51 234",         // #9333EA
  secondaryLight: "168 85 247",    // #A855F7
  secondaryDark: "126 34 206",     // #7E22CE

  // Accent - Pink
  accent: "236 72 153",            // #EC4899
  accentLight: "244 114 182",      // #F472B6
  accentDark: "219 39 119",        // #DB2777

  // Neutrals
  neutral50: "250 250 250",        // #FAFAFA
  neutral100: "245 245 245",       // #F5F5F5
  neutral200: "229 229 229",       // #E5E5E5
  neutral300: "212 212 212",       // #D4D4D4
  neutral400: "163 163 163",       // #A3A3A3
  neutral500: "115 115 115",       // #737373
  neutral600: "82 82 82",          // #525252
  neutral700: "64 64 64",          // #404040
  neutral800: "38 38 38",          // #262626
  neutral900: "23 23 23",          // #171717
  neutral950: "10 10 10",          // #0A0A0A

  // Gradients
  gradient1: "59 130 246",         // Blue
  gradient2: "147 51 234",         // Purple
  gradient3: "22 163 74",          // Green #16A34A
  gradient4: "168 85 247",         // Light Purple
  gradient5: "34 197 94",          // Light Green

  // Semantic
  success: "22 163 74",            // #16A34A
  warning: "217 119 6",            // #D97706
  error: "220 38 38",              // #DC2626
  info: "59 130 246",              // #3B82F6

  // UI
  background: "10 10 10",          // Dark background
  foreground: "245 245 245",       // Light foreground
  muted: "64 64 64",               // #404040
  mutedForeground: "163 163 163",  // #A3A3A3
  border: "38 38 38",              // #262626
  ring: "143 77 177",              // Purple ring
};

/**
 * Vibrant Neon Theme
 * Bright magentas, cyans, and greens for high contrast
 */
export const vibrantNeonTheme: ColorPalette = {
  // Primary - Bright Cyan
  primary: "0 255 255",            // #00FFFF
  primaryLight: "102 255 255",     // #66FFFF
  primaryDark: "0 204 204",        // #00CCCC

  // Secondary - Bright Magenta
  secondary: "255 0 255",          // #FF00FF
  secondaryLight: "255 102 255",   // #FF66FF
  secondaryDark: "204 0 204",      // #CC00CC

  // Accent - Lime Green
  accent: "0 255 0",               // #00FF00
  accentLight: "102 255 102",      // #66FF66
  accentDark: "0 204 0",           // #00CC00

  // Neutrals
  neutral50: "245 245 245",
  neutral100: "230 230 230",
  neutral200: "204 204 204",
  neutral300: "179 179 179",
  neutral400: "128 128 128",
  neutral500: "102 102 102",
  neutral600: "77 77 77",
  neutral700: "51 51 51",
  neutral800: "26 26 26",
  neutral900: "13 13 13",
  neutral950: "0 0 0",

  // Gradients
  gradient1: "0 255 255",          // Cyan
  gradient2: "255 0 255",          // Magenta
  gradient3: "0 255 0",            // Green
  gradient4: "255 255 0",          // Yellow
  gradient5: "255 128 0",          // Orange

  // Semantic
  success: "0 255 0",
  warning: "255 255 0",
  error: "255 0 0",
  info: "0 255 255",

  // UI
  background: "0 0 0",
  foreground: "255 255 255",
  muted: "51 51 51",
  mutedForeground: "179 179 179",
  border: "77 77 77",
  ring: "0 255 255",
};

/**
 * Warm Sunset Theme
 * Oranges, reds, and warm yellows
 */
export const warmSunsetTheme: ColorPalette = {
  // Primary - Fire Orange
  primary: "234 88 12",            // #EA580C
  primaryLight: "251 146 60",      // #FB923C
  primaryDark: "194 65 12",        // #C2410C

  // Secondary - Warm Red
  secondary: "220 38 38",          // #DC2626
  secondaryLight: "239 68 68",     // #EF4444
  secondaryDark: "185 28 28",      // #B91C1C

  // Accent - Golden Yellow
  accent: "217 119 6",             // #D97706
  accentLight: "251 191 36",       // #FBD524
  accentDark: "180 83 9",          // #B45309

  // Neutrals
  neutral50: "250 245 240",
  neutral100: "245 235 220",
  neutral200: "235 210 180",
  neutral300: "220 180 140",
  neutral400: "200 140 100",
  neutral500: "160 120 80",
  neutral600: "120 80 40",
  neutral700: "80 50 20",
  neutral800: "40 25 10",
  neutral900: "20 12 5",
  neutral950: "10 6 2",

  // Gradients
  gradient1: "234 88 12",          // Orange
  gradient2: "220 38 38",          // Red
  gradient3: "217 119 6",          // Gold
  gradient4: "251 191 36",         // Light Gold
  gradient5: "251 146 60",         // Light Orange

  // Semantic
  success: "34 197 94",
  warning: "234 88 12",
  error: "220 38 38",
  info: "59 130 246",

  // UI
  background: "15 7 3",
  foreground: "250 245 240",
  muted: "120 80 40",
  mutedForeground: "220 180 140",
  border: "80 50 20",
  ring: "234 88 12",
};

/**
 * Cool Midnight Theme
 * Deep blues, teals, and silvers
 */
export const coolMidnightTheme: ColorPalette = {
  // Primary - Ocean Blue
  primary: "15 23 42",             // #0F172A
  primaryLight: "30 58 138",       // #1E3A8A
  primaryDark: "15 23 42",         // #0F172A

  // Secondary - Teal
  secondary: "13 148 136",         // #0D9488
  secondaryLight: "45 212 191",    // #2DD4BF
  secondaryDark: "4 120 113",      // #047875

  // Accent - Cyan
  accent: "34 211 238",            // #22D3EE
  accentLight: "165 243 252",      // #A5F3FC
  accentDark: "6 182 212",         // #06B6D4

  // Neutrals
  neutral50: "240 249 255",
  neutral100: "225 242 254",
  neutral200: "186 230 253",
  neutral300: "125 211 252",
  neutral400: "56 189 248",
  neutral500: "14 165 233",
  neutral600: "2 132 199",
  neutral700: "3 105 160",
  neutral800: "7 89 133",
  neutral900: "15 23 42",
  neutral950: "8 15 23",

  // Gradients
  gradient1: "15 23 42",           // Dark Blue
  gradient2: "13 148 136",         // Teal
  gradient3: "34 211 238",         // Cyan
  gradient4: "59 130 246",         // Light Blue
  gradient5: "139 92 246",         // Purple

  // Semantic
  success: "16 185 129",
  warning: "245 158 11",
  error: "239 68 68",
  info: "34 211 238",

  // UI
  background: "3 7 18",
  foreground: "240 249 255",
  muted: "30 58 100",
  mutedForeground: "125 211 252",
  border: "15 23 42",
  ring: "34 211 238",
};

/**
 * All available themes
 */
export const themes = {
  blueModern: blueModernTheme,
  vibrantNeon: vibrantNeonTheme,
  warmSunset: warmSunsetTheme,
  coolMidnight: coolMidnightTheme,
} as const;

export type ThemeName = keyof typeof themes;

/**
 * Helper function to get opacity value for a color
 * @param color RGB color string like "59 130 246"
 * @param opacity Opacity value between 0 and 1
 * @returns CSS rgba string
 */
export function withOpacity(color: string, opacity: number): string {
  return `rgba(${color}, ${opacity})`;
}

/**
 * Helper function to convert RGB to Hex
 * @param color RGB color string like "59 130 246"
 * @returns Hex color string like "#3B82F6"
 */
export function rgbToHex(color: string): string {
  const [r, g, b] = color.split(" ").map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

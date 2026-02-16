/**
 * Theme Configuration
 * 
 * This file controls the active theme for the entire application.
 * Change the ACTIVE_THEME constant to switch color palettes.
 * 
 * Available themes:
 * - 'blueModern': Modern blue with purple and pink accents (default)
 * - 'vibrantNeon': Bright neon colors for high contrast
 * - 'warmSunset': Warm oranges, reds, and golds
 * - 'coolMidnight': Deep blues, teals, and cyans
 */

import type { ThemeName } from "./colors";

/**
 * The active theme for the entire application
 * Change this value to switch all colors throughout the app
 */
export const ACTIVE_THEME: ThemeName = "blueModern";

/**
 * Function to verify theme is valid
 */
export function isValidTheme(theme: string): theme is ThemeName {
  return ["blueModern", "vibrantNeon", "warmSunset", "coolMidnight"].includes(
    theme
  );
}

/**
 * Get the active theme
 */
export function getActiveTheme() {
  return ACTIVE_THEME;
}

/**
 * Color Utility Functions
 * 
 * This file provides utility functions for working with colors in your components.
 * It makes it easy to reference colors without hardcoding hex values.
 */

import { themes, type ColorPalette, type ThemeName } from "./colors";
import { ACTIVE_THEME } from "./theme-config";

/**
 * Get the currently active color palette
 */
export function getColorPalette(): ColorPalette {
  return themes[ACTIVE_THEME];
}

/**
 * Get a specific color from the active palette
 * @param colorName The name of the color property
 * @returns The RGB string value
 */
export function getColor(
  colorName: keyof ColorPalette
): string {
  const palette = getColorPalette();
  return palette[colorName];
}

/**
 * Get a color with opacity using CSS rgba
 * @param colorName The name of the color property
 * @param opacity Opacity value between 0 and 1
 * @returns CSS rgba string
 */
export function getColorWithOpacity(
  colorName: keyof ColorPalette,
  opacity: number
): string {
  const color = getColor(colorName);
  return `rgba(${color}, ${opacity})`;
}

/**
 * Convert RGB string to hex color
 * @param rgbString RGB string like "59 130 246"
 * @returns Hex color string like "#3B82F6"
 */
export function rgbToHex(rgbString: string): string {
  const [r, g, b] = rgbString.split(" ").map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

/**
 * Get hex color from palette
 * @param colorName The name of the color property
 * @returns Hex color string
 */
export function getHexColor(colorName: keyof ColorPalette): string {
  const color = getColor(colorName);
  return rgbToHex(color);
}

/**
 * Create a gradient string from multiple colors
 * @param colors Array of color names from the palette
 * @param direction CSS gradient direction (default: "to right")
 * @returns CSS gradient string
 */
export function createGradient(
  colors: (keyof ColorPalette)[],
  direction: string = "to right"
): string {
  const colorStops = colors.map((colorName) => `rgb(${getColor(colorName)})`);
  return `linear-gradient(${direction}, ${colorStops.join(", ")})`;
}

/**
 * Create a gradient background style object
 * @param colors Array of color names from the palette
 * @param direction CSS gradient direction (default: "to right")
 * @returns Style object with background property
 */
export function gradientBg(
  colors: (keyof ColorPalette)[],
  direction: string = "to right"
): Record<string, string> {
  return {
    background: createGradient(colors, direction),
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
}

/**
 * Create a box-shadow with theme color
 * @param colorName Color name from palette
 * @param opacity Opacity of the shadow color
 * @param blurRadius Blur radius of the shadow
 * @param size Size/spread of the shadow
 * @returns CSS box-shadow string
 */
export function createBoxShadow(
  colorName: keyof ColorPalette,
  opacity: number = 0.3,
  blurRadius: number = 20,
  size: number = 0
): string {
  const color = getColorWithOpacity(colorName, opacity);
  return `0 0 ${blurRadius}px ${size}px ${color}`;
}

/**
 * Color palette export for direct use in styles
 */
export const colors = {
  get current() {
    return getColorPalette();
  },

  // Accessors for common colors
  get primary() {
    return getColor("primary");
  },
  get secondary() {
    return getColor("secondary");
  },
  get accent() {
    return getColor("accent");
  },
  get success() {
    return getColor("success");
  },
  get warning() {
    return getColor("warning");
  },
  get error() {
    return getColor("error");
  },
  get background() {
    return getColor("background");
  },
  get foreground() {
    return getColor("foreground");
  },
};

/**
 * Example usage:
 * 
 * // Get a single color
 * const primaryColor = getColor('primary');
 * 
 * // Get hex color
 * const primaryHex = getHexColor('primary');
 * 
 * // Get color with opacity
 * const primaryWithOpacity = getColorWithOpacity('primary', 0.5);
 * 
 * // Create a gradient
 * const gradient = createGradient(['primary', 'secondary', 'accent']);
 * 
 * // Create a box shadow
 * const shadow = createBoxShadow('primary', 0.3, 20, 0);
 * 
 * // Use in inline styles
 * const style = {
 *   backgroundColor: `rgb(${getColor('primary')})`,
 *   boxShadow: createBoxShadow('primary'),
 * };
 */

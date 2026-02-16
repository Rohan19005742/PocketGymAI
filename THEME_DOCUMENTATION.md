# Color System & Theme Documentation

## Overview

Your application now has a **centralized, maintainable color system** that allows you to change the entire color palette instantly. All colors are managed through CSS variables and TypeScript configuration files.

## How to Change Colors

### Quick Start: Switch to a Different Theme

1. Open `lib/theme/theme-config.ts`
2. Change the `ACTIVE_THEME` constant to one of:
   - `"blueModern"` (default) - Modern blue with purple and pink
   - `"vibrantNeon"` - Bright neon colors
   - `"warmSunset"` - Oranges, reds, and golds
   - `"coolMidnight"` - Deep blues and teals

```typescript
// lib/theme/theme-config.ts
export const ACTIVE_THEME: ThemeName = "vibrantNeon"; // Change this to switch themes
```

**That's it!** All colors throughout your app will instantly update.

---

## Architecture

### File Structure

```
lib/theme/
├── colors.ts              # Color palette definitions (4 pre-made themes)
├── theme-config.ts        # Active theme selector
├── color-utils.ts         # Helper functions for color manipulation
app/
├── globals.css            # CSS variable definitions + component styles
tailwind.config.ts         # Tailwind configuration with color tokens
```

### How It Works

1. **Define Colors** → `colors.ts` contains 4 complete color palettes
2. **Select Active Theme** → `theme-config.ts` specifies which theme is active
3. **CSS Variables** → `globals.css` generates CSS custom properties from the active theme
4. **Use in Components** → Inline styles or Tailwind classes reference the CSS variables
5. **Update Tailwind** → `tailwind.config.ts` provides IntelliSense support

---

## Using Colors in Components

### Method 1: CSS Variables (Best for Dynamic Colors)

```tsx
<div
  style={{
    backgroundColor: `rgb(var(--color-primary))`,
    boxShadow: `0 0 20px rgba(var(--color-primary), 0.3)`
  }}
>
  Content
</div>
```

### Method 2: Gradient Helper

```tsx
<div
  style={{
    background: `linear-gradient(to right, rgb(var(--color-gradient1)), rgb(var(--color-gradient2)))`
  }}
>
  Content
</div>
```

### Method 3: Color Utility Functions

```tsx
import { getColor, getColorWithOpacity, createGradient } from "@/lib/theme/color-utils";

const primaryColor = getColor("primary");      // Returns "59 130 246"
const withOpacity = getColorWithOpacity("primary", 0.5);
const gradient = createGradient(["primary", "secondary", "accent"]);
```

### Method 4: Tailwind Classes (Limited Dynamic Support)

```tsx
<div className="bg-primary text-primary-foreground hover:shadow-lg" style={{boxShadow: `0 0 20px rgb(var(--color-primary))`}}>
  Content
</div>
```

---

## Available Color Themes

### 1. Blue Modern (Default)

Perfect for professional, modern applications.

- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#9333EA)
- **Accent**: Pink (#EC4899)
- **Use Case**: Fitness apps, SaaS, professional tools

### 2. Vibrant Neon

High contrast, bold, and energetic.

- **Primary**: Cyan (#00FFFF)
- **Secondary**: Magenta (#FF00FF)
- **Accent**: Lime Green (#00FF00)
- **Use Case**: Gaming, entertainment, futuristic designs

### 3. Warm Sunset

Warm, welcoming, and engaging.

- **Primary**: Orange (#EA580C)
- **Secondary**: Red (#DC2626)
- **Accent**: Gold (#D97706)
- **Use Case**: Food apps, lifestyle brands, creative studios

### 4. Cool Midnight

Deep, sophisticated, and calm.

- **Primary**: Ocean Blue (#0F172A)
- **Secondary**: Teal (#0D9488)
- **Accent**: Cyan (#22D3EE)
- **Use Case**: Tech products, premium brands, dark interfaces

---

## Creating a Custom Theme

### Step 1: Add to `colors.ts`

```typescript
export const myCustomTheme: ColorPalette = {
  primary: "YOUR_RGB_HERE",
  primaryLight: "YOUR_RGB_HERE",
  primaryDark: "YOUR_RGB_HERE",
  // ... complete the rest
  // Reference existing themes for guidance
};

export const themes = {
  blueModern: blueModernTheme,
  vibrantNeon: vibrantNeonTheme,
  warmSunset: warmSunsetTheme,
  coolMidnight: coolMidnightTheme,
  myCustom: myCustomTheme, // Add your theme
} as const;
```

### Step 2: Update `theme-config.ts`

```typescript
export const ACTIVE_THEME: ThemeName = "myCustom";

export function isValidTheme(theme: string): theme is ThemeName {
  return [
    "blueModern",
    "vibrantNeon",
    "warmSunset",
    "coolMidnight",
    "myCustom" // Add your theme
  ].includes(theme);
}
```

### Step 3: Use Your Theme

```bash
# Rebuild if using TypeScript
npm run build
```

---

## CSS Variables Reference

### Primary Color Group

- `--color-primary`: Main primary color
- `--color-primaryLight`: Lighter variant
- `--color-primaryDark`: Darker variant

### Secondary Color Group

- `--color-secondary`: Main secondary color
- `--color-secondaryLight`: Lighter variant
- `--color-secondaryDark`: Darker variant

### Accent Colors

- `--color-accent`: Main accent color
- `--color-accentLight`: Lighter variant
- `--color-accentDark`: Darker variant

### Neutral Colors (Gray Scale)

- `--color-neutral50` to `--color-neutral950`: 11 shades from light to dark

### Semantic Colors

- `--color-success`: Success state (green-like)
- `--color-warning`: Warning state (yellow-like)
- `--color-error`: Error state (red-like)
- `--color-info`: Info state (blue-like)

### UI Colors

- `--color-background`: Main background
- `--color-foreground`: Main text color
- `--color-border`: Border color
- `--color-ring`: Focus ring color
- `--color-muted`: Muted/disabled color

### Gradient Colors

- `--color-gradient1`: First gradient color
- `--color-gradient2`: Second gradient color
- `--color-gradient3`: Third gradient color
- `--color-gradient4`: Fourth gradient color
- `--color-gradient5`: Fifth gradient color

---

## Advanced Usage

### RuntimeTheme Switching (Optional)

If you want to allow users to switch themes at runtime:

```typescript
// Store theme in localStorage
localStorage.setItem("theme", "vibrantNeon");

// Load on app startup (would need additional setup)
// This requires a client component wrapper
```

### Testing Different Themes

Create a theme switcher component:

```tsx
"use client";

import { useState } from "react";
import { themes, type ThemeName } from "@/lib/theme/colors";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeName>("blueModern");

  // Note: Changing theme at runtime requires additional setup
  // For now, editing theme-config.ts and rebuilding is the way

  return (
    <div className="flex gap-2">
      {Object.keys(themes).map((themeName) => (
        <button
          key={themeName}
          onClick={() => setTheme(themeName as ThemeName)}
          className={`px-4 py-2 rounded ${
            theme === themeName ? "bg-primary" : "bg-neutral-700"
          }`}
        >
          {themeName}
        </button>
      ))}
    </div>
  );
}
```

---

## Best Practices

### ✅ Do

- **Use CSS variables** for all dynamic colors
- **Reference the theme** from `color-utils.ts` instead of hardcoding hex values
- **Use semantic color names** (primary, secondary, success) instead of color names (blue, green)
- **Keep hex/RGB values in one place** - the colors.ts file

### ❌ Don't

- **Hardcode hex colors** like `#3B82F6` in components
- **Mix themes** - use one active theme at a time
- **Use arbitrary Tailwind colors** like `bg-blue-600/20` - use CSS variables instead
- **Create new color files** - add to existing theme system

---

## Troubleshooting

### Colors Not Updating After Theme Change?

1. Rebuild the project: `npm run build`
2. Restart the dev server: `npm run dev`
3. Clear Tailwind cache: Delete `.next` folder

### Colors Look Wrong in Components?

Check that your component uses CSS variables:

```tsx
// ❌ Wrong
<div style={{ backgroundColor: "#3B82F6" }}>

// ✅ Correct
<div style={{ backgroundColor: `rgb(var(--color-primary))` }}>
```

### Tailwind Color Classes Not Working?

The tailwind.config.ts file now extends colors with CSS variable references. If IntelliSense isn't showing colors:

1. Restart VS Code
2. Re-run: `npm install`
3. Check that `tailwind.config.ts` is in the root directory

---

## Examples

### Example 1: Themed Button

```tsx
<button
  style={{
    backgroundColor: `rgb(var(--color-primary))`,
    color: `rgb(var(--color-primary-foreground))`,
    boxShadow: `0 0 20px rgba(var(--color-primary), 0.3)`
  }}
  className="px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
>
  Click me
</button>
```

### Example 2: Gradient Card

```tsx
<div
  style={{
    background: `linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-secondary)))`,
    boxShadow: `0 10px 30px rgba(var(--color-secondary), 0.2)`
  }}
  className="p-6 rounded-xl text-white"
>
  <h3>Gradient Content</h3>
</div>
```

### Example 3: Conditional Status Color

```tsx
function StatusBadge({ status }: { status: "success" | "error" | "warning" }) {
  const colorMap = {
    success: "--color-success",
    error: "--color-error",
    warning: "--color-warning"
  };

  return (
    <span
      style={{
        backgroundColor: `rgba(var(${colorMap[status]}), 0.2)`,
        borderColor: `rgba(var(${colorMap[status]}), 0.5)`,
        color: `rgb(var(${colorMap[status]}))`
      }}
      className="px-3 py-1 rounded-full text-sm font-semibold border"
    >
      {status}
    </span>
  );
}
```

---

## Migration Guide

### From Hardcoded Colors to Theme System

**Before:**
```tsx
<div className="bg-blue-600/30 border border-blue-500/30 shadow-lg shadow-blue-500/20">
  ...
</div>
```

**After:**
```tsx
<div
  style={{
    backgroundColor: `rgba(var(--color-primary), 0.3)`,
    borderColor: `rgba(var(--color-primary), 0.3)`,
    boxShadow: `0 10px 15px rgba(var(--color-primary), 0.2)`
  }}
>
  ...
</div>
```

---

## Performance Notes

- **CSS Variables**: No runtime performance cost, handled by browser
- **Build Time**: Minimal - only compiles themes during build
- **Bundle Size**: Slightly larger due to multiple themes, but negligible
- **Runtime Switching**: Would require additional JavaScript (not currently implemented)

---

## Support & Questions

For questions about the color system:

1. Check `lib/theme/colors.ts` for all available colors
2. Review `app/globals.css` for CSS variable definitions
3. Look at updated components (`hero.tsx`, `animated-background.tsx`) for usage examples
4. Use `lib/theme/color-utils.ts` for programmatic color access

---

**Your code is now maintainable, scalable, and theme-friendly!** 🎨

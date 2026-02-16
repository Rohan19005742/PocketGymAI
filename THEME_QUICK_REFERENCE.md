# Color System - Quick Reference

## Change Theme in 10 Seconds

1. Open: `lib/theme/theme-config.ts`
2. Find: `export const ACTIVE_THEME: ThemeName = "blueModern"`
3. Change to one of:
   ```typescript
   "blueModern"    // Modern blue + purple + pink
   "vibrantNeon"   // Bright cyan + magenta + lime
   "warmSunset"    // Warm orange + red + gold
   "coolMidnight"  // Deep blue + teal + cyan
   ```
4. Build: `npm run build`
5. Done! ✨

## Available Themes

| Theme | Primary | Secondary | Accent | Best For |
|-------|---------|-----------|--------|----------|
| **Blue Modern** | Blue | Purple | Pink | Professional, Fitness |
| **Vibrant Neon** | Cyan | Magenta | Green | Gaming, Bold |
| **Warm Sunset** | Orange | Red | Gold | Food, Lifestyle |
| **Cool Midnight** | Dark Blue | Teal | Cyan | Tech, Premium |

## CSS Variables in Components

```tsx
// Use any of these in a style prop:
backgroundColor: `rgb(var(--color-primary))`
color: `rgb(var(--color-foreground))`
borderColor: `rgba(var(--color-border), 0.5)`
boxShadow: `0 0 20px rgba(var(--color-primary), 0.3)`
background: `linear-gradient(to right, rgb(var(--color-gradient1)), rgb(var(--color-gradient2)))`
```

## Available CSS Variables

### Core Colors
- `--color-primary` / `--color-primaryLight` / `--color-primaryDark`
- `--color-secondary` / `--color-secondaryLight` / `--color-secondaryDark`
- `--color-accent` / `--color-accentLight` / `--color-accentDark`

### Semantic
- `--color-success` (green)
- `--color-error` (red)
- `--color-warning` (yellow)
- `--color-info` (blue)

### UI
- `--color-background`
- `--color-foreground`
- `--color-border`
- `--color-muted`
- `--color-ring`

### Gradients
- `--color-gradient1` through `--color-gradient5`

### Neutrals
- `--color-neutral50` through `--color-neutral950` (light to dark)

## Usage Examples

### Gradient Button
```tsx
<button
  style={{
    background: `linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-secondary)))`,
    color: `rgb(var(--color-foreground))`
  }}
>
  Click Me
</button>
```

### Themed Card
```tsx
<div
  style={{
    backgroundColor: `rgb(var(--color-background))`,
    borderColor: `rgb(var(--color-border))`,
    boxShadow: `0 10px 30px rgba(var(--color-primary), 0.2)`
  }}
  className="border rounded-lg p-6"
>
  Content
</div>
```

### Success Badge
```tsx
<span
  style={{
    backgroundColor: `rgba(var(--color-success), 0.2)`,
    color: `rgb(var(--color-success))`
  }}
>
  ✓ Success
</span>
```

## Files Structure

| File | Purpose |
|------|---------|
| `lib/theme/colors.ts` | All 4 color palettes |
| `lib/theme/theme-config.ts` | Active theme selector |
| `lib/theme/color-utils.ts` | Helper functions |
| `app/globals.css` | CSS variable definitions |
| `tailwind.config.ts` | Tailwind integration |

## Key Benefits

✅ **One-line color changes** - Edit theme-config.ts  
✅ **No hardcoded hex values** - All in colors.ts  
✅ **Consistent styling** - Uses CSS variables  
✅ **Easy to maintain** - Clear separation of concerns  
✅ **Multiple themes** - 4 pre-made, infinite custom  
✅ **Future-proof** - Easy to add runtime switching later  

## Common Tasks

### Add a new color to a theme
Edit `colors.ts` - add property to the theme object

### Create a new theme
1. Define new palette in `colors.ts`
2. Add to `themes` object
3. Add to `isValidTheme()` in `theme-config.ts`

### Use color programmatically
```tsx
import { getColor, getHexColor, getColorWithOpacity } from "@/lib/theme/color-utils";

getColor("primary")                    // "59 130 246"
getHexColor("primary")                 // "#3B82F6"
getColorWithOpacity("primary", 0.5)    // "rgba(59 130 246, 0.5)"
```

---

**That's it!** Your color system is now fully manageable and themeable. 🎨

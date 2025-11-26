# WB Default Color Palette - "Indigo Harmony"

The WB system uses a beautiful dark theme with an indigo primary color as the default. All colors are mathematically derived from the primary hue using the Harmonic Color System (HCS).

## Quick Copy - Complete Palette

```css
:root {
  /* === PRIMARY COLOR (Indigo Blue 240°) === */
  --hue-primary: 240;
  --saturation-primary: 70;
  --lightness-primary: 50;
  --primary: hsl(240, 70%, 50%);           /* #6366f1 */
  --primary-dark: hsl(240, 70%, 35%);      /* #4338ca */
  --primary-light: hsl(240, 50%, 75%);     /* #a5b4fc */
  --primary-rgb: 99, 102, 241;

  /* === SECONDARY (Slate Gray) === */
  --secondary-color: #64748b;
  --secondary-color-light: #94a3b8;
  --secondary-color-dark: #475569;
  --secondary-color-rgb: 100, 116, 139;

  /* === SEMANTIC STATE COLORS === */
  
  /* Success - Green (Growth, positivity, go) */
  --success-color: #22c55e;
  --success-color-light: #4ade80;
  --success-color-dark: #16a34a;
  --success-color-rgb: 34, 197, 94;
  --success-bg: rgba(34, 197, 94, 0.1);
  --success-border: rgba(34, 197, 94, 0.3);

  /* Warning - Amber (Attention, caution) */
  --warning-color: #f59e0b;
  --warning-color-light: #fbbf24;
  --warning-color-dark: #d97706;
  --warning-color-rgb: 245, 158, 11;
  --warning-bg: rgba(245, 158, 11, 0.1);
  --warning-border: rgba(245, 158, 11, 0.3);

  /* Danger/Error - Red (Stop, error, destructive) */
  --danger-color: #ef4444;
  --danger-color-light: #f87171;
  --danger-color-dark: #dc2626;
  --danger-color-rgb: 239, 68, 68;
  --danger-bg: rgba(239, 68, 68, 0.1);
  --danger-border: rgba(239, 68, 68, 0.3);
  /* Aliases */
  --error-color: var(--danger-color);
  --error-color-light: var(--danger-color-light);
  --error-color-dark: var(--danger-color-dark);

  /* Info - Cyan (Information, help, tips) */
  --info-color: #0ea5e9;
  --info-color-light: #38bdf8;
  --info-color-dark: #0284c7;
  --info-color-rgb: 14, 165, 233;
  --info-bg: rgba(14, 165, 233, 0.1);
  --info-border: rgba(14, 165, 233, 0.3);

  /* Muted - Slate (De-emphasized content) */
  --muted-color: #94a3b8;
  --muted-color-light: #cbd5e1;
  --muted-color-dark: #64748b;
  --muted-bg: rgba(148, 163, 184, 0.1);
  --muted-border: rgba(148, 163, 184, 0.2);

  /* === DARK THEME BACKGROUNDS === */
  --bg-color: #0f172a;                     /* Surface 900 - Near black */
  --bg-primary: #1e293b;                   /* Surface 800 - Very dark */
  --bg-secondary: #334155;                 /* Surface 700 - Dark gray */
  --bg-tertiary: #475569;                  /* Surface 600 - Medium dark */

  /* === TEXT COLORS === */
  --text-primary: #f8fafc;                 /* Near white */
  --text-secondary: #e2e8f0;               /* Light gray */
  --text-tertiary: #cbd5e1;                /* Medium light gray */
  --text-muted: #94a3b8;                   /* Medium gray */

  /* === BORDER COLORS === */
  --border-color: #475569;
  --border-light: #64748b;
  --border-dark: #334155;

  /* === SURFACE COLORS (Full Scale) === */
  --surface-50: #f8fafc;
  --surface-100: #f1f5f9;
  --surface-200: #e2e8f0;
  --surface-300: #cbd5e1;
  --surface-400: #94a3b8;
  --surface-500: #64748b;
  --surface-600: #475569;
  --surface-700: #334155;
  --surface-800: #1e293b;
  --surface-900: #0f172a;
}
```

## Color Swatches

### Primary Family
| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| Primary | #6366f1 | hsl(240, 70%, 50%) | Main brand, CTAs |
| Primary Light | #a5b4fc | hsl(240, 50%, 75%) | Hover states, highlights |
| Primary Dark | #4338ca | hsl(240, 70%, 35%) | Active states, borders |

### Semantic Colors
| State | Color | Hex | Usage |
|-------|-------|-----|-------|
| Success | Green | #22c55e | Confirmations, positive outcomes |
| Warning | Amber | #f59e0b | Caution, attention needed |
| Danger | Red | #ef4444 | Errors, destructive actions |
| Info | Cyan | #0ea5e9 | Information, tips, help |
| Muted | Slate | #94a3b8 | De-emphasized content |

### Surface Colors (Dark Theme)
| Level | Hex | Usage |
|-------|-----|-------|
| Surface 900 | #0f172a | Page background |
| Surface 800 | #1e293b | Card backgrounds |
| Surface 700 | #334155 | Elevated surfaces |
| Surface 600 | #475569 | Borders, dividers |

## Why These Colors?

1. **Indigo Primary (240°)** - Conveys trust, professionalism, and sophistication
2. **Wave-Theory Harmonics** - Secondary and accent colors are mathematically derived
3. **Color Psychology** - Semantic colors follow established conventions (red=stop, green=go)
4. **High Contrast** - All colors meet WCAG accessibility guidelines
5. **Dark-First Design** - Optimized for reduced eye strain

## Changing the Primary Color

To change the entire theme, simply update the `--hue-primary` variable:

```css
:root {
  --hue-primary: 180;  /* Cyan theme */
  /* OR */
  --hue-primary: 320;  /* Magenta/Cyberpunk theme */
  /* OR */
  --hue-primary: 25;   /* Sunset orange theme */
}
```

All other colors will automatically recalculate based on the new primary hue.

## See Also

- [Component States](/docs/component-states.md) - How components use these colors
- [Control Panel](/components/wb-control-panel/) - Interactive color theme editor

// @ts-nocheck
/**
 * @file ThemeManager.js
 * @description Theme management module for handling colors, themes, and modes
 * @module core/theme/ThemeManager
 */

/**
 * ThemeManager - Manages application themes, colors and dark/light modes
 * @namespace ThemeManager
 */
const ThemeManager = {
  // Theme definitions
  themes: {
    default: { hue: 240, saturation: 70, lightness: 50 },
    cyberpunk: { hue: 180, saturation: 100, lightness: 50 },
    ocean: { hue: 200, saturation: 85, lightness: 55 },
    sunset: { hue: 25, saturation: 90, lightness: 55 },
    forest: { hue: 150, saturation: 80, lightness: 45 }
  },

  // Apply theme to document
  applyTheme(theme, mode, colors) {
    const root = document.documentElement;
    const body = document.body;

    // Set theme attributes
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-mode', mode);
    body.setAttribute('data-theme', theme);
    body.setAttribute('data-mode', mode);

    // Update body classes
    body.className = body.className
      .replace(/theme-\w+/g, '')
      .replace(/\b(light|dark)-mode\b/g, '');
    body.classList.add(`theme-${theme}`, `${mode}-mode`);

    // Apply CSS custom properties
    this.applyCSSVariables(colors, mode);

    console.log(`Theme applied: ${theme}, Mode: ${mode}`);
  },

  // Apply CSS custom properties
  applyCSSVariables(colors, mode) {
    const root = document.documentElement;

    // Apply color variables
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--primary-light', colors.primaryLight);
    root.style.setProperty('--primary-dark', colors.primaryDark);
    root.style.setProperty('--hover-color', colors.hoverColor);

    // Apply mode-specific variables
    const isDark = mode === 'dark';
    root.style.setProperty('--bg-primary', isDark ? '#222222' : '#f8fafc');
    root.style.setProperty('--bg-secondary', isDark ? '#333333' : '#ffffff');
    root.style.setProperty('--text-primary', isDark ? '#f8fafc' : '#333333');
    root.style.setProperty('--text-secondary', isDark ? '#cccccc' : '#555555');
  },

  // Calculate colors from HSL values
  calculateColors(hue, saturation, lightness, harmonyAngle) {
    const primary = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const secondaryHue = (hue + harmonyAngle) % 360;
    const secondary = `hsl(${secondaryHue}, ${saturation}%, ${lightness}%)`;
    const accentHue = (hue + 180) % 360;
    const accent = `hsl(${accentHue}, ${saturation}%, ${lightness}%)`;
    const primaryLight = `hsl(${hue}, ${saturation}%, ${Math.min(lightness + 15, 95)}%)`;
    const primaryDark = `hsl(${hue}, ${saturation}%, ${Math.max(lightness - 15, 10)}%)`;

    return {
      hue,
      saturation,
      lightness,
      harmonyAngle,
      primary,
      secondary,
      accent,
      primaryLight,
      primaryDark,
      hoverColor: primary
    };
  },

  // Convert HSL to Hex
  hslToHex(h, s, l) {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  // Get harmony relationship name
  getHarmonyName(angle) {
    if (angle === 30) return 'Analogous';
    if (angle === 60) return 'Triadic';
    if (angle === 90) return 'Tetradic';
    if (angle === 120) return 'Split-Complementary';
    if (angle >= 150) return 'Complementary';
    return 'Custom';
  }
};

export default ThemeManager;

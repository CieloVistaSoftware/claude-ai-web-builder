/**
 * HARMONIC COLOR SYSTEM (HCS) - Wave-Based Color Generation
 * 
 * Generates complete color palettes using sine wave mathematics.
 * A single input color creates harmonious variations based on:
 * 
 * - FUNDAMENTAL: Base color (sine wave at 0°)
 * - OCTAVE: Doubled frequency (lighter variation)
 * - FIFTH: Harmonic interval (hue shift)
 * - BEAT: Interference pattern (saturation variation)
 * - OVERTONE: Higher harmonic (darker variation)
 * - AMPLITUDE: Wave height (lightness)
 * - FREQUENCY: Wave speed (hue)
 * 
 * This creates mathematically harmonious color palettes from minimal input.
 * 
 * @author John - Cielo Vista Software (30+ years, Wells Fargo compliance expert)
 * @version 1.0.0
 */

class HarmonicColorSystem {
  /**
   * Parse HSL string to [hue, saturation, lightness] components
   * @private
   * @param {string} hslString - "hsl(h, s%, l%)" format
   * @returns {Array<number>} [h, s, l] values
   */
  static _parseHSL(hslString) {
    const match = hslString.match(/hsl\((\d+\.?\d*),\s*(\d+\.?\d*)%,\s*(\d+\.?\d*)%\)/);
    if (!match) {
      console.warn('[HCS] Invalid HSL format:', hslString);
      return [0, 0, 50];
    }
    return [
      parseFloat(match[1]), // Hue 0-360
      parseFloat(match[2]), // Saturation 0-100
      parseFloat(match[3]), // Lightness 0-100
    ];
  }

  /**
   * Convert hex color to HSL
   * @private
   * @param {string} hex - Hex color (#rrggbb)
   * @returns {string} HSL string
   */
  static _hexToHSL(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    if (max === min) {
      return `hsl(0, 0%, ${Math.round(l * 100)}%)`;
    }

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else if (max === b) h = ((r - g) / d + 4) / 6;

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  /**
   * Generate complete color palette from a single input color
   * @static
   * @param {string} inputColor - Color in hex (#rrggbb) or hsl format
   * @param {string} role - Color role name (primary, secondary, etc.) for naming
   * @returns {Object} Color variations with semantic names
   * 
   * @example
   *   const primary = HarmonicColorSystem.generate('#6366f1', 'primary');
   *   // Returns:
   *   // {
   *   //   fundamental: 'hsl(226, 100%, 55%)',
   *   //   octave: 'hsl(226, 100%, 75%)',
   *   //   fifth: 'hsl(166, 100%, 55%)',
   *   //   beat: 'hsl(226, 70%, 55%)',
   *   //   overtone: 'hsl(226, 100%, 30%)',
   *   //   amplitude: 100,
   *   //   frequency: 226,
   *   //   subtle: 'hsl(226, 100%, 88%)',
   *   //   soft: 'hsl(226, 100%, 72%)',
   *   //   bold: 'hsl(226, 100%, 35%)',
   *   //   vivid: 'hsl(226, 100%, 18%)'
   *   // }
   */
  static generate(inputColor, role = 'primary') {
    // Normalize input (hex or hsl to hsl)
    let hslColor = inputColor;
    if (inputColor.startsWith('#')) {
      hslColor = this._hexToHSL(inputColor);
    }

    // Parse HSL components
    const [h, s, l] = this._parseHSL(hslColor);

    // ═══════════════════════════════════════════════════════════════
    // WAVE MATHEMATICS - Generate harmonic color variations
    // ═══════════════════════════════════════════════════════════════

    // FUNDAMENTAL (0°) - Base color, unchanged
    const fundamental = `hsl(${h}, ${s}%, ${l}%)`;

    // OCTAVE (doubled frequency) - One octave up in lightness
    // Musical octave = doubling frequency; here = +20-25% lightness
    const octaveShift = Math.min(25, 100 - l); // Don't exceed 100%
    const octave = `hsl(${h}, ${s}%, ${Math.round(l + octaveShift)}%)`;

    // FIFTH (frequency ratio 3:2) - Hue shifted by perfect fifth (60°)
    // Perfect fifth in music = 1.5x frequency = 60° hue shift
    const fifthHue = (h + 60) % 360;
    const fifth = `hsl(${fifthHue}, ${s}%, ${l}%)`;

    // BEAT (interference pattern) - Saturation decreased (destructive interference)
    // When two waves are out of phase, amplitude decreases
    const beatSaturation = Math.max(20, s - 25); // Reduce saturation
    const beat = `hsl(${h}, ${beatSaturation}%, ${l}%)`;

    // OVERTONE (higher harmonic) - Darker variation
    // Second harmonic = 2x frequency; here = darker (lower lightness)
    const overtoneShift = Math.min(30, l - 10); // Don't go below 10%
    const overtone = `hsl(${h}, ${s}%, ${Math.round(l - overtoneShift)}%)`;

    // AMPLITUDE - Lightness as wave height (0-100)
    const amplitude = Math.round(l);

    // FREQUENCY - Hue as wave speed (0-360 degrees)
    const frequency = h;

    // ═══════════════════════════════════════════════════════════════
    // SEMANTIC MAPPINGS - Map wave variations to semantic names
    // ═══════════════════════════════════════════════════════════════

    // SUBTLE - Very light background (for use on cards, panels)
    // = octave + extra lightness
    const subtleLight = Math.min(92, l + 35);
    const subtle = `hsl(${h}, ${Math.max(0, s - 10)}%, ${subtleLight}%)`;

    // SOFT - Medium lightness (hover states, secondary use)
    // = harmonic average between fundamental and octave
    const softLight = Math.round((l + (l + octaveShift)) / 2);
    const soft = `hsl(${h}, ${s - 15}%, ${softLight}%)`;

    // BOLD - Dark variation (active states, emphasis)
    // = between fundamental and overtone
    const boldLight = Math.round((l + (l - overtoneShift)) / 2);
    const bold = `hsl(${h}, ${s}%, ${boldLight}%)`;

    // VIVID - Darkest, most saturated (borders, outlines)
    // = overtone + extra saturation
    const vividLight = Math.max(15, l - 40);
    const vivid = `hsl(${h}, ${Math.min(100, s + 10)}%, ${vividLight}%)`;

    // ═══════════════════════════════════════════════════════════════
    // RETURN COMPLETE PALETTE
    // ═══════════════════════════════════════════════════════════════

    return {
      // Raw wave components (for advanced use)
      fundamental,      // Base color (sin 0°)
      octave,          // Doubled frequency (lighter)
      fifth,           // Perfect fifth interval (60° hue)
      beat,            // Interference pattern (reduced saturation)
      overtone,        // Higher harmonic (darker)
      amplitude,       // Lightness value (0-100)
      frequency,       // Hue value (0-360)

      // Semantic mappings (for components to use)
      subtle,          // Light background variation
      soft,            // Medium variation (hover)
      bold,            // Dark variation (active)
      vivid,           // Darkest/most intense (border)

      // Metadata
      role,            // Color role name (primary, secondary, etc.)
      input: inputColor,  // Original input for reference
    };
  }

  /**
   * Generate multiple color palettes for different roles
   * @static
   * @param {string} primaryColor - Primary color to base all palettes on
   * @returns {Object} Object with palettes for each role
   */
  static generatePalettes(primaryColor) {
    return {
      primary: this.generate(primaryColor, 'primary'),
      secondary: this.generate('hsl(0, 0%, 50%)', 'secondary'),
      success: this.generate('hsl(142, 76%, 36%)', 'success'),
      danger: this.generate('hsl(0, 100%, 45%)', 'danger'),
      warning: this.generate('hsl(45, 100%, 50%)', 'warning'),
      info: this.generate('hsl(200, 100%, 45%)', 'info'),
    };
  }

  /**
   * Describe the wave properties of a color
   * @static
   * @param {string} color - Color in HSL format
   * @returns {Object} Wave analysis
   */
  static analyze(color) {
    const [h, s, l] = this._parseHSL(color);

    const properties = {
      hue: h,
      saturation: s,
      lightness: l,
      chroma: `${s}% saturation`,
      brightness: l > 50 ? 'light' : 'dark',
      intensity: s > 50 ? 'vivid' : 'muted',
      wavelength: `hue angle ${h}°`,
      amplitude: `lightness ${l}%`,
    };

    return properties;
  }

  /**
   * Get complementary color using wave phase shift (180°)
   * @static
   * @param {string} color - Color in HSL format
   * @returns {string} Complementary color
   */
  static complement(color) {
    const [h, s, l] = this._parseHSL(color);
    const complementHue = (h + 180) % 360;
    return `hsl(${complementHue}, ${s}%, ${l}%)`;
  }

  /**
   * Get analogous colors using harmonic intervals
   * @static
   * @param {string} color - Color in HSL format
   * @returns {Object} Analogous colors {minor, major, perfect}
   */
  static analogous(color) {
    const [h, s, l] = this._parseHSL(color);

    return {
      minor: `hsl(${(h - 30 + 360) % 360}, ${s}%, ${l}%)`,      // Minor third
      perfect: `hsl(${h}, ${s}%, ${l}%)`,                       // Perfect fifth (base)
      major: `hsl(${(h + 60) % 360}, ${s}%, ${l}%)`,            // Major fifth
    };
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.HarmonicColorSystem = HarmonicColorSystem;
}

// Export for ES modules
export { HarmonicColorSystem };
export default HarmonicColorSystem;

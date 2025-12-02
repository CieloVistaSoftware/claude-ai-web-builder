/**
 * TOKEN INJECTOR - Dependency Injection for CSS Variables
 * 
 * This system injects concrete color values into abstract semantic tokens
 * using the Harmonic Color System (HCS) wave-based mathematics.
 * 
 * PATTERN: Single Input → Wave Math → Complete Color Palette
 * 
 * Example:
 *   const injector = new TokenInjector('#6366f1');  // User picks blue
 *   injector.inject(document.documentElement);      // All colors updated
 *   // Every component inherits new color tokens automatically
 * 
 * @author John - Cielo Vista Software
 * @version 1.0.0
 */

import { HarmonicColorSystem } from './harmonic-color-system.js';

class TokenInjector {
  /**
   * Create a new TokenInjector with a primary color
   * @param {string} primaryColor - Color in hex (#rrggbb), rgb, or hsl format
   */
  constructor(primaryColor = '#6366f1') {
    this.primaryColor = primaryColor;
    
    // Generate all color tokens using wave mathematics
    this.colorTokens = this._generateColorTokens(primaryColor);
    
    // Typography and spacing tokens (static, not generated)
    this.staticTokens = this._getStaticTokens();
    
    // Combined token set
    this.tokens = { ...this.colorTokens, ...this.staticTokens };
  }

  /**
   * Generate complete color palette from a single input color using HCS
   * @private
   * @param {string} inputColor - Primary color to base palette on
   * @returns {Object} Color tokens with semantic names
   */
  _generateColorTokens(inputColor) {
    // Get primary color variations via wave math
    const primaryWave = HarmonicColorSystem.generate(inputColor, 'primary');
    
    // Generate secondary (neutral gray) variations
    const secondaryWave = HarmonicColorSystem.generate('hsl(0, 0%, 50%)', 'secondary');
    
    // Generate success (green) variations
    const successWave = HarmonicColorSystem.generate('hsl(142, 76%, 36%)', 'success');
    
    // Generate danger (red) variations
    const dangerWave = HarmonicColorSystem.generate('hsl(0, 100%, 45%)', 'danger');
    
    // Generate warning (yellow) variations
    const warningWave = HarmonicColorSystem.generate('hsl(45, 100%, 50%)', 'warning');
    
    // Generate info (cyan) variations
    const infoWave = HarmonicColorSystem.generate('hsl(200, 100%, 45%)', 'info');

    return {
      // PRIMARY COLOR TOKENS
      '--color-primary': primaryWave.fundamental,
      '--color-primary-subtle': primaryWave.subtle,
      '--color-primary-soft': primaryWave.soft,
      '--color-primary-bold': primaryWave.bold,
      '--color-primary-vivid': primaryWave.vivid,

      // SECONDARY COLOR TOKENS
      '--color-secondary': secondaryWave.fundamental,
      '--color-secondary-subtle': secondaryWave.subtle,
      '--color-secondary-soft': secondaryWave.soft,
      '--color-secondary-bold': secondaryWave.bold,
      '--color-secondary-vivid': secondaryWave.vivid,

      // SUCCESS COLOR TOKENS
      '--color-success': successWave.fundamental,
      '--color-success-subtle': successWave.subtle,
      '--color-success-soft': successWave.soft,
      '--color-success-bold': successWave.bold,
      '--color-success-vivid': successWave.vivid,

      // DANGER COLOR TOKENS
      '--color-danger': dangerWave.fundamental,
      '--color-danger-subtle': dangerWave.subtle,
      '--color-danger-soft': dangerWave.soft,
      '--color-danger-bold': dangerWave.bold,
      '--color-danger-vivid': dangerWave.vivid,

      // WARNING COLOR TOKENS
      '--color-warning': warningWave.fundamental,
      '--color-warning-subtle': warningWave.subtle,
      '--color-warning-soft': warningWave.soft,
      '--color-warning-bold': warningWave.bold,
      '--color-warning-vivid': warningWave.vivid,

      // INFO COLOR TOKENS
      '--color-info': infoWave.fundamental,
      '--color-info-subtle': infoWave.subtle,
      '--color-info-soft': infoWave.soft,
      '--color-info-bold': infoWave.bold,
      '--color-info-vivid': infoWave.vivid,

      // TEXT COLORS - Derived from primary palette
      '--text-primary': 'hsl(0, 0%, 100%)',
      '--text-secondary': 'hsl(0, 0%, 80%)',
      '--text-tertiary': 'hsl(0, 0%, 60%)',
      '--text-disabled': 'hsl(0, 0%, 40%)',
      '--text-primary-inverse': 'hsl(0, 0%, 0%)',
      '--text-secondary-inverse': 'hsl(0, 0%, 20%)',

      // BACKGROUND COLORS - Dark mode defaults
      '--bg-primary': 'hsl(0, 0%, 10%)',
      '--bg-secondary': 'hsl(0, 0%, 15%)',
      '--bg-tertiary': 'hsl(0, 0%, 22%)',
      '--bg-active': 'hsl(0, 0%, 30%)',

      // BORDER COLORS
      '--border-primary': 'hsl(0, 0%, 30%)',
      '--border-secondary': 'hsl(0, 0%, 22%)',
      '--border-tertiary': 'hsl(0, 0%, 40%)',

      // SHADOW
      '--shadow-color': 'rgba(0, 0, 0, 0.3)',
      '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.3)',
      '--shadow-md': '0 4px 6px rgba(0, 0, 0, 0.3)',
      '--shadow-lg': '0 10px 15px rgba(0, 0, 0, 0.3)',
    };
  }

  /**
   * Get static tokens (typography, spacing) that don't change
   * @private
   * @returns {Object} Static token values
   */
  _getStaticTokens() {
    return {
      // SPACING
      '--spacing-xs': '0.25rem',
      '--spacing-sm': '0.5rem',
      '--spacing-md': '1rem',
      '--spacing-lg': '1.5rem',
      '--spacing-xl': '2rem',
      '--spacing-2xl': '3rem',

      // TYPOGRAPHY
      '--font-family-base': "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif",
      '--font-family-mono': "'Courier New', 'Monaco', monospace",

      '--font-size-xs': '0.625rem',
      '--font-size-sm': '0.75rem',
      '--font-size-base': '0.875rem',
      '--font-size-lg': '1rem',
      '--font-size-xl': '1.25rem',
      '--font-size-2xl': '1.5rem',
      '--font-size-3xl': '2rem',

      '--font-weight-light': '300',
      '--font-weight-normal': '400',
      '--font-weight-medium': '500',
      '--font-weight-semibold': '600',
      '--font-weight-bold': '700',

      // TRANSITIONS
      '--transition-fast': 'all 0.15s ease',
      '--transition-normal': 'all 0.3s ease',
      '--transition-slow': 'all 0.5s ease',

      // BORDER RADIUS
      '--radius-sm': '4px',
      '--radius-md': '6px',
      '--radius-lg': '8px',
      '--radius-xl': '12px',
      '--radius-full': '9999px',

      // Z-INDEX
      '--z-dropdown': '100',
      '--z-modal': '200',
      '--z-toast': '300',
      '--z-tooltip': '400',

      // OPACITY
      '--opacity-disabled': '0.5',
      '--opacity-hover': '0.8',
      '--opacity-focus': '0.9',
    };
  }

  /**
   * Inject all tokens into a target element (usually document.documentElement)
   * @param {HTMLElement} target - Element to inject tokens into (default: root)
   */
  inject(target = document.documentElement) {
    if (!target || !(target instanceof HTMLElement)) {
      console.error('TokenInjector.inject() requires a valid HTMLElement');
      return;
    }

    // Apply each token as a CSS custom property
    Object.entries(this.tokens).forEach(([tokenName, tokenValue]) => {
      target.style.setProperty(tokenName, tokenValue);
    });

    // Dispatch event so components can react to token changes
    window.dispatchEvent(
      new CustomEvent('wb:tokens-injected', {
        detail: { injector: this, tokens: this.tokens },
      })
    );

    console.log('[TokenInjector] Injected', Object.keys(this.tokens).length, 'tokens');
  }

  /**
   * Get a specific token value
   * @param {string} tokenName - Name of the token (e.g., '--color-primary')
   * @returns {string|null} Token value or null if not found
   */
  getToken(tokenName) {
    return this.tokens[tokenName] || null;
  }

  /**
   * Update a single token and re-inject
   * @param {string} tokenName - Token to update
   * @param {string} value - New value
   * @param {HTMLElement} target - Target element (default: root)
   */
  updateToken(tokenName, value, target = document.documentElement) {
    this.tokens[tokenName] = value;
    target.style.setProperty(tokenName, value);
    
    window.dispatchEvent(
      new CustomEvent('wb:token-updated', {
        detail: { tokenName, value },
      })
    );
  }

  /**
   * Get all tokens as an object
   * @returns {Object} All tokens
   */
  getTokens() {
    return { ...this.tokens };
  }

  /**
   * Export tokens as a CSS string (for saving/loading)
   * @returns {string} CSS custom properties declaration
   */
  toCSSString() {
    return ':root {\n' +
      Object.entries(this.tokens)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n') +
      '\n}';
  }

  /**
   * Export tokens as JSON (for storage)
   * @returns {string} JSON representation
   */
  toJSON() {
    return JSON.stringify(this.tokens, null, 2);
  }

  /**
   * Load tokens from JSON
   * @static
   * @param {string} json - JSON string of tokens
   * @returns {TokenInjector} New injector with loaded tokens
   */
  static fromJSON(json) {
    try {
      const tokens = JSON.parse(json);
      const injector = new TokenInjector();
      injector.tokens = tokens;
      return injector;
    } catch (error) {
      console.error('Failed to load tokens from JSON:', error);
      return new TokenInjector();
    }
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.TokenInjector = TokenInjector;
  
  // Create a default injector instance
  window.WB = window.WB || { };
  window.WB.tokenInjector = new TokenInjector();
}

// Export for ES modules
export { TokenInjector };
export default TokenInjector;

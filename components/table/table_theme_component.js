// TableThemeComponent - Inherits from existing wb.css variables and formulas
// Uses your existing golden ratio, spacing, and color system

class TableThemeComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Cache for performance
    this.lastHue = null;
    this.lastSaturation = null;
    this.lastLightness = null;
    this.lastColorMode = null;
    this.lastTheme = null;
    this.styleElement = null;
  }
  
  connectedCallback() {
    this.setupInheritanceListeners();
    this.generateTableTheme();
  }
  
  disconnectedCallback() {
    this.removeInheritanceListeners();
    if (this.styleElement) {
      this.styleElement.remove();
    }
  }
  
  // Listen to existing website builder color system
  setupInheritanceListeners() {
    // Listen to color bar changes
    document.addEventListener('input', this.handleColorBarInput.bind(this));
    
    // Listen to theme changes
    this.themeObserver = new MutationObserver(() => {
      this.checkForChanges();
    });
    
    this.themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-color-mode', 'data-layout']
    });
    
    // Poll for colorBarState changes from wb.js
    this.pollInterval = setInterval(() => {
      this.checkColorBarState();
    }, 100);
  }
  
  removeInheritanceListeners() {
    if (this.themeObserver) this.themeObserver.disconnect();
    if (this.pollInterval) clearInterval(this.pollInterval);
    document.removeEventListener('input', this.handleColorBarInput.bind(this));
  }
  
  // Handle color bar input events from wb.js
  handleColorBarInput(event) {
    if (event.target.id === 'color-bar' || 
        event.target.id === 'lightness-slider' || 
        event.target.id === 'saturation-slider') {
      setTimeout(() => this.checkColorBarState(), 10);
    }
  }
  
  // Check for changes in the global colorBarState from wb.js
  checkColorBarState() {
    if (typeof colorBarState === 'undefined') return;
    
    const hasChanged = 
      this.lastHue !== colorBarState.hue ||
      this.lastSaturation !== colorBarState.saturation ||
      this.lastLightness !== colorBarState.lightness ||
      this.lastColorMode !== colorBarState.colorMode;
    
    if (hasChanged) {
      this.lastHue = colorBarState.hue;
      this.lastSaturation = colorBarState.saturation;
      this.lastLightness = colorBarState.lightness;
      this.lastColorMode = colorBarState.colorMode;
      
      this.generateTableTheme();
    }
  }
  
  // Check for theme changes
  checkForChanges() {
    const currentTheme = document.body.getAttribute('data-theme');
    const currentMode = document.body.getAttribute('data-color-mode');
    
    if (this.lastTheme !== currentTheme || this.lastMode !== currentMode) {
      this.lastTheme = currentTheme;
      this.lastMode = currentMode;
      setTimeout(() => this.generateTableTheme(), 50);
    }
  }
  
  // Get current values from existing wb.js system
  getCurrentValues() {
    // Get from global colorBarState (wb.js)
    if (typeof colorBarState !== 'undefined') {
      return {
        hue: colorBarState.hue || 240,
        saturation: colorBarState.saturation || 70,
        lightness: colorBarState.lightness || 50,
        isDarkMode: colorBarState.colorMode === 'dark' || 
                   document.body.getAttribute('data-color-mode') === 'dark' ||
                   document.body.getAttribute('data-theme') === 'dark',
        currentTheme: document.body.getAttribute('data-theme') || 'light'
      };
    }
    
    // Fallback: extract from existing CSS variables
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColor = rootStyles.getPropertyValue('--primary').trim() || '#6366f1';
    const hsl = this.hexToHSL(primaryColor);
    
    return {
      hue: hsl ? hsl.h : 240,
      saturation: hsl ? hsl.s : 70,
      lightness: hsl ? hsl.l : 50,
      isDarkMode: document.body.getAttribute('data-color-mode') === 'dark' ||
                 document.body.getAttribute('data-theme') === 'dark',
      currentTheme: document.body.getAttribute('data-theme') || 'light'
    };
  }
  
  // Generate table theme using wb.css mathematical formulas
  generateTableTheme() {
    const { hue, saturation, lightness, isDarkMode, currentTheme } = this.getCurrentValues();
    
    // Calculate colors using the same math as your updateColorBarPreview function
    const rgb = this.hslToRgb(hue, saturation, lightness);
    const primaryHex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    
    // Generate table-specific variations using mathematical relationships
    const theme = {
      primary: primaryHex,
      
      // Light variations (using your existing lightness math)
      primaryLight: this.hslToHex(hue, saturation * 0.8, Math.min(95, lightness * 1.3)),
      primaryDark: this.hslToHex(hue, saturation * 1.1, Math.max(10, lightness * 0.7)),
      
      // Background colors (using inverse relationships)
      bgPrimary: isDarkMode ? 
        this.hslToHex(hue, Math.min(saturation * 0.3, 20), 8) :
        this.hslToHex(hue, Math.min(saturation * 0.1, 10), 98),
        
      bgSecondary: isDarkMode ?
        this.hslToHex(hue, Math.min(saturation * 0.4, 25), 12) :
        this.hslToHex(hue, Math.min(saturation * 0.2, 15), 95),
      
      // Text colors (using contrast math)
      textPrimary: isDarkMode ?
        this.hslToHex(hue, Math.min(saturation * 0.2, 15), 95) :
        this.hslToHex(hue, Math.min(saturation * 0.3, 20), 15),
        
      textSecondary: isDarkMode ?
        this.hslToHex(hue, Math.min(saturation * 0.3, 20), 70) :
        this.hslToHex(hue, Math.min(saturation * 0.4, 25), 45),
      
      // Border colors
      border: isDarkMode ?
        this.hslToHex(hue, Math.min(saturation * 0.4, 25), 25) :
        this.hslToHex(hue, Math.min(saturation * 0.3, 20), 85),
      
      // Table-specific colors using mathematical progression
      tableHeader: isDarkMode ?
        this.hslToHex(hue, saturation * 0.6, lightness * 0.4) :
        this.hslToHex(hue, saturation * 0.4, lightness * 1.4),
        
      tableStripe: isDarkMode ?
        this.hslToHex(hue, Math.min(saturation * 0.2, 10), 6) :
        this.hslToHex(hue, Math.min(saturation * 0.1, 8), 99),
        
      tableHover: isDarkMode ?
        this.hslToHex(hue, saturation * 0.5, lightness * 0.3) :
        this.hslToHex(hue, saturation * 0.3, lightness * 1.6),
        
      tableSelected: isDarkMode ?
        this.hslToHex(hue, saturation * 0.7, lightness * 0.5) :
        this.hslToHex(hue, saturation * 0.5, lightness * 1.8)
    };
    
    // Generate and apply CSS using existing wb.css variables
    const css = this.generateCSS(theme, isDarkMode, currentTheme);
    this.applyCSS(css);
    
    // Dispatch event
    this.dispatchEvent(new CustomEvent('table-theme-updated', {
      detail: { theme, hsl: { hue, saturation, lightness }, isDarkMode, currentTheme },
      bubbles: true,
      composed: true
    }));
  }
  
  // Generate CSS that inherits from wb.css variables and formulas
  generateCSS(theme, isDarkMode, currentTheme) {
    return `
      /* Table theme inheriting from wb.css variables and formulas */
      table-component {
        /* Inherit base variables from wb.css */
        --table-bg-color: ${theme.bgSecondary};
        --table-text-color: ${theme.textPrimary};
        --table-border-color: ${theme.border};
        --table-header-bg: ${theme.tableHeader};
        --table-header-color: ${isDarkMode ? theme.textPrimary : theme.bgPrimary};
        --table-stripe-color: ${theme.tableStripe};
        --table-hover-color: ${theme.tableHover}20;
        --table-selected-color: ${theme.tableSelected}30;
        --table-sort-icon-color: ${theme.primary};
        --table-pagination-active: ${theme.primary};
        --table-pagination-hover: ${theme.tableHover}15;
        
        /* Use existing wb.css spacing scale */
        --table-cell-padding: var(--space-sm) var(--space-md);
        --table-header-padding: var(--space-md) var(--space-md);
        --table-margin: var(--space-lg);
        
        /* Use existing wb.css typography scale */
        --table-font-size: var(--text-small);
        --table-header-font-size: var(--text-small);
        --table-font-family: inherit;
        
        /* Use existing wb.css golden ratio for border radius */
        --table-border-radius: calc(var(--space-xs) * var(--golden-ratio));
        
        /* Use existing wb.css transition variables */
        --table-transition: var(--transition-fast);
        --table-transition-medium: var(--transition-medium);
        
        /* Calculate shadows using existing variables */
        --table-shadow: 0 calc(var(--space-xs) / 2) var(--space-md) var(--glass-shadow);
        --table-elevation: 0 var(--space-xs) var(--space-lg) var(--glass-shadow);
        
        /* Use existing glassmorphism variables */
        --table-glass-bg: var(--glass-bg);
        --table-glass-border: var(--glass-border);
        --table-glass-shadow: var(--glass-shadow);
      }
      
      /* Enhanced table styling using wb.css patterns */
      table-component::part(table) {
        box-shadow: var(--table-shadow);
        border-radius: var(--table-border-radius);
        overflow: hidden;
        transition: var(--table-transition-medium);
        background: var(--table-bg-color);
        border: 1px solid var(--table-border-color);
      }
      
      table-component::part(header-cell) {
        background: var(--table-header-bg);
        color: var(--table-header-color);
        padding: var(--table-header-padding);
        font-size: var(--table-header-font-size);
        font-weight: 600;
        border-bottom: 2px solid var(--table-border-color);
        transition: var(--table-transition);
      }
      
      table-component::part(cell) {
        padding: var(--table-cell-padding);
        font-size: var(--table-font-size);
        border-bottom: 1px solid var(--table-border-color);
        transition: var(--table-transition);
      }
      
      table-component::part(row):hover {
        background-color: var(--table-hover-color);
        transform: translateY(-1px);
        transition: var(--table-transition);
      }
      
      table-component::part(row).selected {
        background-color: var(--table-selected-color);
        border-left: calc(var(--space-xs) / 2) solid var(--table-sort-icon-color);
      }
      
      /* Striped rows using wb.css pattern */
      table-component[striped]::part(row):nth-child(odd) {
        background-color: var(--table-stripe-color);
      }
      
      table-component[striped]::part(row):nth-child(odd).selected {
        background-color: var(--table-selected-color);
      }
      
      /* Bordered table using wb.css spacing */
      table-component[bordered]::part(cell),
      table-component[bordered]::part(header-cell) {
        border: 1px solid var(--table-border-color);
      }
      
      /* Compact mode using wb.css spacing scale */
      table-component[compact]::part(cell),
      table-component[compact]::part(header-cell) {
        padding: var(--space-xs) var(--space-sm);
      }
      
      /* Sort headers */
      table-component::part(sort-header) {
        cursor: pointer;
        user-select: none;
        transition: var(--table-transition);
      }
      
      table-component::part(sort-header):hover {
        background-color: var(--table-hover-color);
      }
      
      table-component::part(sort-icon) {
        color: var(--table-sort-icon-color);
        margin-left: var(--space-xs);
        font-size: var(--text-tiny);
        transition: var(--table-transition);
      }
      
      /* Pagination using wb.css spacing and transitions */
      table-component::part(pagination) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--space-lg);
        gap: var(--space-md);
      }
      
      table-component::part(pagination-controls) {
        display: flex;
        gap: var(--space-xs);
      }
      
      table-component::part(page-button) {
        padding: var(--space-xs) var(--space-sm);
        border: 1px solid var(--table-border-color);
        background: var(--table-bg-color);
        color: var(--table-text-color);
        border-radius: calc(var(--space-xs) / 2);
        font-size: var(--text-tiny);
        transition: var(--table-transition);
        cursor: pointer;
        min-width: calc(var(--space-md) * 2);
        text-align: center;
      }
      
      table-component::part(page-button):hover:not(:disabled):not(.current) {
        background-color: var(--table-pagination-hover);
        transform: translateY(-1px);
      }
      
      table-component::part(page-button).current {
        background-color: var(--table-pagination-active);
        color: white;
        border-color: var(--table-pagination-active);
        box-shadow: 0 0 var(--space-sm) var(--table-pagination-active)40;
      }
      
      table-component::part(page-button):disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      /* Status badges that adapt to theme */
      table-component .status {
        display: inline-block;
        padding: var(--space-xs) var(--space-sm);
        border-radius: var(--space-lg);
        font-size: var(--text-tiny);
        font-weight: 500;
        border: 1px solid;
      }
      
      table-component .status.active {
        background-color: var(--accent)20;
        color: var(--accent);
        border-color: var(--accent)60;
      }
      
      table-component .status.pending {
        background-color: var(--accent-alt)20;
        color: var(--accent-alt);
        border-color: var(--accent-alt)60;
      }
      
      /* Responsive using wb.css breakpoint pattern */
      @media (max-width: 768px) {
        table-component {
          --table-cell-padding: var(--space-xs) var(--space-sm);
          --table-font-size: var(--text-tiny);
        }
        
        table-component::part(pagination) {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-sm);
        }
      }
      
      /* Loading state */
      table-component[loading]::part(table) {
        opacity: 0.6;
        pointer-events: none;
        position: relative;
      }
      
      table-component[loading]::part(table)::after {
        content: 'Loading...';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--table-bg-color);
        padding: var(--space-md);
        border: 1px solid var(--table-border-color);
        border-radius: var(--table-border-radius);
        font-size: var(--text-small);
        z-index: 10;
      }
    `;
  }
  
  // Apply generated CSS
  applyCSS(css) {
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.id = 'table-theme-inherited';
      document.head.appendChild(this.styleElement);
    }
    
    this.styleElement.textContent = css;
  }
  
  // Utility functions using your existing wb.js math
  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
  
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  
  hslToHex(h, s, l) {
    const rgb = this.hslToRgb(h, s, l);
    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  }
  
  hexToHSL(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: none;
        }
      </style>
    `;
  }
}

// Register the component
customElements.define('table-theme-component', TableThemeComponent);

// Auto-initialize when table components are found
document.addEventListener('DOMContentLoaded', () => {
  const tableComponents = document.querySelectorAll('table-component');
  if (tableComponents.length > 0 && !document.querySelector('table-theme-component')) {
    const themeComponent = document.createElement('table-theme-component');
    document.body.appendChild(themeComponent);
  }
});

export default TableThemeComponent;
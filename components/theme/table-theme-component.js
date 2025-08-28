/**
 * Table Theme Component Web Component
 * 
 * This component acts as a lightweight decorator for the theme-generator-component, extending it with
 * table-specific theming capabilities. It provides a compact panel that works alongside the main theme
 * generator to add table-specific styling options without duplicating the base theme functionality.
 * 
 * Usage: <table-theme-component></table-theme-component>
 * 
 * Features:
 * - Listens to theme-generator 'theme-changed' events
 * - Adds table-specific CSS variables to the generated theme
 * - Provides compact controls for table styling
 * - Automatically applies theme colors to match the main generator
 * 
 * Note: This component should be used alongside the theme-generator-component, not as a replacement.
 */

class TableThemeComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Table-specific theme settings with sensible defaults
    this.tableTheme = {
      cellPadding: 12,
      borderWidth: 1,
      borderRadius: 4,
      fontSize: 14,
      headerFontWeight: 600,
      stripedOpacity: 0.05,
      hoverOpacity: 0.08,
      sortIconSize: 16,
      paginationSize: 32,
      compactPadding: 8
    };
    
    this.lastBaseTheme = null;
    this.isCollapsed = false;
  }
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.initializeFromThemeGenerator();
    
    // Apply initial theme immediately
    setTimeout(() => {
      this.initializeFromColorBarState();
    }, 100);
  }
  initializeFromThemeGenerator() {
    // Listen for theme changes from the main theme generator
    document.addEventListener('theme-changed', (event) => {
      this.handleBaseThemeChange(event.detail);
    });
    
    // Listen for color-bar-changed events from table-theme.html demo
    document.addEventListener('color-bar-changed', (event) => {
      this.handleColorBarChange(event.detail);
    });
    
    // Try to get initial theme from existing theme generator
    const themeGenerator = document.querySelector('theme-generator');
    if (themeGenerator && typeof themeGenerator.getTheme === 'function') {
      const baseTheme = themeGenerator.getTheme();
      this.handleBaseThemeChange(baseTheme);
    }
    
    // Initialize from global colorBarState if available
    this.initializeFromColorBarState();
  }
  handleBaseThemeChange(baseTheme) {
    // Store the base theme for reference
    this.lastBaseTheme = baseTheme;
    
    // Apply base theme styling to this component's UI for visual consistency
    this.applyBaseThemeToComponent(baseTheme);
    
    // Generate and apply table-specific extensions to the document
    this.generateTableThemeExtension(baseTheme);
  }
  handleColorBarChange(colorBarState) {
    console.log('🎨 Table theme received color-bar-changed event:', colorBarState);
    // Convert colorBarState to base theme format
    const baseTheme = this.createThemeFromColorBarState(colorBarState);
    this.handleBaseThemeChange(baseTheme);
  }
  initializeFromColorBarState() {
    // Initialize from global colorBarState if available
    if (typeof colorBarState !== 'undefined') {
      console.log('🎨 Initializing table theme from colorBarState:', colorBarState);
      const baseTheme = this.createThemeFromColorBarState(colorBarState);
      this.handleBaseThemeChange(baseTheme);
    } else {
      console.log('⚠️ colorBarState not available, using default theme');
      // Apply default theme
      const defaultTheme = this.createThemeFromColorBarState({
        hue: 220,
        saturation: 70,
        lightness: 50
      });
      this.handleBaseThemeChange(defaultTheme);
    }
  }

  createThemeFromColorBarState(state) {
    const { hue, saturation, lightness } = state;
    
    // Convert HSL to RGB for hex calculation
    const hslToRgb = (h, s, l) => {
      h /= 360; s /= 100; l /= 100;
      const a = s * Math.min(l, 1 - l);
      const f = (n, k = (n + h * 12) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))];
    };
    
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    
    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    const primaryColor = rgbToHex(r, g, b);
    
    // Create mathematical variations
    const primaryLight = rgbToHex(...hslToRgb(hue, saturation * 0.8, Math.min(95, lightness * 1.3)));
    const primaryDark = rgbToHex(...hslToRgb(hue, saturation * 1.1, Math.max(10, lightness * 0.7)));
    
    // Determine if dark mode based on lightness and body attributes
    const isDark = lightness < 40 || 
                   document.body.getAttribute('data-theme') === 'dark' ||
                   document.body.getAttribute('data-color-mode') === 'dark';
    
    return {
      colors: {
        primary: primaryColor,
        primaryLight: primaryLight,
        primaryDark: primaryDark,
        background: isDark ? '#121212' : '#ffffff',
        surface: isDark ? '#1e1e1e' : '#f8f9fa',
        textPrimary: isDark ? '#f0f0f0' : '#333333',
        textSecondary: isDark ? '#a0a0a0' : '#666666',
        border: isDark ? '#333333' : '#e5e7eb'
      },
      isDark: isDark,
      timestamp: Date.now()
    };
  }

  applyBaseThemeToComponent(theme) {
    // Apply base theme colors to this component's shadow DOM for UI consistency
    const root = this.shadowRoot;
    
    // Set CSS custom properties for internal styling
    root.host.style.setProperty('--base-primary', theme.colors.primary);
    root.host.style.setProperty('--base-primary-light', theme.colors.primaryLight);
    root.host.style.setProperty('--base-primary-dark', theme.colors.primaryDark);
    root.host.style.setProperty('--base-background', theme.colors.background);
    root.host.style.setProperty('--base-surface', theme.colors.surface);
    root.host.style.setProperty('--base-text-primary', theme.colors.textPrimary);
    root.host.style.setProperty('--base-text-secondary', theme.colors.textSecondary);
    root.host.style.setProperty('--base-border', theme.colors.border);
  }
  generateTableThemeExtension(baseTheme) {
    // Create extended theme object that includes base theme + table-specific variables
    const extendedTheme = {
      ...baseTheme,
      tableTheme: {
        ...this.tableTheme,
        timestamp: Date.now()
      }
    };
    
    // Apply table-specific CSS variables to the document
    this.applyTableThemeToDocument(extendedTheme);
    
    // Dispatch enhanced theme-changed event with table extensions
    this.dispatchEvent(new CustomEvent('table-theme-changed', {
      detail: extendedTheme,
      bubbles: true,
      composed: true
    }));
    
    // Also dispatch a general theme-enhanced event for other potential decorators
    document.dispatchEvent(new CustomEvent('theme-enhanced', {
      detail: {
        component: 'table',
        baseTheme: baseTheme,
        enhancement: this.tableTheme,
        extendedTheme: extendedTheme
      }
    }));
  }
  applyTableThemeToDocument(extendedTheme) {
    const root = document.documentElement;
    const tableTheme = extendedTheme.tableTheme;
    const baseColors = extendedTheme.colors;
    const isDarkMode = extendedTheme.isDark;
    
    // Apply table-specific CSS variables
    root.style.setProperty('--table-cell-padding', `${tableTheme.cellPadding}px`);
    root.style.setProperty('--table-border-width', `${tableTheme.borderWidth}px`);
    root.style.setProperty('--table-border-radius', `${tableTheme.borderRadius}px`);
    root.style.setProperty('--table-font-size', `${tableTheme.fontSize}px`);
    root.style.setProperty('--table-header-font-weight', tableTheme.headerFontWeight);
    root.style.setProperty('--table-stripe-opacity', tableTheme.stripedOpacity);
    root.style.setProperty('--table-hover-opacity', tableTheme.hoverOpacity);
    root.style.setProperty('--table-sort-icon-size', `${tableTheme.sortIconSize}px`);
    root.style.setProperty('--table-pagination-size', `${tableTheme.paginationSize}px`);
    root.style.setProperty('--table-compact-padding', `${tableTheme.compactPadding}px`);
    
    // Apply enhanced table-specific color variables based on base theme
    if (baseColors) {
      console.log('🎨 Applying table color variables:', baseColors);
      
      // Set data-theme attribute on body to ensure dark mode styles apply correctly
      if (isDarkMode) {
        document.body.setAttribute('data-theme', 'dark');
      } else {
        document.body.removeAttribute('data-theme');
      }
      
      // Primary color influences for header and interactions
      root.style.setProperty('--table-header-bg', isDarkMode ? 
        baseColors.primaryDark :  // Darker header in dark mode
        baseColors.primaryLight); // Lighter header in light mode
      
      root.style.setProperty('--table-header-color', isDarkMode ? 
        '#ffffff' :  // White text for dark mode headers for better contrast
        baseColors.primaryDark);
      
      // Border colors need more contrast in dark mode
      root.style.setProperty('--table-border-color', isDarkMode ? 
        'rgba(255, 255, 255, 0.15)' :  // Light borders for dark mode
        baseColors.border);
      
      // Stripe background - use primary color with opacity but adjust for dark mode
      const stripeOpacity = isDarkMode ? 
        tableTheme.stripedOpacity * 0.3 : // Lower opacity in dark mode
        tableTheme.stripedOpacity;
      root.style.setProperty('--table-stripe-bg', `${baseColors.primary}${Math.round(stripeOpacity * 255).toString(16).padStart(2, '0')}`);
      
      // Hover color - use primary color with opacity but adjust for dark mode
      const hoverOpacity = isDarkMode ? 
        tableTheme.hoverOpacity * 2 : // Higher opacity in dark mode
        tableTheme.hoverOpacity;
      root.style.setProperty('--table-hover-color', `${baseColors.primary}${Math.round(hoverOpacity * 255).toString(16).padStart(2, '0')}`);
      
      // Background and text colors
      root.style.setProperty('--table-bg-color', baseColors.surface);
      root.style.setProperty('--table-text-color', baseColors.textPrimary);
      root.style.setProperty('--table-text-secondary', baseColors.textSecondary);
      root.style.setProperty('--table-sort-icon-color', baseColors.textSecondary);
      
      // Selection color (based on primary)
      root.style.setProperty('--table-selected-color', `${baseColors.primary}${Math.round(0.2 * 255).toString(16).padStart(2, '0')}`);
    }
  }

  setupEventListeners() {
    // Tab switching
    this.shadowRoot.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Theme control inputs
    const inputs = this.shadowRoot.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.updateTableTheme();
      });
    });

    // Reset button
    const resetBtn = this.shadowRoot.querySelector('.reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetToDefaults();
      });
    }

    // Export button
    const exportBtn = this.shadowRoot.querySelector('.export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportTableTheme();
      });
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    
    // Update tab buttons
    this.shadowRoot.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    this.shadowRoot.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.dataset.tab === tabName);
    });
  }

  updateTableTheme() {
    // Get values from inputs
    const cellPaddingInput = this.shadowRoot.querySelector('#cellPadding');
    const borderWidthInput = this.shadowRoot.querySelector('#borderWidth');
    const borderRadiusInput = this.shadowRoot.querySelector('#borderRadius');
    const fontSizeInput = this.shadowRoot.querySelector('#fontSize');
    const headerFontWeightInput = this.shadowRoot.querySelector('#headerFontWeight');
    const stripedOpacityInput = this.shadowRoot.querySelector('#stripedOpacity');
    const hoverOpacityInput = this.shadowRoot.querySelector('#hoverOpacity');
    const sortIconSizeInput = this.shadowRoot.querySelector('#sortIconSize');
    const paginationSizeInput = this.shadowRoot.querySelector('#paginationSize');
    const compactPaddingInput = this.shadowRoot.querySelector('#compactPadding');

    // Update theme object
    this.tableTheme = {
      cellPadding: parseInt(cellPaddingInput?.value || 12),
      borderWidth: parseInt(borderWidthInput?.value || 1),
      borderRadius: parseInt(borderRadiusInput?.value || 4),
      fontSize: parseInt(fontSizeInput?.value || 14),
      headerFontWeight: parseInt(headerFontWeightInput?.value || 600),
      stripedOpacity: parseFloat(stripedOpacityInput?.value || 0.05),
      hoverOpacity: parseFloat(hoverOpacityInput?.value || 0.08),
      sortIconSize: parseInt(sortIconSizeInput?.value || 16),
      paginationSize: parseInt(paginationSizeInput?.value || 32),
      compactPadding: parseInt(compactPaddingInput?.value || 8)
    };    // Apply the updated theme
    if (this.lastBaseTheme) {
      this.generateTableThemeExtension(this.lastBaseTheme);
    }
  }

  resetToDefaults() {
    this.tableTheme = {
      cellPadding: 12,
      borderWidth: 1,
      borderRadius: 4,
      fontSize: 14,
      headerFontWeight: 600,
      stripedOpacity: 0.05,
      hoverOpacity: 0.08,
      sortIconSize: 16,
      paginationSize: 32,
      compactPadding: 8
    };    // Update input values
    this.updateInputValues();
    if (this.lastBaseTheme) {
      this.generateTableThemeExtension(this.lastBaseTheme);
    }
  }

  updateInputValues() {
    const inputs = {
      cellPadding: this.shadowRoot.querySelector('#cellPadding'),
      borderWidth: this.shadowRoot.querySelector('#borderWidth'),
      borderRadius: this.shadowRoot.querySelector('#borderRadius'),
      fontSize: this.shadowRoot.querySelector('#fontSize'),
      headerFontWeight: this.shadowRoot.querySelector('#headerFontWeight'),
      stripedOpacity: this.shadowRoot.querySelector('#stripedOpacity'),
      hoverOpacity: this.shadowRoot.querySelector('#hoverOpacity'),
      sortIconSize: this.shadowRoot.querySelector('#sortIconSize'),
      paginationSize: this.shadowRoot.querySelector('#paginationSize'),
      compactPadding: this.shadowRoot.querySelector('#compactPadding')
    };

    Object.keys(inputs).forEach(key => {
      if (inputs[key]) {
        inputs[key].value = this.tableTheme[key];
      }
    });
  }

  exportTableTheme() {
    const exportData = {
      tableTheme: this.tableTheme,
      cssVariables: this.generateCSSVariables(),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-theme.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  generateCSSVariables() {
    return {
      '--table-cell-padding': `${this.tableTheme.cellPadding}px`,
      '--table-border-width': `${this.tableTheme.borderWidth}px`,
      '--table-border-radius': `${this.tableTheme.borderRadius}px`,
      '--table-font-size': `${this.tableTheme.fontSize}px`,
      '--table-header-font-weight': this.tableTheme.headerFontWeight,
      '--table-stripe-opacity': this.tableTheme.stripedOpacity,
      '--table-hover-opacity': this.tableTheme.hoverOpacity,
      '--table-sort-icon-size': `${this.tableTheme.sortIconSize}px`,
      '--table-pagination-size': `${this.tableTheme.paginationSize}px`,
      '--table-compact-padding': `${this.tableTheme.compactPadding}px`
    };
  }

  getTableTheme() {
    return { ...this.tableTheme };
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          color: var(--text-color, #333);
          background: var(--bg-color, #fff);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin: 20px 0;
        }

        .tabs {
          display: flex;
          flex-wrap: wrap;
          border-bottom: 1px solid var(--border-color, #ddd);
          margin-bottom: 20px;
        }

        .tab-btn {
          padding: 10px 20px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 16px;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
          color: var(--text-color, #333);
        }

        .tab-btn:hover {
          background-color: var(--surface-color, rgba(0, 0, 0, 0.05));
        }

        .tab-btn.active {
          border-bottom-color: var(--base-primary, #4285f4);
          color: var(--base-primary, #4285f4);
          font-weight: bold;
        }

        .tab-content {
          display: none;
          animation: fadeIn 0.3s;
        }

        .tab-content.active {
          display: block;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .control-group {
          margin-bottom: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .control-item {
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: 500;
          margin-bottom: 5px;
          color: var(--text-color, #333);
        }

        input, select {
          padding: 8px 12px;
          border: 1px solid var(--border-color, #ddd);
          border-radius: 4px;
          background: var(--surface-color, #fff);
          color: var(--text-color, #333);
        }

        input[type="range"] {
          padding: 0;
          height: 6px;
          background: var(--border-color, #ddd);
          outline: none;
          border-radius: 3px;
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: var(--base-primary, #4285f4);
          border-radius: 50%;
          cursor: pointer;
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: var(--base-primary, #4285f4);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .value-display {
          font-size: 12px;
          color: var(--base-primary, #4285f4);
          font-weight: 500;
        }

        .actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color, #ddd);
        }

        button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }

        .reset-btn {
          background: var(--surface-color, #f8f9fa);
          color: var(--text-color, #333);
          border: 1px solid var(--border-color, #ddd);
        }

        .reset-btn:hover {
          background: var(--border-color, #e9ecef);
        }

        .export-btn {
          background: var(--base-primary, #4285f4);
          color: white;
        }

        .export-btn:hover {
          background: var(--base-primary-dark, #3367d6);
        }

        .preview-section {
          margin-top: 20px;
          padding: 15px;
          background: var(--surface-color, #f8f9fa);
          border-radius: 4px;
          border: 1px solid var(--border-color, #ddd);
        }

        .preview-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--table-font-size, 14px);
        }

        .preview-table th {
          padding: var(--table-cell-padding, 12px);
          background: var(--base-primary-light, #f0f0f0);
          border: var(--table-border-width, 1px) solid var(--border-color, #ddd);
          font-weight: var(--table-header-font-weight, 600);
          text-align: left;
        }

        .preview-table td {
          padding: var(--table-cell-padding, 12px);
          border: var(--table-border-width, 1px) solid var(--border-color, #ddd);
        }

        .preview-table tr:nth-child(even) {
          background: rgba(0, 0, 0, var(--table-stripe-opacity, 0.05));
        }

        .preview-table tr:hover {
          background: rgba(0, 0, 0, var(--table-hover-opacity, 0.08));
        }

        @media (max-width: 768px) {
          .control-group {
            grid-template-columns: 1fr;
          }
          
          .actions {
            flex-direction: column;
          }
        }
      </style>

      <div class="container">
        <h3>Table Theme Customization</h3>
        <p>Customize the appearance of table components to complement your main theme.</p>

        <div class="tabs">
          <button class="tab-btn active" data-tab="appearance">Appearance</button>
          <button class="tab-btn" data-tab="spacing">Spacing</button>
          <button class="tab-btn" data-tab="typography">Typography</button>
          <button class="tab-btn" data-tab="preview">Preview</button>
        </div>

        <div class="tab-content active" data-tab="appearance">
          <div class="control-group">
            <div class="control-item">
              <label for="borderWidth">Border Width</label>
              <input type="range" id="borderWidth" min="0" max="5" value="1" step="1">
              <span class="value-display">1px</span>
            </div>
            <div class="control-item">
              <label for="borderRadius">Border Radius</label>
              <input type="range" id="borderRadius" min="0" max="20" value="4" step="1">
              <span class="value-display">4px</span>
            </div>
            <div class="control-item">
              <label for="stripedOpacity">Striped Row Opacity</label>
              <input type="range" id="stripedOpacity" min="0" max="0.2" value="0.05" step="0.01">
              <span class="value-display">0.05</span>
            </div>
            <div class="control-item">
              <label for="hoverOpacity">Hover Effect Opacity</label>
              <input type="range" id="hoverOpacity" min="0" max="0.3" value="0.08" step="0.01">
              <span class="value-display">0.08</span>
            </div>
          </div>
        </div>

        <div class="tab-content" data-tab="spacing">
          <div class="control-group">
            <div class="control-item">
              <label for="cellPadding">Cell Padding</label>
              <input type="range" id="cellPadding" min="4" max="24" value="12" step="2">
              <span class="value-display">12px</span>
            </div>
            <div class="control-item">
              <label for="compactPadding">Compact Mode Padding</label>
              <input type="range" id="compactPadding" min="2" max="16" value="8" step="2">
              <span class="value-display">8px</span>
            </div>
            <div class="control-item">
              <label for="sortIconSize">Sort Icon Size</label>
              <input type="range" id="sortIconSize" min="12" max="24" value="16" step="2">
              <span class="value-display">16px</span>
            </div>
            <div class="control-item">
              <label for="paginationSize">Pagination Button Size</label>
              <input type="range" id="paginationSize" min="24" max="48" value="32" step="4">
              <span class="value-display">32px</span>
            </div>
          </div>
        </div>

        <div class="tab-content" data-tab="typography">
          <div class="control-group">
            <div class="control-item">
              <label for="fontSize">Font Size</label>
              <input type="range" id="fontSize" min="12" max="18" value="14" step="1">
              <span class="value-display">14px</span>
            </div>
            <div class="control-item">
              <label for="headerFontWeight">Header Font Weight</label>
              <select id="headerFontWeight">
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600" selected>Semi-bold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="tab-content" data-tab="preview">
          <div class="preview-section">
            <h4>Table Preview</h4>
            <table class="preview-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>Frontend Developer</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>UX Designer</td>
                  <td>Active</td>
                </tr>
                <tr>
                  <td>Robert Johnson</td>
                  <td>Backend Developer</td>
                  <td>On Leave</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="actions">
          <button class="reset-btn">Reset to Defaults</button>
          <button class="export-btn">Export Theme</button>
        </div>
      </div>
    `;

    // Update value displays
    setTimeout(() => {
      this.updateValueDisplays();
    }, 0);
  }

  updateValueDisplays() {
    const ranges = this.shadowRoot.querySelectorAll('input[type="range"]');
    ranges.forEach(range => {
      const valueDisplay = range.nextElementSibling;
      if (valueDisplay && valueDisplay.classList.contains('value-display')) {
        const updateDisplay = () => {
          let value = range.value;
          let unit = 'px';
          
          if (range.id === 'stripedOpacity' || range.id === 'hoverOpacity') {
            unit = '';
          }
          
          valueDisplay.textContent = value + unit;
        };
        
        updateDisplay();
        range.addEventListener('input', updateDisplay);
      }
    });
  }
}

// Register the custom element
customElements.define('table-theme-component', TableThemeComponent);

// Export the class for use in other modules
export default TableThemeComponent;

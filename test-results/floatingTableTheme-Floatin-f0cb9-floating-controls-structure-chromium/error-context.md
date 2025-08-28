# Test info

- Name: Floating Table Theme Controls Tests >> should have table-theme.html file with floating controls structure
- Location: C:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\Tests\playwright\floatingTableTheme.spec.ts:22:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: ".floating-color-control"
Received string:    "<!DOCTYPE html>·
<html lang=\"en\">·
<head>·
    <meta charset=\"UTF-8\" />·
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />·
    <title>Table Theme Component Demo - Mathematical Color Inheritance</title>·
    <meta·
      name=\"description\"·
      content=\"Demonstration of automatic table theming using mathematical formulas and color inheritance from the Claude AI Website Builder design system\"·
    />·
    <meta·
      name=\"keywords\"·
      content=\"table theme, color inheritance, golden ratio, mathematical design, web components\"·
    />···
    <!-- Favicon -->·
    <link rel=\"icon\" href=\"../../ziasymbol.svg\" type=\"image/svg+xml\" />·
    <link rel=\"apple-touch-icon\" href=\"../../ziasymbol.svg\" />···
    <!-- Open Graph Meta Tags -->·
    <meta property=\"og:title\" content=\"Table Theme Component Demo\" />·
    <meta·
      property=\"og:description\"·
      content=\"Zero-configuration table theming with mathematical color inheritance\"·
    />·
    <meta property=\"og:type\" content=\"website\" />···
    <!-- Design System Foundation -->·
    <link rel=\"stylesheet\" href=\"../../wb/wb.css\" />···
    <style>·
      /* Additional semantic styling for demo layout */·
      :root {·
        /* Enhanced table-specific variables building on wb.css */·
        --demo-section-spacing: calc(var(--space-lg) * var(--golden-ratio));·
        --demo-card-radius: calc(var(--space-xs) * var(--golden-ratio));·
        --demo-shadow: 0 calc(var(--space-xs) / 2) var(--space-lg)·
          rgba(0, 0, 0, 0.1);···
        /* Table theme variables (will be updated by table-theme-component) */·
        --table-bg-color: #ffffff;·
        --table-text-color: #333333;·
        --table-border-color: #e5e7eb;·
        --table-header-bg: #f8f9fa;·
        --table-header-color: #1f2937;·
        --table-hover-color: rgba(59, 130, 246, 0.08);·
        --table-stripe-bg: rgba(0, 0, 0, 0.02);·
        --table-cell-bg: #ffffff;·
        --table-text-secondary: #6b7280;·
        --table-font-size: 14px;·
        --table-sort-icon-color: #9ca3af;·
      }···
      body {·
        font-family: var(·
          --font-family-sans,·
          system-ui,·
          -apple-system,·
          sans-serif·
        );·
        line-height: var(--line-height-relaxed, 1.6);·
        color: var(--text-primary, #333);·
        background-color: var(--background, #fff);·
        margin: 0;·
        padding: 0;·
      }···
      .demo-container {·
        max-width: 1200px;·
        margin: 0 auto;·
        padding: var(--space-lg);·
      }···
      header {·
        text-align: center;·
        margin-bottom: var(--demo-section-spacing);·
        padding: var(--space-xl) var(--space-lg);·
        background: linear-gradient(·
          135deg,·
          var(--primary-light, #e8f0fe),·
          var(--background, #fff)·
        );·
        border-radius: var(--demo-card-radius);·
        box-shadow: var(--demo-shadow);·
      }···
      header h1 {·
        margin: 0 0 var(--space-md) 0;·
        color: var(--primary, #007bff);·
        font-size: calc(var(--text-xl) * var(--golden-ratio));·
        font-weight: 700;·
      }···
      header p {·
        margin: 0;·
        color: var(--text-secondary, #666);·
        font-size: var(--text-large);·
      }···
      .theme-controls {·
        background: var(--surface, #fff);·
        border: 1px solid var(--border-color, #e0e0e0);·
        border-radius: var(--demo-card-radius);·
        padding: var(--space-lg);·
        margin-bottom: var(--demo-section-spacing);·
        box-shadow: var(--demo-shadow);·
      }···
      .theme-controls h2 {·
        margin: 0 0 var(--space-md) 0;·
        color: var(--primary, #007bff);·
        font-size: var(--text-xl);·
      }···
      .control-group {·
        margin-bottom: var(--space-md);·
      }···
      .control-group label {·
        display: block;·
        margin-bottom: var(--space-xs);·
        font-weight: 600;·
        color: var(--text-primary, #333);·
      }···
      .slider-wrapper {·
        display: flex;·
        align-items: center;·
        gap: var(--space-sm);·
      }···
      .slider {·
        flex: 1;·
        -webkit-appearance: none;·
        appearance: none;·
        height: 8px;·
        border-radius: 4px;·
        background: var(--neutral-200, #e5e7eb);·
        outline: none;·
      }···
      .slider::-webkit-slider-thumb {·
        -webkit-appearance: none;·
        appearance: none;·
        width: 20px;·
        height: 20px;·
        border-radius: 50%;·
        background: var(--primary, #007bff);·
        cursor: pointer;·
        border: 2px solid #fff;·
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);·
      }···
      .slider::-moz-range-thumb {·
        width: 20px;·
        height: 20px;·
        border-radius: 50%;·
        background: var(--primary, #007bff);·
        cursor: pointer;·
        border: 2px solid #fff;·
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);·
      }···
      .value-display {·
        min-width: 60px;·
        text-align: center;·
        font-family: var(--font-family-mono, monospace);·
        font-size: var(--text-sm);·
        background: var(--neutral-100, #f3f4f6);·
        padding: var(--space-xs) var(--space-sm);·
        border-radius: 4px;·
        border: 1px solid var(--border-color, #e0e0e0);·
      }···
      .color-preview {·
        width: 40px;·
        height: 40px;·
        border-radius: 50%;·
        border: 2px solid #fff;·
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);·
        margin-left: var(--space-sm);·
      }···
      .theme-info {·
        background: var(--neutral-50, #f9fafb);·
        border: 1px solid var(--border-color, #e0e0e0);·
        border-radius: var(--demo-card-radius);·
        padding: var(--space-md);·
        margin-bottom: var(--demo-section-spacing);·
      }···
      .theme-info h3 {·
        margin: 0 0 var(--space-sm) 0;·
        color: var(--primary, #007bff);·
      }···
      .color-values {·
        display: grid;·
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));·
        gap: var(--space-sm);·
        font-family: var(--font-family-mono, monospace);·
        font-size: var(--text-sm);·
      }···
      .color-value {·
        display: flex;·
        align-items: center;·
        gap: var(--space-xs);·
      }···
      .color-swatch {·
        width: 16px;·
        height: 16px;·
        border-radius: 2px;·
        border: 1px solid var(--border-color, #e0e0e0);·
      }···
      .table-section {·
        margin-bottom: var(--demo-section-spacing);·
      }···
      .table-section h2 {·
        color: var(--primary, #007bff);·
        margin-bottom: var(--space-md);·
        font-size: var(--text-xl);·
      }···
      .table-section p {·
        color: var(--text-secondary, #666);·
        margin-bottom: var(--space-lg);·
      }···
      /* Status badges */·
      .status-badge {·
        padding: 4px 8px;·
        border-radius: 12px;·
        font-size: 12px;·
        font-weight: 600;·
        text-transform: uppercase;·
      }···
      .status-active {·
        background: #dcfce7;·
        color: #166534;·
      }···
      .status-on-leave {·
        background: #fef3c7;·
        color: #92400e;·
      }···
      .status-contract {·
        background: #dbeafe;·
        color: #1e40af;·
      }···
      .status-new-hire {·
        background: #f3e8ff;·
        color: #7c2d12;·
      }···
      /* Stock indicators */·
      .stock-high {·
        color: #059669;·
        font-weight: 600;·
      }···
      .stock-medium {·
        color: #d97706;·
        font-weight: 600;·
      }···
      .stock-low {·
        color: #dc2626;·
        font-weight: 600;·
      }···
      /* Transaction status */·
      .transaction-completed {·
        color: #059669;·
        font-weight: 600;·
      }···
      .transaction-pending {·
        color: #d97706;·
        font-weight: 600;·
      }···
      .transaction-failed {·
        color: #dc2626;·
        font-weight: 600;·
      }···
      /* Error state */·
      .error-message {·
        background: #fee2e2;·
        border: 1px solid #fecaca;·
        color: #dc2626;·
        padding: var(--space-md);·
        border-radius: var(--demo-card-radius);·
        margin: var(--space-md) 0;·
      }···
      .loading-state {·
        text-align: center;·
        padding: var(--space-xl);·
        color: var(--text-secondary, #666);·
      }·
    </style>·
</head>·
<body>·
    <div class=\"demo-container\">·
        <header>·
            <h1>Table Theme Component Demo</h1>·
            <p>·
                Mathematical color inheritance and automatic theming for data tables.·
                Theme changes affect all tables instantly using HSL color relationships.·
            </p>·
        </header>···
        <!-- Theme Controls -->·
        <div class=\"theme-controls\">·
            <h2>🎨 Color Control</h2>·
            <div class=\"control-group\">·
                <label for=\"color-bar\">Primary Hue</label>·
                <div class=\"slider-wrapper\">·
                    <input·
                        type=\"range\"·
                        id=\"color-bar\"·
                        class=\"slider\"·
                        min=\"0\"·
                        max=\"360\"·
                        value=\"220\"·
                    />·
                    <div id=\"hue-display\" class=\"value-display\">220°</div>·
                    <div id=\"color-preview\" class=\"color-preview\"></div>·
                </div>·
            </div>···
            <div class=\"control-group\">·
                <label for=\"saturation-slider\">Saturation</label>·
                <div class=\"slider-wrapper\">·
                    <input·
                        type=\"range\"·
                        id=\"saturation-slider\"·
                        class=\"slider\"·
                        min=\"0\"·
                        max=\"100\"·
                        value=\"70\"·
                    />·
                    <div id=\"saturation-display\" class=\"value-display\">70%</div>·
                </div>·
            </div>···
            <div class=\"control-group\">·
                <label for=\"lightness-slider\">Lightness</label>·
                <div class=\"slider-wrapper\">·
                    <input·
                        type=\"range\"·
                        id=\"lightness-slider\"·
                        class=\"slider\"·
                        min=\"10\"·
                        max=\"90\"·
                        value=\"50\"·
                    />·
                    <div id=\"lightness-display\" class=\"value-display\">50%</div>·
                </div>·
            </div>···
            <div class=\"control-group\">·
                <label for=\"theme-select\">Theme Preset</label>·
                <select id=\"theme-select\">·
                    <option value=\"light\">Light</option>·
                    <option value=\"dark\">Dark</option>·
                    <option value=\"auto\">Auto (System)</option>·
                </select>·
            </div>·
        </div>···
        <!-- Theme Information Display -->·
        <div class=\"theme-info\">·
            <h3>🔍 Current Theme Values</h3>·
            <div class=\"color-values\" id=\"theme-values\">·
                <!-- Color values will be populated by JavaScript -->·
            </div>·
        </div>···
        <!-- Employee Directory Table -->·
        <div class=\"table-section\">·
            <h2>👥 Employee Directory</h2>·
            <p>·
                Interactive employee table with sorting, pagination, and selection. Data loaded from table.json.·
            </p>·
            <table-component··
                id=\"employees-table\"··
                sortable··
                paginated··
                selectable··
                striped··
                bordered>·
                <!-- Automatically inherits theme from color system -->·
            </table-component>·
        </div>···
        <!-- Product Catalog Table -->·
        <div class=\"table-section\">·
            <h2>📦 Product Catalog</h2>·
            <p>·
                Compact table layout with custom renderers and mathematical color relationships.·
                Product Catalog Table·
            </p>·
            <table-component··
                id=\"products-table\"··
                sortable··
                paginated··
                selectable··
                striped··
                bordered>·
                <!-- Automatically inherits theme from color system -->·
            </table-component>·
        </div>···
        <!-- Transaction History Table -->·
        <div class=\"table-section\">·
            <h2>💳 Transaction History</h2>·
            <p>·
                Financial data table with status indicators and amount formatting.·
            </p>·
            <table-component··
                id=\"transactions-table\"··
                sortable··
                paginated··
                selectable··
                striped··
                bordered>·
                <!-- Automatically inherits theme from color system -->·
            </table-component>·
        </div>·
    </div>···
    <!-- Table Component Scripts -->·
    <script type=\"module\" src=\"../theme/table-component.js\"></script>·
    <script type=\"module\" src=\"../theme/table-theme-component.js\"></script>···
    <!-- Demo Implementation Script -->·
    <script>·
      // Global color state for theme coordination·
      window.colorBarState = {·
        hue: 220,·
        saturation: 70,·
        lightness: 50,·
      };···
      // Demo controller class·
      class TableThemeDemo {·
        constructor() {·
          this.sampleData = {};·
          this.initializeDemo();·
        }···
        async initializeDemo() {·
          try {·
            console.log(\"🚀 Initializing Table Theme Demo...\");···············
            // Load sample data from table.json·
            await this.loadTableData();···············
            // Wait for components to be registered·
            await this.waitForComponents();···············
            // Setup all tables with data·
            this.setupTables();···············
            // Initialize theme controls·
            this.setupThemeControls();···············
            // Setup real-time theme info updates·
            this.setupThemeInfoUpdates();···············
            console.log(\"✅ Table Theme Demo initialized successfully\");·
          } catch (error) {·
            console.error(\"❌ Demo initialization failed:\", error);·
            this.showError(error);·
          }·
        }···
        async loadTableData() {·
          try {·
            const response = await fetch(\"./table.json\");·
            if (!response.ok) {·
              throw new Error(`Failed to load table.json: ${response.status}`);·
            }·
            this.sampleData = await response.json();·
            console.log(\"📊 Sample data loaded:\", Object.keys(this.sampleData));·
          } catch (error) {·
            console.error(\"Failed to load table data:\", error);·
            // Fallback to empty data sets·
            this.sampleData = { employees: [], products: [], transactions: [] };·
          }·
        }···
        async waitForComponents() {·
          // Wait for all required components to be registered·
          const components = [\"table-component\", \"table-theme-component\"];·
          for (const component of components) {·
            while (!customElements.get(component)) {·
              await new Promise((resolve) => setTimeout(resolve, 100));·
            }·
          }·············
          // Initialize the table theme component with current color state·
          const tableThemeComponent = document.querySelector(\"table-theme-component\");·
          if (tableThemeComponent && typeof colorBarState !== \"undefined\") {·
            // Trigger initial theme setup·
            this.triggerThemeUpdate();·
          }·
        }···
        setupTables() {·
          this.setupEmployeesTable();·
          this.setupProductsTable();·
          this.setupTransactionsTable();·
        }···
        setupEmployeesTable() {·
          const table = document.getElementById(\"employees-table\");·
          if (!table || !this.sampleData.employees) return;···
          const columns = [·
            { id: \"firstName\", label: \"First Name\", sortable: true },·
            { id: \"lastName\", label: \"Last Name\", sortable: true },·
            { id: \"email\", label: \"Email\", sortable: true },·
            { id: \"role\", label: \"Role\", sortable: true },·
            { id: \"department\", label: \"Department\", sortable: true },·
            {·
              id: \"status\",·
              label: \"Status\",·
              sortable: true,·
              renderer: (val) => {·
                const statusClass = val.toLowerCase().replace(/\\s+/g, \"-\");·
                return `<span class=\"status-badge status-${statusClass}\">${val}</span>`;·
              },·
            },·
            { id: \"location\", label: \"Location\", sortable: true },·
          ];···
          table.setColumns(columns);·
          table.setData(this.sampleData.employees);·
        }···
        setupProductsTable() {·
          const table = document.getElementById(\"products-table\");·
          if (!table || !this.sampleData.products) return;···
          const columns = [·
            { id: \"id\", label: \"ID\", sortable: true },·
            { id: \"name\", label: \"Product\", sortable: true },·
            { id: \"category\", label: \"Category\", sortable: true },·
            {·
              id: \"price\",·
              label: \"Price\",·
              sortable: true,·
              renderer: (val) => `$${val.toFixed(2)}`,·
            },·
            {·
              id: \"stock\",·
              label: \"Stock\",·
              sortable: true,·
              renderer: (val) => {·
                const status = val > 50 ? \"high\" : val > 10 ? \"medium\" : \"low\";·
                return `<span class=\"stock-${status}\">${val}</span>`;·
              },·
            },·
            {·
              id: \"rating\",·
              label: \"Rating\",·
              sortable: true,·
              renderer: (val) =>·
                \"★\".repeat(Math.floor(val)) +·
                \"☆\".repeat(5 - Math.floor(val)) +·
                ` (${val})`,·
            },·
            {·
              id: \"featured\",·
              label: \"Featured\",·
              sortable: true,·
              renderer: (val) => (val ? \"✅ Yes\" : \"❌ No\"),·
            },·
          ];···
          table.setColumns(columns);·
          table.setData(this.sampleData.products);·
        }···
        setupTransactionsTable() {·
          const table = document.getElementById(\"transactions-table\");·
          if (!table || !this.sampleData.transactions) return;···
          const columns = [·
            { id: \"id\", label: \"Transaction ID\", sortable: true },·
            {·
              id: \"date\",·
              label: \"Date\",·
              sortable: true,·
              renderer: (val) => new Date(val).toLocaleDateString(),·
            },·
            { id: \"customer\", label: \"Customer\", sortable: true },·
            {·
              id: \"amount\",·
              label: \"Amount\",·
              sortable: true,·
              renderer: (val) => `$${val.toLocaleString()}`,·
            },·
            {·
              id: \"status\",·
              label: \"Status\",·
              sortable: true,·
              renderer: (val) => {·
                const statusClass = val.toLowerCase();·
                const icon = {·
                  completed: \"✅\",·
                  pending: \"⏳\",·
                  failed: \"❌\",·
                }[statusClass] || \"❓\";·
                return `${icon} <span class=\"transaction-${statusClass}\">${val}</span>`;·
              },·
            },·
            { id: \"paymentMethod\", label: \"Payment\", sortable: true },·
          ];···
          table.setColumns(columns);·
          table.setData(this.sampleData.transactions);·
        }···
        setupThemeControls() {·
          // Initialize colorBarState if it doesn't exist·
          if (typeof colorBarState === \"undefined\") {·
            window.colorBarState = {·
              hue: 220,·
              saturation: 70,·
              lightness: 50,·
            };·
          }···
          // Setup control event listeners·
          const colorBar = document.getElementById(\"color-bar\");·
          const saturationSlider = document.getElementById(\"saturation-slider\");·
          const lightnessSlider = document.getElementById(\"lightness-slider\");·
          const themeSelect = document.getElementById(\"theme-select\");···
          // Initialize slider values from colorBarState·
          if (colorBar) colorBar.value = colorBarState.hue;·
          if (saturationSlider) saturationSlider.value = colorBarState.saturation;·
          if (lightnessSlider) lightnessSlider.value = colorBarState.lightness;·
          if (themeSelect) themeSelect.value = \"auto\";···
          // Initialize displays·
          this.updateValueDisplays();·
          this.setupThemeInfoUpdates();···
          // Color bar changes·
          colorBar?.addEventListener(\"input\", (e) => {·
            colorBarState.hue = parseInt(e.target.value);·
            this.updateValueDisplays();·
            this.updateTheme();·
          });···
          // Saturation changes·
          saturationSlider?.addEventListener(\"input\", (e) => {·
            colorBarState.saturation = parseInt(e.target.value);·
            this.updateValueDisplays();·
            this.updateTheme();·
          });···
          // Lightness changes·
          lightnessSlider?.addEventListener(\"input\", (e) => {·
            colorBarState.lightness = parseInt(e.target.value);·
            this.updateValueDisplays();·
            this.updateTheme();·
          });···
          // Theme preset changes·
          themeSelect?.addEventListener(\"change\", (e) => {·
            this.applyThemePreset(e.target.value);·
            this.updateTheme();·
          });·
        }···
        updateValueDisplays() {·
          // Update slider displays·
          const hueDisplay = document.getElementById(\"hue-display\");·
          const saturationDisplay = document.getElementById(\"saturation-display\");·
          const lightnessDisplay = document.getElementById(\"lightness-display\");·
          const colorPreview = document.getElementById(\"color-preview\");···
          if (hueDisplay) hueDisplay.textContent = `${colorBarState.hue}°`;·
          if (saturationDisplay) saturationDisplay.textContent = `${colorBarState.saturation}%`;·
          if (lightnessDisplay) lightnessDisplay.textContent = `${colorBarState.lightness}%`;···
          // Update color preview·
          if (colorPreview) {·
            const previewColor = `hsl(${colorBarState.hue}, ${colorBarState.saturation}%, ${colorBarState.lightness}%)`;·
            colorPreview.style.backgroundColor = previewColor;·
          }·············
          // Update slider values to match state·
          const colorBar = document.getElementById(\"color-bar\");·
          const saturationSlider = document.getElementById(\"saturation-slider\");·
          const lightnessSlider = document.getElementById(\"lightness-slider\");·············
          if (colorBar && colorBar.value != colorBarState.hue) {·
            colorBar.value = colorBarState.hue;·
          }·
          if (saturationSlider && saturationSlider.value != colorBarState.saturation) {·
            saturationSlider.value = colorBarState.saturation;·
          }·
          if (lightnessSlider && lightnessSlider.value != colorBarState.lightness) {·
            lightnessSlider.value = colorBarState.lightness;·
          }·
        }···
        setupThemeInfoUpdates() {·
          // Initial theme info display·
          this.updateThemeInfo();·
        }···
        updateThemeInfo() {·
          const themeValuesContainer = document.getElementById(\"theme-values\");·
          if (!themeValuesContainer) return;···
          // Calculate theme colors based on current state·
          const { hue, saturation, lightness } = colorBarState;·············
          const colors = {·
            primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,·
            primaryLight: `hsl(${hue}, ${saturation}%, ${Math.min(lightness + 20, 90)}%)`,·
            primaryDark: `hsl(${hue}, ${saturation}%, ${Math.max(lightness - 20, 10)}%)`,·
            accent: `hsl(${(hue + 180) % 360}, ${saturation}%, ${lightness}%)`,·
            background: `hsl(${hue}, ${Math.min(saturation * 0.2, 20)}%, 95%)`,·
            surface: `hsl(${hue}, ${Math.min(saturation * 0.1, 10)}%, 98%)`,·
            border: `hsl(${hue}, ${Math.min(saturation * 0.3, 30)}%, 85%)`,·
          };···
          // Generate color value displays·
          themeValuesContainer.innerHTML = Object.entries(colors)·
            .map(([name, value]) => `·
              <div class=\"color-value\">·
                <div class=\"color-swatch\" style=\"background-color: ${value}\"></div>·
                <span>${name}: ${value}</span>·
              </div>·
            `).join('');·
        }···
        updateTheme() {·
          // Call the existing triggerThemeUpdate method·
          this.triggerThemeUpdate();·
        }···
        triggerThemeUpdate() {·
          // Update theme info display·
          this.updateThemeInfo();···
          // Trigger table theme component update·
          const tableThemeComponent = document.querySelector(\"table-theme-component\");·
          if (tableThemeComponent) {·
            tableThemeComponent.updateTheme(colorBarState);·
          }···
          // Apply CSS custom properties to document root for immediate visual updates·
          const { hue, saturation, lightness } = colorBarState;·
          document.documentElement.style.setProperty(\"--primary-hue\", hue);·
          document.documentElement.style.setProperty(\"--primary-saturation\", `${saturation}%`);·
          document.documentElement.style.setProperty(\"--primary-lightness\", `${lightness}%`);·
          document.documentElement.style.setProperty(\"--primary-color\", `hsl(${hue}, ${saturation}%, ${lightness}%)`);·
          document.documentElement.style.setProperty(\"--primary-color-light\", `hsl(${hue}, ${saturation}%, ${Math.min(lightness + 20, 90)}%)`);·
          document.documentElement.style.setProperty(\"--primary-color-dark\", `hsl(${hue}, ${saturation}%, ${Math.max(lightness - 20, 10)}%)`);···
          // Dispatch custom event for other components·
          document.dispatchEvent(new CustomEvent(\"themeUpdate\", {·
            detail: colorBarState·
          }));·
        }···
        applyThemePreset(preset) {·
          switch (preset) {·
            case \"light\":·
              colorBarState.lightness = 50;·
              break;·
            case \"dark\":·
              colorBarState.lightness = 20;·
              break;·
            case \"auto\":·
              // Use system preference·
              const prefersDark = window.matchMedia(\"(prefers-color-scheme: dark)\").matches;·
              colorBarState.lightness = prefersDark ? 20 : 50;·
              break;·
          }·············
          // Update slider values·
          const lightnessSlider = document.getElementById(\"lightness-slider\");·
          if (lightnessSlider) {·
            lightnessSlider.value = colorBarState.lightness;·
          }·············
          this.updateValueDisplays();·
        }···
        showError(error) {·
          const container = document.querySelector(\".demo-container\");·
          const errorDiv = document.createElement(\"div\");·
          errorDiv.className = \"error-message\";·
          errorDiv.innerHTML = `·
            <h3>⚠️ Demo Error</h3>·
            <p><strong>Error:</strong> ${error.message}</p>·
            <p>Please check the console for more details.</p>·
          `;·
          container.insertBefore(errorDiv, container.firstChild);·
        }·
      }···
      // Initialize the demo when page loads·
      document.addEventListener(\"DOMContentLoaded\", () => {·
        new TableThemeDemo();·
      });·
    </script>·
</body>·
</html>"
    at forEach (C:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\Tests\playwright\floatingTableTheme.spec.ts:42:23)
    at C:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\Tests\playwright\floatingTableTheme.spec.ts:41:21
```

# Test source

```ts
   1 | /**
   2 |  * Floating Table Theme Controls Tests
   3 |  * 
   4 |  * Converted from FloatingTableThemeControls.Tests.ps1
   5 |  * Tests the floating, draggable color control panel for table theming
   6 |  */
   7 |
   8 | import { test, expect } from '@playwright/test';
   9 | import * as fs from 'fs';
   10 | import * as path from 'path';
   11 |
   12 | // Helper function to get project root path
   13 | function getProjectRoot() {
   14 |   const testDir = path.resolve(__dirname);
   15 |   const testsDir = path.dirname(testDir);
   16 |   return path.dirname(testsDir);
   17 | }
   18 |
   19 | test.describe('Floating Table Theme Controls Tests', () => {
   20 |   const projectRoot = getProjectRoot();
   21 |   
   22 |   test('should have table-theme.html file with floating controls structure', async () => {
   23 |     const tableThemeFile = path.join(projectRoot, 'components', 'table', 'table-theme.html');
   24 |     
   25 |     // Check if the file exists
   26 |     expect(fs.existsSync(tableThemeFile)).toBeTruthy();
   27 |     
   28 |     // Read the content
   29 |     const content = fs.readFileSync(tableThemeFile, 'utf8');
   30 |     
   31 |     // Required CSS classes for floating controls
   32 |     const requiredClasses = [
   33 |       '.floating-color-control',
   34 |       '.control-header',
   35 |       '.control-btn',
   36 |       '.floating-control-content',
   37 |       '.floating-control-group',
   38 |       '.color-preview'
   39 |     ];
   40 |     
   41 |     requiredClasses.forEach(className => {
>  42 |       expect(content).toContain(className);
      |                       ^ Error: expect(received).toContain(expected) // indexOf
   43 |       console.log(`✅ Found CSS class: ${className}`);
   44 |     });
   45 |   });
   46 |
   47 |   test('should have required HTML elements for floating controls', async () => {
   48 |     const tableThemeFile = path.join(projectRoot, 'components', 'table', 'table-theme.html');
   49 |     const content = fs.readFileSync(tableThemeFile, 'utf8');
   50 |     
   51 |     // Required HTML elements
   52 |     const requiredElements = [
   53 |       'id="floating-control"',
   54 |       'id="control-header"',
   55 |       'id="minimize-btn"',
   56 |       'id="floating-color-bar"',
   57 |       'id="floating-saturation-slider"',
   58 |       'id="floating-lightness-slider"',
   59 |       'id="floating-theme-select"',
   60 |       'id="color-preview"'
   61 |     ];
   62 |     
   63 |     requiredElements.forEach(element => {
   64 |       expect(content).toContain(element);
   65 |       console.log(`✅ Found HTML element: ${element}`);
   66 |     });
   67 |   });
   68 |
   69 |   test('should have floating controls working in browser', async ({ page }) => {
   70 |     // Navigate to the table theme page
   71 |     await page.goto('/components/table/table-theme.html');
   72 |     
   73 |     // Check if floating control exists
   74 |     const floatingControl = page.locator('#floating-control');
   75 |     await expect(floatingControl).toBeVisible();
   76 |     
   77 |     // Check if control header exists
   78 |     const controlHeader = page.locator('#control-header');
   79 |     await expect(controlHeader).toBeVisible();
   80 |     
   81 |     // Test minimize functionality if available
   82 |     const minimizeBtn = page.locator('#minimize-btn');
   83 |     if (await minimizeBtn.count() > 0) {
   84 |       await minimizeBtn.click();
   85 |       
   86 |       // Wait for animation
   87 |       await page.waitForTimeout(500);
   88 |       
   89 |       // Check if control content is hidden or minimized
   90 |       const controlContent = page.locator('.floating-control-content');
   91 |       if (await controlContent.count() > 0) {
   92 |         const isHidden = await controlContent.isHidden();
   93 |         console.log(`Control content minimized: ${isHidden}`);
   94 |       }
   95 |     }
   96 |   });
   97 |
   98 |   test('should have draggable floating controls', async ({ page }) => {
   99 |     await page.goto('/components/table/table-theme.html');
  100 |     
  101 |     const floatingControl = page.locator('#floating-control');
  102 |     await expect(floatingControl).toBeVisible();
  103 |     
  104 |     // Get initial position
  105 |     const initialPosition = await floatingControl.boundingBox();
  106 |     
  107 |     if (initialPosition) {
  108 |       // Test drag functionality
  109 |       await floatingControl.hover();
  110 |       await page.mouse.down();
  111 |       await page.mouse.move(initialPosition.x + 100, initialPosition.y + 50);
  112 |       await page.mouse.up();
  113 |       
  114 |       // Wait for potential animation
  115 |       await page.waitForTimeout(200);
  116 |       
  117 |       // Get new position
  118 |       const newPosition = await floatingControl.boundingBox();
  119 |       
  120 |       if (newPosition) {
  121 |         // Check if position changed (allowing some tolerance)
  122 |         const positionChanged = 
  123 |           Math.abs(newPosition.x - initialPosition.x) > 10 || 
  124 |           Math.abs(newPosition.y - initialPosition.y) > 10;
  125 |         
  126 |         console.log(`Position changed: ${positionChanged}`);
  127 |         console.log(`Initial: (${initialPosition.x}, ${initialPosition.y})`);
  128 |         console.log(`New: (${newPosition.x}, ${newPosition.y})`);
  129 |       }
  130 |     }
  131 |   });
  132 |
  133 |   test('should have color controls that update theme', async ({ page }) => {
  134 |     await page.goto('/components/table/table-theme.html');
  135 |     
  136 |     // Look for color controls
  137 |     const colorBar = page.locator('#floating-color-bar');
  138 |     const saturationSlider = page.locator('#floating-saturation-slider');
  139 |     const lightnessSlider = page.locator('#floating-lightness-slider');
  140 |     const colorPreview = page.locator('#color-preview');
  141 |     
  142 |     // Test color bar if it exists
```
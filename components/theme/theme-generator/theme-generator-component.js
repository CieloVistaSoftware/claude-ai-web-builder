/**
 * Theme Generator Web Component
 * 
 * This file defines a custom element that encapsulates the theme generator functionality.
 * Usage: <theme-generator></theme-generator>
 */

class ThemeGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
      // Global state variables
    this.currentPreviewMode = 'light';
    this.isMinimized = false;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.activeTab = 'config';  // Default active tab
  }  connectedCallback() {
    this.render();
    this.setupEventListeners();
    
    // Apply initial theme based on isDark setting
    setTimeout(() => {
      const isDark = this.isDarkSelect.checked;
      if (isDark) {
        const darkTheme = this.generateTheme({
          name: this.themeNameInput.value,
          primaryHue: parseInt(this.primaryHueInput.value),
          colorScheme: this.colorSchemeSelect.value,
          saturation: parseInt(this.saturationInput.value),
          luminosity: parseInt(this.luminosityInput.value),
          isDark: true
        });
        this.applyThemeToControlPanel(darkTheme);
      }
    }, 0);
  }

  render() {
    // Combine CSS and HTML into a single template
    this.shadowRoot.innerHTML = `
      <style>
        /* Component-specific styles */
        :host {
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        
        /* Hide floating preview - we'll be applying theme to the entire page instead */
        .floating-preview {
          display: none !important;
        }
        
        /* Tab system styles */
        .tabs {
          display: flex;
          flex-wrap: wrap;
          border-bottom: 1px solid #ddd;
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
        }
        
        .tab-btn:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .tab-btn.active {
          border-bottom-color: var(--primary-color, #4285f4);
          color: var(--primary-color, #4285f4);
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

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        h1, h2 {
          margin-bottom: 20px;
        }

        /* Hue Slider */
        .hue-slider {
          width: 100%;
          height: 30px;
          -webkit-appearance: none;
          appearance: none;
          outline: none;
          cursor: pointer;
          border-radius: 15px;
          background: linear-gradient(to right, 
              hsl(0, 100%, 50%) 0%, 
              hsl(30, 100%, 50%) 8.33%,
              hsl(60, 100%, 50%) 16.66%, 
              hsl(90, 100%, 50%) 25%,
              hsl(120, 100%, 50%) 33.33%,
              hsl(150, 100%, 50%) 41.66%,
              hsl(180, 100%, 50%) 50%, 
              hsl(210, 100%, 50%) 58.33%,
              hsl(240, 100%, 50%) 66.66%, 
              hsl(270, 100%, 50%) 75%,
              hsl(300, 100%, 50%) 83.33%, 
              hsl(330, 100%, 50%) 91.66%,
              hsl(360, 100%, 50%) 100%);
        }        .hue-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 25px;
          height: 25px;
          background: var(--card-background, white);
          cursor: pointer;
          border-radius: 50%;
          border: 3px solid var(--primary-color, #333);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }

        .hue-slider::-moz-range-thumb {
          width: 25px;
          height: 25px;
          background: var(--card-background, white);
          cursor: pointer;
          border-radius: 50%;
          border: 3px solid var(--primary-color, #333);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }/* Control Panel with more compact styling */
        .control-panel.compact {
          background: var(--card-background, white); 
          color: var(--text-color, #333);
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 15px;
          position: relative;
          max-width: 500px;
          margin: 0 auto 15px;
        }.control-header {
          display: flex;
          flex-direction: row-reverse;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }        .save-button {
          background: var(--primary-color, #28a745);
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.3s;
        }

        .save-button:hover {
          background: var(--primary-color-dark, #218838);
        }

        .controls {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .control-row {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }        .control-group {
          flex: 1;
          min-width: 150px;
          padding: 0 2rem;
        }        .control-group.primary-hue {
          flex: 2;
        }
          .value-display {
          color: var(--text-color, #333);
        }
        
        /* Mode Toggle Switch */
        .mode-toggle-container {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        
        .mode-toggle {
          position: relative;
          margin-top: 8px;
        }
        
        .mode-checkbox {
          opacity: 0;
          height: 0;
          width: 0;
          position: absolute;
        }
        
        .mode-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          width: 100px;
          height: 34px;
          background: #ebebeb;
          border-radius: 100px;
          position: relative;
          transition: background-color 0.2s;
        }
        
        .mode-label .mode-light {
          padding-left: 10px;
          color: #333;
        }
        
        .mode-label .mode-dark {
          padding-right: 10px;
          color: #f8f8f8;
        }
        
        .mode-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 30px;
          height: 30px;
          border-radius: 45px;
          transition: 0.2s;
          background: white;
          box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
        }
        
        .mode-checkbox:checked + .mode-label {
          background: #333;
        }
        
        .mode-checkbox:checked + .mode-label .mode-slider {
          left: calc(100% - 2px);
          transform: translateX(-100%);
        }label {
          font-weight: 600;
          margin-bottom: 5px;
          color: var(--text-color, #333);
          display: block;
        }

        input, select {
          padding: 8px 12px;
          border: 1px solid var(--border-color, #ddd);
          border-radius: 5px;
          font-size: 14px;
          width: 100%;
          background-color: var(--background-color, white);
          color: var(--text-color, #333);
        }

        .generate-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: background 0.3s;
          margin-top: 10px;
          align-self: center;
        }

        .generate-button:hover {
          background: #0056b3;
        }

        /* Color wheel visualization */
        .color-wheel-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 auto;
        }

        .color-wheel {
          width: 80px;
          height: 80px;
          position: relative;
          border-radius: 50%;
          background: conic-gradient(
              hsl(0, 100%, 50%) 0deg,
              hsl(60, 100%, 50%) 60deg,
              hsl(120, 100%, 50%) 120deg,
              hsl(180, 100%, 50%) 180deg,
              hsl(240, 100%, 50%) 240deg,
              hsl(300, 100%, 50%) 300deg,
              hsl(360, 100%, 50%) 360deg
          );
        }

        .wheel-marker {
          position: absolute;
          width: 10px;
          height: 10px;
          background: white;
          border: 2px solid black;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .wheel-marker.accent {
          border-color: #ff5733;
          background: #ffefeb;
        }

        .color-wheel-labels {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
          font-size: 12px;
        }

        .color-label {
          display: flex;
          align-items: center;
        }

        .color-label.primary::before {
          content: "";
          display: inline-block;
          width: 10px;
          height: 10px;
          border: 2px solid black;
          border-radius: 50%;
          margin-right: 5px;
          background: white;
        }

        .color-label.accent::before {
          content: "";
          display: inline-block;
          width: 10px;
          height: 10px;
          border: 2px solid #ff5733;
          border-radius: 50%;
          margin-right: 5px;
          background: #ffefeb;
        }        /* Theme Preview - More Compact */
        .theme-preview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        .preview-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }        .preview {
          padding: 15px;
        }

        .preview-header {
          margin-bottom: 10px;
        }

        .preview-title {
          font-size: 18px;
          margin-bottom: 3px;
        }

        .preview-subtitle {
          font-size: 13px;
          opacity: 0.8;
        }

        .preview-content {
          margin-bottom: 15px;
        }

        .preview-button {
          padding: 8px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          margin-right: 10px;
          margin-bottom: 10px;
        }

        .preview-card {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        /* Color Swatches */
        .color-swatches {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .swatch {
          text-align: center;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background: white;
        }

        .swatch-color {
          width: 100%;
          height: 60px;
          border-radius: 5px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
        }

        .swatch-label {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .swatch-value {
          font-size: 11px;
          font-family: monospace;
          color: #666;
        }

        /* Generated CSS Output */
        .css-output {
          background: #282c34;
          color: #f8f8f2;
          padding: 20px;
          border-radius: 10px;
          overflow-x: auto;
        }

        .css-output pre {
          margin: 0;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 14px;
          line-height: 1.5;
        }
        
        /* Semantic HTML tab styles */
        .semantic-elements {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
        }
        
        .semantic-header {
          padding: 1.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--primary-color-light, #ccc);
          background-color: var(--card-background, #f8f8f8);
        }
        
        .semantic-nav ul {
          display: flex;
          list-style: none;
          gap: 2rem;
          padding: 0;
        }
        
        .semantic-nav a {
          text-decoration: none;
          color: var(--primary-color, #333);
          font-weight: 500;
          transition: color 0.3s;
        }
        
        .semantic-nav a:hover {
          color: var(--primary-color-dark, #000);
        }
        
        .semantic-section {
          margin: 2rem 0;
          padding: 1.5rem;
          border-radius: 8px;
          background-color: var(--card-background, #f8f8f8);
        }
        
        .semantic-article {
          margin: 2rem 0;
          padding: 1.5rem;
          border-left: 4px solid var(--primary-color, #333);
          background-color: var(--card-background, #f8f8f8);
        }
        
        .placeholder-img {
          height: 150px;
          background-color: var(--primary-color-light, #ccc);
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }
        
        figcaption {
          font-style: italic;
          color: var(--text-color, #666);
          text-align: center;
        }
        
        .semantic-aside {
          float: right;
          width: 30%;
          margin-left: 1.5rem;
          padding: 1rem;
          background-color: var(--card-background, #f8f8f8);
          border-left: 2px solid var(--primary-color, #333);
        }
        
        .semantic-form {
          max-width: 500px;
        }
        
        fieldset {
          border: 1px solid var(--primary-color-light, #ccc);
          border-radius: 4px;
          padding: 1.5rem;
        }
        
        legend {
          padding: 0 10px;
          color: var(--primary-color, #333);
        }
        
        .form-control {
          margin-bottom: 1rem;
        }
        
        .form-control label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .semantic-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .semantic-button.primary {
          background-color: var(--primary-color, #333);
          color: white;
        }
        
        .semantic-button.secondary {
          background-color: var(--secondary-color, #666);
          color: white;
        }
        
        .lists-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .semantic-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .semantic-table caption {
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: var(--primary-color, #333);
        }
        
        .semantic-table th, 
        .semantic-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--primary-color-light, #ccc);
        }
        
        .semantic-table th {
          background-color: var(--primary-color-light, #eee);
          color: var(--primary-color-dark, #333);
        }
          .semantic-footer {
          margin-top: 3rem;
          padding: 1.5rem;
          text-align: center;
          border-top: 1px solid var(--primary-color-light, #ccc);
          color: var(--text-color, #666);
          background-color: var(--card-background, #f8f8f8);
        }
          /* Documentation Tab Styles */
        .doc-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 8px;
          background-color: var(--card-background, #f8f8f8);
        }
        
        .doc-section h3 {
          color: var(--primary-color, #333);
          border-bottom: 1px solid var(--primary-color-light, #eee);
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }
        
        /* API Tab Styles */
        .api-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          border-radius: 8px;
          background-color: var(--card-background, #f8f8f8);
        }
        
        .api-section h3 {
          color: var(--primary-color, #333);
          border-bottom: 1px solid var(--primary-color-light, #eee);
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .api-section h4 {
          color: var(--primary-color-dark, #222);
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .api-section ul {
          padding-left: 1.5rem;
        }
          .api-section li {
          margin-bottom: 0.5rem;
        }
        
        .api-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        
        .api-table th,
        .api-table td {
          padding: 0.5rem;
          text-align: left;
          border-bottom: 1px solid var(--primary-color-light, #eee);
        }
        
        .api-table th {
          background-color: var(--primary-color-light, #eee);
          color: var(--primary-color-dark, #333);
        }
        
        .method-detail {
          margin-bottom: 1.5rem;
        }
        
        .method-detail h4 {
          color: var(--primary-color, #333);
          margin-bottom: 0.5rem;
        }
        
        .code-block {
          background-color: #282c34;
          color: #f8f8f2;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 14px;
          line-height: 1.5;
          margin: 1rem 0;
        }

        /* Responsive design for mobile */
        @media (max-width: 768px) {
          .theme-preview {
            grid-template-columns: 1fr;
          }
          
          .control-row {
            flex-direction: column;
          }
          
          .lists-container {
            grid-template-columns: 1fr;
          }
          
          .semantic-aside {
            float: none;
            width: 100%;
            margin-left: 0;
          }
        }/* Semantic Elements Preview */
        .semantic-preview-container {
          margin: 30px 0;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }
        
        .semantic-elements-preview {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
          color: var(--text-color, #333);
          background: var(--background-color, #fff);
          min-height: 200px;
          padding: 0;
          border-radius: 8px;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        /* Header Styles */
        .semantic-preview-header {
          background: var(--primary-color, #333);
          color: #fff;
          padding: 1rem 2rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
        }
        
        .semantic-preview-header h1 {
          margin: 0;
          font-size: 1.5rem;
        }
        
        .semantic-preview-header nav ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 1.5rem;
        }
        
        .semantic-preview-header nav a {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .semantic-preview-header nav a.active,
        .semantic-preview-header nav a:hover {
          color: #fff;
        }
        
        /* Hero Section */
        .semantic-preview-hero {
          background: var(--primary-color-light, #eaeaea);
          color: var(--text-color, #333);
          padding: 2rem;
          text-align: center;
          border-bottom: 1px solid var(--border-color, #ddd);
        }
        
        .semantic-preview-hero h2 {
          margin-top: 0;
          font-size: 1.75rem;
        }
        
        .semantic-preview-hero .lead {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }
        
        /* Columns Layout */
        .semantic-preview-columns {
          display: grid;
          grid-template-columns: 7fr 3fr;
          gap: 2rem;
          padding: 2rem;
        }
        
        /* Main Content Area */
        .semantic-preview-section {
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color, #eee);
        }
        
        .semantic-preview-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        
        .semantic-preview-section h2 {
          color: var(--primary-color, #333);
          margin-top: 0;
          font-size: 1.4rem;
        }
        
        .semantic-preview-section h3 {
          color: var(--text-color, #444);
          margin-top: 1.5rem;
          font-size: 1.2rem;
        }
        
        /* Blockquote */
        .semantic-preview-section blockquote {
          border-left: 4px solid var(--primary-color, #333);
          margin: 1.5rem 0;
          padding: 1rem 1.5rem;
          background: var(--card-background, #f9f9f9);
          font-style: italic;
          color: var(--text-color-secondary, #555);
        }
        
        .semantic-preview-section blockquote cite {
          display: block;
          text-align: right;
          font-style: normal;
          font-weight: bold;
          margin-top: 0.5rem;
        }
        
        /* Figure */
        .semantic-preview-img-placeholder {
          height: 120px;
          background: var(--primary-color-light, #eee);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color, #333);
          font-style: italic;
        }
        
        .semantic-preview-section figure {
          margin: 1.5rem 0;
        }
        
        .semantic-preview-section figcaption {
          font-style: italic;
          color: var(--text-color-secondary, #666);
          text-align: center;
          margin-top: 0.5rem;
        }
        
        /* Lists */
        .semantic-preview-lists {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        
        .semantic-preview-lists h3 {
          margin-top: 0;
          font-size: 1.1rem;
        }
        
        .semantic-preview-lists ul,
        .semantic-preview-lists ol {
          padding-left: 1.5rem;
          margin-bottom: 0;
        }
        
        .semantic-preview-lists li {
          margin-bottom: 0.5rem;
        }
        
        .semantic-preview-lists dl {
          margin: 0;
        }
        
        .semantic-preview-lists dt {
          font-weight: bold;
          color: var(--primary-color, #333);
          margin-top: 0.75rem;
        }
        
        .semantic-preview-lists dd {
          margin-left: 0;
          margin-bottom: 0.5rem;
        }
        
        /* Buttons */
        .semantic-preview-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-right: 0.5rem;
        }
        
        .semantic-preview-button.primary {
          background: var(--primary-color, #0066cc);
          color: white;
        }
        
        .semantic-preview-button.secondary {
          background: var(--secondary-color, #6c757d);
          color: white;
        }
        
        .semantic-preview-button:hover {
          opacity: 0.9;
        }
        
        .semantic-preview-button:active {
          transform: translateY(1px);
        }
        
        /* Forms */
        .semantic-preview-form {
          max-width: 100%;
        }
        
        .semantic-preview-form fieldset {
          border: 1px solid var(--border-color, #ddd);
          border-radius: 6px;
          padding: 1.5rem;
          margin: 0;
        }
        
        .semantic-preview-form legend {
          padding: 0 0.5rem;
          font-weight: bold;
          color: var(--primary-color, #333);
        }
        
        .semantic-preview-form .form-group {
          margin-bottom: 1rem;
        }
        
        .semantic-preview-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .semantic-preview-form input[type="text"],
        .semantic-preview-form input[type="email"],
        .semantic-preview-form select,
        .semantic-preview-form textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--border-color, #ddd);
          border-radius: 4px;
          background: var(--background-color, #fff);
          color: var(--text-color, #333);
        }
        
        .semantic-preview-form textarea {
          resize: vertical;
        }
        
        .semantic-preview-form .checkbox-group {
          display: flex;
          align-items: center;
        }
        
        .semantic-preview-form .checkbox-group input {
          margin-right: 0.5rem;
        }
        
        .semantic-preview-form .checkbox-group label {
          margin-bottom: 0;
        }
        
        .form-buttons {
          margin-top: 1.5rem;
          display: flex;
          gap: 0.5rem;
        }
        
        /* Table */
        .semantic-preview-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 0.9rem;
        }
        
        .semantic-preview-table caption {
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: var(--primary-color, #333);
          text-align: left;
        }
        
        .semantic-preview-table th,
        .semantic-preview-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color, #ddd);
        }
        
        .semantic-preview-table th {
          background: var(--primary-color-light, #f5f5f5);
          color: var(--primary-color, #333);
          font-weight: 600;
        }
        
        .semantic-preview-table tbody tr:hover {
          background: var(--background-color, rgba(0,0,0,0.02));
        }
        
        .semantic-preview-table tfoot {
          font-style: italic;
          color: var(--text-color-secondary, #666);
          font-size: 0.85rem;
        }
        
        /* Details/Summary */
        .semantic-preview-details {
          border: 1px solid var(--border-color, #ddd);
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        
        .semantic-preview-details summary {
          padding: 0.75rem 1rem;
          cursor: pointer;
          background: var(--card-background, #f5f5f5);
          font-weight: 500;
          color: var(--primary-color, #333);
        }
        
        .semantic-preview-details p {
          padding: 0.75rem 1rem;
          margin: 0;
        }
        
        /* Aside/Sidebar */
        .semantic-preview-aside {
          background: var(--card-background, #f5f5f5);
          padding: 1.5rem;
          border-radius: 6px;
          height: fit-content;
          border-left: 3px solid var(--primary-color, #333);
        }
        
        .semantic-preview-aside h3 {
          margin-top: 0;
          color: var(--primary-color, #333);
          font-size: 1.2rem;
        }
        
        .semantic-preview-aside h4 {
          font-size: 1rem;
          color: var(--text-color, #333);
        }
        
        .semantic-preview-aside ul {
          padding-left: 1.25rem;
        }
        
        .semantic-preview-aside li {
          margin-bottom: 0.5rem;
        }
        
        /* Card in sidebar */
        .semantic-preview-card {
          background: var(--background-color, #fff);
          border: 1px solid var(--border-color, #ddd);
          border-radius: 4px;
          padding: 1rem;
          margin: 1.5rem 0;
        }
        
        .semantic-preview-card h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
        
        .semantic-preview-card p {
          margin: 0;
        }
        
        /* Tag cloud */
        .semantic-preview-tag-cloud {
          margin-top: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .semantic-preview-tag-cloud .tag {
          background: var(--primary-color-light, #e0e0e0);
          color: var(--primary-color, #333);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.8rem;
        }
        
        /* Footer */
        .semantic-preview-footer {
          background: var(--primary-color-dark, #222);
          color: rgba(255, 255, 255, 0.8);
          padding: 1.5rem 2rem;
          margin-top: 2rem;
        }
        
        .semantic-preview-footer .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .semantic-preview-footer p {
          margin: 0;
          font-size: 0.9rem;
        }
        
        .footer-nav {
          display: flex;
          gap: 1rem;
        }
        
        .footer-nav a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
        }
        
        .footer-nav a:hover {
          color: #fff;
          text-decoration: underline;
        }
        
        /* Responsive design for semantic preview */
        @media (max-width: 768px) {
          .semantic-preview-columns {
            grid-template-columns: 1fr;
          }
          
          .semantic-preview-aside {
            margin-top: 2rem;
            border-left: none;
            border-top: 3px solid var(--primary-color, #333);
          }
          
          .semantic-preview-lists {
            grid-template-columns: 1fr;
          }
          
          .semantic-preview-footer .footer-content {
            flex-direction: column;
            align-items: flex-start;
          }
        }        /* Tab Styling Controls */
        .control-section {
          border-top: 1px solid var(--border-color, #ddd);
          margin-top: 20px;
          padding-top: 20px;
        }
        
        .section-title {
          color: var(--primary-color, #333);
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
          text-align: center;
        }
        
        .tab-style-preview {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid var(--border-color, #ddd);
          border-radius: 8px;
          background: var(--background-color, #f8f8f8);
        }
        
        .tab-style-preview h4 {
          margin-top: 0;
          margin-bottom: 15px;
          color: var(--text-color, #333);
          font-size: 16px;
          text-align: center;
        }
        
        .preview-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color, #ddd);
          margin-bottom: 15px;
        }
        
        .preview-tab-btn {
          padding: 8px 15px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }
        
        .preview-tab-btn.active {
          border-bottom-color: var(--primary-color, #4285f4);
          color: var(--primary-color, #4285f4);
          font-weight: bold;
        }
        
        .preview-tab-content {
          padding: 10px;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color, #333);
        }
        
        /* Tab Style Variants */
        .preview-tabs.glassmorphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px;
        }
        
        .preview-tabs.glassmorphism .preview-tab-btn {
          color: var(--text-color, #333);
          border-radius: 4px;
        }
        
        .preview-tabs.glassmorphism .preview-tab-btn.active {
          background: rgba(var(--primary-rgb, 66, 133, 244), 0.2);
          border-bottom: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .preview-tabs.gradient {
          background: linear-gradient(to right, var(--primary-color-light, #6ea8fe), var(--secondary-color-light, #ffd166));
          border-radius: 4px;
          padding: 4px;
          border: none;
        }
        
        .preview-tabs.gradient .preview-tab-btn {
          color: var(--text-color, #333);
          border-radius: 4px;
          border-bottom: none;
          margin: 0 2px;
        }
        
        .preview-tabs.gradient .preview-tab-btn.active {
          background: rgba(255, 255, 255, 0.25);
          color: var(--primary-color-dark, #0056b3);
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .preview-tabs.solid {
          background: var(--primary-color-light, #6ea8fe);
          border-radius: 4px;
          padding: 4px;
          border: none;
        }
        
        .preview-tabs.solid .preview-tab-btn {
          color: var(--text-color, #333);
          border-radius: 4px;
          border-bottom: none;
        }
        
        .preview-tabs.solid .preview-tab-btn.active {
          background: var(--primary-color, #0d6efd);
          color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .preview-tabs.minimal {
          background: transparent;
          border-bottom: 1px solid var(--primary-color-light, #6ea8fe);
        }
        
        .preview-tabs.minimal .preview-tab-btn {
          color: var(--text-color-secondary, #6c757d);
        }
        
        .preview-tabs.minimal .preview-tab-btn.active {
          color: var(--primary-color, #0d6efd);
          border-bottom-color: var(--primary-color, #0d6efd);
        }
        
        /* Custom Tab Styles */
        .tabs.glassmorphism {
          background: rgba(255, 255, 255, var(--tab-transparency, 0.1));
          backdrop-filter: blur(var(--tab-blur, 8px));
          border-radius: var(--tab-border-radius, 4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px;
        }
        
        .tabs.glassmorphism .tab-btn {
          color: var(--text-color, #333);
          border-radius: var(--tab-border-radius, 4px);
          border-bottom: none;
        }
        
        .tabs.glassmorphism .tab-btn.active {
          background: rgba(var(--primary-rgb, 66, 133, 244), 0.2);
          border-bottom: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .tabs.gradient {
          background: linear-gradient(to right, var(--primary-color-light, #6ea8fe), var(--secondary-color-light, #ffd166));
          border-radius: var(--tab-border-radius, 4px);
          padding: 4px;
          border: none;
        }
        
        .tabs.gradient .tab-btn {
          color: var(--text-color, #333);
          border-radius: var(--tab-border-radius, 4px);
          border-bottom: none;
          margin: 0 2px;
        }
        
        .tabs.gradient .tab-btn.active {
          background: rgba(255, 255, 255, 0.25);
          color: var(--primary-color-dark, #0056b3);
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .tabs.solid {
          background: var(--primary-color-light, #6ea8fe);
          border-radius: var(--tab-border-radius, 4px);
          padding: 4px;
          border: none;
        }
        
        .tabs.solid .tab-btn {
          color: var(--text-color, #333);
          border-radius: var(--tab-border-radius, 4px);
          border-bottom: none;
        }
        
        .tabs.solid .tab-btn.active {
          background: var(--primary-color, #0d6efd);
          color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .tabs.minimal {
          background: transparent;
          border-bottom: 1px solid var(--primary-color-light, #6ea8fe);
        }
        
        .tabs.minimal .tab-btn {
          color: var(--text-color-secondary, #6c757d);
        }
        
        .tabs.minimal .tab-btn.active {
          color: var(--primary-color, #0d6efd);
          border-bottom-color: var(--primary-color, #0d6efd);
        }
      </style>

      <div class="container">
        <h1>Theme Generator</h1>
          <div class="tabs">
          <button class="tab-btn active" data-tab="config">Theme Configuration</button>
          <button class="tab-btn" data-tab="preview">Preview</button>
          <button class="tab-btn" data-tab="palette">Color Palette</button>
          <button class="tab-btn" data-tab="css">Generated CSS</button>
          <button class="tab-btn" data-tab="documentation">Documentation</button>
          <button class="tab-btn" data-tab="api">API</button>
        </div>
        
        <!-- Theme Configuration Tab -->
        <div class="tab-content active" id="config-tab">
          <!-- Control Panel (50% smaller) -->
          <div class="control-panel compact">            <div class="control-header">
              <button class="save-button">Save Theme</button>
            </div>
            
            <div class="controls">
              <div class="control-row">
                <div class="control-group">
                  <label for="themeName">Theme Name</label>
                  <input type="text" id="themeName" value="My Custom Theme">
                </div>
                
                <div class="control-group mode-toggle-container">
                  <label>Mode</label>
                  <div class="mode-toggle">
                    <input type="checkbox" id="isDark" class="mode-checkbox">
                    <label for="isDark" class="mode-label">
                      <span class="mode-light">Light</span>
                      <span class="mode-dark">Dark</span>
                      <span class="mode-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div class="control-row">
                <div class="control-group">
                  <label for="colorScheme">Color Scheme</label>
                  <select id="colorScheme">
                    <option value="complementary">Complementary (180°)</option>
                    <option value="triadic">Triadic (120°)</option>
                    <option value="analogous">Analogous (30°)</option>
                    <option value="splitComplementary">Split-Complementary (150°)</option>
                    <option value="tetradic">Tetradic (90°)</option>
                    <option value="monochromatic">Monochromatic (0°)</option>
                  </select>
                </div>
              </div>
              
              <div class="control-row">
                <div class="control-group primary-hue">                  <label for="primaryHue">Primary Hue (0-360)</label>
                  <input type="range" id="primaryHue" min="0" max="360" value="220" class="hue-slider">
                  <small class="value-display">Value: <span id="hueValue">220</span>°</small>
                </div>
                
                <div class="control-group">
                  <div class="color-wheel-container">
                    <div class="color-wheel" id="colorWheel">
                      <div class="wheel-marker" id="primaryMarker"></div>
                      <div class="wheel-marker accent" id="accentMarker"></div>
                    </div>
                    <div class="color-wheel-labels">
                      <div class="color-label primary">
                        <span id="primaryDegree">220°</span>
                      </div>
                      <div class="color-label accent">
                        <span id="accentDegree">40°</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="control-row">
                <div class="control-group">
                  <label for="saturation">Saturation (%)</label>
                  <input type="range" id="saturation" min="10" max="100" value="70" class="slider">
                  <small class="value-display">Value: <span id="saturationValue">70</span>%</small>
                </div>
                
                <div class="control-group">
                  <label for="luminosity">Luminosity (%)</label>
                  <input type="range" id="luminosity" min="20" max="80" value="50" class="slider">
                  <small class="value-display">Value: <span id="luminosityValue">50</span>%</small>
                </div>
              </div>
              
              <button class="generate-button">Generate Theme</button>
              
              <div class="control-section">
                <h3 class="section-title">Tab Styling</h3>
                <div class="control-row">
                  <div class="control-group">
                    <label for="tabStyle">Tab Style</label>
                    <select id="tabStyle">
                      <option value="default">Default</option>
                      <option value="glassmorphism">Glass Morphism</option>
                      <option value="gradient">Gradient</option>
                      <option value="solid">Solid</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                  
                  <div class="control-group">
                    <label for="tabBorderRadius">Border Radius (px)</label>
                    <input type="range" id="tabBorderRadius" min="0" max="20" value="4" class="slider">
                    <small class="value-display">Value: <span id="borderRadiusValue">4</span>px</small>
                  </div>
                </div>
                
                <div class="control-row">
                  <div class="control-group">
                    <label for="tabTransparency">Transparency (%)</label>
                    <input type="range" id="tabTransparency" min="0" max="100" value="10" class="slider">
                    <small class="value-display">Value: <span id="transparencyValue">10</span>%</small>
                  </div>
                  
                  <div class="control-group">
                    <label for="tabBlur">Blur Effect (px)</label>
                    <input type="range" id="tabBlur" min="0" max="20" value="8" class="slider">
                    <small class="value-display">Value: <span id="blurValue">8</span>px</small>
                  </div>
                </div>
                
                <div class="tab-style-preview">
                  <h4>Tab Style Preview</h4>
                  <div class="preview-tabs">
                    <button class="preview-tab-btn active">Tab 1</button>
                    <button class="preview-tab-btn">Tab 2</button>
                    <button class="preview-tab-btn">Tab 3</button>
                  </div>
                  <div class="preview-tab-content">
                    Tab styling preview
                  </div>
                </div>
              </div>
            </div>
          </div>
            <!-- Semantic Elements Example -->          <div class="semantic-preview-container">
            <h2>Semantic Elements Preview</h2>
            <div class="semantic-elements-preview" id="semanticPreview">
              <!-- Header Section -->
              <header class="semantic-preview-header">
                <h1>Semantic HTML</h1>
                <nav>
                  <ul>
                    <li><a href="#" class="active">Home</a></li>
                    <li><a href="#">Products</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                  </ul>
                </nav>
              </header>
              
              <main>
                <!-- Hero Section -->
                <section class="semantic-preview-hero">
                  <h2>Welcome to Theme Preview</h2>
                  <p class="lead">This preview shows how semantic HTML elements are styled with your theme.</p>
                  <button class="semantic-preview-button primary">Primary Action</button>
                  <button class="semantic-preview-button secondary">Secondary Action</button>
                </section>

                <div class="semantic-preview-columns">
                  <!-- Main Content Column -->
                  <div class="semantic-preview-main-column">
                    <!-- Article Section -->
                    <section class="semantic-preview-section">
                      <article>
                        <h2>Article Example</h2>
                        <p>This is a paragraph within an article. The semantic structure helps organize content in a meaningful way.</p>
                        
                        <h3>Subheading</h3>
                        <p>Different heading levels are automatically styled according to hierarchy.</p>
                        
                        <blockquote>
                          <p>Blockquotes are styled with your theme's accent colors to make them stand out from regular text.</p>
                          <cite>— Theme Generator</cite>
                        </blockquote>
                        
                        <figure>
                          <div class="semantic-preview-img-placeholder"></div>
                          <figcaption>Figure caption with descriptive text</figcaption>
                        </figure>
                      </article>
                    </section>
                    
                    <!-- Text Elements Section -->
                    <section class="semantic-preview-section">
                      <h2>Text Elements</h2>
                      <p>Regular paragraph with <a href="#">hyperlink</a> styling.</p>
                      <p><strong>Strong text</strong> and <em>emphasized text</em> show how inline elements are styled.</p>
                      <p><mark>Marked text</mark> for highlighting important information.</p>
                      <p><small>Small text</small> for less important information.</p>
                      <p>Code: <code>const theme = new ThemeGenerator();</code></p>
                      <hr>
                      <address>
                        Contact: <a href="mailto:example@example.com">example@example.com</a><br>
                        123 Theme Street, Web City
                      </address>
                    </section>
                    
                    <!-- Lists Section -->
                    <section class="semantic-preview-section">
                      <h2>Lists</h2>
                      
                      <div class="semantic-preview-lists">
                        <div>
                          <h3>Unordered List</h3>
                          <ul>
                            <li>Primary colors</li>
                            <li>Secondary colors
                              <ul>
                                <li>Light variants</li>
                                <li>Dark variants</li>
                              </ul>
                            </li>
                            <li>Accent colors</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3>Ordered List</h3>
                          <ol>
                            <li>Select a primary hue</li>
                            <li>Choose a color scheme</li>
                            <li>Adjust saturation and luminosity</li>
                            <li>Generate your theme</li>
                          </ol>
                        </div>
                        
                        <div>
                          <h3>Definition List</h3>
                          <dl>
                            <dt>Primary Color</dt>
                            <dd>The main color for your theme</dd>
                            <dt>Saturation</dt>
                            <dd>Color intensity from gray to vibrant</dd>
                            <dt>Luminosity</dt>
                            <dd>Brightness level of colors</dd>
                          </dl>
                        </div>
                      </div>
                    </section>
                    
                    <!-- Forms Section -->
                    <section class="semantic-preview-section">
                      <h2>Form Elements</h2>
                      <form class="semantic-preview-form">
                        <fieldset>
                          <legend>Contact Form</legend>
                          
                          <div class="form-group">
                            <label for="preview-name">Name:</label>
                            <input type="text" id="preview-name" placeholder="Your name">
                          </div>
                          
                          <div class="form-group">
                            <label for="preview-email">Email:</label>
                            <input type="email" id="preview-email" placeholder="your.email@example.com">
                          </div>
                          
                          <div class="form-group">
                            <label for="preview-subject">Subject:</label>
                            <select id="preview-subject">
                              <option>General Inquiry</option>
                              <option>Technical Support</option>
                              <option>Feature Request</option>
                            </select>
                          </div>
                          
                          <div class="form-group">
                            <label for="preview-message">Message:</label>
                            <textarea id="preview-message" rows="3" placeholder="Your message"></textarea>
                          </div>
                          
                          <div class="form-group checkbox-group">
                            <input type="checkbox" id="preview-subscribe">
                            <label for="preview-subscribe">Subscribe to newsletter</label>
                          </div>
                          
                          <div class="form-buttons">
                            <button type="button" class="semantic-preview-button primary">Submit</button>
                            <button type="button" class="semantic-preview-button secondary">Cancel</button>
                          </div>
                        </fieldset>
                      </form>
                    </section>
                    
                    <!-- Table Section -->
                    <section class="semantic-preview-section">
                      <h2>Table</h2>
                      <table class="semantic-preview-table">
                        <caption>Theme Color Components</caption>
                        <thead>
                          <tr>
                            <th>Element</th>
                            <th>Light Mode</th>
                            <th>Dark Mode</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Background</td>
                            <td>#FFFFFF</td>
                            <td>#121212</td>
                          </tr>
                          <tr>
                            <td>Surface</td>
                            <td>#F5F5F5</td>
                            <td>#1E1E1E</td>
                          </tr>
                          <tr>
                            <td>Primary Text</td>
                            <td>#212121</td>
                            <td>#EEEEEE</td>
                          </tr>
                          <tr>
                            <td>Secondary Text</td>
                            <td>#757575</td>
                            <td>#AAAAAA</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colspan="3">These values are generated automatically based on your theme settings.</td>
                          </tr>
                        </tfoot>
                      </table>
                    </section>
                    
                    <!-- Details/Summary Section -->
                    <section class="semantic-preview-section">
                      <h2>Interactive Elements</h2>
                      
                      <details class="semantic-preview-details">
                        <summary>What are semantic elements?</summary>
                        <p>Semantic HTML elements clearly describe their meaning to both the browser and the developer. Examples include &lt;header&gt;, &lt;footer&gt;, &lt;article&gt;, and &lt;section&gt;.</p>
                      </details>
                      
                      <details class="semantic-preview-details">
                        <summary>Why use semantic HTML?</summary>
                        <p>Semantic HTML improves accessibility, SEO, and makes code more readable and maintainable.</p>
                      </details>
                    </section>
                  </div>
                  
                  <!-- Sidebar Column -->
                  <aside class="semantic-preview-aside">
                    <div class="aside-content">
                      <h3>Sidebar</h3>
                      <p>This is an aside element that typically contains related content or supplementary information.</p>
                      
                      <h4>Related Links</h4>
                      <ul>
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">Customization Guide</a></li>
                        <li><a href="#">Theme Gallery</a></li>
                      </ul>
                      
                      <div class="semantic-preview-card">
                        <h4>Did You Know?</h4>
                        <p>Your theme automatically generates accessible color contrasts for text and background.</p>
                      </div>
                      
                      <div class="semantic-preview-tag-cloud">
                        <span class="tag">HTML</span>
                        <span class="tag">CSS</span>
                        <span class="tag">Themes</span>
                        <span class="tag">Design</span>
                        <span class="tag">Accessibility</span>
                      </div>
                    </div>
                  </aside>
                </div>
              </main>
              
              <!-- Footer Section -->
              <footer class="semantic-preview-footer">
                <div class="footer-content">
                  <p>&copy; 2023 Theme Generator. All semantic HTML elements styled by your custom theme.</p>
                  <nav class="footer-nav">
                    <a href="#">Terms</a>
                    <a href="#">Privacy</a>
                    <a href="#">Contact</a>
                  </nav>
                </div>
              </footer>
            </div>
          </div>
        </div>
          <!-- Preview Tab -->
        <div class="tab-content" id="preview-tab">
          <h2>Theme Previews</h2>
          <div class="theme-preview">
            <!-- Light Preview -->
            <div class="preview-container">
              <div class="preview" id="lightPreview">
                <div class="preview-header">
                  <h2 class="preview-title">Light Mode Preview</h2>
                  <p class="preview-subtitle">See how your theme looks in light mode</p>
                </div>
                <div class="preview-content">
                  <p>This is a paragraph of text showing the primary text color. The theme system automatically generates a complete color palette based on your selected primary hue and color scheme.</p>
                </div>
                <button class="preview-button primary">Primary Button</button>
                <button class="preview-button accent">Accent Button</button>
                <div class="preview-card">
                  <h3>Card Title</h3>
                  <p>This is a card component showing the surface color and border styling.</p>
                </div>
              </div>
            </div>

            <!-- Dark Preview -->
            <div class="preview-container">
              <div class="preview" id="darkPreview">
                <div class="preview-header">
                  <h2 class="preview-title">Dark Mode Preview</h2>
                  <p class="preview-subtitle">See how your theme looks in dark mode</p>
                </div>
                <div class="preview-content">
                  <p>This is a paragraph of text showing the primary text color. The theme system automatically generates a complete color palette based on your selected primary hue and color scheme.</p>
                </div>
                <button class="preview-button primary">Primary Button</button>
                <button class="preview-button accent">Accent Button</button>
                <div class="preview-card">
                  <h3>Card Title</h3>
                  <p>This is a card component showing the surface color and border styling.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Color Palette Tab -->
        <div class="tab-content" id="palette-tab">
          <h2>Generated Color Palette</h2>
          <div class="color-swatches" id="colorSwatches">
            <!-- Swatches will be generated here -->
          </div>
        </div>
        
        <!-- CSS Output Tab -->
        <div class="tab-content" id="css-tab">
          <h2>Generated CSS</h2>
          <pre id="cssOutput"></pre>
        </div>        <!-- Documentation Tab -->
        <div class="tab-content" id="documentation-tab">
          <h2>Theme Generator Documentation</h2>
          
          <section class="doc-section">
            <h3>Introduction</h3>
            <p>
              The Theme Generator is a powerful tool that allows you to create and customize 
              color themes for your website. This demo shows how to integrate and use the 
              Theme Generator Web Component in your projects.
            </p>
          </section>
          
          <section class="doc-section">
            <h3>Basic Usage</h3>
            <p>Simply add the component script to your page and use the custom element:</p>
            <pre class="code-block">
&lt;script src="theme-generator-component.js"&gt;&lt;/script&gt;
&lt;theme-generator&gt;&lt;/theme-generator&gt;</pre>
          </section>
          
          <section class="doc-section">
            <h3>Advanced Usage</h3>
            <p>You can configure the theme generator with initial settings by using JavaScript:</p>
            <pre class="code-block">
// Get a reference to the component
const themeGenerator = document.querySelector('theme-generator');

// Configure with initial settings
themeGenerator.configure({
    primaryHue: 180,
    colorScheme: 'triadic',
    saturation: 60,
    luminosity: 50,
    isDark: true
});</pre>
            <p>You can also listen for theme changes:</p>
            <pre class="code-block">
// Listen for theme change events
themeGenerator.addEventListener('theme-changed', (event) => {
    const theme = event.detail;
    console.log('Theme updated:', theme);
    
    // Apply the theme to your application
    // applyTheme(theme);
});</pre>
          </section>
          
          <section class="doc-section">
            <h3>API Reference</h3>
            <h4>Methods</h4>
            <ul>
              <li><strong>configure(options)</strong> - Set initial configuration options</li>
              <li><strong>getTheme()</strong> - Get the current theme configuration</li>
              <li><strong>generateCss()</strong> - Generate CSS variables for the current theme</li>
              <li><strong>exportTheme()</strong> - Export the current theme as a JSON object</li>
            </ul>
            <h4>Events</h4>
            <ul>
              <li><strong>theme-changed</strong> - Fired when the theme is updated</li>
              <li><strong>theme-saved</strong> - Fired when the theme is saved</li>
            </ul>
          </section>
        </div>
        
        <!-- API Tab -->
        <div class="tab-content" id="api-tab">
          <h2>Theme Generator API</h2>
          <p>API documentation for programmatic integration</p>
          
          <section class="api-section">
            <h3>Properties</h3>
            <table class="api-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>primaryHue</td>
                  <td>Number</td>
                  <td>The base hue value (0-360) for the theme</td>
                </tr>
                <tr>
                  <td>colorScheme</td>
                  <td>String</td>
                  <td>The color scheme type (monochromatic, analogous, complementary, etc.)</td>
                </tr>
                <tr>
                  <td>saturation</td>
                  <td>Number</td>
                  <td>The saturation level (0-100) for the generated colors</td>
                </tr>
                <tr>
                  <td>luminosity</td>
                  <td>Number</td>
                  <td>The brightness level (0-100) for the generated colors</td>
                </tr>
                <tr>
                  <td>isDark</td>
                  <td>Boolean</td>
                  <td>Whether the theme is in dark mode</td>
                </tr>
              </tbody>
            </table>
          </section>
          
          <section class="api-section">
            <h3>Methods</h3>
            <div class="method-detail">
              <h4>configure(options)</h4>
              <p>Set initial configuration options for the theme generator</p>
              <pre class="code-block">
themeGenerator.configure({
  primaryHue: 180,
  colorScheme: 'triadic',
  saturation: 60,
  luminosity: 50,
  isDark: true
});</pre>
            </div>
            
            <div class="method-detail">
              <h4>getTheme()</h4>
              <p>Get the current theme configuration and generated colors</p>
              <pre class="code-block">
const theme = themeGenerator.getTheme();</pre>
            </div>
            
            <div class="method-detail">
              <h4>generateCss()</h4>
              <p>Generate CSS variables for the current theme</p>
              <pre class="code-block">
const cssVariables = themeGenerator.generateCss();</pre>
            </div>
            
            <div class="method-detail">
              <h4>exportTheme()</h4>
              <p>Export the current theme as a JSON object</p>
              <pre class="code-block">
const themeData = themeGenerator.exportTheme();</pre>
            </div>
          </section>
        </div>
        
        <!-- Semantic HTML Tab -->
        <div class="tab-content" id="semantic-tab">
          <h2>Semantic HTML Elements</h2>
          <div class="semantic-elements">
            <header class="semantic-header">
              <h1>Page Header</h1>
              <nav class="semantic-nav">
                <ul>
                  <li><a href="#">Home</a></li>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Services</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </nav>
            </header>
            
            <main>
              <section class="semantic-section">
                <h2>Section Heading</h2>
                <p>This is a paragraph within a section element. Sections are used to group related content.</p>
                <blockquote>This is a blockquote element, used for quoting content from other sources.</blockquote>
              </section>
              
              <article class="semantic-article">
                <h2>Article Heading</h2>
                <p>This is an article element, used for self-contained content that could be distributed independently.</p>
                <figure>
                  <div class="placeholder-img"></div>
                  <figcaption>This is a figure caption under an image placeholder.</figcaption>
                </figure>
              </article>
              
              <aside class="semantic-aside">
                <h3>Sidebar Heading</h3>
                <p>This is an aside element, typically used for sidebars or content tangentially related to the main content.</p>
              </aside>
              
              <section class="semantic-section form-container">
                <h2>Form Elements</h2>
                <form class="semantic-form">
                  <fieldset>
                    <legend>Form Controls</legend>
                    <div class="form-control">
                      <label for="input-text">Text Input:</label>
                      <input type="text" id="input-text" placeholder="Enter text here">
                    </div>
                    <div class="form-control">
                      <label for="select-example">Select:</label>
                      <select id="select-example">
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                      </select>
                    </div>
                    <div class="form-control">
                      <button type="button" class="semantic-button primary">Submit</button>
                      <button type="button" class="semantic-button secondary">Cancel</button>
                    </div>
                  </fieldset>
                </form>
              </section>
              
              <section class="semantic-section">
                <h2>Lists & Tables</h2>
                <div class="lists-container">
                  <div>
                    <h3>Unordered List</h3>
                    <ul>
                      <li>Item One</li>
                      <li>Item Two</li>
                      <li>Item Three</li>
                    </ul>
                  </div>
                  <div>
                    <h3>Ordered List</h3>
                    <ol>
                      <li>First Item</li>
                      <li>Second Item</li>
                      <li>Third Item</li>
                    </ol>
                  </div>
                </div>
                
                <table class="semantic-table">
                  <caption>Sample Table</caption>
                  <thead>
                    <tr>
                      <th>Header 1</th>
                      <th>Header 2</th>
                      <th>Header 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Row 1, Cell 1</td>
                      <td>Row 1, Cell 2</td>
                      <td>Row 1, Cell 3</td>
                    </tr>
                    <tr>
                      <td>Row 2, Cell 1</td>
                      <td>Row 2, Cell 2</td>
                      <td>Row 2, Cell 3</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </main>
            
            <footer class="semantic-footer">
              <p>This is a footer element, typically containing copyright information, links to privacy policies, etc.</p>
            </footer>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Save references to frequently accessed elements
    this.primaryHueInput = this.shadowRoot.getElementById('primaryHue');
    this.hueValueSpan = this.shadowRoot.getElementById('hueValue');
    this.primaryDegreeSpan = this.shadowRoot.getElementById('primaryDegree');
    this.accentDegreeSpan = this.shadowRoot.getElementById('accentDegree');
    this.saturationInput = this.shadowRoot.getElementById('saturation');
    this.saturationValueSpan = this.shadowRoot.getElementById('saturationValue');
    this.luminosityInput = this.shadowRoot.getElementById('luminosity');
    this.luminosityValueSpan = this.shadowRoot.getElementById('luminosityValue');
    this.colorSchemeSelect = this.shadowRoot.getElementById('colorScheme');
    this.isDarkSelect = this.shadowRoot.getElementById('isDark');
    this.themeNameInput = this.shadowRoot.getElementById('themeName');
    
    // Tab styling references
    this.tabStyleSelect = this.shadowRoot.getElementById('tabStyle');
    this.tabBorderRadiusInput = this.shadowRoot.getElementById('tabBorderRadius');
    this.borderRadiusValueSpan = this.shadowRoot.getElementById('borderRadiusValue');
    this.tabTransparencyInput = this.shadowRoot.getElementById('tabTransparency');
    this.transparencyValueSpan = this.shadowRoot.getElementById('transparencyValue');
    this.tabBlurInput = this.shadowRoot.getElementById('tabBlur');
    this.blurValueSpan = this.shadowRoot.getElementById('blurValue');
    this.previewTabs = this.shadowRoot.querySelector('.preview-tabs');
    
    // Set up tab system
    const tabButtons = this.shadowRoot.querySelectorAll('.tab-btn');
    const tabContents = this.shadowRoot.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        
        // Update active tab button
        tabButtons.forEach(btn => {
          btn.classList.toggle('active', btn === button);
        });
        
        // Show active tab content
        tabContents.forEach(content => {
          const contentId = content.getAttribute('id');
          content.classList.toggle('active', contentId === `${tabName}-tab`);
        });
        
        this.activeTab = tabName;
      });
    });
    
    // Set up event listeners for controls
    this.setupControlInputListeners();
    
    // Set up tab styling event listeners
    this.setupTabStylingListeners();
    
    // Initialize theme generation
    this.generateAndApplyTheme();

    // Setup color wheel markers
    this.updateColorWheel(parseInt(this.primaryHueInput.value), 
      this.calculateAccentHue(parseInt(this.primaryHueInput.value), this.colorSchemeSelect.value));

    // Setup generate button
    const generateButton = this.shadowRoot.querySelector('.generate-button');
    generateButton.addEventListener('click', () => this.generateAndApplyTheme());
    
    // Setup save button
    const saveButton = this.shadowRoot.querySelector('.save-button');
    saveButton.addEventListener('click', () => this.saveTheme());
    
    // Setup preview tab buttons
    const previewTabButtons = this.shadowRoot.querySelectorAll('.preview-tab-btn');
    previewTabButtons.forEach(button => {
      button.addEventListener('click', () => {
        previewTabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }

  setupControlInputListeners() {
    // Primary Hue Input
    this.primaryHueInput.addEventListener('input', () => {
      const value = this.primaryHueInput.value;
      this.hueValueSpan.textContent = value;
      this.primaryDegreeSpan.textContent = value + '°';
      
      // Update color wheel markers
      const accentHue = this.calculateAccentHue(
        parseInt(value), 
        this.colorSchemeSelect.value
      );
      this.accentDegreeSpan.textContent = accentHue + '°';
      this.updateColorWheel(parseInt(value), accentHue);
      
      this.generateAndApplyTheme();
    });
    
    // Saturation Input
    this.saturationInput.addEventListener('input', () => {
      this.saturationValueSpan.textContent = this.saturationInput.value;
      this.generateAndApplyTheme();
    });
    
    // Luminosity Input
    this.luminosityInput.addEventListener('input', () => {
      this.luminosityValueSpan.textContent = this.luminosityInput.value;
      this.generateAndApplyTheme();
    });
    
    // Color Scheme Select
    this.colorSchemeSelect.addEventListener('change', () => {
      const primaryHue = parseInt(this.primaryHueInput.value);
      const accentHue = this.calculateAccentHue(primaryHue, this.colorSchemeSelect.value);
      this.accentDegreeSpan.textContent = accentHue + '°';
      this.updateColorWheel(primaryHue, accentHue);
      this.generateAndApplyTheme();
    });      // Dark Mode Toggle
    this.isDarkSelect.addEventListener('change', () => {
      // Apply theme immediately for responsive feedback
      const isDark = this.isDarkSelect.checked;
      const config = {
        name: this.themeNameInput.value,
        primaryHue: parseInt(this.primaryHueInput.value),
        colorScheme: this.colorSchemeSelect.value,
        saturation: parseInt(this.saturationInput.value),
        luminosity: parseInt(this.luminosityInput.value),
        isDark: isDark
      };
      
      // Generate the appropriate theme
      const theme = this.generateTheme(config);
      
      // Apply immediately to the semantic preview for instant feedback
      if (isDark) {
        this.applyThemeToControlPanel(theme);
      } else {
        this.resetControlPanel();
        this.applyThemeToSemanticPreview(theme);
      }
      
      // Then generate the complete theme
      this.generateAndApplyTheme();
    });
  }  generateAndApplyTheme() {
    const config = {
      name: this.themeNameInput.value,
      primaryHue: parseInt(this.primaryHueInput.value),
      colorScheme: this.colorSchemeSelect.value,
      saturation: parseInt(this.saturationInput.value),
      luminosity: parseInt(this.luminosityInput.value),
      isDark: this.isDarkSelect.checked
    };
    
    // Generate themes for both light and dark mode
    const lightTheme = this.generateTheme({ ...config, isDark: false });
    const darkTheme = this.generateTheme({ ...config, isDark: true });
    
    // Apply to previews in both config tab and preview tab
    this.applyThemeToPreview(lightTheme, 'lightPreview');
    this.applyThemeToPreview(darkTheme, 'darkPreview');
    
    // Apply current theme to control panel and semantic preview based on mode
    if (config.isDark) {
      this.applyThemeToControlPanel(darkTheme);
    } else {
      this.resetControlPanel();
      // Apply light theme to semantic preview
      this.applyThemeToSemanticPreview(lightTheme);
    }
    
    // Generate swatches
    this.generateSwatches(config.isDark ? darkTheme : lightTheme);
    
    // Generate CSS
    this.generateCSS(config.isDark ? darkTheme : lightTheme);
    
    // Apply to semantic HTML tab
    this.applyThemeToSemanticHTML(config.isDark ? darkTheme : lightTheme);
    
    // Get the current theme based on mode
    const currentTheme = config.isDark ? darkTheme : lightTheme;
    
    // Dispatch the theme-changed event for external use
    this.dispatchEvent(new CustomEvent('theme-changed', {
      detail: { 
        primaryHue: config.primaryHue,
        colorScheme: config.colorScheme, 
        saturation: config.saturation,
        luminosity: config.luminosity,
        isDark: config.isDark,
        ...currentTheme
      },
      bubbles: true,
      composed: true
    }));
  }

  generateTheme(config) {
    const {
      name,
      primaryHue,
      colorScheme = 'complementary',
      saturation = 85,
      luminosity = 50,
      isDark = false
    } = config;
    
    // Calculate accent hue based on color scheme
    let accentHue = this.calculateAccentHue(primaryHue, colorScheme);
    
    // Generate theme based on dark/light mode
    let theme = {};
    
    if (isDark) {
      theme = {
        // Primary colors
        primary: `hsl(${primaryHue}, ${saturation}%, ${luminosity}%)`,
        primaryLight: `hsl(${primaryHue}, ${saturation}%, ${Math.min(luminosity + 20, 90)}%)`,
        primaryDark: `hsl(${primaryHue}, ${saturation}%, ${Math.max(luminosity - 20, 10)}%)`,
        
        // Accent colors
        accent: colorScheme === 'monochromatic' 
          ? `hsl(${accentHue}, ${Math.max(saturation - 30, 20)}%, ${luminosity}%)`
          : `hsl(${accentHue}, ${saturation}%, ${luminosity}%)`,
        accentLight: colorScheme === 'monochromatic'
          ? `hsl(${accentHue}, ${Math.max(saturation - 30, 20)}%, ${Math.min(luminosity + 20, 90)}%)`
          : `hsl(${accentHue}, ${saturation}%, ${Math.min(luminosity + 20, 90)}%)`,
        accentDark: colorScheme === 'monochromatic'
          ? `hsl(${accentHue}, ${Math.max(saturation - 30, 20)}%, ${Math.max(luminosity - 20, 10)}%)`
          : `hsl(${accentHue}, ${saturation}%, ${Math.max(luminosity - 20, 10)}%)`,
        
        // Backgrounds
        background: `hsl(${primaryHue}, ${Math.min(saturation * 0.2, 20)}%, 10%)`,
        surface: `hsl(${primaryHue}, ${Math.min(saturation * 0.2, 20)}%, 15%)`,
        
        // Text
        textPrimary: `hsl(0, 0%, 95%)`,
        textSecondary: `hsl(0, 0%, 75%)`,
        
        // Borders
        border: `hsl(${primaryHue}, ${Math.min(saturation * 0.2, 20)}%, 25%)`
      };
    } else {
      theme = {
        // Primary colors
        primary: `hsl(${primaryHue}, ${saturation}%, ${luminosity}%)`,
        primaryLight: `hsl(${primaryHue}, ${Math.max(saturation - 20, 30)}%, ${Math.min(luminosity + 20, 90)}%)`,
        primaryDark: `hsl(${primaryHue}, ${saturation}%, ${Math.max(luminosity - 15, 20)}%)`,
        
        // Accent colors
        accent: colorScheme === 'monochromatic'
          ? `hsl(${accentHue}, ${Math.max(saturation - 30, 20)}%, ${luminosity}%)`
          : `hsl(${accentHue}, ${saturation}%, ${luminosity}%)`,
        accentLight: colorScheme === 'monochromatic'
          ? `hsl(${accentHue}, ${Math.max(saturation - 40, 10)}%, ${Math.min(luminosity + 20, 90)}%)`
          : `hsl(${accentHue}, ${Math.max(saturation - 20, 30)}%, ${Math.min(luminosity + 20, 90)}%)`,
        accentDark: colorScheme === 'monochromatic'
          ? `hsl(${accentHue}, ${Math.max(saturation - 30, 20)}%, ${Math.max(luminosity - 15, 20)}%)`
          : `hsl(${accentHue}, ${saturation}%, ${Math.max(luminosity - 15, 20)}%)`,
        
        // Backgrounds
        background: `hsl(0, 0%, 98%)`,
        surface: `hsl(0, 0%, 100%)`,
        
        // Text
        textPrimary: `hsl(0, 0%, 10%)`,
        textSecondary: `hsl(0, 0%, 35%)`,
        
        // Borders
        border: `hsl(${primaryHue}, ${Math.min(saturation * 0.3, 30)}%, 85%)`
      };
    }
    
    return {
      name,
      config,
      colors: theme,
      accentHue
    };
  }

  calculateAccentHue(primaryHue, colorScheme) {
    switch(colorScheme) {
      case 'complementary':
        return (primaryHue +  180) % 360;
      case 'triadic':
        return (primaryHue + 120) % 360;
      case 'analogous':
        return (primaryHue + 30) % 360;
      case 'splitComplementary':
        return (primaryHue + 150) % 360;
      case 'tetradic':
        return (primaryHue + 90) % 360;
      case 'monochromatic':
        return primaryHue; // Same hue, different saturation/lightness
      default:
        return (primaryHue + 180) % 360;
    }
  }

  applyThemeToPreview(theme, previewId) {
    const preview = this.shadowRoot.getElementById(previewId);
    if (!preview) return;
    
    const isDark = theme.config.isDark;
    
    // Apply styles
    preview.style.backgroundColor = theme.colors.background;
    preview.style.color = theme.colors.textPrimary;
    
    // Style headers
    preview.querySelector('.preview-title').style.color = theme.colors.primary;
    preview.querySelector('.preview-subtitle').style.color = theme.colors.textSecondary;
    
    // Style buttons
    const primaryBtn = preview.querySelector('.preview-button.primary');
    primaryBtn.style.backgroundColor = theme.colors.primary;
    primaryBtn.style.color = isDark ? '#fff' : '#fff';
    primaryBtn.style.border = 'none';
    
    const accentBtn = preview.querySelector('.preview-button.accent');
    accentBtn.style.backgroundColor = theme.colors.accent;
    accentBtn.style.color = isDark ? '#fff' : '#fff';
    accentBtn.style.border = 'none';
    
    // Style card
    const card = preview.querySelector('.preview-card');
    card.style.backgroundColor = theme.colors.surface;
    card.style.border = `1px solid ${theme.colors.border}`;
    card.querySelector('h3').style.color = theme.colors.primary;
    card.querySelector('p').style.color = theme.colors.textSecondary;
  }
    applyThemeToSemanticHTML(theme) {
    // Apply to both semantic tab and the semantic preview on the config tab
    this.applyThemeToSemanticTab(theme);
    this.applyThemeToSemanticPreview(theme);
  }
  
  // Apply theme to the separate semantic HTML tab
  applyThemeToSemanticTab(theme) {
    const semanticTab = this.shadowRoot.getElementById('semantic-tab');
    if (!semanticTab) return;
    
    // Apply theme to semantic elements
    const semanticElements = semanticTab.querySelector('.semantic-elements');
    const isDark = theme.config.isDark;
    
    // Set background and text colors
    semanticElements.style.backgroundColor = theme.colors.background;
    semanticElements.style.color = theme.colors.textPrimary;
    
    // Style semantic header
    const header = semanticElements.querySelector('.semantic-header');
    header.style.backgroundColor = theme.colors.surface;
    header.style.borderBottomColor = theme.colors.border;
    header.querySelector('h1').style.color = theme.colors.primary;
    
    // Style nav links
    const navLinks = semanticElements.querySelectorAll('.semantic-nav a');
    navLinks.forEach(link => {
      link.style.color = theme.colors.primary;
    });
    
    // Style sections and articles
    const sections = semanticElements.querySelectorAll('.semantic-section');
    sections.forEach(section => {
      section.style.backgroundColor = theme.colors.surface;
      section.style.borderColor = theme.colors.border;
      
      // Style headings
      const headings = section.querySelectorAll('h2, h3');
      headings.forEach(heading => {
        heading.style.color = theme.colors.primary;
      });
    });
    
    // Style article
    const article = semanticElements.querySelector('.semantic-article');
    article.style.backgroundColor = theme.colors.surface;
    article.style.borderLeftColor = theme.colors.primary;
    
    // Style figure
    const placeholderImg = semanticElements.querySelector('.placeholder-img');
    placeholderImg.style.backgroundColor = theme.colors.primaryLight;
    
    // Style aside
    const aside = semanticElements.querySelector('.semantic-aside');
    aside.style.backgroundColor = theme.colors.surface;
    aside.style.borderLeftColor = theme.colors.primary;
    
    // Style form elements
    const fieldset = semanticElements.querySelector('fieldset');
    fieldset.style.borderColor = theme.colors.border;
    
    // Style buttons
    const primaryButton = semanticElements.querySelector('.semantic-button.primary');
    primaryButton.style.backgroundColor = theme.colors.primary;
    primaryButton.style.color = '#fff';
    
    const secondaryButton = semanticElements.querySelector('.semantic-button.secondary');
    secondaryButton.style.backgroundColor = theme.colors.accent;
    secondaryButton.style.color = '#fff';
    
    // Style table
    const table = semanticElements.querySelector('.semantic-table');
    table.style.borderColor = theme.colors.border;
    
    const tableHeaders = table.querySelectorAll('th');
    tableHeaders.forEach(th => {
      th.style.backgroundColor = theme.colors.primaryLight;
      th.style.color = isDark ? '#000' : theme.colors.primaryDark;
    });
    
    const tableCells = table.querySelectorAll('td');
    tableCells.forEach(td => {
      td.style.borderBottomColor = theme.colors.border;
    });
    
    // Style footer
    const footer = semanticElements.querySelector('.semantic-footer');
    footer.style.backgroundColor = theme.colors.surface;
    footer.style.borderTopColor = theme.colors.border;
    footer.style.color = theme.colors.textSecondary;
  }

  updateColorWheel(primaryHue, accentHue) {
    // Position primary marker
    const primaryMarker = this.shadowRoot.getElementById('primaryMarker');
    const primaryAngle = primaryHue * Math.PI / 180;
    const primaryRadius = 32; // Slightly less than the wheel radius
    const primaryX = 40 + Math.cos(primaryAngle) * primaryRadius;
    const primaryY = 40 + Math.sin(primaryAngle) * primaryRadius;
    primaryMarker.style.left = `${primaryX}px`;
    primaryMarker.style.top = `${primaryY}px`;
    
    // Position accent marker
    const accentMarker = this.shadowRoot.getElementById('accentMarker');
    const accentAngle = accentHue * Math.PI / 180;
    const accentRadius = 32; // Same radius as primary
    const accentX = 40 + Math.cos(accentAngle) * accentRadius;
    const accentY = 40 + Math.sin(accentAngle) * accentRadius;
    accentMarker.style.left = `${accentX}px`;
    accentMarker.style.top = `${accentY}px`;
  }

  generateSwatches(theme) {
    const swatchesContainer = this.shadowRoot.getElementById('colorSwatches');
    swatchesContainer.innerHTML = '';
    
    const colorKeys = [
      { key: 'primary', label: 'Primary' },
      { key: 'primaryLight', label: 'Primary Light' },
      { key: 'primaryDark', label: 'Primary Dark' },
      { key: 'accent', label: 'Accent' },
      { key: 'accentLight', label: 'Accent Light' },
      { key: 'accentDark', label: 'Accent Dark' },
      { key: 'background', label: 'Background' },
      { key: 'surface', label: 'Surface' },
      { key: 'textPrimary', label: 'Text Primary' },
      { key: 'textSecondary', label: 'Text Secondary' },
      { key: 'border', label: 'Border' }
    ];
    
    colorKeys.forEach(item => {
      const color = theme.colors[item.key];
      
      // Create swatch
      const swatch = document.createElement('div');
      swatch.className = 'swatch';
      
      // Color display
      const colorDisplay = document.createElement('div');
      colorDisplay.className = 'swatch-color';
      colorDisplay.style.backgroundColor = color;
      
      // Label
      const label = document.createElement('div');
      label.className = 'swatch-label';
      label.textContent = item.label;
      
      // Value
      const value = document.createElement('div');
      value.className = 'swatch-value';
      value.textContent = color;
      
      // Append elements
      swatch.appendChild(colorDisplay);
      swatch.appendChild(label);
      swatch.appendChild(value);
      
      // Add to container
      swatchesContainer.appendChild(swatch);
    });
  }  setupTabStylingListeners() {
    if (!this.tabStyleSelect || !this.previewTabs) return;
    
    // Update tab style when selection changes
    this.tabStyleSelect.addEventListener('change', () => {
      const selectedStyle = this.tabStyleSelect.value;
      
      // Apply style to the preview tabs
      this.previewTabs.className = 'preview-tabs';
      if (selectedStyle !== 'default') {
        this.previewTabs.classList.add(selectedStyle);
      }
      
      // Apply to main component tabs
      const mainTabs = this.shadowRoot.querySelector('.tabs');
      if (mainTabs) {
        mainTabs.className = 'tabs';
        if (selectedStyle !== 'default') {
          mainTabs.classList.add(selectedStyle);
        }
      }
      
      // Generate updated CSS
      this.generateAndApplyTheme();
    });
    
    // Update border radius
    this.tabBorderRadiusInput.addEventListener('input', () => {
      const value = this.tabBorderRadiusInput.value;
      this.borderRadiusValueSpan.textContent = value;
      this.updateTabStyleCustomProperty('--tab-border-radius', `${value}px`);
      this.generateAndApplyTheme();
    });
    
    // Update transparency
    this.tabTransparencyInput.addEventListener('input', () => {
      const value = this.tabTransparencyInput.value;
      this.transparencyValueSpan.textContent = value;
      this.updateTabStyleCustomProperty('--tab-transparency', value / 100);
      this.generateAndApplyTheme();
    });
    
    // Update blur effect
    this.tabBlurInput.addEventListener('input', () => {
      const value = this.tabBlurInput.value;
      this.blurValueSpan.textContent = value;
      this.updateTabStyleCustomProperty('--tab-blur', `${value}px`);
      this.generateAndApplyTheme();
    });
  }
  
  // Helper method to update tab style custom properties
  updateTabStyleCustomProperty(property, value) {
    // Update preview tabs
    this.previewTabs.style.setProperty(property, value);
    
    // Update main component tabs
    const mainTabs = this.shadowRoot.querySelector('.tabs');
    if (mainTabs) {
      mainTabs.style.setProperty(property, value);
    }
    
    // Store in document for CSS generation
    document.documentElement.style.setProperty(property, value);
  }

  generateCSS(theme) {
    const cssOutput = this.shadowRoot.getElementById('cssOutput');
    
    // Extract RGB values from primary color for glassmorphism effects
    let primaryRgb = '66, 133, 244'; // Default RGB value
    const primaryColor = theme.colors.primary;
    if (primaryColor.startsWith('#')) {
      const r = parseInt(primaryColor.slice(1, 3), 16);
      const g = parseInt(primaryColor.slice(3, 5), 16);
      const b = parseInt(primaryColor.slice(5, 7), 16);
      primaryRgb = `${r}, ${g}, ${b}`;
    }
    
    // Get tab styling values if available
    const tabStyle = this.tabStyleSelect ? this.tabStyleSelect.value : 'default';
    const tabBorderRadius = this.tabBorderRadiusInput ? this.tabBorderRadiusInput.value : 4;
    const tabTransparency = this.tabTransparencyInput ? this.tabTransparencyInput.value / 100 : 0.1;
    const tabBlur = this.tabBlurInput ? this.tabBlurInput.value : 8;
    
    // Generate CSS variables
    const cssVars = `/* ${theme.name} */
:root {
  /* Primary Colors */
  --primary-color: ${theme.colors.primary};
  --primary-color-light: ${theme.colors.primaryLight};
  --primary-color-dark: ${theme.colors.primaryDark};
  --primary-rgb: ${primaryRgb};
  
  /* Accent Colors */
  --secondary-color: ${theme.colors.accent};
  --secondary-color-light: ${theme.colors.accentLight};
  --secondary-color-dark: ${theme.colors.accentDark};
  
  /* Backgrounds */
  --background-color: ${theme.colors.background};
  --card-background: ${theme.colors.surface};
  
  /* Text Colors */
  --text-color: ${theme.colors.textPrimary};
  --text-color-secondary: ${theme.colors.textSecondary};
  
  /* Border */
  --border-color: ${theme.colors.border};
  
  /* Tab Styling */
  --tab-border-radius: ${tabBorderRadius}px;
  --tab-transparency: ${tabTransparency};
  --tab-blur: ${tabBlur}px;
}

/* Applied Tab Style: ${tabStyle} */
${tabStyle !== 'default' ? this.generateTabStyleCSS(tabStyle) : '/* Default tab style selected */'}`;
    
    cssOutput.textContent = cssVars;
  }
  
  generateTabStyleCSS(style) {
    switch(style) {
      case 'glassmorphism':
        return `.tabs.glassmorphism {
  background: rgba(255, 255, 255, var(--tab-transparency, 0.1));
  backdrop-filter: blur(var(--tab-blur, 8px));
  border-radius: var(--tab-border-radius, 4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px;
}

.tabs.glassmorphism .tab-btn {
  color: var(--text-color, #333);
  border-radius: var(--tab-border-radius, 4px);
  border-bottom: none;
}

.tabs.glassmorphism .tab-btn.active {
  background: rgba(var(--primary-rgb, 66, 133, 244), 0.2);
  border-bottom: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}`;
      
      case 'gradient':
        return `.tabs.gradient {
  background: linear-gradient(to right, var(--primary-color-light, #6ea8fe), var(--secondary-color-light, #ffd166));
  border-radius: var(--tab-border-radius, 4px);
  padding: 4px;
  border: none;
}

.tabs.gradient .tab-btn {
  color: var(--text-color, #333);
  border-radius: var(--tab-border-radius, 4px);
  border-bottom: none;
  margin: 0 2px;
}

.tabs.gradient .tab-btn.active {
  background: rgba(255, 255, 255, 0.25);
  color: var(--primary-color-dark, #0056b3);
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}`;
      
      case 'solid':
        return `.tabs.solid {
  background: var(--primary-color-light, #6ea8fe);
  border-radius: var(--tab-border-radius, 4px);
  padding: 4px;
  border: none;
}

.tabs.solid .tab-btn {
  color: var(--text-color, #333);
  border-radius: var(--tab-border-radius, 4px);
  border-bottom: none;
}

.tabs.solid .tab-btn.active {
  background: var(--primary-color, #0d6efd);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}`;
      
      case 'minimal':
        return `.tabs.minimal {
  background: transparent;
  border-bottom: 1px solid var(--primary-color-light, #6ea8fe);
}

.tabs.minimal .tab-btn {
  color: var(--text-color-secondary, #6c757d);
}

.tabs.minimal .tab-btn.active {
  color: var(--primary-color, #0d6efd);
  border-bottom-color: var(--primary-color, #0d6efd);
}`;
      
      default:
        return '';
    }
  }
  saveTheme() {
    const config = {
      name: this.themeNameInput.value,
      primaryHue: parseInt(this.primaryHueInput.value),
      colorScheme: this.colorSchemeSelect.value,
      saturation: parseInt(this.saturationInput.value),
      luminosity: parseInt(this.luminosityInput.value),
      isDark: this.isDarkSelect.checked
    };
    
    // Generate theme
    const theme = this.generateTheme(config);
    
    // Generate CSS
    const cssContent = this.generateCss();
    
    // Create a blob and download link
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    
    // Set download attributes
    downloadLink.href = url;
    downloadLink.download = `${config.name.replace(/\s+/g, '-').toLowerCase()}.css`;
    
    // Append, trigger download, and clean up
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
    
    // Also save to localStorage for convenience
    const savedThemes = JSON.parse(localStorage.getItem('savedThemes') || '[]');
    savedThemes.push({
      name: config.name,
      config: config,
      colors: theme.colors
    });
    localStorage.setItem('savedThemes', JSON.stringify(savedThemes));
    
    // Dispatch save event
    this.dispatchEvent(new CustomEvent('theme-saved', {
      detail: { 
        name: config.name,
        theme: theme
      },
      bubbles: true,
      composed: true
    }));
  }
  // API Methods

  // Get the current theme configuration
  getTheme() {
    const config = {
      name: this.themeNameInput.value,
      primaryHue: parseInt(this.primaryHueInput.value),
      colorScheme: this.colorSchemeSelect.value,
      saturation: parseInt(this.saturationInput.value),
      luminosity: parseInt(this.luminosityInput.value),
      isDark: this.isDarkSelect.value === 'true'
    };
    
    return this.generateTheme(config);
  }
    // Generate CSS variables string for the current theme
  generateCss() {
    const theme = this.getTheme();
    
    // Extract RGB values for glassmorphism effects
    let primaryRgb = '66, 133, 244'; // Default RGB value
    const primaryColor = theme.colors.primary;
    if (primaryColor.startsWith('#')) {
      const r = parseInt(primaryColor.slice(1, 3), 16);
      const g = parseInt(primaryColor.slice(3, 5), 16);
      const b = parseInt(primaryColor.slice(5, 7), 16);
      primaryRgb = `${r}, ${g}, ${b}`;
    }
    
    // Get tab styling values if available
    const tabStyle = this.tabStyleSelect ? this.tabStyleSelect.value : 'default';
    const tabBorderRadius = this.tabBorderRadiusInput ? this.tabBorderRadiusInput.value : 4;
    const tabTransparency = this.tabTransparencyInput ? this.tabTransparencyInput.value / 100 : 0.1;
    const tabBlur = this.tabBlurInput ? this.tabBlurInput.value : 8;
    
    // Generate CSS variables string
    return `/* ${theme.name} */
:root {
  /* Primary Colors */
  --primary-color: ${theme.colors.primary};
  --primary-color-light: ${theme.colors.primaryLight};
  --primary-color-dark: ${theme.colors.primaryDark};
  --primary-rgb: ${primaryRgb};
  
  /* Accent Colors */
  --secondary-color: ${theme.colors.accent};
  --secondary-color-light: ${theme.colors.accentLight};
  --secondary-color-dark: ${theme.colors.accentDark};
  
  /* Backgrounds */
  --background-color: ${theme.colors.background};
  --card-background: ${theme.colors.surface};
  
  /* Text Colors */
  --text-color: ${theme.colors.textPrimary};
  --text-color-secondary: ${theme.colors.textSecondary};
  
  /* Border */
  --border-color: ${theme.colors.border};
  
  /* Tab Styling */
  --tab-border-radius: ${tabBorderRadius}px;
  --tab-transparency: ${tabTransparency};
  --tab-blur: ${tabBlur}px;
}

/* Applied Tab Style: ${tabStyle} */
${tabStyle !== 'default' ? this.generateTabStyleCSS(tabStyle) : '/* Default tab style selected */'}`;
  }
  
  // Export the current theme as a JSON object
  exportTheme() {
    const config = {
      name: this.themeNameInput.value,
      primaryHue: parseInt(this.primaryHueInput.value),
      colorScheme: this.colorSchemeSelect.value,
      saturation: parseInt(this.saturationInput.value),
      luminosity: parseInt(this.luminosityInput.value),
      isDark: this.isDarkSelect.value === 'true'
    };
    
    const theme = this.generateTheme(config);
    
    return {
      name: theme.name,
      config: theme.config,
      colors: theme.colors,
      css: this.generateCss()
    };
  }  // Apply theme to control panel and semantic elements preview
  applyThemeToControlPanel(theme) {
    const controlPanel = this.shadowRoot.querySelector('.control-panel.compact');
    if (!controlPanel) return;
    
    // Set control panel background and text colors
    controlPanel.style.setProperty('--card-background', theme.colors.surface);
    controlPanel.style.setProperty('--text-color', theme.colors.textPrimary);
    controlPanel.style.setProperty('--border-color', theme.colors.border);
    controlPanel.style.setProperty('--primary-color', theme.colors.primary);
    controlPanel.style.setProperty('--primary-color-light', theme.colors.primaryLight);
    controlPanel.style.setProperty('--primary-color-dark', theme.colors.primaryDark);
    controlPanel.style.setProperty('--secondary-color', theme.colors.accent);
    controlPanel.style.setProperty('--secondary-color-light', theme.colors.accentLight);
    controlPanel.style.setProperty('--background-color', theme.colors.background);
    
    // Set primary RGB value for glassmorphism tabs
    const primaryColor = theme.colors.primary;
    if (primaryColor.startsWith('#')) {
      const r = parseInt(primaryColor.slice(1, 3), 16);
      const g = parseInt(primaryColor.slice(3, 5), 16);
      const b = parseInt(primaryColor.slice(5, 7), 16);
      controlPanel.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    }
    
    // Additional styling for inputs and controls
    const inputs = controlPanel.querySelectorAll('input[type="text"], select');
    inputs.forEach(input => {
      input.style.backgroundColor = theme.colors.background;
      input.style.color = theme.colors.textPrimary;
      input.style.borderColor = theme.colors.border;
    });
    
    // Style the color wheel labels
    const colorWheelLabels = controlPanel.querySelectorAll('.color-wheel-labels span');
    colorWheelLabels.forEach(label => {
      label.style.color = theme.colors.textPrimary;
    });
    
    // Style the value displays
    const valueDisplays = controlPanel.querySelectorAll('.value-display');
    valueDisplays.forEach(display => {
      display.style.color = theme.colors.textSecondary;
    });
    
    // Ensure tab styling is applied
    if (this.tabStyleSelect) {
      // Reapply current tab styling
      const selectedStyle = this.tabStyleSelect.value;
      
      // Apply style to preview tabs
      if (this.previewTabs) {
        this.previewTabs.className = 'preview-tabs';
        if (selectedStyle !== 'default') {
          this.previewTabs.classList.add(selectedStyle);
        }
      }
      
      // Apply to main component tabs
      const mainTabs = this.shadowRoot.querySelector('.tabs');
      if (mainTabs) {
        mainTabs.className = 'tabs';
        if (selectedStyle !== 'default') {
          mainTabs.classList.add(selectedStyle);
        }
      }
      
      // Make sure the tab-specific properties are preserved
      this.updateTabStyleCustomProperty('--tab-border-radius', `${this.tabBorderRadiusInput.value}px`);
      this.updateTabStyleCustomProperty('--tab-transparency', this.tabTransparencyInput.value / 100);
      this.updateTabStyleCustomProperty('--tab-blur', `${this.tabBlurInput.value}px`);
    }

    // Apply theme to semantic elements preview
    this.applyThemeToSemanticPreview(theme);
  }
  
  // Apply theme to semantic elements preview section
  applyThemeToSemanticPreview(theme) {
    const semanticPreview = this.shadowRoot.getElementById('semanticPreview');
    if (!semanticPreview) return;
    
    const isDark = theme.config.isDark;
    
    // Apply variables to preview container
    semanticPreview.style.setProperty('--background-color', theme.colors.background);
    semanticPreview.style.setProperty('--card-background', theme.colors.surface);
    semanticPreview.style.setProperty('--text-color', theme.colors.textPrimary);
    semanticPreview.style.setProperty('--text-color-secondary', theme.colors.textSecondary);
    semanticPreview.style.setProperty('--border-color', theme.colors.border);
    semanticPreview.style.setProperty('--primary-color', theme.colors.primary);
    semanticPreview.style.setProperty('--primary-color-light', theme.colors.primaryLight);
    semanticPreview.style.setProperty('--primary-color-dark', theme.colors.primaryDark);
    semanticPreview.style.setProperty('--secondary-color', theme.colors.accent);
    semanticPreview.style.setProperty('--accent-color', theme.colors.accent);
    
    // Style header
    const header = semanticPreview.querySelector('.semantic-preview-header');
    header.style.backgroundColor = theme.colors.primary;
    
    // Style hero section
    const hero = semanticPreview.querySelector('.semantic-preview-hero');
    hero.style.backgroundColor = theme.colors.primaryLight;
    hero.style.color = isDark ? '#fff' : theme.colors.textPrimary;
    
    // Style buttons
    const primaryBtns = semanticPreview.querySelectorAll('.semantic-preview-button.primary');
    primaryBtns.forEach(btn => {
      btn.style.backgroundColor = theme.colors.primary;
      btn.style.color = '#fff';
    });
    
    const secondaryBtns = semanticPreview.querySelectorAll('.semantic-preview-button.secondary');
    secondaryBtns.forEach(btn => {
      btn.style.backgroundColor = theme.colors.accent;
      btn.style.color = '#fff';
    });
    
    // Style form elements
    const inputElements = semanticPreview.querySelectorAll('input, select, textarea');
    inputElements.forEach(el => {
      el.style.backgroundColor = theme.colors.background;
      el.style.borderColor = theme.colors.border;
      el.style.color = theme.colors.textPrimary;
    });
    
    // Style card elements
    const cards = semanticPreview.querySelectorAll('.semantic-preview-card');
    cards.forEach(card => {
      card.style.backgroundColor = theme.colors.surface;
      card.style.borderColor = theme.colors.border;
    });
    
    // Style footer
    const footer = semanticPreview.querySelector('.semantic-preview-footer');
    footer.style.backgroundColor = theme.colors.primaryDark;
    
    // Style tags
    const tags = semanticPreview.querySelectorAll('.tag');
    tags.forEach(tag => {
      tag.style.backgroundColor = theme.colors.primaryLight;
      tag.style.color = isDark ? '#fff' : theme.colors.primaryDark;
    });
  }
    // Reset control panel and semantic preview to light theme
  resetControlPanel() {
    const controlPanel = this.shadowRoot.querySelector('.control-panel.compact');
    if (!controlPanel) return;
    
    // Reset to default light theme values
    controlPanel.style.removeProperty('--card-background');
    controlPanel.style.removeProperty('--text-color');
    controlPanel.style.removeProperty('--border-color');
    controlPanel.style.removeProperty('--primary-color');
    controlPanel.style.removeProperty('--background-color');
    
    // Reset inputs
    const inputs = controlPanel.querySelectorAll('input[type="text"], select');
    inputs.forEach(input => {
      input.style.removeProperty('backgroundColor');
      input.style.removeProperty('color');
      input.style.removeProperty('borderColor');
    });
    
    // Reset color wheel labels
    const colorWheelLabels = controlPanel.querySelectorAll('.color-wheel-labels span');
    colorWheelLabels.forEach(label => {
      label.style.removeProperty('color');
    });
    
    // Reset value displays
    const valueDisplays = controlPanel.querySelectorAll('.value-display');
    valueDisplays.forEach(display => {
      display.style.removeProperty('color');
    });
    
    // Reset semantic preview
    this.resetSemanticPreview();
  }
  
  // Reset semantic preview to light theme defaults
  resetSemanticPreview() {
    const semanticPreview = this.shadowRoot.getElementById('semanticPreview');
    if (!semanticPreview) return;
    
    // Reset CSS variables
    semanticPreview.style.removeProperty('--background-color');
    semanticPreview.style.removeProperty('--card-background');
    semanticPreview.style.removeProperty('--text-color');
    semanticPreview.style.removeProperty('--text-color-secondary');
    semanticPreview.style.removeProperty('--border-color');
    semanticPreview.style.removeProperty('--primary-color');
    semanticPreview.style.removeProperty('--primary-color-light');
    semanticPreview.style.removeProperty('--primary-color-dark');
    semanticPreview.style.removeProperty('--secondary-color');
    semanticPreview.style.removeProperty('--accent-color');
    
    // Reset header
    const header = semanticPreview.querySelector('.semantic-preview-header');
    header.style.removeProperty('backgroundColor');
    
    // Reset hero section
    const hero = semanticPreview.querySelector('.semantic-preview-hero');
    hero.style.removeProperty('backgroundColor');
    hero.style.removeProperty('color');
    
    // Reset buttons
    const buttons = semanticPreview.querySelectorAll('.semantic-preview-button');
    buttons.forEach(btn => {
      btn.style.removeProperty('backgroundColor');
      btn.style.removeProperty('color');
    });
    
    // Reset form elements
    const formElements = semanticPreview.querySelectorAll('input, select, textarea');
    formElements.forEach(el => {
      el.style.removeProperty('backgroundColor');
      el.style.removeProperty('borderColor');
      el.style.removeProperty('color');
    });
    
    // Reset card elements
    const cards = semanticPreview.querySelectorAll('.semantic-preview-card');
    cards.forEach(card => {
      card.style.removeProperty('backgroundColor');
      card.style.removeProperty('borderColor');
    });
    
    // Reset footer
    const footer = semanticPreview.querySelector('.semantic-preview-footer');
    footer.style.removeProperty('backgroundColor');
    
    // Reset tags
    const tags = semanticPreview.querySelectorAll('.tag');
    tags.forEach(tag => {
      tag.style.removeProperty('backgroundColor');
      tag.style.removeProperty('color');
    });
  }
    // Set theme configuration programmatically
  setTheme(config) {
    if (config.name) this.themeNameInput.value = config.name;
    if (config.primaryHue) {
      this.primaryHueInput.value = config.primaryHue;
      this.hueValueSpan.textContent = config.primaryHue;
      this.primaryDegreeSpan.textContent = config.primaryHue + '°';
    }
    if (config.colorScheme) this.colorSchemeSelect.value = config.colorScheme;
    if (config.saturation) {
      this.saturationInput.value = config.saturation;
      this.saturationValueSpan.textContent = config.saturation;
    }
    if (config.luminosity) {
      this.luminosityInput.value = config.luminosity;
      this.luminosityValueSpan.textContent = config.luminosity;
    }
    if (config.isDark !== undefined) {
      this.isDarkSelect.checked = config.isDark;
    }
    
    this.generateAndApplyTheme();
  }
  
  // Alias for setTheme for API consistency
  configure(config) {
    this.setTheme(config);
    return this;
  }
}

// Define the custom element
customElements.define('theme-generator', ThemeGenerator);

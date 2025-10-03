// Enhanced Content Script - Extracts ALL CSS from any website
console.log('CSS Extractor Pro content script loaded');

class CSSExtractorPro {
  constructor() {
    this.cssData = new Map();
    this.variables = new Map();
    this.styles = new Map();
    this.colors = new Set();
    this.mediaQueries = [];
    this.keyframes = [];
    this.fontFaces = [];
    this.imports = [];
  }

  async extractAll(options = {}) {
    console.log('Starting comprehensive CSS extraction...');
    
    // Clear previous data
    this.reset();
    
    try {
      // Phase 1: Extract from stylesheets
      await this.extractFromStylesheets();
      
      // Phase 2: Extract from inline styles
      this.extractFromInlineStyles();
      
      // Phase 3: Extract computed styles
      this.extractComputedStyles();
      
      // Phase 4: Extract from Shadow DOM
      this.extractFromShadowDOM();
      
      // Phase 5: Extract dynamically added styles
      await this.extractDynamicStyles();
      
      // Phase 6: Process and categorize
      this.processExtractedData();
      
      return this.formatResults();
    } catch (error) {
      console.error('Extraction failed:', error);
      throw error;
    }
  }

  reset() {
    this.variables.clear();
    this.styles.clear();
    this.colors.clear();
    this.mediaQueries = [];
    this.keyframes = [];
    this.fontFaces = [];
    this.imports = [];
  }

  async extractFromStylesheets() {
    const sheets = Array.from(document.styleSheets);
    
    for (const sheet of sheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) continue;
        
        for (const rule of rules) {
          this.processRule(rule, `stylesheet: ${sheet.href || 'inline'}`);
        }
      } catch (e) {
        // Try to fetch cross-origin stylesheets
        if (sheet.href) {
          await this.fetchExternalCSS(sheet.href);
        }
      }
    }
  }

  async fetchExternalCSS(url) {
    try {
      // Create a same-origin proxy request through background script
      const response = await chrome.runtime.sendMessage({
        action: 'fetchCSS',
        url: url
      });
      
      if (response && response.content) {
        this.parseRawCSS(response.content, `external: ${url}`);
      }
    } catch (error) {
      console.log(`Could not fetch ${url}`);
    }
  }

  processRule(rule, source) {
    switch (rule.type) {
      case CSSRule.STYLE_RULE:
        this.extractFromStyleRule(rule, source);
        break;
      
      case CSSRule.MEDIA_RULE:
        this.mediaQueries.push({
          condition: rule.conditionText,
          source: source
        });
        // Process nested rules
        Array.from(rule.cssRules).forEach(nestedRule => {
          this.processRule(nestedRule, `${source} @media`);
        });
        break;
      
      case CSSRule.KEYFRAMES_RULE:
        this.keyframes.push({
          name: rule.name,
          source: source
        });
        break;
      
      case CSSRule.FONT_FACE_RULE:
        const fontFamily = rule.style.getPropertyValue('font-family');
        if (fontFamily) {
          this.fontFaces.push({
            family: fontFamily.replace(/['"]/g, ''),
            source: source
          });
        }
        break;
      
      case CSSRule.IMPORT_RULE:
        if (rule.href) {
          this.imports.push({
            href: rule.href,
            source: source
          });
        }
        break;
      
      case CSSRule.SUPPORTS_RULE:
        // Process @supports rules
        if (rule.cssRules) {
          Array.from(rule.cssRules).forEach(nestedRule => {
            this.processRule(nestedRule, `${source} @supports`);
          });
        }
        break;
    }
  }

  extractFromStyleRule(rule, source) {
    const style = rule.style;
    
    for (let i = 0; i < style.length; i++) {
      const prop = style[i];
      const value = style.getPropertyValue(prop).trim();
      
      // Store CSS variables
      if (prop.startsWith('--')) {
        this.variables.set(prop, {
          value: value,
          source: source,
          selector: rule.selectorText
        });
        
        // Check if it's a color
        if (this.isColorValue(value)) {
          this.colors.add({
            property: prop,
            value: value,
            type: 'variable'
          });
        }
      } else {
        // Store regular styles
        const key = `${prop}:${value}`;
        if (!this.styles.has(key)) {
          this.styles.set(key, {
            property: prop,
            value: value,
            source: source,
            selector: rule.selectorText,
            count: 1
          });
        } else {
          this.styles.get(key).count++;
        }
        
        // Check for color properties
        if (this.isColorProperty(prop) && this.isColorValue(value)) {
          this.colors.add({
            property: prop,
            value: value,
            type: 'style'
          });
        }
      }
    }
  }

  extractFromInlineStyles() {
    // Extract from <style> elements
    document.querySelectorAll('style').forEach((style, index) => {
      if (style.textContent) {
        this.parseRawCSS(style.textContent, `inline-style-${index}`);
      }
    });
    
    // Extract from style attributes
    document.querySelectorAll('[style]').forEach((element, index) => {
      const styleText = element.getAttribute('style');
      if (styleText) {
        const tagName = element.tagName.toLowerCase();
        const className = element.className || 'no-class';
        this.parseRawCSS(styleText, `style-attr-${tagName}.${className}`);
      }
    });
  }

  extractComputedStyles() {
    // Get computed styles from important elements
    const elements = [
      document.documentElement,
      document.body,
      ...document.querySelectorAll('header, nav, main, footer, article, section, div[class*="container"]')
    ];
    
    elements.forEach(element => {
      if (!element) return;
      
      const computed = getComputedStyle(element);
      
      // Extract CSS variables from computed styles
      Array.from(computed).forEach(prop => {
        if (prop.startsWith('--')) {
          const value = computed.getPropertyValue(prop).trim();
          if (value && !this.variables.has(prop)) {
            this.variables.set(prop, {
              value: value,
              source: 'computed',
              element: element.tagName.toLowerCase()
            });
            
            if (this.isColorValue(value)) {
              this.colors.add({
                property: prop,
                value: value,
                type: 'computed-variable'
              });
            }
          }
        }
      });
    });
  }

  extractFromShadowDOM() {
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      if (element.shadowRoot) {
        // Extract styles from shadow root
        element.shadowRoot.querySelectorAll('style').forEach(style => {
          if (style.textContent) {
            this.parseRawCSS(style.textContent, `shadow-${element.tagName.toLowerCase()}`);
          }
        });
        
        // Recursively check shadow DOM elements
        this.extractFromShadowDOMRecursive(element.shadowRoot, element.tagName.toLowerCase());
      }
    });
  }

  extractFromShadowDOMRecursive(root, parentTag) {
    root.querySelectorAll('*').forEach(element => {
      if (element.shadowRoot) {
        element.shadowRoot.querySelectorAll('style').forEach(style => {
          if (style.textContent) {
            this.parseRawCSS(style.textContent, `shadow-nested-${parentTag}`);
          }
        });
        this.extractFromShadowDOMRecursive(element.shadowRoot, parentTag);
      }
    });
  }

  async extractDynamicStyles() {
    // Wait a bit for dynamic styles to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Re-check for new stylesheets
    const sheets = Array.from(document.styleSheets);
    sheets.forEach(sheet => {
      if (!this.cssData.has(sheet)) {
        this.cssData.set(sheet, true);
        try {
          const rules = sheet.cssRules || sheet.rules;
          if (rules) {
            Array.from(rules).forEach(rule => {
              this.processRule(rule, 'dynamic');
            });
          }
        } catch (e) {
          // Ignore cross-origin errors
        }
      }
    });
  }

  parseRawCSS(cssText, source) {
    // Extract CSS variables
    const varRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
    let match;
    
    while ((match = varRegex.exec(cssText)) !== null) {
      const prop = `--${match[1]}`;
      const value = match[2].trim();
      
      if (!this.variables.has(prop)) {
        this.variables.set(prop, {
          value: value,
          source: source
        });
        
        if (this.isColorValue(value)) {
          this.colors.add({
            property: prop,
            value: value,
            type: 'parsed-variable'
          });
        }
      }
    }
    
    // Extract regular properties
    const propRegex = /([a-z-]+)\s*:\s*([^;!]+)(?:;|!)/gi;
    while ((match = propRegex.exec(cssText)) !== null) {
      const prop = match[1].trim();
      const value = match[2].trim();
      
      if (!prop.startsWith('--')) {
        const key = `${prop}:${value}`;
        if (!this.styles.has(key)) {
          this.styles.set(key, {
            property: prop,
            value: value,
            source: source,
            count: 1
          });
        } else {
          this.styles.get(key).count++;
        }
        
        if (this.isColorProperty(prop) && this.isColorValue(value)) {
          this.colors.add({
            property: prop,
            value: value,
            type: 'parsed-style'
          });
        }
      }
    }
  }

  processExtractedData() {
    // Sort and deduplicate colors
    const uniqueColors = new Map();
    this.colors.forEach(color => {
      const key = `${color.property}:${color.value}`;
      if (!uniqueColors.has(key)) {
        uniqueColors.set(key, color);
      }
    });
    this.colors = new Set(uniqueColors.values());
  }

  isColorValue(value) {
    if (!value) return false;
    const v = value.toLowerCase().trim();
    
    return (
      v.match(/#([0-9a-f]{3}){1,2}([0-9a-f]{2})?/i) ||
      v.includes('rgb') ||
      v.includes('hsl') ||
      v.includes('hwb') ||
      v.includes('lab') ||
      v.includes('lch') ||
      v.includes('color(') ||
      v === 'transparent' ||
      v === 'currentcolor' ||
      /^[a-z]+$/.test(v) // Named colors
    );
  }

  isColorProperty(prop) {
    return /color|background|border|outline|shadow|fill|stroke/.test(prop);
  }

  quickScan() {
    // Quick stats without full extraction
    this.reset();
    
    // Count variables
    const computed = getComputedStyle(document.documentElement);
    Array.from(computed).forEach(prop => {
      if (prop.startsWith('--')) {
        this.variables.set(prop, true);
      }
    });
    
    // Count stylesheets
    let styleCount = 0;
    document.styleSheets.forEach(sheet => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (rules) styleCount += rules.length;
      } catch (e) {
        styleCount++; // Count inaccessible sheets
      }
    });
    
    // Count colors
    let colorCount = 0;
    this.variables.forEach((_, prop) => {
      const value = computed.getPropertyValue(prop);
      if (this.isColorValue(value)) colorCount++;
    });
    
    return {
      variableCount: this.variables.size,
      styleCount: styleCount,
      colorCount: colorCount
    };
  }

  formatResults() {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    const hostname = window.location.hostname || 'unknown';
    
    // Create CSS output
    const cssLines = [
      `/* Complete CSS Extraction from ${window.location.href} */`,
      `/* Extracted on: ${new Date().toISOString()} */`,
      `/* Total: ${this.variables.size} variables, ${this.styles.size} unique styles, ${this.colors.size} colors */`,
      '',
      '/* ==================== CSS VARIABLES ==================== */',
      ':root {'
    ];
    
    this.variables.forEach((data, prop) => {
      cssLines.push(`  ${prop}: ${data.value}; /* ${data.source || 'unknown'} */`);
    });
    cssLines.push('}', '');
    
    // Add media queries section
    if (this.mediaQueries.length > 0) {
      cssLines.push('/* ==================== MEDIA QUERIES ==================== */');
      this.mediaQueries.forEach(mq => {
        cssLines.push(`/* @media ${mq.condition} - ${mq.source} */`);
      });
      cssLines.push('');
    }
    
    // Add animations section
    if (this.keyframes.length > 0) {
      cssLines.push('/* ==================== ANIMATIONS ==================== */');
      this.keyframes.forEach(kf => {
        cssLines.push(`/* @keyframes ${kf.name} - ${kf.source} */`);
      });
      cssLines.push('');
    }
    
    // Create JSON output
    const jsonData = {
      meta: {
        url: window.location.href,
        hostname: hostname,
        title: document.title,
        timestamp: new Date().toISOString(),
        extractionMethod: 'comprehensive-v2'
      },
      statistics: {
        totalVariables: this.variables.size,
        totalStyles: this.styles.size,
        totalColors: this.colors.size,
        mediaQueries: this.mediaQueries.length,
        keyframes: this.keyframes.length,
        fontFaces: this.fontFaces.length,
        imports: this.imports.length
      },
      data: {
        variables: Array.from(this.variables.entries()).map(([prop, data]) => ({
          property: prop,
          ...data
        })),
        colors: Array.from(this.colors),
        mediaQueries: this.mediaQueries,
        keyframes: this.keyframes,
        fontFaces: this.fontFaces,
        imports: this.imports,
        topStyles: Array.from(this.styles.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 100)
      }
    };
    
    // Create colors-only file
    const colorLines = [
      `/* Color Palette from ${hostname} */`,
      ':root {'
    ];
    
    Array.from(this.colors).forEach((color, index) => {
      if (color.type === 'variable') {
        colorLines.push(`  ${color.property}: ${color.value};`);
      } else {
        colorLines.push(`  --extracted-color-${index}: ${color.value}; /* from ${color.property} */`);
      }
    });
    colorLines.push('}');
    
    return {
      css: {
        filename: `css-complete-${hostname}-${timestamp}.css`,
        content: cssLines.join('\n'),
        type: 'text/css'
      },
      json: {
        filename: `css-data-${hostname}-${timestamp}.json`,
        content: JSON.stringify(jsonData, null, 2),
        type: 'application/json'
      },
      colors: {
        filename: `color-palette-${hostname}-${timestamp}.css`,
        content: colorLines.join('\n'),
        type: 'text/css'
      },
      summary: {
        totalVariables: this.variables.size,
        totalStyles: this.styles.size,
        colorCount: this.colors.size,
        hostname: hostname,
        url: window.location.href
      }
    };
  }
}

// Initialize extractor
const extractor = new CSSExtractorPro();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received:', request.action);
  
  switch (request.action) {
    case 'getPageInfo':
      sendResponse({
        url: window.location.href,
        title: document.title,
        hostname: window.location.hostname
      });
      break;
    
    case 'quickScan':
      const scanResult = extractor.quickScan();
      sendResponse({
        success: true,
        data: scanResult
      });
      break;
    
    case 'extractAll':
      extractor.extractAll(request.options)
        .then(result => {
          sendResponse({
            success: true,
            data: result
          });
        })
        .catch(error => {
          sendResponse({
            success: false,
            error: error.message
          });
        });
      return true; // Keep channel open for async response
    
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

console.log('CSS Extractor Pro ready!');
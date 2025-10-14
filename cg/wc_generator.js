// Utility: convert hyphen-case to camelCase
function toCamel(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse automation flags
const AUTO_YES = process.argv.includes('--yes');
const NAME_INDEX = process.argv.indexOf('--name');
const AUTO_NAME = (NAME_INDEX !== -1 && process.argv[NAME_INDEX + 1]) ? process.argv[NAME_INDEX + 1] : null;

// Tracing utility
function trace(msg, ...args) {
  console.log('[TRACE]', msg, ...args);
}

/**
 * Web Component Generator - Enhanced with Schema Support
 * Creates complete, type-safe Web Components with all required files
 * Can generate from existing schema files for regeneration/recreation
 */

export default class WebComponentGenerator {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.fromSchema = false;
    this.schemaData = null;
  }

  /**
   * Prompt user for input
   */
  async prompt(question) {
    // Automation: auto-confirm and set name if flags are present
    if (AUTO_YES) {
      // If the prompt is for a name, use AUTO_NAME if set, else default
      if (question.startsWith('Component name')) {
        return AUTO_NAME || '';
      }
      // If the prompt is for overwrite or confirmation, auto-confirm
      if (question.match(/(Generate component|Overwrite|already exists|y\/n)/i)) {
        return 'y';
      }
      // For all other prompts, return empty string (default)
      return '';
    }
    return new Promise(resolve => {
      this.rl.question(question, answer => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Main generation flow
   */
  async generate() {
    trace('Starting generator. Arguments:', process.argv);
    console.log('\n🎨 Web Component Generator\n');
    // Check for --from-schema argument
    const args = process.argv.slice(2);
    trace('Parsed args:', args);
    const schemaArgIndex = args.indexOf('--from-schema');
    trace('--from-schema index:', schemaArgIndex);
    if (schemaArgIndex !== -1) {
      let schemaPath = args[schemaArgIndex + 1];
      if (!schemaPath || schemaPath.startsWith('--')) {
        // Prompt for schema path interactively
        schemaPath = await this.prompt('Enter path to schema file (e.g., components/wb-control-panel/wb-control-panel.schema.json): ');
      }
      trace('Schema path:', schemaPath);
      // Try resolving schema path from CWD, then from project root (script's parent dir), then absolute
      let resolvedPath = schemaPath;
      if (!fs.existsSync(resolvedPath)) {
        // Try relative to script directory (project root)
        const scriptDir = path.resolve(__dirname, '..');
        const altPath = path.join(scriptDir, schemaPath.replace(/^\.\//, ''));
        if (fs.existsSync(altPath)) {
          resolvedPath = altPath;
        } else if (fs.existsSync(path.resolve(schemaPath))) {
          resolvedPath = path.resolve(schemaPath);
        } else {
          console.error(`\n❌ Error: Schema file not found at '${schemaPath}' or '${altPath}' or as absolute path.`);
          this.rl.close();
          return;
        }
      }
      trace('Resolved schema path:', resolvedPath);
      await this.generateFromSchema(resolvedPath);
    } else {
      trace('No --from-schema flag, running interactive mode');
      await this.generateInteractive();
    }
  }

  /**
   * Generate from existing schema file
   */
  async generateFromSchema(schemaPath) {
    trace('Reading schema from:', schemaPath);
    console.log(`\n📋 Reading schema from: ${schemaPath}\n`);
    try {
      // Read and parse schema
      trace('Attempting to read schema file...');
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      trace('Schema file content:', schemaContent.slice(0, 200) + (schemaContent.length > 200 ? '...truncated...' : ''));
      this.schemaData = JSON.parse(schemaContent);
      this.fromSchema = true;
      trace('Parsed schemaData:', this.schemaData);
      console.log('✅ Schema loaded successfully\n');
      // Extract component info from schema
      const componentInfo = this.extractFromSchema(this.schemaData);
      trace('Extracted componentInfo:', componentInfo);
      // Display what was found
      console.log('Found in schema:');
      console.log(`  • Component: ${componentInfo.tag}`);
      console.log(`  • Class: ${componentInfo.className}`);
      console.log(`  • Description: ${componentInfo.description}`);
      console.log(`  • Attributes: ${componentInfo.attributes.length}`);
      console.log(`  • Events: ${componentInfo.events.length}`);
      console.log(`  • Slots: ${componentInfo.slots.length}`);
      if (componentInfo.dependencies?.length > 0) {
        console.log(`  • Dependencies: ${componentInfo.dependencies.join(', ')}`);
      }
      console.log('');
      // Ask for confirmation
      const proceed = await this.prompt('Generate component from this schema? (y/n): ');
      trace('User proceed response:', proceed);
      if (proceed.toLowerCase() !== 'y') {
        console.log('❌ Cancelled');
        this.rl.close();
        return;
      }
      // Ask for new component name (optional)
      const newName = await this.prompt(`Component name [${componentInfo.tag}]: `);
      trace('User newName response:', newName);
      if (newName) {
        componentInfo.tag = newName;
        componentInfo.className = this.tagToClassName(newName);
        trace('Updated componentInfo with new name:', componentInfo);
      }
      // Validate tag name
      trace('Validating tag name:', componentInfo.tag);
      if (!this.isValidTagName(componentInfo.tag)) {
        console.error('\n❌ Error: Tag name must contain a hyphen and be lowercase (e.g., my-component)');
        this.rl.close();
        return;
      }
      // Create component directory
      const componentDir = path.join(process.cwd(), componentInfo.tag);
      trace('Component directory to create:', componentDir);
      if (fs.existsSync(componentDir)) {
        trace('Component directory exists, prompting for overwrite.');
        const overwrite = await this.prompt(`Directory ${componentInfo.tag} already exists. Overwrite? (y/n): `);
        trace('User overwrite response:', overwrite);
        if (overwrite.toLowerCase() !== 'y') {
          console.log('❌ Cancelled');
          this.rl.close();
          return;
        }
      } else {
        trace('Component directory does not exist, creating...');
        fs.mkdirSync(componentDir, { recursive: true });
        trace('Component directory created.');
      }
      // Generate files
      console.log(`\n📁 Creating component in ${componentDir}/\n`);
      trace('Generating files...');
      this.generateJavaScript(componentDir, componentInfo);
      this.generateCSS(componentDir, componentInfo);
      this.generateHTML(componentDir, componentInfo);
      this.generateMarkdown(componentDir, componentInfo);
      this.generateClaudeMd(componentDir, componentInfo);
      this.generateSchema(componentDir, componentInfo);
      trace('All files generated.');
      console.log('\n✅ Component created successfully from schema!\n');
      console.log('Next steps:');
      console.log(`  1. cd ${componentInfo.tag}`);
      console.log(`  2. Review generated files`);
      console.log(`  3. Add complex features as needed`);
      console.log(`  4. Run: node ../wc-typechecker.js . (to validate)\n`);
      this.rl.close();
    } catch (error) {
      console.error('❌ Error reading schema:', error.message);
      trace('Error stack:', error.stack);
      this.rl.close();
    }
  }

  /**
   * Extract component info from schema
   */
  extractFromSchema(schema) {
    // Get basic info from schema
    const tag = schema.tags?.[0]?.name || 'wb-component';
    const className = this.tagToClassName(tag);
    const description = schema.description || schema.title || 'Component generated from schema';
    const author = 'Generated from Schema';
    const shadow = 'open'; // Default to open shadow DOM
    
    // Extract attributes from schema
    const attributes = [];
    if (schema.tags?.[0]?.attributes) {
      for (const attr of schema.tags[0].attributes) {
        attributes.push({
          name: attr.name,
          type: this.inferAttributeType(attr),
          description: attr.description || `${attr.name} attribute`
        });
      }
    }
    
    // Also check properties section
    if (schema.properties) {
      for (const [propName, propDef] of Object.entries(schema.properties)) {
        // Skip if already in attributes
        if (attributes.find(a => a.name === propName)) continue;
        
        // Only add simple properties as attributes
        if (propDef.type === 'string' || propDef.type === 'boolean' || propDef.type === 'number') {
          attributes.push({
            name: propName,
            type: propDef.type,
            description: propDef.description || `${propName} property`
          });
        }
      }
    }
    
    // Extract events - look in multiple places
    const events = [];
    
    // Check wbComponentRegistry.api.events
    if (schema.wbComponentRegistry?.api?.events) {
      for (const eventName of schema.wbComponentRegistry.api.events) {
        events.push({
          name: eventName,
          description: `${eventName} event`
        });
      }
    }
    
    // Check architecture.responsibilities for event mentions
    if (schema.architecture?.responsibilities) {
      const eventPattern = /wb:[a-z-]+/g;
      const responsibilityText = schema.architecture.responsibilities.join(' ');
      const matches = responsibilityText.match(eventPattern);
      if (matches) {
        for (const match of matches) {
          if (!events.find(e => e.name === match)) {
            events.push({
              name: match,
              description: `${match} event`
            });
          }
        }
      }
    }
    
    // Extract slots (usually just default)
    const slots = [
      {
        name: 'default',
        description: 'Main content slot'
      }
    ];
    
    // Extract dependencies
    const dependencies = schema.wbComponentRegistry?.dependencies || 
                        schema['component-dependencies']?.critical || 
                        [];
    
    return {
      tag,
      className,
      description,
      author,
      shadow,
      attributes,
      events,
      slots,
      dependencies,
      schema: this.schemaData // Keep original schema for reference
    };
  }

  /**
   * Infer attribute type from schema attribute definition
   */
  inferAttributeType(attr) {
    // Check for valueSet (enum) - treat as string
    if (attr.valueSet) {
      return 'string';
    }
    
    // Check description for hints
    const desc = (attr.description || '').toLowerCase();
    if (desc.includes('enable') || desc.includes('disable') || desc.includes('toggle')) {
      return 'boolean';
    }
    
    // Default to string
    return 'string';
  }

  /**
   * Interactive generation flow (original)
   */
  async generateInteractive() {
    console.log('This will create a complete Web Component with:');
    console.log('  • .js  - Component JavaScript');
    console.log('  • .css - Component styles');
    console.log('  • .html - Demo page');
    console.log('  • .md - Documentation');
    console.log('  • claude.md - AI/Claude-specific docs');
    console.log('  • schema.json - Component schema\n');

    // Gather component information
    const componentInfo = await this.gatherInformation();

    // Validate tag name
    if (!this.isValidTagName(componentInfo.tag)) {
      console.error('\n❌ Error: Tag name must contain a hyphen and be lowercase (e.g., my-component)');
      this.rl.close();
      return;
    }

    // Create component directory
    const componentDir = path.join(process.cwd(), componentInfo.tag);
    
    if (fs.existsSync(componentDir)) {
      const overwrite = await this.prompt(`Directory ${componentInfo.tag} already exists. Overwrite? (y/n): `);
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ Cancelled');
        this.rl.close();
        return;
      }
    } else {
      fs.mkdirSync(componentDir, { recursive: true });
    }

    // Generate files
    console.log(`\n📁 Creating component in ${componentDir}/\n`);

    this.generateJavaScript(componentDir, componentInfo);
    this.generateCSS(componentDir, componentInfo);
    this.generateHTML(componentDir, componentInfo);
    this.generateMarkdown(componentDir, componentInfo);
    this.generateClaudeMd(componentDir, componentInfo);
    this.generateSchema(componentDir, componentInfo);

    console.log('\n✅ Component created successfully!\n');
    console.log('Next steps:');
    console.log(`  1. cd ${componentInfo.tag}`);
    console.log(`  2. Open ${componentInfo.tag}.html in browser to see demo`);
    console.log(`  3. Customize the component to your needs`);
    console.log(`  4. Run: node ../wc-typechecker.js . (to validate)\n`);

    this.rl.close();
  }

  /**
   * Gather component information from user (original)
   */
  async gatherInformation() {
    const tag = await this.prompt('Component tag name (e.g., user-card): ');
    const className = this.tagToClassName(tag);
    const description = await this.prompt('Component description: ');
    const author = await this.prompt('Author name: ');
    const shadow = await this.prompt('Shadow DOM mode (open/closed/none) [open]: ') || 'open';

    // Attributes
    console.log('\n📋 Add attributes (press Enter with empty name to finish):');
    const attributes = [];
    while (true) {
      const attrName = await this.prompt('  Attribute name: ');
      if (!attrName) break;
      
      const attrType = await this.prompt('  Attribute type (string/number/boolean): ') || 'string';
      const attrDesc = await this.prompt('  Attribute description: ');
      
      attributes.push({
        name: attrName,
        type: attrType,
        description: attrDesc
      });
    }

    // Events
    console.log('\n🎯 Add events (press Enter with empty name to finish):');
    const events = [];
    while (true) {
      const eventName = await this.prompt('  Event name (kebab-case): ');
      if (!eventName) break;
      
      const eventDesc = await this.prompt('  Event description: ');
      
      events.push({
        name: eventName,
        description: eventDesc
      });
    }

    // Slots
    console.log('\n🔌 Add slots (press Enter with empty name to finish):');
    const slots = [];
    while (true) {
      const slotName = await this.prompt('  Slot name (or "default"): ');
      if (!slotName) break;
      
      const slotDesc = await this.prompt('  Slot description: ');
      
      slots.push({
        name: slotName,
        description: slotDesc
      });
    }

    return {
      tag,
      className,
      description,
      author,
      shadow,
      attributes,
      events,
      slots
    };
  }

  /**
   * Convert tag name to class name
   */
  tagToClassName(tag) {
    return tag.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  /**
   * Validate tag name
   */
  isValidTagName(tag) {
    return /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(tag);
  }

  /**
   * Generate JavaScript file
   */
  generateJavaScript(dir, info) {
    const filename = `${info.tag}.js`;
    const filepath = path.join(dir, filename);

    const observedAttributes = info.attributes.map(a => `'${a.name}'`).join(', ');
    const attributeDocs = info.attributes.map(a => 
      ` * @attribute {${a.type}} ${a.name} - ${a.description}`
    ).join('\n');
    const eventDocs = info.events.map(e => 
      ` * @fires ${e.name} - ${e.description}`
    ).join('\n');
    const slotDocs = info.slots.map(s => 
      ` * @slot ${s.name} - ${s.description}`
    ).join('\n');

    // Use camelCase for variable names
    const attributeCases = info.attributes.map(a => {
      const varName = toCamel(a.name);
      const conversion = a.type === 'number' ? 'Number(newValue)' :
                        a.type === 'boolean' ? 'newValue !== null' :
                        'newValue';
      return `      case '${a.name}':\n        this._${varName} = ${conversion};\n        break;`;
    }).join('\n');

    const shadowRootSetup = info.shadow !== 'none' ? 
      `    // Set up shadow DOM\n    this.attachShadow({ mode: '${info.shadow}' });\n` : '';

    const renderMethod = info.shadow !== 'none' ? 'this.shadowRoot.innerHTML' : 'this.innerHTML';

    // Render: use camelCase for variables
    const renderVars = info.attributes.map(a => `    const ${toCamel(a.name)} = this.getAttribute('${a.name}') || '';`).join('\n');
    const renderFields = info.attributes.map(a => `        <p><strong>${a.name}:</strong> $\{${toCamel(a.name)}}<\/p>`).join('\n');
    const slotFields = info.slots.map(s => `        <slot name=\"${s.name}\"></slot>`).join('');

    // Build the full render() method as a string, using direct assignment
    const renderAssignment = info.shadow !== 'none' ? 'this.shadowRoot.innerHTML = template;' : 'this.innerHTML = template;';
    const renderMethodBody = `\n${renderVars}\n    const template = ` +
      '`\n      <div class=\"container\">\n        <h3>' + info.className + '</h3>\n' +
      renderFields + '\n' + slotFields + '\n      </div>\n    `;' +
      `\n    ${renderAssignment}\n  }`;

    const content = `/**
 * ${info.description}
 * 
 * @webcomponent
 * @tag ${info.tag}
 * @shadow ${info.shadow}
 * ${attributeDocs}
${eventDocs ? ' * \n' + eventDocs : ''}
${slotDocs ? ' * \n' + slotDocs : ''}
 */
class ${info.className} extends HTMLElement {
  constructor() {
    super();
    
${shadowRootSetup}
    // Initialize state
${info.attributes.map(a => `    this._${a.name} = ${a.type === 'boolean' ? 'false' : a.type === 'number' ? '0' : "''"};\n`).join('')}
    // Bind methods
    this._handleClick = this._handleClick.bind(this);
  }
  
  static get observedAttributes() {
    return [${observedAttributes}];
  }
  
  connectedCallback() {
    // Set ARIA attributes
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'region');
    }
    
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    
    // Load styles
    this._loadStyles();
    
    // Initial render
    this.render();
    
    // Add event listeners
    this.addEventListener('click', this._handleClick);
  }
  
  disconnectedCallback() {
    // Clean up event listeners
    this.removeEventListener('click', this._handleClick);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    switch (name) {
${attributeCases}
    }
    
    // Re-render if already connected
    if (${info.shadow !== 'none' ? 'this.shadowRoot' : 'this.isConnected'}) {
      this.render();
    }
  }
  
${info.attributes.map(a => {
  const getter = a.type === 'boolean' 
    ? `    return this.hasAttribute('${a.name}');`
    : `    return this.getAttribute('${a.name}');`;
  
  const setter = a.type === 'boolean'
    ? `    if (value) {\n      this.setAttribute('${a.name}', '');\n    } else {\n      this.removeAttribute('${a.name}');\n    }`
    : `    if (value) {\n      this.setAttribute('${a.name}', value);\n    } else {\n      this.removeAttribute('${a.name}');\n    }`;

  return `  /**
   * Get ${a.name}
   * @returns {${a.type}}
   */
  get ${a.name}() {
${getter}
  }
  
  /**
   * Set ${a.name}
   * @param {${a.type}} value
   */
  set ${a.name}(value) {
${setter}
  }
`;
}).join('\n')}
  /**
   * Load component styles
   * @private
   */
  _loadStyles() {
    const style = document.createElement('style');
    // In production, load from external CSS file
    style.textContent = \`
      :host {
        display: block;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    \`;
    ${info.shadow !== 'none' ? 'this.shadowRoot.appendChild(style);' : 'this.appendChild(style);'}
  }
  
  /**
   * Render component
   */
  render() {${renderMethodBody}
  }
  
  /**
   * Handle click events
   * @param {Event} event
   * @private
   */
  _handleClick(event) {
${info.events.map(e => `    this.dispatchEvent(new CustomEvent('${e.name}', {\n      detail: { timestamp: Date.now() },\n      bubbles: true,\n      composed: true\n    }));\n`).join('')}
  }
}

// Register the custom element
customElements.define('${info.tag}', ${info.className});`;

    fs.writeFileSync(filepath, content);
    console.log(`  ✅ Created ${filename}`);
  }

  // ... REST OF THE METHODS (generateCSS, generateHTML, etc.) ...
  // Copy from original wc_generator.js

  generateCSS(dir, info) {
    const filename = `${info.tag}.css`;
    const filepath = path.join(dir, filename);
    const hostSelector = info.shadow !== 'none' ? ':host' : `.${info.tag}`;

    const content = `/**
 * ${info.className} Styles
 * 
 * DEPENDENCIES: ../../styles/main.css (Harmonic Color System)
 * Reference: ../HowToCreateWebcomponent.md
 */

:root {
  /* Only add truly unique variables here */
}

${hostSelector} {
  /* Use ONLY global variables from _variables.css */
  display: block;
  position: relative;
  box-sizing: border-box !important;
  
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  
  padding: var(--space-md);
  margin: 0;
  
  cursor: pointer;
  user-select: none;
  transition: var(--transition-base);
  outline: none;
}

${hostSelector}__content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: var(--space-sm);
}

${hostSelector}:hover:not([disabled]) {
  background-color: var(--interactive-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

${hostSelector}:active:not([disabled]) {
  background-color: var(--interactive-active);
  transform: translateY(0);
}

${hostSelector}:focus-visible {
  outline: 2px solid var(--focus-color) !important;
  outline-offset: 2px !important;
  box-shadow: var(--focus-ring);
}

${hostSelector}[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
  background-color: var(--interactive-disabled);
  color: var(--interactive-disabled-text);
}

${info.attributes.some(a => a.name === 'variant') ? `
${hostSelector}[variant="primary"] {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}

${hostSelector}[variant="primary"]:hover:not([disabled]) {
  background-color: var(--btn-primary-hover);
}

${hostSelector}[variant="secondary"] {
  background-color: var(--btn-secondary-bg);
  color: var(--btn-secondary-text);
}

${hostSelector}[variant="secondary"]:hover:not([disabled]) {
  background-color: var(--btn-secondary-hover);
}

${hostSelector}[variant="outline"] {
  background-color: transparent;
  color: var(--primary);
  border-color: var(--primary);
}

${hostSelector}[variant="outline"]:hover:not([disabled]) {
  background-color: var(--primary);
  color: white;
}
` : ''}

@media (max-width: 768px) {
  ${hostSelector} {
    min-height: 44px;
    padding: var(--space-sm);
  }
}

@media (prefers-reduced-motion: reduce) {
  ${hostSelector} {
    transition: none;
    animation: none;
  }
}

[data-theme="dark"] ${hostSelector},
[data-theme="light"] ${hostSelector} {
  /* Automatic theme support via HCS */
}

@media (prefers-contrast: high) {
  ${hostSelector} {
    border-width: 2px;
  }
}`;

    fs.writeFileSync(filepath, content);
    console.log(`  ✅ Created ${filename} (WB HCS compliant)`);
  }

  // Keep all other generate methods from original...
  generateHTML(dir, info) {
    const filename = `${info.tag}-demo.html`;
    const filepath = path.join(dir, filename);
    const cssFile = `${info.tag}.css`;
    const jsFile = `${info.tag}.js`;
    const attributes = info.attributes.map(a => `${a.name}=""`).join(' ');
    const slots = info.slots && info.slots.length > 0 ? info.slots.map(s => `<span slot="${s.name}">${s.name} content</span>`).join('\n        ') : '';
    const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${info.className} Demo</title>
  <link rel="stylesheet" href="${cssFile}">
</head>
<body>
  <h2>${info.className} Demo</h2>
  <${info.tag} ${attributes}>
    ${slots}
  </${info.tag}>
  <script type="module" src="${jsFile}"></script>
</body>
</html>`;
    fs.writeFileSync(filepath, content);
    console.log(`  ✅ Created ${filename}`);
  }
  generateMarkdown(dir, info) { /* ... same as original ... */ }
  generateClaudeMd(dir, info) { /* ... same as original ... */ }
  generateSchema(dir, info) { /* ... same as original ... */ }
}

// Run if executed directly
// Always run the generator when this file is executed
const generator = new WebComponentGenerator();
generator.generate().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
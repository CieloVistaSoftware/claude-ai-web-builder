#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';
// For CLI path resolution if needed
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/**
 * Web Component Generator
 * Creates complete, type-safe Web Components with all required files
 */

export default class WebComponentGenerator {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Prompt user for input
   */
  async prompt(question) {
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
    console.log('\n🎨 Web Component Generator\n');
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
   * Gather component information from user
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
    console.log('\n📌 Add slots (press Enter with empty name to finish):');
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

    const attributeCases = info.attributes.map(a => {
      const conversion = a.type === 'number' ? 'Number(newValue)' :
                        a.type === 'boolean' ? 'newValue !== null' :
                        'newValue';
      return `      case '${a.name}':\n        this._${a.name} = ${conversion};\n        break;`;
    }).join('\n');

    const shadowRootSetup = info.shadow !== 'none' ? 
      `    // Set up shadow DOM\n    this.attachShadow({ mode: '${info.shadow}' });\n` : '';

    const renderMethod = info.shadow !== 'none' ? 'this.shadowRoot.innerHTML' : 'this.innerHTML';

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
  render() {
${info.attributes.map(a => `    const ${a.name} = this.getAttribute('${a.name}') || '';\n`).join('')}
    const template = \`
      <div class="container">
        <h3>${info.className}</h3>
${info.attributes.map(a => `        <p><strong>${a.name}:</strong> \${${a.name}}</p>\n`).join('')}
${info.slots.map(s => `        <slot name="${s.name}"></slot>\n`).join('')}
      </div>
    \`;
    
    ${renderMethod} = template;
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

  /**
   * Generate CSS file
   */
  generateCSS(dir, info) {
    const filename = `${info.tag}.css`;
    const filepath = path.join(dir, filename);

    const hostSelector = info.shadow !== 'none' ? ':host' : `.${info.tag}`;

    const content = `/**
 * ${info.className} Styles
 */

${hostSelector} {
  display: block;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: all 0.3s ease;
}

${hostSelector}:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

${hostSelector}:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

p {
  margin: 0;
  color: #666;
}

strong {
  color: #333;
  font-weight: 600;
}

${info.slots.map(s => `
::slotted([slot="${s.name}"]) {
  margin-top: 0.5rem;
}
`).join('')}

/* Responsive */
@media (max-width: 768px) {
  ${hostSelector} {
    padding: 0.75rem;
  }
  
  h3 {
    font-size: 1.1rem;
  }
}`;

    fs.writeFileSync(filepath, content);
    console.log(`  ✅ Created ${filename}`);
  }

  /**
   * Generate HTML demo file
   */
  generateHTML(dir, info) {
    const filename = `${info.tag}.html`;
    const filepath = path.join(dir, filename);

    const exampleAttributes = info.attributes.map(a => 
      `${a.name}="${a.type === 'string' ? 'Example ' + a.name : a.type === 'number' ? '42' : ''}"`
    ).join('\n      ');

    const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${info.className} - Demo</title>
  <style>
    body[data-theme="dark"] {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 2rem;
      background: #181f2a;
      color: #f1f5fa;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      margin-bottom: 1rem;
      color: #e0e6ef;
    }
    .demo-section {
      margin-bottom: 2rem;
    }
    .demo-section h2 {
      margin-bottom: 1rem;
      color: #b6c2d6;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .event-log {
      background: #232b39;
      border: 1px solid #2d3748;
      border-radius: 4px;
      padding: 1rem;
      max-height: 200px;
      overflow-y: auto;
      margin-top: 1rem;
      color: #f1f5fa;
    }
    .event-item {
      padding: 0.5rem;
      background: #232b39;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-family: monospace;
      color: #b6c2d6;
    }
  </style>
</head>
<body data-theme="dark">
  <div class="container">
    <h1>🎨 ${info.className} Demo</h1>
    <p>Interactive demonstration of the <code>&lt;${info.tag}&gt;</code> Web Component.</p>

    <section class="demo-section">
      <h2>Basic Example</h2>
      <div class="grid">
        <${info.tag}
      ${exampleAttributes}
        ></${info.tag}>
      </div>
    </section>

${info.slots.length > 0 ? `    <section class="demo-section">
      <h2>With Slots</h2>
      <div class="grid">
        <${info.tag} ${info.attributes[0] ? info.attributes[0].name + '="Slotted Example"' : ''}>
${info.slots.map(s => `          <div slot="${s.name}">${s.description}</div>`).join('\n')}
        </${info.tag}>
      </div>
    </section>
` : ''}
    <section class="demo-section">
      <div class="event-log">
        <h3>📋 Event Log</h3>
        <div id="event-log"></div>
      </div>
    </section>
  </div>

  <script type="module" src="${info.tag}.js"></script>
  
  <script>
    const eventLog = document.getElementById('event-log');
    let eventCount = 0;

    function logEvent(eventName, detail) {
      eventCount++;
      const eventItem = document.createElement('div');
      eventItem.className = 'event-item';
      eventItem.textContent = \`[\${eventCount}] \${eventName}: \${JSON.stringify(detail)}\`;
      eventLog.insertBefore(eventItem, eventLog.firstChild);

      while (eventLog.children.length > 10) {
        eventLog.removeChild(eventLog.lastChild);
      }
    }

${info.events.map(e => `    document.addEventListener('${e.name}', (e) => {\n      logEvent('${e.name}', e.detail);\n    });\n`).join('\n')}
  </script>
</body>
</html>`;

    fs.writeFileSync(filepath, content);
    console.log(`  ✅ Created ${filename}`);
  }

  /**
   * Generate Markdown documentation
   */
  generateMarkdown(dir, info) {
    const filename = `${info.tag}.md`;
    const filepath = path.join(dir, filename);

    const content = `# ${info.className}

${info.description}

## Installation

\`\`\`html
<script type="module" src="${info.tag}.js"></script>
\`\`\`

## Usage

### Basic Usage

\`\`\`html
<${info.tag}
${info.attributes.map(a => `  ${a.name}="${a.type === 'string' ? 'value' : a.type === 'number' ? '42' : ''}"`).join('\n')}
></${info.tag}>
\`\`\`

### Programmatic Usage

\`\`\`javascript
const element = document.createElement('${info.tag}');
${info.attributes.map(a => `element.${a.name} = ${a.type === 'string' ? '"value"' : a.type === 'number' ? '42' : 'true'};\n`).join('')}document.body.appendChild(element);
\`\`\`

## Attributes

${info.attributes.length > 0 ? `
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
${info.attributes.map(a => `| \`${a.name}\` | \`${a.type}\` | \`${a.type === 'boolean' ? 'false' : a.type === 'number' ? '0' : "''"}\` | ${a.description} |`).join('\n')}
` : 'No attributes defined.'}

## Properties

${info.attributes.length > 0 ? `
| Property | Type | Description |
|----------|------|-------------|
${info.attributes.map(a => `| \`${a.name}\` | \`${a.type}\` | ${a.description} |`).join('\n')}
` : 'No properties defined.'}

## Events

${info.events.length > 0 ? `
| Event | Description | Detail |
|-------|-------------|--------|
${info.events.map(e => `| \`${e.name}\` | ${e.description} | \`{ timestamp: number }\` |`).join('\n')}

### Event Examples

${info.events.map(e => `
\`\`\`javascript
element.addEventListener('${e.name}', (event) => {
  console.log('${e.name}:', event.detail);
});
\`\`\`
`).join('\n')}
` : 'No events defined.'}

## Slots

${info.slots.length > 0 ? `
| Slot | Description |
|------|-------------|
${info.slots.map(s => `| \`${s.name}\` | ${s.description} |`).join('\n')}

### Slot Example

\`\`\`html
<${info.tag}>
${info.slots.map(s => `  <div slot="${s.name}">${s.description}</div>`).join('\n')}
</${info.tag}>
\`\`\`
` : 'No slots defined.'}

## Example

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="${info.tag}.js"></script>
</head>
<body>
  <${info.tag} ${info.attributes[0] ? info.attributes[0].name + '="Example"' : ''}></${info.tag}>
  
  <script>
    const element = document.querySelector('${info.tag}');
    ${info.events[0] ? `element.addEventListener('${info.events[0].name}', (e) => {\n      console.log('Event fired:', e.detail);\n    });` : '// Add event listeners'}
  </script>
</body>
</html>
\`\`\`

## Browser Support

- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Author

${info.author}

## License

MIT`;

    fs.writeFileSync(filepath, content);
    console.log(`  ✅ Created ${filename}`);
  }

  /**
   * Generate claude.md file
   */
  generateClaudeMd(dir, info) {
    const filename = 'claude.md';
    const filepath = path.join(dir, filename);
    const timestamp = new Date().toISOString();

    const content = `# ${info.className} - AI/Claude Documentation

---

## 📋 Component Metadata

**Component Name:** ${info.tag}  
**Component Class:** ${info.className}  
**Version:** 1.0.0  
**Created:** ${timestamp}  
**Last Updated:** ${timestamp}  
**Status:** 🟢 Active Development

### 📁 File Locations

\`\`\`
${info.tag}/
├── ${info.tag}.js           # Component implementation
├── ${info.tag}.css          # Component styles  
├── ${info.tag}.html         # Demo page
├── ${info.tag}.md           # Human documentation
├── claude.md                # This file (AI documentation)
└── schema.json              # Component schema
\`\`\`

### 🔗 Important Links

- **Component Documentation:** [${info.tag}.md](./${info.tag}.md)
- **Demo Page:** [${info.tag}.html](./${info.tag}.html)
- **Component Schema:** [schema.json](./schema.json)
- **How to Create Web Components:** [../HowToCreateWebcomponent.md](../HowToCreateWebcomponent.md)
- **Component Guidelines:** [WB Standards](../HowToCreateWebcomponent.md#wb-specific-css-rules--patterns)

---

## 🐛 Issue Tracking

### Current Issues

<!-- Add new issues below with timestamp, line number, priority -->

\`\`\`
No issues currently logged.
\`\`\`

### Issue Template

When logging new issues, use this format:

\`\`\`markdown
**[PRIORITY] Issue Title**  
- **Timestamp:** YYYY-MM-DD HH:MM:SS
- **File:** ${info.tag}.js
- **Line:** Line number(s)
- **Description:** Brief description of the issue
- **Impact:** How this affects functionality
- **Fix:** Proposed solution (if known)
\`\`\`

**Priority Levels:**
- 🔴 **P0 - CRITICAL**: Blocks functionality, must fix immediately
- 🟠 **P1 - HIGH**: Major issue, fix before release
- 🟡 **P2 - MEDIUM**: Important but not blocking
- 🟢 **P3 - LOW**: Nice to have, minor issue
- 🔵 **P4 - ENHANCEMENT**: Future improvement

### Example Issue Entry

\`\`\`markdown
**[P1 - HIGH] Event handler memory leak**
- **Timestamp:** 2025-01-15 14:30:00
- **File:** ${info.tag}.js
- **Line:** 145-150
- **Description:** Event listeners not properly cleaned up in disconnectedCallback
- **Impact:** Memory leaks when component is removed from DOM
- **Fix:** Add removeEventListener calls in disconnectedCallback method
\`\`\`

---

This file provides AI-optimized documentation for the ${info.tag} Web Component.

## Component Purpose

${info.description}

This component is designed to ${info.description.toLowerCase()}. It follows Web Components standards and can be used in any modern web application.

## Usage for AI

When generating code using this component, remember:

1. **Tag Name**: Always use \`<${info.tag}>\` (with hyphen)
2. **Shadow DOM**: This component uses **${info.shadow}** shadow DOM
3. **Framework Agnostic**: Works with vanilla JS, React, Vue, Angular, etc.
4. **Self-Contained**: All styles are encapsulated

## Key Attributes

${info.attributes.length > 0 ? info.attributes.map(a => `
### ${a.name}

- **Type**: \`${a.type}\`
- **Purpose**: ${a.description}
- **Required**: No
${a.type === 'boolean' ? '- **Usage**: Presence indicates true, absence indicates false' : ''}

\`\`\`html
<${info.tag} ${a.name}="${a.type === 'string' ? 'example-value' : a.type === 'number' ? '42' : ''}"${a.type === 'boolean' ? ' ' + a.name : ''}></${info.tag}>
\`\`\`
`).join('\n') : 'No attributes defined for this component.'}

## Events

${info.events.length > 0 ? info.events.map(e => `
### ${e.name}

${e.description}

**Listening to the event:**

\`\`\`javascript
const element = document.querySelector('${info.tag}');
element.addEventListener('${e.name}', (event) => {
  console.log('Event fired:', event.detail);
  // Handle event
});
\`\`\`

**Event Detail Structure:**

\`\`\`javascript
{
  timestamp: number,
  // Additional event-specific data
}
\`\`\`
`).join('\n') : 'No events defined for this component.'}

## Slots

${info.slots.length > 0 ? info.slots.map(s => `
### ${s.name} Slot

${s.description}

\`\`\`html
<${info.tag}>
  <div slot="${s.name}">
    ${s.description}
  </div>
</${info.tag}>
\`\`\`
`).join('\n') : 'No slots defined for this component.'}

## Common Patterns

### Basic Usage

\`\`\`html
<${info.tag}${info.attributes[0] ? ' ' + info.attributes[0].name + '="example"' : ''}></${info.tag}>
\`\`\`

### With All Attributes

\`\`\`html
<${info.tag}
${info.attributes.map(a => `  ${a.name}="${a.type === 'string' ? 'example-' + a.name : a.type === 'number' ? '42' : ''}"`).join('\n')}
></${info.tag}>
\`\`\`

${info.slots.length > 0 ? `### With Slots

\`\`\`html
<${info.tag}>
${info.slots.map(s => `  <div slot="${s.name}">${s.description}</div>`).join('\n')}
</${info.tag}>
\`\`\`
` : ''}

### Programmatic Creation

\`\`\`javascript
// Create element
const element = document.createElement('${info.tag}');

// Set attributes
${info.attributes.map(a => `element.setAttribute('${a.name}', ${a.type === 'string' ? "'value'" : a.type === 'number' ? '42' : 'true'});`).join('\n')}

// Add event listeners
${info.events.length > 0 ? info.events.map(e => `element.addEventListener('${e.name}', (e) => {
  console.log('${e.name}:', e.detail);
});`).join('\n\n') : '// No events to listen for'}

// Append to DOM
document.body.appendChild(element);
\`\`\`

## Code Examples

### Example 1: Simple Implementation

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="${info.tag}.js"></script>
</head>
<body>
  <${info.tag} ${info.attributes[0] ? info.attributes[0].name + '="Example"' : ''}></${info.tag}>
</body>
</html>
\`\`\`

### Example 2: With Event Handling

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="${info.tag}.js"></script>
</head>
<body>
  <${info.tag} id="myComponent" ${info.attributes[0] ? info.attributes[0].name + '="Example"' : ''}></${info.tag}>
  
  <script>
    const component = document.getElementById('myComponent');
    
    ${info.events.length > 0 ? info.events.map(e => `component.addEventListener('${e.name}', (event) => {
      console.log('${e.name} fired:', event.detail);
      // Your handling logic here
    });`).join('\n    \n    ') : '// Add event listeners here'}
  </script>
</body>
</html>
\`\`\`

### Example 3: Dynamic Content

\`\`\`javascript
// Fetch data and populate component
async function loadData() {
  const data = await fetch('/api/data').then(r => r.json());
  
  const component = document.createElement('${info.tag}');
  ${info.attributes.length > 0 ? `
  // Set attributes from data
  ${info.attributes.slice(0, 2).map(a => `component.setAttribute('${a.name}', data.${a.name} || '');`).join('\n  ')}` : ''}
  
  document.body.appendChild(component);
}

loadData();
\`\`\`

## Integration Notes

### Framework Integration

#### Vanilla JavaScript

\`\`\`javascript
document.querySelector('${info.tag}').addEventListener('${info.events[0]?.name || 'click'}', handler);
\`\`\`

#### React

\`\`\`jsx
function MyComponent() {
  const handleEvent = (e) => {
    console.log(e.detail);
  };
  
  return (
    <${info.tag}
      ${info.attributes[0] ? info.attributes[0].name + '="value"' : ''}
      ref={(el) => el && el.addEventListener('${info.events[0]?.name || 'custom-event'}', handleEvent)}
    />
  );
}
\`\`\`

#### Vue

\`\`\`vue
<template>
  <${info.tag}
    ${info.attributes[0] ? ':' + info.attributes[0].name + '="value"' : ''}
    @${info.events[0]?.name || 'custom-event'}="handleEvent"
  />
</template>

<script>
export default {
  methods: {
    handleEvent(e) {
      console.log(e.detail);
    }
  }
}
</script>
\`\`\`

#### Angular

\`\`\`typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <${info.tag}
      ${info.attributes[0] ? '[attr.' + info.attributes[0].name + ']="value"' : ''}
      (${info.events[0]?.name || 'custom-event'})="handleEvent($event)"
    ></${info.tag}>
  \`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  handleEvent(event: CustomEvent) {
    console.log(event.detail);
  }
}
\`\`\`

### Browser Support

- ✅ Chrome 54+
- ✅ Firefox 63+
- ✅ Safari 10.1+
- ✅ Edge 79+

### Performance Considerations

- Component uses Shadow DOM (${info.shadow}) for style encapsulation
- Minimal performance overhead
- Efficient re-rendering on attribute changes
- Proper cleanup in disconnectedCallback

### Accessibility

- Component includes basic ARIA attributes
- Keyboard navigation supported
- Screen reader compatible
${info.attributes.some(a => a.name.includes('label') || a.name.includes('aria')) ? '- ARIA labels provided via attributes' : '- Consider adding aria-label attribute for better accessibility'}

## AI Code Generation Tips

When generating code that uses this component:

1. **Always include the hyphen** in the tag name (\`${info.tag}\`)
2. **Import before use**: \`<script type="module" src="${info.tag}.js"></script>\`
3. **Attribute types matter**: 
${info.attributes.map(a => `   - ${a.name}: ${a.type}${a.type === 'boolean' ? ' (presence = true)' : ''}`).join('\n')}
4. **Events bubble**: Set \`bubbles: true\` when dispatching
5. **Use composed**: Set \`composed: true\` to cross shadow boundaries

## Troubleshooting

### Component Not Displaying

**Check:**
1. Script tag present and loaded
2. Tag name has hyphen
3. Browser supports Custom Elements
4. No JavaScript errors in console

### Styles Not Applied

**Check:**
1. Shadow DOM mode is correct (${info.shadow})
${info.shadow !== 'none' ? '2. Styles are in shadowRoot, not document' : '2. Styles are in document, not shadowRoot'}
3. CSS custom properties for theming

### Events Not Firing

**Check:**
1. Event name is correct (${info.events[0]?.name || 'check documentation'})
2. Event listener attached after component loads
3. Event bubbles and composed flags set correctly

## Version History

- **v1.0.0**: Initial release
  - Basic functionality
  - All attributes implemented
  - Event handling
  ${info.slots.length > 0 ? '- Slot support' : ''}

## Author

${info.author}

## Related Components

Consider using with:
- Other custom elements in your application
- Standard HTML elements
- Third-party Web Components

---

**This documentation is optimized for AI assistants like Claude to understand and generate code using this component.**`;

    fs.writeFileSync(filepath, content);
    console.log(`  ✅ Created ${filename}`);
  }

  /**
   * Generate schema.json
   */
  generateSchema(dir, info) {
    const filename = 'schema.json';
    const filepath = path.join(dir, filename);

    const schema = {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "name": info.className,
      "tag": info.tag,
      "version": "1.0.0",
      "description": info.description,
      "author": info.author,
      "extends": "HTMLElement",
      "shadowDOM": info.shadow,
      "attributes": info.attributes.map(a => ({
        name: a.name,
        type: a.type,
        default: a.type === 'boolean' ? false : a.type === 'number' ? 0 : '',
        required: false,
        description: a.description
      })),
      "properties": info.attributes.map(a => ({
        name: a.name,
        type: a.type,
        description: a.description,
        readOnly: false
      })),
      "events": info.events.map(e => ({
        name: e.name,
        description: e.description,
        bubbles: true,
        composed: true,
        cancelable: false
      })),
      "slots": info.slots.map(s => ({
        name: s.name,
        description: s.description
      }))
    };

    fs.writeFileSync(filepath, JSON.stringify(schema, null, 2));
    console.log(`  ✅ Created ${filename}`);
  }
}

// Always run the generator when this script is executed directly
if (process.argv[1] && process.argv[1].endsWith('wc_generator.js')) {
  const generator = new WebComponentGenerator();
  generator.generate().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}
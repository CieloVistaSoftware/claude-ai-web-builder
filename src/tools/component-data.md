# component-data.js - WB Component Discovery Data for Web IDE

## Overview

The WB Component Discovery Data file serves as a **static snapshot** of component discovery results, providing pre-generated component and symbol information for web-based development tools. It acts as a lightweight alternative to running full discovery analysis in browser environments.

## Core Purpose

This file addresses the need for **browser-accessible component data** without requiring Node.js filesystem access or real-time component discovery. It provides a complete symbol table and component registry that can be used by web IDEs, documentation tools, and debugging interfaces.

## Key Features

### 📊 **Pre-Generated Symbol Table**
- **Complete Symbol Mapping**: All 855+ symbols with metadata
- **Component Classifications**: Web components vs legacy components
- **Type Information**: Classes, functions, custom elements
- **Component Relationships**: Symbol-to-component mappings

### 🔧 **Component Registry**
- **Component Status Tracking**: Complete, broken, legacy classifications
- **Component Metadata**: Types, custom elements, issue tracking
- **Health Assessment**: Component operational status
- **API Information**: Available methods, events, attributes

### 🌐 **Browser Compatibility**
- **Global Namespace**: Available as `window.WB_DISCOVERY_DATA`
- **Zero Dependencies**: Standalone JavaScript file
- **Immediate Loading**: Data available on script load
- **Console Integration**: Automatic logging for verification

## Data Structure

### **Symbol Table Format**
```javascript
window.WB_DISCOVERY_DATA.symbolTable = [
    [
        "wb-button",                              // Symbol name
        {
            "name": "wb-button",                  // Symbol identifier
            "type": "custom-element",             // Symbol type
            "component": "wb-button",             // Parent component
            "webComponent": true                  // Web component flag
        }
    ],
    [
        "WBButton",                               // Class symbol
        {
            "name": "WBButton",
            "type": "class", 
            "component": "wb-button",
            "webComponent": false                 // Legacy class
        }
    ]
];
```

### **Component Registry Format**
```javascript
window.WB_DISCOVERY_DATA.componentRegistry = [
    {
        "name": "wb-button",                      // Component name
        "type": "web-component",                  // Component type
        "status": "complete",                     // Health status
        "customElement": "wb-button"              // Custom element tag
    },
    {
        "name": "wb-input",
        "type": "legacy",
        "status": "broken",                       // Known issues
        "issues": ["Input elements not functional"]
    }
];
```

### **Metadata Structure**
```javascript
window.WB_DISCOVERY_DATA.metadata = {
    "totalComponents": 23,                        // Total discovered
    "webComponents": 14,                          // Modern web components
    "legacyComponents": 9,                        // Legacy implementations
    "brokenComponents": 4,                        // Components with issues
    "scanTime": "2025-10-13T..."                 // Last update timestamp
};
```

## Symbol Categories

### **Web Components** (Custom Elements)
Modern web components with `customElements.define()` registration:

```javascript
// Examples from symbol table
["wb-button", "wb-table", "wb-select", "wb-toggle"]
["wb-modal", "wb-status", "wb-nav", "wb-card"]
["wb-color-picker", "wb-footer", "wb-event-log"]
["control-panel", "color-bar", "wb-log-error"]
```

**Characteristics**:
- `type: "custom-element"`
- `webComponent: true`
- Can be used directly in HTML: `<wb-button></wb-button>`

### **Component Classes** (Legacy Pattern)
Traditional WB component classes with factory methods:

```javascript
// Examples from symbol table
["WBButton", "WBTable", "WBSelect", "WBToggle"]
["WBModal", "WBStatus", "WBNav", "WBCard"]
["WBColorPicker", "WBFooter", "WBEventLog"]
```

**Characteristics**:
- `type: "class"`
- `webComponent: false`
- Used programmatically: `WBButton.create('elementId', config)`

### **Utility Functions**
Common utility functions used across components:

```javascript
// Examples from symbol table
["loadCSS", "generateId", "getPath", "loadConfig"]
```

**Characteristics**:
- `type: "function"`
- `component: "wb-component-utils"`
- Shared functionality across all components

## Component Status Classifications

### **✅ Complete Components** (14 Web + 5 Legacy = 19)
Fully functional components ready for production use:

**Web Components**:
- `wb-button`, `wb-table`, `wb-select`, `wb-toggle`
- `wb-modal`, `wb-status`, `wb-nav`, `wb-card`
- `wb-color-picker`, `wb-footer`, `wb-event-log`
- `control-panel`, `color-bar`, `wb-log-error`

**Legacy Components**:
- `wb-viewport`, `wb-slider`, `wb-hero`
- `wb-header`, `wb-component-utils`

### **🔴 Broken Components** (4)
Components with known issues requiring attention:

```javascript
{
    "name": "wb-input",
    "status": "broken", 
    "issues": ["Input elements not functional"]
},
{
    "name": "control-panel-new",
    "status": "broken",
    "issues": ["JSON parsing errors"]
},
{
    "name": "change-text", 
    "status": "broken",
    "issues": ["Edit mode not working"]
},
{
    "name": "image-insert",
    "status": "broken", 
    "issues": ["Insert function broken"]
}
```

## Usage Examples

### **Browser Integration**
```html
<!DOCTYPE html>
<html>
<head>
    <script src="tools/component-data.js"></script>
</head>
<body>
    <script>
        // Access component data
        console.log(window.WB_DISCOVERY_DATA.metadata);
        
        // Find web components
        const webComponents = window.WB_DISCOVERY_DATA.symbolTable
            .filter(([name, data]) => data.type === 'custom-element')
            .map(([name]) => name);
            
        console.log('Available web components:', webComponents);
    </script>
</body>
</html>
```

### **Component Validation**
```javascript
function isComponentAvailable(componentName) {
    const symbolTable = window.WB_DISCOVERY_DATA.symbolTable;
    return symbolTable.some(([name, data]) => 
        name === componentName && data.type === 'custom-element'
    );
}

// Usage
if (isComponentAvailable('wb-button')) {
    document.body.innerHTML += '<wb-button>Click me</wb-button>';
}
```

### **Component Registry Queries**
```javascript
function getComponentInfo(componentName) {
    return window.WB_DISCOVERY_DATA.componentRegistry
        .find(comp => comp.name === componentName);
}

function getBrokenComponents() {
    return window.WB_DISCOVERY_DATA.componentRegistry
        .filter(comp => comp.status === 'broken');
}

// Usage
const buttonInfo = getComponentInfo('wb-button');
console.log(`wb-button status: ${buttonInfo.status}`);

const broken = getBrokenComponents();
console.log(`Broken components: ${broken.map(c => c.name).join(', ')}`);
```

### **Symbol Table Queries**
```javascript
function getSymbolsByType(type) {
    return window.WB_DISCOVERY_DATA.symbolTable
        .filter(([name, data]) => data.type === type)
        .map(([name, data]) => ({ name, ...data }));
}

// Usage
const customElements = getSymbolsByType('custom-element');
const classes = getSymbolsByType('class');
const functions = getSymbolsByType('function');

console.log(`Found ${customElements.length} web components`);
console.log(`Found ${classes.length} component classes`);
console.log(`Found ${functions.length} utility functions`);
```

## Web IDE Integration

### **Autocomplete Support**
```javascript
function getAutocompleteOptions(type) {
    const symbolTable = window.WB_DISCOVERY_DATA.symbolTable;
    
    return symbolTable
        .filter(([name, data]) => data.type === type)
        .map(([name, data]) => ({
            label: name,
            kind: type === 'custom-element' ? 'html-tag' : 'class',
            documentation: `${data.type} from ${data.component}`,
            insertText: type === 'custom-element' ? `<${name}></${name}>` : name
        }));
}

// Get web component autocomplete
const webComponentOptions = getAutocompleteOptions('custom-element');

// Get class autocomplete
const classOptions = getAutocompleteOptions('class');
```

### **Code Validation**
```javascript
function validateWebComponentUsage(htmlContent) {
    const errors = [];
    const webComponentTags = htmlContent.match(/<(wb-[^>\s\/]+)/g) || [];
    
    for (const tag of webComponentTags) {
        const componentName = tag.replace('<', '');
        
        if (!isComponentAvailable(componentName)) {
            errors.push({
                type: 'unknown-component',
                component: componentName,
                message: `Unknown web component: ${componentName}`
            });
        }
        
        const componentInfo = getComponentInfo(componentName);
        if (componentInfo && componentInfo.status === 'broken') {
            errors.push({
                type: 'broken-component',
                component: componentName,
                message: `Using broken component: ${componentName}`,
                issues: componentInfo.issues
            });
        }
    }
    
    return errors;
}
```

### **Documentation Generation**
```javascript
function generateComponentDocs() {
    const docs = {};
    
    window.WB_DISCOVERY_DATA.componentRegistry.forEach(component => {
        docs[component.name] = {
            name: component.name,
            type: component.type,
            status: component.status,
            customElement: component.customElement,
            issues: component.issues || [],
            symbols: window.WB_DISCOVERY_DATA.symbolTable
                .filter(([name, data]) => data.component === component.name)
                .map(([name, data]) => ({ name, type: data.type }))
        };
    });
    
    return docs;
}
```

## File Generation

### **Source Generation**
This file is generated by running the component discovery process:

```bash
# Generate fresh component data
node tools/component-discovery.js

# Copy results to component-data.js format
node -e "
const fs = require('fs');
const results = JSON.parse(fs.readFileSync('component-discovery-reports/discovery-results.json'));
const output = \`window.WB_DISCOVERY_DATA = \${JSON.stringify(results, null, 2)};\`;
fs.writeFileSync('tools/component-data.js', output);
"
```

### **Manual Updates**
When components change, this file should be regenerated:

```bash
# Full regeneration pipeline
npm run discover                    # Run component discovery
npm run build:component-data        # Generate component-data.js
npm run build:symbols              # Update all build artifacts
```

## Integration Points

### **Build Process Integration**
```json
{
  "scripts": {
    "build:component-data": "node scripts/generate-component-data.js",
    "build:symbols": "npm run build:component-data && node tools/build-symbols.js build",
    "prebuild": "npm run build:symbols"
  }
}
```

### **Web IDE Tools**
- **Component IDE** (`component-ide.html`): Uses this data for component browsing
- **Documentation Viewer**: Generates component documentation from data
- **Code Editor**: Provides autocomplete and validation
- **Debug Tools**: Component availability checking

### **Runtime Access**
```javascript
// Check if component data is loaded
if (window.WB_DISCOVERY_DATA) {
    console.log('Component discovery data available');
    console.log(window.WB_DISCOVERY_DATA.metadata);
} else {
    console.warn('Component discovery data not loaded');
}
```

## Performance Characteristics

### **Loading Performance**
- **File Size**: ~15KB for 23 components and 855+ symbols
- **Parse Time**: <1ms for JSON parsing
- **Memory Usage**: ~50KB in browser memory
- **Network Impact**: Single HTTP request, cacheable

### **Query Performance**
- **Symbol Lookup**: O(n) linear search through symbol array
- **Component Registry**: O(n) linear search through component array
- **Filtering**: Efficient with native array methods
- **Memory Efficient**: No complex data structures

## Browser Compatibility

### **JavaScript Features**
- **ES6 Features**: Uses modern JavaScript (arrow functions, array methods)
- **Browser Support**: Chrome 60+, Firefox 55+, Safari 10+, Edge 16+
- **Fallbacks**: Can be transpiled for older browsers if needed

### **Console Integration**
```javascript
// Automatic logging on load
console.log('🔍 WB Component Discovery Data loaded:', window.WB_DISCOVERY_DATA.metadata);

// Output shows:
// 🔍 WB Component Discovery Data loaded: {
//   totalComponents: 23,
//   webComponents: 14,
//   legacyComponents: 9,
//   brokenComponents: 4,
//   scanTime: "2025-10-13T..."
// }
```

## Maintenance

### **Update Frequency**
- **On Component Changes**: When new components are added or modified
- **Build Process**: Automatically updated during builds
- **Manual Updates**: Can be triggered manually when needed

### **Validation**
```javascript
// Validate data structure integrity
function validateComponentData() {
    const data = window.WB_DISCOVERY_DATA;
    
    if (!data) return false;
    if (!Array.isArray(data.symbolTable)) return false;
    if (!Array.isArray(data.componentRegistry)) return false;
    if (!data.metadata) return false;
    
    return true;
}
```

### **Version Control**
- **Git Tracking**: File is tracked in version control
- **Diff Friendly**: JSON structure shows clear changes
- **Build Artifacts**: Generated during build process
- **CI/CD Integration**: Automatic updates in deployment pipeline

---

**Status**: 🟢 **Production Ready**  
**Data Version**: Reflects 23 components, 855+ symbols  
**Browser Support**: Modern browsers (ES6+)  
**File Size**: ~15KB uncompressed  
**Update Method**: Generated from component discovery results
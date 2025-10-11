# WB Component Definition - Updated October 9, 2025

## 🏗️ **OFFICIAL WB COMPONENT ARCHITECTURE**

Based on analysis of 29+ existing components, the **WB Component Hybrid Architecture** is now the official standard.

## 📋 **WB COMPONENT REQUIREMENTS**

### 1. **Naming Convention** ✅ MANDATORY
- All components MUST use `wb-` prefix
- Examples: `wb-layout`, `wb-nav`, `wb-card`, `wb-button`
- Custom HTML tags: `<wb-component-name>`

### 2. **File Structure** ✅ MANDATORY
Each WB component folder must contain:
```
components/wb-component-name/
├── wb-component-name.js          # ES6 module component logic
├── wb-component-name.css         # CSS-First external styles
├── wb-component-name.md          # API documentation
├── wb-component-name-demo.html   # Two-tab demo (Documentation/Examples)
├── claude.md                     # Development log and current issues (REQUIRED)
└── wb-component-name.schema.json # (Optional) Data validation
```

### 3. **Architecture Standards** ✅ HYBRID APPROACH

#### **Shadow DOM Usage: OPTIONAL**
- **Current Reality**: Only 8 of 29+ components use Shadow DOM (27.7%)
- **Policy**: Use Shadow DOM ONLY when style encapsulation is critical
- **Default**: CSS-First Architecture without Shadow DOM

```javascript
class WBMyComponent extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM is OPTIONAL - use only for complex visual components
    if (this.requiresStyleEncapsulation()) {
      this.attachShadow({ mode: 'open' });
    }
  }
  
  requiresStyleEncapsulation() {
    // Override this method to determine Shadow DOM usage
    // Return true for: color pickers, complex visual widgets, isolated styling
    // Return false for: layout components, content components, simple UI
    return false; // Default: CSS-First approach
  }
  
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  
  render() {
    const content = this.getContent();
    
    if (this.shadowRoot) {
      // Shadow DOM components can include internal styles
      this.shadowRoot.innerHTML = `
        <style>
          :host { 
            display: block; 
            /* CSS variables pass through Shadow DOM */
          }
        </style>
        ${content}
      `;
    } else {
      // CSS-First: Use external stylesheets (RECOMMENDED)
      this.innerHTML = content;
    }
  }
  
  setupEventListeners() {
    // WB Components use event-driven architecture
    this.addEventListener('wb:update', this.handleUpdate.bind(this));
  }
}

customElements.define('wb-my-component', WBMyComponent);
```

### 4. **CSS-First Architecture** ✅ DEFAULT APPROACH
- **NO inline styles** in component HTML
- **External CSS files only** (wb-component-name.css)
- **CSS custom properties** for theming
- **Global CSS variables** accessible across components

### 5. **Event-Driven Communication** ✅ MANDATORY
- Components communicate via custom events (wb:event-name)
- No direct method calls between components
- Event bubbling for component hierarchy

### 6. **Documentation Requirements** ✅ MANDATORY
- **claude.md**: Development log with current issues and specifications
- **component-name.md**: API documentation and usage examples
- **Two-tab demo**: Documentation tab and Examples tab structure

## 🎯 **SHADOW DOM USAGE GUIDELINES**

### ✅ **USE Shadow DOM For:**
- **Complex visual components**: wb-color-picker, wb-color-bar
- **Style isolation needed**: Components with heavy CSS that might conflict
- **Reusable widgets**: Components distributed as libraries
- **Complex internal structure**: Components with many internal elements

### ❌ **AVOID Shadow DOM For:**
- **Layout components**: wb-layout, wb-nav, wb-header, wb-footer
- **Content components**: wb-card, wb-button, wb-input
- **Simple UI elements**: wb-toggle, wb-select, wb-status
- **Components needing easy CSS theming**: Most utility components

## 📊 **CURRENT COMPONENT STATUS**

### **Components Using Shadow DOM** (8 total):
- wb-tab (complex tab interface)
- wb-color-picker (style isolation)
- wb-color-bar (visual widget)  
- wb-color-bars (visual widget)
- ControlPanel (Working folder - should be consolidated)

### **Components Using CSS-First** (21+ total):
- wb-layout, wb-nav, wb-card, wb-button, wb-input, wb-select
- wb-table, wb-modal, wb-toggle, wb-status, wb-search, wb-footer
- wb-event-log, wb-log-error, wb-keyboard-manager, wb-theme-manager
- wb-change-text, wb-control-panel (and more...)

## 🚨 **MIGRATION REQUIREMENTS**

### **Immediate Actions Required:**

1. **✅ Remove Duplicates**: 
   - ~~Delete `components/color-bars/`~~ ✅ COMPLETED
   - ~~Remove `Working/components/ControlPanel.js`~~ ✅ COMPLETED

2. **📚 Missing claude.md Files** (12 components need claude.md):
   - wb-card, wb-change-text, wb-color-picker, wb-footer, wb-header
   - wb-hero, wb-keyboard-manager, wb-modal, wb-search, wb-theme

3. **📖 Update Component Documentation**:
   - Add hybrid Shadow DOM guidelines to existing component docs
   - Document Shadow DOM usage rationale for each component
   - Update demo files to follow two-tab structure

## 💡 **RECOMMENDATIONS**

### **For New Components:**
1. Start with CSS-First approach (no Shadow DOM)
2. Add Shadow DOM only if style conflicts occur
3. Follow wb- naming convention strictly
4. Include claude.md from component creation
5. Use event-driven architecture from the start

### **For Existing Components:**
1. **Do not force Shadow DOM** - current approach is working
2. **Standardize documentation** - ensure all have claude.md
3. **Clean up duplicates** - maintain single source of truth
4. **Document architecture decisions** - why Shadow DOM or CSS-First

## 🎉 **CONCLUSION**

The **WB Component Hybrid Architecture** acknowledges that:
- **Not all components need Shadow DOM** - it's a tool, not a requirement
- **CSS-First works well** for most WB components  
- **Flexibility is valuable** - use the right approach for each component
- **Consistency within component types** is more important than forcing uniformity

This approach **maintains the 21+ working components** while providing clear guidelines for when to use Shadow DOM in future development.

---

**Document Version**: 1.0  
**Last Updated**: October 9, 2025  
**Components Analyzed**: 29+  
**Architecture**: Hybrid (Shadow DOM Optional, CSS-First Default)
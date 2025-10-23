# WB Demo Component

## Overview
A reusable component for creating two-tab documentation and examples layouts following WB component standards.

## Features
- ✅ Two-tab structure (Documentation/Examples) 
- ✅ Built-in event logging system with one message per line enforcement
- ✅ Slotted content architecture
- ✅ Dark theme styling
- ✅ CSS-first architecture with external stylesheet
- ✅ Reusable across all WB components

## File Structure
```
components/wb-demo/
├── wb-demo.js              # Main component (ES6 class)
├── wb-demo.css             # External styles (CSS-first)
├── wb-demo-demo.html       # Two-tab demo
├── wb-demo.md              # Component documentation
└── claude.md               # Development log
```

## Usage Example

```html
<wb-demo markdown="wb-demo.md">
    <span slot="title">🧪 My Component Demo</span>
    <div slot="examples">
        <h2>Examples Content</h2>
        <p>Interactive examples go here...</p>
    </div>
</wb-demo>
```


**Documentation Loading Behavior:**

1. If the `doc-url` attribute is set, the documentation tab displays the referenced file as rendered HTML (highest priority).
2. If the `markdown` attribute is set and no documentation slot is present, the documentation tab displays the referenced markdown file as rendered HTML.
3. If a `<div slot="documentation">...</div>` is specified, its HTML markup is displayed in the documentation tab (as-is), and the markdown attribute is ignored. Use this slot to hard code documentation directly in the demo file.
4. If neither attribute is set, the component will automatically search for a `.md` file matching the folder name (e.g., `wb-demo.md`) and display it as documentation.

**Override:**
Users can always override the auto-detection by specifying either the `doc-url` or `markdown` attribute, or by providing a documentation slot.

## Standards Compliance
- ✅ **wb- prefix**: wb-demo
- ✅ **CSS-First**: External wb-demo.css file
- ✅ **ES6 modules**: No CommonJS
- ✅ **Two-tab demo**: wb-demo-demo.html
- ✅ **Shadow DOM**: Used appropriately for reusable UI component
- ✅ **Event logging**: Built-in logging system with one message per line enforcement
- ✅ **Composition**: Supports slotted content

## Event Logging Requirements
---
# 🎯 WB Demo Component

`<wb-demo>` is a standards-compliant web component for showcasing other WB components with live documentation and interactive examples. It supports markdown-driven documentation, event logging, and recursive demos.

---

## Nested Example

```html
<wb-demo markdown="wb-demo.md">
        <!-- Demo Title -->
        <span slot="title">🎯 WB Demo Component Demo</span>
 
        <!-- Documentation Content (rendered from .md file) -->
        <div slot="documentation"></div>
        
        <!-- Examples Content -->
        <div slot="examples">
            <h2>🎯 Interactive Examples</h2>
            <p>Demonstrations of the WB Demo component in action.</p>
            
            <!-- Nested Demo Example -->
            <div class="demo-example">
                <h3>Nested WB Demo Example</h3>
                <p>This shows how wb-demo can be used recursively for other components:</p>
                <wb-demo>
                    <span slot="title">Nested Demo Level 2</span>
                    <div slot="documentation">
                        <h4>Nested Documentation</h4>
                        <p>This is a hard coded documentation<code>&lt;wb-demo&gt;</code> component. You can nest as many levels as you want.</p>
                    </div>
                    <div slot="examples">
                        <h4>Nested Example Content</h4>
                        <p>Any content can go here, including more <code>&lt;wb-demo&gt;</code> components if desired.</p>
                    </div>
                </wb-demo>
            </div>
            
            <!-- Event Logging Example -->
            <div class="demo-example">
                <h3>Event Logging Test</h3>
                <p>Test the built-in event logging system:</p>
                

            </div>
            
            <!-- Integration Example -->
            <div class="demo-example">
                <h3>Integration with Other Components</h3>
                <p>wb-demo is designed to work with all WB components:</p>
                
                <div class="feature-grid">
                    <div class="feature-card">
                        <h4>wb-tab Integration</h4>
                        <p>Perfect for showcasing tab components with proper event logging.</p>
                    </div>
                    <div class="feature-card">
                        <h4>wb-layout Integration</h4>
                        <p>Ideal for demonstrating layout changes and responsive behavior.</p>
                    </div>
                    <div class="feature-card">
                        <h4>wb-card Integration</h4>
                        <p>Great for showing card variations and configurations.</p>
                    </div>
                    <div class="feature-card">
                        <h4>Universal Usage</h4>
                        <p>Works with any WB component following our standards.</p>
                    </div>
                </div>
            </div>
        </div>
    </wb-demo>
```

 
---

## Features

- **Markdown Documentation:** Use the `markdown` attribute to load documentation from a `.md` file.
- **Interactive Examples:** Place live examples in the `examples` slot.
- **Event Logging:** Built-in event log for demoing component events.
- **Recursive Demos:** You can nest `<wb-demo>` components for meta-demos.

---

## Example

```html
<wb-demo markdown="wb-demo.md">
    <span slot="title">🎯 WB Demo Component Demo</span>
    <div slot="documentation"></div>
    <div slot="examples">
        <h2>🎯 Interactive Examples</h2>
        <p>Demonstrations of the WB Demo component in action.</p>
        <!-- Nested Demo Example -->
        <div class="demo-example">
            <h3>Nested WB Demo Example</h3>
            <p>This shows how wb-demo can be used recursively for other components:</p>
            <wb-demo>
                <span slot="title">Nested Demo Level 2</span>
                <div slot="documentation">
                    <h4>Nested Documentation</h4>
                    <p>This is a hard coded documentation<code>&lt;wb-demo&gt;</code> component. You can nest as many levels as you want.</p>
                </div>
                <div slot="examples">
                    <h4>Nested Example Content</h4>
                    <p>Any content can go here, including more <code>&lt;wb-demo&gt;</code> components if desired.</p>
                </div>
            </wb-demo>
        </div>
        <!-- Event Logging Example -->
        <div class="demo-example">
            <h3>Event Logging Test</h3>
            <p>Test the built-in event logging system:</p>
        </div>
        <!-- Integration Example -->
        <div class="demo-example">
            <h3>Integration with Other Components</h3>
            <p>wb-demo is designed to work with all WB components:</p>
            <div class="feature-grid">
                <div class="feature-card">
                    <h4>wb-tab Integration</h4>
                    <p>Perfect for showcasing tab components with proper event logging.</p>
                </div>
                <div class="feature-card">
                    <h4>wb-layout Integration</h4>
                    <p>Ideal for demonstrating layout changes and responsive behavior.</p>
                </div>
                <div class="feature-card">
                    <h4>wb-card Integration</h4>
                    <p>Great for showing card variations and configurations.</p>
                </div>
                <div class="feature-card">
                    <h4>Universal Usage</h4>
                    <p>Works with any WB component following our standards.</p>
                </div>
            </div>
        </div>
    </div>
</wb-demo>
```

---

## API

| Slot           | Purpose                                  |
| -------------- | ---------------------------------------- |
| `title`        | Title for the demo                       |
| `documentation`| Documentation (ignored if `markdown` set)|
| `examples`     | Interactive examples                     |

| Attribute      | Purpose                                  |
| -------------- | ---------------------------------------- |
| `markdown`     | Path to markdown file for documentation  |

---

## Notes

- When `markdown` is set, the documentation tab will only show the contents of the referenced markdown file.
- Place all interactive examples in the `examples` slot.
- You can nest `<wb-demo>` components for meta-demos.
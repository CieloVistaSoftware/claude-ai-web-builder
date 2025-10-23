# Task #3 & #4: wb-nav Interactive Examples + wb-tab Configuration

**File**: `IMPLEMENTATION-TASKS-3-4.md`  
**Location**: `/docs/component-guides/`  
**Priority**: 🔴 CRITICAL | **Time**: 5-7 hours total | **Status**: ⏳ READY TO IMPLEMENT

---

## TASK #3: Fix wb-nav Interactive Examples (2-3 hours)

**Issue**: Navigation examples are static (not clickable)

### Solution: Add Interactive Examples

**File**: `/components/wb-nav/wb-nav-demo.html`

```html
<wb-tab variant="underline" active-tab="0">
    <wb-tab-item label="📚 Documentation">
        <!-- Load from wb-nav.md -->
    </wb-tab-item>
    
    <wb-tab-item label="🎮 Interactive Examples">
        <div class="example-section">
            <h3>Horizontal Navigation</h3>
            <wb-nav variant="horizontal">
                <wb-nav-item label="Home" href="#" active="true"></wb-nav-item>
                <wb-nav-item label="Products" href="#"></wb-nav-item>
                <wb-nav-item label="Services" href="#"></wb-nav-item>
                <wb-nav-item label="Contact" href="#"></wb-nav-item>
            </wb-nav>
            <div id="content-1" class="content-area">
                <h4>Home Content</h4>
                <p>Click items above to change content</p>
            </div>
        </div>
        
        <div class="example-section">
            <h3>Vertical Navigation</h3>
            <div class="vertical-nav">
                <wb-nav variant="vertical">
                    <wb-nav-item label="Dashboard" href="#" active="true"></wb-nav-item>
                    <wb-nav-item label="Profile" href="#"></wb-nav-item>
                    <wb-nav-item label="Settings" href="#"></wb-nav-item>
                </wb-nav>
                <div id="content-2" class="content-area">
                    <h4>Dashboard</h4>
                </div>
            </div>
        </div>
    </wb-tab-item>
</wb-tab>

<script>
// Make navigation interactive
document.querySelectorAll('wb-nav').forEach(nav => {
    nav.querySelectorAll('wb-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            nav.querySelectorAll('wb-nav-item').forEach(i => i.removeAttribute('active'));
            item.setAttribute('active', 'true');
            
            const label = item.getAttribute('label');
            const content = nav.nextElementSibling;
            if (content && content.classList.contains('content-area')) {
                content.innerHTML = `<h4>${label} Content</h4><p>Updated on click</p>`;
            }
            e.preventDefault();
        });
    });
});
</script>

<style>
.example-section { margin: 2rem 0; padding: 1.5rem; border: 1px solid var(--color-border); }
.vertical-nav { display: flex; gap: 2rem; min-height: 300px; }
.vertical-nav wb-nav { flex: 0 0 150px; }
.content-area { flex: 1; padding: 1rem; background: var(--color-background); }
</style>
```

### Acceptance Criteria ✅
- [ ] Navigation items clickable
- [ ] Active state changes on click
- [ ] Content area updates
- [ ] Multiple nav types shown (horizontal, vertical, breadcrumb)
- [ ] Works in light/dark mode
- [ ] Responsive

---

## TASK #4: Implement wb-tab Injectable Configuration (3-4 hours)

**Goal**: Add JSON-based tab configuration system

### Step 1: Create Config Schema

**File**: `/components/wb-tab/wb-tab.config.json`

```json
{
  "component": "wb-tab",
  "version": "1.0.0",
  "description": "Tabbed content with injectable configuration",
  "attributes": {
    "variant": { "values": ["underline", "pills", "bordered"], "default": "underline" },
    "active-tab": { "type": "number", "default": 0 },
    "config-url": { "description": "URL to JSON configuration" },
    "config-data": { "description": "Inline JSON configuration" }
  },
  "methods": {
    "setTabs(tabs)": "Set tabs from array",
    "getActiveTab()": "Get active index",
    "setActiveTab(index)": "Set active by index"
  },
  "events": {
    "wb:tab-changed": "Fired when active tab changes"
  }
}
```

### Step 2: Add Methods to wb-tab.js

```javascript
class WBTab extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._tabs = [];
        this._activeIndex = 0;
    }

    connectedCallback() {
        this.loadConfiguration();
        this.render();
        this.attachEventListeners();
    }

    async loadConfiguration() {
        // Check for inline config
        const configData = this.getAttribute('config-data');
        if (configData) {
            this.setTabs(JSON.parse(configData));
            return;
        }

        // Check for URL config
        const configUrl = this.getAttribute('config-url');
        if (configUrl) {
            const response = await fetch(configUrl);
            const config = await response.json();
            if (config.tabs) this.setTabs(config.tabs);
            return;
        }

        // Load from HTML children
        this.loadFromChildren();
    }

    setTabs(tabs) {
        this._tabs = tabs.map(tab => ({
            label: tab.label || 'Tab',
            content: tab.content || '',
            icon: tab.icon
        }));
        this.render();
    }

    getActiveTab() {
        return this._activeIndex;
    }

    setActiveTab(index) {
        if (index < 0 || index >= this._tabs.length) return;
        this._activeIndex = index;
        this.render();
        this.dispatchEvent(new CustomEvent('wb:tab-changed', {
            bubbles: true,
            detail: { index, label: this._tabs[index].label }
        }));
    }

    render() {
        const variant = this.getAttribute('variant') || 'underline';
        const activeIndex = parseInt(this.getAttribute('active-tab') || 0);
        this._activeIndex = activeIndex;

        const html = `
            <style>
                :host { display: block; }
                .tabs-header { display: flex; border-bottom: 2px solid var(--color-border); }
                .tab-button { padding: 0.75rem 1rem; border: none; background: transparent; 
                    color: var(--color-text-secondary); cursor: pointer; transition: all 0.3s; }
                .tab-button.active { color: var(--color-primary); border-bottom: 2px solid var(--color-primary); }
                .tab-panel { display: none; padding: 1rem; }
                .tab-panel.active { display: block; animation: fadeIn 0.3s; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            </style>
            
            <div class="tabs-header">
                ${this._tabs.map((tab, i) => `
                    <button class="tab-button ${i === activeIndex ? 'active' : ''}" 
                            data-index="${i}" role="tab">
                        ${tab.icon ? `<span>${tab.icon}</span> ` : ''}${tab.label}
                    </button>
                `).join('')}
            </div>
            
            <div class="tabs-content">
                ${this._tabs.map((tab, i) => `
                    <div class="tab-panel ${i === activeIndex ? 'active' : ''}" role="tabpanel">
                        ${tab.content}
                    </div>
                `).join('')}
            </div>
        `;

        this.shadowRoot.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.shadowRoot.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.tab-button').dataset.index);
                this.setActiveTab(index);
            });
        });
    }

    loadFromChildren() {
        const items = this.querySelectorAll('wb-tab-item');
        this._tabs = Array.from(items).map(item => ({
            label: item.getAttribute('label') || 'Tab',
            content: item.innerHTML,
            icon: item.getAttribute('icon')
        }));
        this.render();
    }
}

customElements.define('wb-tab', WBTab);
```

### Step 3: Create Example Config

**File**: `/components/wb-tab/tabs-config-example.json`

```json
{
  "tabs": [
    { "label": "📚 Documentation", "icon": "📖", "content": "<h3>Getting Started</h3><p>Tab loaded from JSON</p>" },
    { "label": "🎨 Variants", "icon": "🎨", "content": "<h3>Choose Variants</h3><p>underline, pills, bordered</p>" },
    { "label": "⚙️ API", "icon": "⚙️", "content": "<h3>API Reference</h3><p>setTabs, getActiveTab, setActiveTab</p>" }
  ]
}
```

### Step 4: Update Demo

**File**: `/components/wb-tab/wb-tab-demo.html`

```html
<!-- Example 1: HTML-defined tabs -->
<h3>Static Tabs (HTML)</h3>
<wb-tab variant="underline" active-tab="0">
    <wb-tab-item label="Tab 1">Content 1</wb-tab-item>
    <wb-tab-item label="Tab 2">Content 2</wb-tab-item>
</wb-tab>

<!-- Example 2: Inline JSON config -->
<h3>Inline JSON Config</h3>
<wb-tab variant="pills" config-data='{"tabs":[{"label":"A","content":"Content A"},{"label":"B","content":"Content B"}]}'></wb-tab>

<!-- Example 3: URL-based config -->
<h3>URL-based Config</h3>
<wb-tab variant="bordered" config-url="/components/wb-tab/tabs-config-example.json"></wb-tab>

<!-- Example 4: Programmatic -->
<h3>Programmatic Tabs</h3>
<wb-tab id="prog-tabs" variant="segmented"></wb-tab>
<script>
    document.getElementById('prog-tabs').setTabs([
        { label: '🔵 Blue', content: '<p style="color:blue">Blue content</p>' },
        { label: '🟢 Green', content: '<p style="color:green">Green content</p>' }
    ]);
</script>
```

### Acceptance Criteria ✅
- [ ] HTML-defined tabs work
- [ ] Inline JSON config works
- [ ] URL config loads
- [ ] Programmatic setTabs() works
- [ ] Tab switching fires events
- [ ] All variants supported
- [ ] Responsive design
- [ ] Dark/light mode

---

## 📝 Files to Create/Modify

**Create**:
- [ ] `/components/wb-tab/wb-tab.config.json`
- [ ] `/components/wb-tab/tabs-config-example.json`

**Modify**:
- [ ] `/components/wb-nav/wb-nav-demo.html` (add interactive examples)
- [ ] `/components/wb-nav/wb-nav.css` (add demo styles)
- [ ] `/components/wb-tab/wb-tab.js` (add config methods)
- [ ] `/components/wb-tab/wb-tab-demo.html` (add config examples)

---

## 🎯 Next Steps

1. Approve Architecture Decision (Task #2)
2. Implement Task #3 (wb-nav) 
3. Implement Task #4 (wb-tab)
4. Fix Testing Infrastructure (Task #1)

**Location**: `/docs/component-guides/IMPLEMENTATION-TASKS-3-4.md`

# WB Component States & Variants

All WB components should support a unified system of **variants**, **states**, and **sizes**.

## 🎨 Variants (Color-based)

Use these for semantic meaning:

| Variant | CSS Variable | Hex | Usage |
|---------|--------------|-----|-------|
| **primary** | `--primary-color` | `#6366f1` | Main actions, links, highlights |
| **secondary** | `--secondary-color` | `#64748b` | Alternative actions, less emphasis |
| **success** | `--success-color` | `#22c55e` | Positive outcomes, confirmations |
| **warning** | `--warning-color` | `#f59e0b` | Caution, requires attention |
| **danger** | `--danger-color` | `#ef4444` | Destructive actions, errors |
| **info** | `--info-color` | `#0ea5e9` | Informational, tips, hints |
| **muted** | `--muted-color` | `#94a3b8` | Subtle, de-emphasized content |

### Usage in HTML

```html
<!-- Using attribute -->
<wb-button variant="success">Save</wb-button>
<wb-button variant="danger">Delete</wb-button>
<wb-button variant="warning">Caution</wb-button>
<wb-button variant="info">Learn More</wb-button>

<!-- Using class -->
<div class="wb-success">Success message</div>
<div class="wb-warning">Warning message</div>
```

### Variant Styles

Each variant supports three visual styles:

| Style | Class | Description |
|-------|-------|-------------|
| **Filled** | `.wb-filled` | Solid background color |
| **Outlined** | `.wb-outlined` | Border only, transparent background |
| **Ghost** | `.wb-ghost` | Subtle background tint |

```html
<wb-button variant="success" class="wb-filled">Filled</wb-button>
<wb-button variant="success" class="wb-outlined">Outlined</wb-button>
<wb-button variant="success" class="wb-ghost">Ghost</wb-button>
```

---

## 🔄 Interactive States

| State | Attribute/Class | Description |
|-------|-----------------|-------------|
| **active** | `active` / `.active` | Currently selected/pressed |
| **disabled** | `disabled` / `.wb-disabled` | Non-interactive |
| **loading** | `loading` / `.wb-loading` | Processing (shows spinner) |
| **focused** | `:focus-visible` / `.wb-focused` | Keyboard focus |

```html
<wb-button disabled>Can't Click</wb-button>
<wb-button loading>Processing...</wb-button>
<wb-button active>Selected</wb-button>
```

---

## 📐 Sizes

| Size | Attribute/Class | Scale |
|------|-----------------|-------|
| **small** | `size="small"` / `.wb-small` | 0.75x |
| **medium** | `size="medium"` / `.wb-medium` | 1x (default) |
| **large** | `size="large"` / `.wb-large` | 1.25x |

```html
<wb-button size="small">Small</wb-button>
<wb-button size="medium">Medium</wb-button>
<wb-button size="large">Large</wb-button>
```

---

## 🔵 Status Dots

For inline status indicators:

```html
<span class="wb-status-dot wb-success"></span> Online
<span class="wb-status-dot wb-warning"></span> Busy
<span class="wb-status-dot wb-danger"></span> Offline
<span class="wb-status-dot wb-info wb-pulse"></span> Syncing
```

---

## 🏷️ Badges

```html
<span class="wb-badge wb-success">New</span>
<span class="wb-badge wb-warning">Beta</span>
<span class="wb-badge wb-danger">Hot</span>
<span class="wb-badge wb-info">v2.0</span>
```

---

## 📢 Alerts

```html
<div class="wb-alert wb-success">
    <span class="wb-alert-icon">✓</span>
    <div class="wb-alert-content">
        <div class="wb-alert-title">Success!</div>
        <div class="wb-alert-message">Your changes have been saved.</div>
    </div>
</div>

<div class="wb-alert wb-danger">
    <span class="wb-alert-icon">✕</span>
    <div class="wb-alert-content">
        <div class="wb-alert-title">Error</div>
        <div class="wb-alert-message">Something went wrong.</div>
    </div>
</div>
```

---

## 🎯 CSS Variables Reference

### Using in Custom Components

```css
/* Access variant colors via CSS variables */
.my-component.wb-success {
    background: var(--success-color);
    border-color: var(--success-color-dark);
}

/* Or use the generic variant system */
.my-component {
    background: var(--wb-variant-color);
    color: var(--wb-variant-text);
    border-color: var(--wb-variant-border);
}
```

### Full Variable List

```css
/* Primary */
--primary-color: #6366f1;
--primary-color-light: #818cf8;
--primary-color-dark: #4f46e5;

/* Success */
--success-color: #22c55e;
--success-color-light: #4ade80;
--success-color-dark: #16a34a;
--success-bg: rgba(34, 197, 94, 0.1);
--success-border: rgba(34, 197, 94, 0.3);

/* Warning */
--warning-color: #f59e0b;
--warning-color-light: #fbbf24;
--warning-color-dark: #d97706;
--warning-bg: rgba(245, 158, 11, 0.1);
--warning-border: rgba(245, 158, 11, 0.3);
--warning-text: #000000;

/* Danger/Error */
--danger-color: #ef4444;
--danger-color-light: #f87171;
--danger-color-dark: #dc2626;
--danger-bg: rgba(239, 68, 68, 0.1);
--danger-border: rgba(239, 68, 68, 0.3);

/* Info */
--info-color: #0ea5e9;
--info-color-light: #38bdf8;
--info-color-dark: #0284c7;
--info-bg: rgba(14, 165, 233, 0.1);
--info-border: rgba(14, 165, 233, 0.3);

/* Secondary */
--secondary-color: #64748b;
--secondary-color-light: #94a3b8;
--secondary-color-dark: #475569;

/* Muted */
--muted-color: #94a3b8;
--muted-color-light: #cbd5e1;
--muted-color-dark: #64748b;
```

---

## 🃏 Card Variants

wb-card supports both style and semantic variants:

### Style Variants
| Variant | Description |
|---------|-------------|
| `default` | Standard card with border |
| `elevated` | Higher shadow, no border |
| `outlined` | Border only, transparent bg |
| `filled` | Solid primary background |
| `glass` | Frosted glass effect |

### Semantic Variants (accent border)
| Variant | Color |
|---------|-------|
| `primary` | Indigo |
| `secondary` | Gray |
| `success` | Green |
| `warning` | Amber |
| `danger` | Red |
| `info` | Blue |

### Semantic Filled Variants (solid background)
| Variant | Color |
|---------|-------|
| `success-filled` | Green |
| `warning-filled` | Amber |
| `danger-filled` | Red |
| `info-filled` | Blue |

```html
<wb-card variant="success" title="Success!" body="Operation completed."></wb-card>
<wb-card variant="danger-filled" title="Error" body="Something went wrong."></wb-card>
```

---

## ✅ Component Checklist

Every WB component should support:

- [ ] **Variants**: primary, secondary, success, warning, danger, info
- [ ] **States**: active, disabled, loading (where applicable)
- [ ] **Sizes**: small, medium, large (where applicable)
- [ ] **Accessibility**: ARIA attributes, keyboard support

---

## 📁 Files

- `/styles/_variables.css` - CSS custom properties
- `/styles/_states.css` - State utility classes
- `/styles/main.css` - Imports all styles

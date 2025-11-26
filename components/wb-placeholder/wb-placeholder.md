# 🖼️ WB Placeholder Component

A reusable SVG placeholder image component with customizable dimensions, colors, and labels.

## Overview

The `<wb-placeholder>` component generates SVG placeholder images for:
- Prototyping and wireframing
- Demo pages and documentation
- Fallback images when content is loading
- Layout testing

## Quick Start

```html
<!-- Basic usage (400×200, indigo) -->
<wb-placeholder></wb-placeholder>

<!-- Custom size -->
<wb-placeholder width="600" height="300"></wb-placeholder>

<!-- Custom color and label -->
<wb-placeholder 
    width="300" 
    height="200" 
    color="#22c55e" 
    label="Product Image">
</wb-placeholder>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | Number | 400 | Width in pixels |
| `height` | Number | 200 | Height in pixels |
| `color` | String | #6366f1 | Background color (any CSS color) |
| `text-color` | String | #ffffff | Text color for label |
| `label` | String | "Placeholder Image" | Text displayed on the placeholder |

## Slots

| Slot | Description |
|------|-------------|
| `caption` | Optional figcaption below the image |

### Caption Example

```html
<wb-placeholder width="400" height="200" label="Hero Image">
    <figcaption slot="caption">Figure 1: Main product photo</figcaption>
</wb-placeholder>
```

## JavaScript API

### Properties

```javascript
const placeholder = document.querySelector('wb-placeholder');

// Get/set individual properties
placeholder.width = 500;
placeholder.height = 300;
placeholder.color = '#ef4444';
placeholder.textColor = '#000';
placeholder.label = 'Error State';
```

### Methods

```javascript
// Set multiple properties at once
placeholder.setOptions({
    width: 400,
    height: 200,
    color: '#22c55e',
    textColor: '#fff',
    label: 'Success'
});
```

## Color Presets

Common color values from the WB design system:

| Name | Hex | Usage |
|------|-----|-------|
| Primary | #6366f1 | Default, branding |
| Success | #22c55e | Positive states |
| Error | #ef4444 | Error states |
| Warning | #f59e0b | Warning states |
| Info | #0ea5e9 | Informational |
| Purple | #8b5cf6 | Accent |
| Pink | #ec4899 | Accent |

## Common Patterns

### Avatar Placeholder

```html
<wb-placeholder width="60" height="60" color="#6366f1" label="JD"></wb-placeholder>
```

### Card Image

```html
<div class="card">
    <wb-placeholder width="300" height="180" label="Product"></wb-placeholder>
    <h3>Product Title</h3>
    <p>Description text...</p>
</div>
```

### Hero Banner

```html
<wb-placeholder width="1200" height="400" color="#0ea5e9" label="Hero Banner">
    <figcaption slot="caption">Main page hero image</figcaption>
</wb-placeholder>
```

## Semantic HTML

The component uses proper semantic markup:

```html
<figure data-wb-semantic="true">
    <svg role="img" aria-label="...">...</svg>
    <figcaption data-wb-semantic="true">...</figcaption>
</figure>
```

## Accessibility

- SVG has `role="img"` attribute
- `aria-label` is set to the label text
- Proper figure/figcaption structure

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 67+ |
| Firefox | 63+ |
| Safari | 12.1+ |
| Edge | 79+ |

---

**Built for the WB Component Library**

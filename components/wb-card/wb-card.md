# WB Card Component

A versatile card component for displaying structured content with multiple layout options, variants, and interactive capabilities.

## Overview

The WB Card component provides a flexible container for organizing and presenting content in a visually appealing and accessible manner. It supports various layouts, visual styles, and interactive behaviors.

## Features

- **Multiple Variants**: Default, elevated, outlined, filled, and glass styles
- **Flexible Layouts**: Vertical, horizontal, and media positioning options
- **Responsive Design**: Adapts to different screen sizes
- **Interactive States**: Hover, active, loading, and disabled states
- **Accessibility**: Full keyboard navigation and screen reader support
- **Media Support**: Images and other media elements
- **Action Areas**: Support for buttons and interactive elements

## Usage

### Basic Card

```javascript
const card = WBCard.create({
  title: "Card Title",
  subtitle: "Optional subtitle",
  body: "Card content goes here",
  footer: "Optional footer content"
});
```

### Card with Media

```javascript
const card = WBCard.create({
  title: "Product Card",
  media: {
    src: "product-image.jpg",
    alt: "Product image"
  },
  body: "Product description",
  actions: [
    { text: "Buy Now", variant: "primary" },
    { text: "Learn More", variant: "secondary" }
  ]
}, {
  variant: "elevated",
  layout: "media-top",
  clickable: true
});
```

### Clickable Card

```javascript
const card = WBCard.create({
  title: "Interactive Card",
  body: "Click me to navigate"
}, {
  clickable: true,
  variant: "outlined"
});

// Listen for card clicks
card.addEventListener('wbCardClick', (e) => {
  console.log('Card clicked:', e.detail);
});
```

## Variants

### Default
Clean card with subtle border and background.

### Elevated
Card with shadow elevation for prominence.

### Outlined
Card with visible border and no background.

### Filled
Card with colored background.

### Glass
Glassmorphism effect with backdrop blur.

## Layouts

### Vertical (Default)
Standard top-to-bottom content flow.

### Horizontal
Side-by-side content arrangement.

### Media Top
Image/media at the top, content below.

### Media Left/Right
Media positioned to the left or right of content.

## Content Structure

```javascript
const content = {
  title: "Card Title",          // Main heading
  subtitle: "Subtitle",         // Secondary heading
  body: "Content text",         // Main content
  media: {                      // Optional media
    src: "image.jpg",
    alt: "Description",
    type: "image" // or "video"
  },
  actions: [                    // Optional action buttons
    { text: "Action", variant: "primary", onClick: handler }
  ],
  footer: "Footer content"      // Optional footer
};
```

## Configuration Options

```javascript
const options = {
  variant: "elevated",          // Visual style
  size: "standard",             // compact, standard, large
  layout: "vertical",           // Content arrangement
  clickable: false,             // Enable click interaction
  loading: false,               // Show loading state
  showHeader: true,             // Show/hide header
  showFooter: false,            // Show/hide footer
  showActions: true             // Show/hide action area
};
```

## Events

### wbCardReady
Fired when the card is initialized and ready.

```javascript
card.addEventListener('wbCardReady', (e) => {
  console.log('Card ready:', e.detail.card);
});
```

### wbCardClick
Fired when a clickable card is clicked.

```javascript
card.addEventListener('wbCardClick', (e) => {
  console.log('Card clicked:', e.detail);
});
```

### wbCardActionClick
Fired when an action button is clicked.

```javascript
card.addEventListener('wbCardActionClick', (e) => {
  console.log('Action clicked:', e.detail.action);
});
```

### wbCardMediaLoad
Fired when media content loads.

```javascript
card.addEventListener('wbCardMediaLoad', (e) => {
  console.log('Media loaded:', e.detail.media);
});
```

## Methods

### WBCard.create(content, options)
Creates a new card with specified content and options.

### WBCard.setContent(card, content)
Updates the content of an existing card.

### WBCard.setVariant(card, variant)
Changes the visual variant of a card.

### WBCard.setLayout(card, layout)
Changes the layout of a card.

### WBCard.setLoading(card, loading)
Sets the loading state of a card.

## Accessibility

- Semantic HTML structure with proper headings
- Keyboard navigation support
- Screen reader compatibility
- ARIA attributes for enhanced accessibility
- Focus management for interactive elements
- High contrast mode support

## Responsive Behavior

- **Mobile**: Vertical layout, compact size
- **Tablet**: Vertical layout, standard size
- **Desktop**: Configurable layout and size

## Integration with Control Panel

The WB Card component integrates with the control panel system:

- Reacts to color theme changes
- Responds to spacing adjustments
- Binds to CSS custom properties
- Dispatches interaction events
- Listens for global layout changes

## Best Practices

1. **Content Hierarchy**: Use proper heading levels and content structure
2. **Media Optimization**: Provide appropriate image sizes and alt text
3. **Consistent Spacing**: Use system spacing values for uniformity
4. **Loading States**: Show loading indicators for dynamic content
5. **Error Handling**: Gracefully handle missing or failed media
6. **Performance**: Lazy load images when possible
7. **Testing**: Test with keyboard navigation and screen readers

## Examples

See `wb-card-demo.html` for comprehensive examples and usage patterns.
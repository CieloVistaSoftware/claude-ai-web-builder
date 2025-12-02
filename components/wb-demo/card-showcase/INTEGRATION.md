# Integration Guide - Card Showcase

## Quick Start

### 1. Standalone Usage (Full Screen)
```html
<iframe src="card-showcase.html" width="100%" height="100%"></iframe>
```

### 2. In wb-demo Component
```html
<wb-demo 
  title="🃏 Card Component Showcase"
  demo-url="./card-showcase/card-showcase.html">
</wb-demo>
```

### 3. In HTML Page
```html
<!DOCTYPE html>
<html>
<head>
  <title>Card Showcase</title>
</head>
<body>
  <iframe 
    src="/path/to/card-showcase/card-showcase.html"
    style="width: 100%; height: 100vh; border: none;">
  </iframe>
</body>
</html>
```

## File Structure

```
wb-demo/
├── card-showcase/
│   ├── card-showcase.html     ← Main HTML file
│   ├── README.md              ← User documentation
│   └── claude.md              ← Development notes
├── wb-demo.js
├── wb-demo.css
└── ... (other demo files)
```

## Features Overview

### ✅ What's Included

1. **50 Card Examples** organized by:
   - Gradient Cards (5)
   - Image Cards (4) - top, left, right
   - Variants (4) - elevated, outlined, filled, glass
   - Sizes (3) - compact, standard, large
   - Use Cases (22) - features, testimonials, products, team, blog, services
   - Advanced (8) - dark theme, interactive, premium

2. **Full Navigation System**:
   - Gallery view with category grouping
   - Detail view for individual cards
   - Navigation stack with back button
   - Breadcrumb navigation
   - No external history API needed

3. **Theme Support**:
   - Light theme (default)
   - Dark theme with toggle
   - Persistent theme preference
   - All cards adapt automatically

4. **Responsive Design**:
   - Mobile-first approach
   - Adaptive grid layout
   - Touch-friendly interface
   - Optimized scrolling

5. **Accessibility**:
   - Semantic HTML
   - Keyboard navigation
   - Focus indicators
   - High contrast support
   - Reduced motion support

## Navigation System Explained

### How It Works

```
App State:
- navigationStack = [{ view: 'gallery', data: {} }]
- currentIndex = 0

User Action: Click Card 1
- Push { view: 'detail', data: card1 }
- currentIndex = 1
- Render detail view

User Action: Click Back
- Pop from stack
- currentIndex = 0
- Render gallery view

User Action: Click Breadcrumb Gallery
- Reset stack to initial
- currentIndex = 0
- Render gallery view
```

### Key Features

1. **No Browser History** - Works in iframes
2. **Full Control** - Application manages navigation
3. **Stackable** - Can be extended for more views
4. **Stateless** - Each view renders independently
5. **Performant** - Minimal DOM operations

## Card Customization

### Adding New Cards

Edit `card-showcase.html` and add to `cardData` array:

```javascript
{
  id: 51,  // New ID
  category: 'Your Category',
  title: 'Card Title',
  subtitle: 'Subtitle',
  body: 'Card description or content',
  variant: 'elevated',  // elevated, outlined, filled, glass
  size: 'standard',     // compact, standard, large
  layout: 'vertical',   // vertical, media-top, media-left, media-right, horizontal
  mediaSrc: 'https://example.com/image.jpg',  // optional
  style: 'background: ...',  // optional CSS
  clickable: true
}
```

### Modifying Styling

Update CSS custom properties in `<style>`:

```css
:root {
  --primary: #6366f1;        // Main accent color
  --bg-primary: #ffffff;     // Main background
  --text-primary: #1e293b;   // Main text color
  --border-color: #e2e8f0;   // Borders
  /* ... etc ... */
}

[data-theme="dark"] {
  --bg-primary: #0f172a;     // Dark background
  --text-primary: #f1f5f9;   // Light text
  /* ... etc ... */
}
```

## Component Integration

### Using WBCard in Detail View

The showcase uses `WBCard.create()` for dynamic card creation:

```javascript
const cardEl = WBCard.create(
  {
    title: card.title,
    subtitle: card.subtitle,
    body: card.body,
    mediaSrc: card.mediaSrc
  },
  {
    variant: card.variant || 'elevated',
    size: card.size || 'standard',
    layout: card.layout || 'vertical',
    clickable: true
  }
);

// Apply optional custom styles
if (card.style) {
  cardEl.style.cssText = card.style;
}

// Add click handler
cardEl.addEventListener('wbCardClick', () => {
  navigate('detail', card);
});

// Insert into DOM
container.appendChild(cardEl);
```

## Theming

### Light Theme (Default)
- Clean, professional appearance
- High readability
- Suitable for daytime use
- 100+ WCAG AA contrast

### Dark Theme
- Reduced eye strain
- Modern aesthetic
- Suitable for nighttime use
- Automatically inverted colors

### Switching Themes

Click the theme toggle button (🌙 Dark / ☀️ Light) in the header.

Preference is saved to localStorage and restored on page reload.

### CSS Variables for Theming

```css
/* Automatically updated with theme switch */
--primary: color used for accents
--bg-primary: main background
--bg-secondary: secondary background
--text-primary: main text color
--text-secondary: secondary text color
--border-color: element borders

/* Updated in [data-theme="dark"] selector */
```

## Responsive Breakpoints

| Breakpoint | Size | Layout |
|-----------|------|--------|
| Mobile | < 768px | Single column, stacked cards |
| Tablet | 768px - 1199px | 2 columns |
| Desktop | > 1200px | 3+ columns (auto-fill) |

### Mobile Optimizations
- Single column layout
- Larger touch targets
- Optimized spacing
- Hamburger-friendly navigation
- Stacking of horizontal cards

## Performance Tips

1. **Image Optimization**
   - Uses Unsplash images (external)
   - Consider CDN for production images
   - Use appropriate image sizes

2. **Rendering Performance**
   - Cards render on-demand
   - Smooth CSS transitions
   - Minimal layout thrashing
   - Efficient grid layout

3. **Memory Usage**
   - 50 cards in array (lightweight)
   - No external libraries
   - Clean event listeners
   - Proper garbage collection

## Browser Testing

### Desktop Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile Browsers
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+
- ✅ Samsung Internet 14+

### Features Tested
- Navigation stack
- Theme switching
- Responsive grid
- Image loading
- Touch interactions
- Keyboard navigation

## Troubleshooting

### Cards Not Appearing
1. Check WBCard component is imported
2. Verify card data structure
3. Check browser console for errors
4. Clear localStorage and refresh

### Navigation Not Working
1. Verify navStack initialization
2. Check event listener attachment
3. Ensure breadcrumb updates
4. Check back button state

### Images Not Loading
1. Verify image URLs are correct
2. Check CORS headers
3. Verify image exists at URL
4. Try different image source

### Theme Not Persisting
1. Check localStorage is enabled
2. Clear browser cache
3. Check [data-theme] attribute
4. Verify CSS custom properties

## Future Enhancements

### Phase 1 (Current) ✅
- 50 card examples
- Full navigation
- Theme support
- Responsive design

### Phase 2
- [ ] Search by title/category
- [ ] Filter by variant/size/layout
- [ ] Code snippet viewer
- [ ] Copy-to-clipboard

### Phase 3
- [ ] Live component editor
- [ ] Preset themes
- [ ] Export as HTML
- [ ] Component generator

### Phase 4
- [ ] Analytics
- [ ] Favorites/bookmarks
- [ ] Sharing
- [ ] Social features

## Support & Contribution

### Reporting Issues
1. Describe the issue
2. Include browser/OS
3. Provide screenshot if visual
4. List reproduction steps

### Contributing
1. Add new cards following pattern
2. Test in light/dark themes
3. Test on mobile
4. Update documentation

### Feedback
- Suggest new card types
- Recommend layout ideas
- Point out accessibility issues
- Propose performance improvements

## References

- [WBCard Component Docs](../wb-card/wb-card.md)
- [WB Framework Overview](../../README.md)
- [CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Shadow DOM Guide](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

## License

Part of the WB Component Library by Cielo Vista Software

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Maintained By:** John Morrison  
**Status:** Production Ready

# 🃏 WB Card Component - 50 Professional Card Examples

A comprehensive showcase of the WB Card component with 50 diverse card examples, full navigation system, theme support, and interactive features.

## Features

### Navigation & Browser-like Experience
- ✅ **Navigation Stack** - Full back/forward history tracking
- ✅ **Breadcrumb Navigation** - Visual navigation path
- ✅ **Gallery View** - Browse all 50 cards organized by category
- ✅ **Detail View** - Click any card to see full details and preview
- ✅ **Smooth Transitions** - Fade-in animations for content

### Card Variety (50 Examples)
- 5x **Gradient Cards** - Beautiful gradient backgrounds (Ocean, Sunset, Forest, Purple, Aurora)
- 4x **Image Top Cards** - Media positioned above content
- 3x **Image Left Cards** - Media positioned on the left
- 2x **Image Right Cards** - Media positioned on the right
- 4x **Variant Showcase** - Elevated, Outlined, Filled, Glass variants
- 3x **Size Variations** - Compact, Standard, Large
- 4x **Feature Cards** - Lightning Fast, Secure, Precise, Scalable
- 3x **Testimonial Cards** - Customer reviews and quotes
- 3x **Product/Pricing Cards** - Starter, Professional, Enterprise plans
- 3x **Team Member Cards** - Staff profiles with images
- 4x **Blog Post Cards** - Article previews
- 4x **Service Cards** - UI Design, Development, Analytics, Consulting
- 2x **Dark Theme Cards** - Theme optimization
- 2x **Interactive Cards** - Hover effects, responsive design
- 2x **Advanced Layouts** - Media left, horizontal layouts
- 2x **Premium Cards** - VIP and lifetime value offerings

### Theme Support
- 🌙 **Light/Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Mobile, tablet, and desktop layouts
- ♿ **Accessibility** - WCAG compliant with proper contrast

### Interaction Features
- 🖱️ **Clickable Cards** - Click any card to view details
- 📊 **Stats Display** - Card metadata in detail view
- 🎨 **Live Preview** - Real component preview in detail view
- 💾 **Local Storage** - Theme preference persists across sessions

## Usage

### Opening the Showcase
```html
<iframe src="path/to/card-showcase/card-showcase.html" 
        width="100%" 
        height="100vh"
        frameborder="0"></iframe>
```

### Or in wb-demo Component
```html
<wb-demo 
  title="Card Component Showcase"
  demo-url="./card-showcase/card-showcase.html"
  doc-url="./wb-card.md">
</wb-demo>
```

## Navigation System

### Architecture
```
NavigationStack:
  - Gallery (all cards organized by category)
    └─ Detail (individual card details)
```

### How It Works
1. **Gallery View** - Shows all 50 cards grouped by category
2. **Click Any Card** - Opens detail view with:
   - Full card information
   - Component properties (variant, size, layout)
   - Live preview of the card
   - Technical specifications
3. **Back Button** - Navigate back through history
4. **Breadcrumbs** - Quick navigation anchor

### Browser Behavior
- Full page can be the demo (no iframe needed)
- Cards fill entire viewport
- Scrollable content area with custom scrollbar
- Responsive grid layout

## Card Categories

| Category | Count | Description |
|----------|-------|-------------|
| Gradient Cards | 5 | Beautiful gradient backgrounds |
| Image Cards | 4 | Media at top position |
| Image Left Cards | 3 | Media on left side |
| Image Right Cards | 2 | Media on right side |
| Card Variants | 4 | Different visual styles |
| Card Sizes | 3 | Compact, standard, large |
| Feature Cards | 4 | Product features |
| Testimonial Cards | 3 | Customer quotes |
| Product Cards | 3 | Pricing tiers |
| Team Member Cards | 3 | Team profiles |
| Blog Post Cards | 4 | Article previews |
| Service Cards | 4 | Service offerings |
| Dark Theme Cards | 2 | Theme support |
| Interactive Cards | 2 | Interactive features |
| Advanced Layouts | 2 | Complex layouts |
| Premium Cards | 2 | Premium offerings |

## Key Features

### Full Screen Support
- Header always visible with navigation controls
- Content area scrolls independently
- Theme toggle and back button in header
- Breadcrumb shows current location

### Theme System
- Light theme (default) with clean, professional colors
- Dark theme with reduced eye strain
- Persistent theme preference (localStorage)
- All cards adapt to theme automatically

### Card Interactions
- **Hover Effects** - Smooth elevation and scale
- **Click Navigation** - Cards are clickable
- **Detail Preview** - Full card preview in detail view
- **Responsive Grid** - Adapts to screen size

### Responsive Breakpoints
- **Desktop (>1200px)** - Multi-column grid
- **Tablet (768px-1199px)** - 2-3 column grid
- **Mobile (<768px)** - Single column, optimized spacing

## CSS Architecture

### CSS Custom Properties
```css
--primary: #6366f1
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--info: #3b82f6

--bg-primary: #ffffff
--bg-secondary: #f8fafc
--bg-tertiary: #e2e8f0

--text-primary: #1e293b
--text-secondary: #64748b
--text-tertiary: #94a3b8
```

### Grid Layouts
- `.card-grid` - Default auto-fill with minmax(320px, 1fr)
- `.card-grid.dense` - Compact layout (280px)
- `.card-grid.wide` - Spacious layout (380px)

## Performance Optimizations
- Lazy-loaded card components
- Efficient rendering with fade-in animations
- Minimal reflows during navigation
- Optimized scrollbar styling
- CSS transitions over animations where possible

## Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ✅ IE11 (with polyfills)

## Accessibility Features
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- High contrast mode support
- Focus indicators on interactive elements
- Reduced motion support

## File Structure
```
card-showcase/
├── card-showcase.html       # Main showcase file
└── README.md               # This file
```

## Integration with WB Framework

This component works seamlessly with:
- `wb-card` - Card component
- `wb-button` - Action buttons
- `wb-theme` - Theme management
- `wb-demo` - Demo container

## Future Enhancements

Potential additions:
- [ ] Search functionality
- [ ] Filter by category
- [ ] Filter by variant/size/layout
- [ ] Code snippet copy
- [ ] Component generator
- [ ] Customization preview
- [ ] Export to HTML/React

## Author
Cielo Vista Software - WB Component Library

## Version
1.0.0 - Complete 50-card showcase with full navigation

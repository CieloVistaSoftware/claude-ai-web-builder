# WB Header Component Design

## Overview

The WB Header component is a comprehensive, customizable header solution for the Website Builder system. It combines branding, navigation, search functionality, and user actions into a cohesive, responsive header that adapts to different screen sizes and layouts.

## Component Architecture

### Structure
```html
<wb-header>
  <div class="wb-header-container">
    <!-- Brand Section -->
    <div class="wb-header-brand">
      <img class="wb-header-logo" />
      <span class="wb-header-title"></span>
      <span class="wb-header-tagline"></span>
    </div>
    
    <!-- Navigation Section -->
    <wb-nav class="wb-header-nav"></wb-nav>
    
    <!-- Search Section -->
    <div class="wb-header-search">
      <input class="wb-header-search-input" />
      <button class="wb-header-search-button"></button>
    </div>
    
    <!-- Actions Section -->
    <div class="wb-header-actions">
      <button class="wb-header-action"></button>
      <!-- User menu, notifications, etc. -->
    </div>
    
    <!-- Mobile Toggle -->
    <button class="wb-header-mobile-toggle"></button>
  </div>
</wb-header>
```

## Design Patterns

### 1. **Classic Header**
- Logo on left
- Horizontal navigation center
- Actions on right
- Search integrated or expandable

### 2. **Split Header**
- Top bar: Logo, search, user actions
- Bottom bar: Navigation menu
- Common in e-commerce sites

### 3. **Sidebar Header**
- Minimal top bar with logo and toggle
- Navigation in collapsible sidebar
- Good for content-heavy sites

### 4. **Mega Menu Header**
- Standard header layout
- Dropdown menus with multi-column content
- Rich content areas with images/links

### 5. **Sticky Header**
- Remains fixed on scroll
- Can shrink/minimize on scroll
- Maintains essential navigation

## Features

### Core Features
- **Responsive Design**: Adapts from desktop to mobile seamlessly
- **Theme Integration**: Supports dark/light modes
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels
- **Performance**: Lazy loading, minimal reflows
- **Customizable**: Extensive styling options via CSS variables

### Advanced Features
- **Smart Sticky**: Hides on scroll down, shows on scroll up
- **Search Integration**: Inline, modal, or expandable search
- **Multi-level Navigation**: Dropdown and mega menu support
- **User Account**: Profile, notifications, settings access
- **Breadcrumbs**: Optional breadcrumb navigation
- **Announcements**: Banner/alert area for important messages

## Configuration Options

### Layout Options
```javascript
{
  layout: 'classic' | 'split' | 'centered' | 'sidebar',
  position: 'fixed' | 'sticky' | 'relative',
  height: 'compact' | 'normal' | 'tall',
  width: 'full' | 'contained' | 'fluid'
}
```

### Brand Options
```javascript
{
  logo: {
    src: 'path/to/logo.svg',
    alt: 'Company Logo',
    height: 40,
    link: '/'
  },
  title: {
    text: 'Company Name',
    show: true,
    size: 'medium'
  },
  tagline: {
    text: 'Your tagline here',
    show: false
  }
}
```

### Navigation Options
```javascript
{
  nav: {
    position: 'center' | 'left' | 'right',
    style: 'default' | 'pills' | 'minimal',
    items: [...], // Navigation items array
    showOnMobile: true
  }
}
```

### Search Options
```javascript
{
  search: {
    show: true,
    placeholder: 'Search...',
    position: 'right' | 'center',
    style: 'inline' | 'expandable' | 'modal',
    action: '/search',
    suggestions: true
  }
}
```

### Actions Options
```javascript
{
  actions: [
    {
      type: 'button',
      icon: 'user',
      label: 'Account',
      dropdown: true
    },
    {
      type: 'notification',
      icon: 'bell',
      badge: true,
      count: 3
    }
  ]
}
```

## Responsive Behavior

### Desktop (> 1024px)
- Full header with all sections visible
- Horizontal navigation
- Inline search
- All actions visible

### Tablet (768px - 1024px)
- Compact header
- Navigation may collapse to dropdown
- Search becomes expandable
- Some actions in dropdown

### Mobile (< 768px)
- Logo and hamburger menu only
- Full-screen mobile menu
- Search in mobile menu
- Actions in mobile menu

## Styling

### CSS Variables
```css
:root {
  /* Dimensions */
  --wb-header-height: 64px;
  --wb-header-mobile-height: 56px;
  --wb-header-padding: 1rem;
  
  /* Colors */
  --wb-header-bg: var(--bg-primary);
  --wb-header-text: var(--text-primary);
  --wb-header-border: var(--border-color);
  --wb-header-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  /* Typography */
  --wb-header-font-size: 1rem;
  --wb-header-logo-size: 2rem;
  
  /* Transitions */
  --wb-header-transition: all 0.3s ease;
}
```

### Theme Variants

#### Transparent Header
```css
.wb-header--transparent {
  background: transparent;
  position: absolute;
  color: white;
}
```

#### Gradient Header
```css
.wb-header--gradient {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
}
```

#### Minimal Header
```css
.wb-header--minimal {
  border-bottom: 1px solid var(--border-color);
  box-shadow: none;
}
```

## Accessibility

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close dropdowns
- Arrow keys for menu navigation

### Screen Reader Support
- Proper heading hierarchy
- Descriptive labels
- Live regions for dynamic content
- Skip navigation links

### ARIA Implementation
```html
<header role="banner">
  <nav role="navigation" aria-label="Main">
  <button aria-expanded="false" aria-controls="mobile-menu">
  <div role="search">
  <button aria-label="User account" aria-haspopup="true">
```

## Integration Examples

### Basic Header
```html
<wb-header 
  logo-src="/logo.svg"
  title="My Website"
  layout="classic">
</wb-header>
```

### Advanced Header
```javascript
const header = document.createElement('wb-header');
header.setConfig({
  layout: 'split',
  brand: {
    logo: { src: '/logo.svg', height: 40 },
    title: { text: 'Company', show: true }
  },
  nav: {
    items: [
      { text: 'Products', href: '/products' },
      { text: 'Services', href: '/services' },
      { text: 'About', href: '/about' }
    ]
  },
  search: {
    show: true,
    style: 'expandable'
  },
  actions: [
    { type: 'notification', badge: true },
    { type: 'user', dropdown: true }
  ]
});
```

## Performance Considerations

### Optimization Strategies
- Lazy load dropdown content
- Use CSS containment for layout stability
- Minimize JavaScript for basic functionality
- Implement virtual scrolling for mega menus
- Cache rendered components

### Loading Strategy
```javascript
// Progressive enhancement
1. Load critical CSS inline
2. Display basic header structure
3. Load JavaScript asynchronously
4. Enhance with interactive features
5. Load non-critical assets
```

## Mobile Considerations

### Touch Interactions
- Large touch targets (44x44px minimum)
- Swipe gestures for menu
- Tap outside to close
- Smooth animations

### Mobile Menu Design
```
┌─────────────────────────┐
│ Logo           ≡ Close  │
├─────────────────────────┤
│ 🔍 Search              │
├─────────────────────────┤
│ Home                    │
│ Products               >│
│ Services               >│
│ About                   │
│ Contact                 │
├─────────────────────────┤
│ 👤 My Account          │
│ 🔔 Notifications (3)    │
│ ⚙️ Settings            │
└─────────────────────────┘
```

## Best Practices

### Do's
- Keep header height consistent
- Limit top-level navigation items
- Provide clear visual hierarchy
- Ensure contrast ratios meet WCAG
- Test on various devices and screen sizes
- Use semantic HTML structure
- Implement proper focus management

### Don'ts
- Don't overload with too many items
- Avoid auto-playing content
- Don't hide essential navigation
- Avoid tiny touch targets
- Don't break expected patterns
- Don't forget loading states
- Avoid layout shifts

## Future Enhancements

### Planned Features
1. **AI-Powered Search**: Intelligent search suggestions
2. **Personalization**: User-specific navigation
3. **Voice Navigation**: Voice command support
4. **Progressive Disclosure**: Smart menu items based on user behavior
5. **Multi-language**: RTL support and language switcher
6. **A/B Testing**: Built-in header variant testing
7. **Analytics Integration**: Track user interactions

### Experimental Features
- Gesture-based navigation
- Predictive menu loading
- Context-aware actions
- Adaptive layouts based on usage
- Blockchain-based authentication

## Component API

### Properties
```typescript
interface WBHeaderProps {
  layout?: 'classic' | 'split' | 'centered' | 'sidebar';
  sticky?: boolean;
  transparent?: boolean;
  height?: 'compact' | 'normal' | 'tall';
  brand?: BrandConfig;
  nav?: NavConfig;
  search?: SearchConfig;
  actions?: ActionConfig[];
  theme?: 'light' | 'dark' | 'auto';
}
```

### Methods
```typescript
class WBHeader extends HTMLElement {
  setConfig(config: WBHeaderProps): void;
  showSearch(): void;
  hideSearch(): void;
  openMobileMenu(): void;
  closeMobileMenu(): void;
  setSticky(sticky: boolean): void;
  updateActions(actions: ActionConfig[]): void;
}
```

### Events
```typescript
// Dispatched events
'wb-header:search' // Search submitted
'wb-header:menu-open' // Mobile menu opened
'wb-header:menu-close' // Mobile menu closed
'wb-header:action-click' // Action button clicked
'wb-header:logo-click' // Logo clicked
```

## Conclusion

The WB Header component provides a flexible, accessible, and performant header solution that can adapt to various design needs while maintaining consistency with the Website Builder system. Its modular architecture allows for easy customization and extension while providing sensible defaults for common use cases.
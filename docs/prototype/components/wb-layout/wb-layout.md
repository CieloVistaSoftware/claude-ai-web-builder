# WB Layout Component

A web component that manages website layout configurations and coordinates with the wb-nav component for different navigation styles.

## Features

- **Multiple Layout Types**: Support for top-nav, left-nav, right-nav, and ad-layout
- **Dynamic Layout Switching**: Change layouts programmatically or via UI control
- **CSS Custom Properties**: Uses CSS variables for responsive layout management
- **Navigation Integration**: Coordinates with wb-nav component for layout-specific navigation
- **Responsive Design**: Automatically adapts sidebar layouts to top navigation on mobile
- **Event-Driven**: Dispatches events for layout changes and integrates with other wb- components

## Supported Layouts

### Top Navigation (`top-nav`)
- Horizontal navigation bar at page top
- Default layout with standard header positioning
- Best for traditional website layouts

### Left Sidebar (`left-nav`)
- Fixed vertical sidebar on the left side
- 200px width with full height navigation
- Ideal for dashboard-style layouts

### Right Sidebar (`right-nav`)
- Fixed vertical sidebar on the right side  
- 200px width with full height navigation
- Alternative sidebar positioning

### Ad Layout (`ad-layout`)
- Advertisement-optimized layout
- Enhanced navigation with branding and CTA support
- Taller header (80px) for promotional content

## Usage

### Basic Usage

```html
<!-- Top Navigation Layout -->
<wb-layout layout="top-nav">
  <wb-nav type="horizontal" position="top">
    <div slot="brand">My Website</div>
    <div slot="nav-items">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </div>
  </wb-nav>
  <main>
    <!-- Main content -->
  </main>
</wb-layout>

<!-- Left Sidebar Layout -->
<wb-layout layout="left-nav">
  <wb-nav type="vertical" position="left" width="200px">
    <div slot="brand">Dashboard</div>
    <div slot="nav-items">
      <a href="#">🏠 Home</a>
      <a href="#">👤 Profile</a>
      <a href="#">⚙️ Settings</a>
    </div>
  </wb-nav>
  <main>
    <!-- Main content -->
  </main>
</wb-layout>

<!-- Right Sidebar Layout -->
<wb-layout layout="right-nav">
  <main>
    <!-- Main content -->
  </main>
  <wb-nav type="vertical" position="right" width="200px">
    <div slot="brand">Related</div>
    <div slot="nav-items">
      <a href="#">📖 Articles</a>
      <a href="#">🏷️ Tags</a>
      <a href="#">💬 Comments</a>
    </div>
  </wb-nav>
</wb-layout>

<!-- Advertisement Layout -->
<wb-layout layout="ad-layout">
  <wb-nav type="enhanced" branding="true" cta="true">
    <div slot="brand">Premium Site</div>
    <div slot="nav-items">
      <a href="#">Home</a>
      <a href="#">Products</a>
      <a href="#">Services</a>
    </div>
    <div slot="cta">
      <button>Get Started</button>
    </div>
  </wb-nav>
  <main>
    <!-- Main content -->
  </main>
  <aside>
    <!-- Advertisement space -->
  </aside>
</wb-layout>
```

### Concise Usage (Attribute-Based)

For simpler navigation needs, you can use attributes instead of slots:

```html
<!-- Top Navigation - Concise -->
<wb-layout layout="top-nav">
  <wb-nav 
    layout="top-nav" 
    brand-text="My Website"
    items='[
      {"text": "Home", "href": "#home"},
      {"text": "About", "href": "#about"},
      {"text": "Contact", "href": "#contact"}
    ]'>
  </wb-nav>
  <main>Content</main>
</wb-layout>

<!-- Left Sidebar - Concise -->
<wb-layout layout="left-nav">
  <wb-nav 
    layout="left-nav" 
    brand-text="Dashboard"
    items='[
      {"text": "🏠 Home", "href": "#home"},
      {"text": "👤 Profile", "href": "#profile"},
      {"text": "⚙️ Settings", "href": "#settings"}
    ]'>
  </wb-nav>
  <main>Content</main>
</wb-layout>

<!-- Right Sidebar - Concise -->
<wb-layout layout="right-nav">
  <main>Content</main>
  <wb-nav 
    layout="right-nav" 
    brand-text="Related"
    items='[
      {"text": "📖 Articles", "href": "#articles"},
      {"text": "🏷️ Tags", "href": "#tags"}
    ]'>
  </wb-nav>
</wb-layout>
```

### JSON Format Options

**Multi-line JSON (recommended for readability):**
```html
<wb-nav items='[
  {"text": "Home", "href": "#home"},
  {"text": "About", "href": "#about"},
  {"text": "Contact", "href": "#contact"}
]'>
```

**Single-line JSON (compact):**
```html
<wb-nav items='[{"text":"Home","href":"#"},{"text":"About","href":"#"}]'>
```

**JSON Formatting Tips:**
- Use proper spacing: `"text": "Home"` instead of `"text":"Home"`
- Multi-line format is more readable for multiple items
- Single-line works fine for 1-2 simple items
- Always validate JSON syntax to avoid parsing errors
- Use proper href values instead of just `#`

### Programmatic Control

```javascript
// Change layout programmatically
const layoutComponent = document.querySelector('wb-layout');
layoutComponent.setLayout('left-nav');

// Get current layout info
const layoutInfo = layoutComponent.getLayout();
console.log(layoutInfo.current); // 'left-nav'

// Get available layouts
const layouts = layoutComponent.getAvailableLayouts();
```

### Global API

```javascript
// Global API for easy access
WBLayout.setLayout('right-nav');
const current = WBLayout.getLayout();
const available = WBLayout.getAvailableLayouts();
```

## Attributes

### wb-layout Attributes
- `layout`: Initial layout type (`top-nav`, `left-nav`, `right-nav`, `ad-layout`)
- `auto-apply`: Whether to automatically apply layout styles (default: true)
- `show-control`: Show the layout selection dropdown

### wb-nav Attributes (Used within wb-layout)
- `type`: Navigation type (`horizontal`, `vertical`, `enhanced`)
- `position`: Navigation position (`top`, `left`, `right`)
- `width`: Width for vertical navigations (e.g., `200px`)
- `branding`: Enable branding section (for enhanced type)
- `cta`: Enable call-to-action section (for enhanced type)

### wb-nav Slots
- `brand`: Brand/logo area
- `nav-items`: Navigation links and menu items
- `cta`: Call-to-action content (enhanced navigation)
- `extra`: Additional content area (right sidebar navigation)

## Events

### Dispatched Events

- `wb-layout-ready`: Component is initialized and ready
- `wb-layout-changed`: Layout has been changed (bubbles)

### Listened Events

- `wb-layout-change`: External request to change layout

## CSS Custom Properties

The component sets these CSS variables for responsive layout management:

```css
:root {
  --nav-width: /* Navigation width */
  --nav-height: /* Navigation height */
  --content-margin-left: /* Left content margin */
  --content-margin-top: /* Top content margin */
  --content-margin-right: /* Right content margin */
}
```

## Integration with wb-nav

The wb-layout component works with wb-nav components using specific configurations for each layout type:

### Top Navigation Configuration

**Verbose (Slot-based):**
```html
<wb-layout layout="top-nav">
  <wb-nav type="horizontal" position="top">
    <div slot="brand">Brand Name</div>
    <div slot="nav-items">
      <a href="#">Link 1</a>
      <a href="#">Link 2</a>
    </div>
  </wb-nav>
  <main>Content</main>
</wb-layout>
```

**Concise (Attribute-based):**
```html
<wb-layout layout="top-nav">
  <wb-nav layout="top-nav" brand-text="Brand" 
          items='[
            {"text": "Link 1", "href": "#link1"},
            {"text": "Link 2", "href": "#link2"}
          ]'>
  </wb-nav>
  <main>Content</main>
</wb-layout>
```

### Left Sidebar Configuration

**Verbose (Slot-based):**
```html
<wb-layout layout="left-nav">
  <wb-nav type="vertical" position="left" width="200px">
    <div slot="brand">Menu</div>
    <div slot="nav-items">
      <a href="#">Dashboard</a>
      <a href="#">Profile</a>
      <a href="#">Settings</a>
    </div>
  </wb-nav>
  <main>Content</main>
</wb-layout>
```

**Concise (Attribute-based):**
```html
<wb-layout layout="left-nav">
  <wb-nav layout="left-nav" brand-text="Menu"
          items='[
            {"text": "Dashboard", "href": "#dashboard"},
            {"text": "Profile", "href": "#profile"},
            {"text": "Settings", "href": "#settings"}
          ]'>
  </wb-nav>
  <main>Content</main>
</wb-layout>
```

### Right Sidebar Configuration
```html
<wb-layout layout="right-nav">
  <main>Content</main>
  <wb-nav type="vertical" position="right" width="200px">
    <div slot="brand">Related</div>
    <div slot="nav-items">
      <a href="#">Similar</a>
      <a href="#">Popular</a>
    </div>
    <div slot="extra">
      <!-- Additional content like ads -->
    </div>
  </wb-nav>
</wb-layout>
```

### Enhanced Ad Layout Configuration
```html
<wb-layout layout="ad-layout">
  <wb-nav type="enhanced" branding="true" cta="true">
    <div slot="brand">Premium Brand</div>
    <div slot="nav-items">
      <a href="#">Home</a>
      <a href="#">Products</a>
      <a href="#">Services</a>
    </div>
    <div slot="cta">
      <button>Call to Action</button>
    </div>
  </wb-nav>
  <main>Content</main>
  <aside>Advertisement Space</aside>
</wb-layout>
```

### Navigation Integration Features
- Automatic configuration of wb-nav based on layout type
- CSS custom properties coordination
- Layout change event dispatching
- Responsive behavior synchronization

### Usage Recommendations

**Use Attribute-based (Concise) when:**
- Simple navigation with text links only
- Rapid prototyping or simple sites
- JSON-based configuration preferred
- Minimal HTML structure desired

**JSON Formatting Tips:**
- Use proper JSON formatting with spaces after colons
- Multi-line JSON is more readable for complex navigation
- Single-line JSON works for simple cases: `items='[{"text":"Home","href":"#"}]'`
- Validate JSON syntax to avoid parsing errors

**Use Slot-based (Verbose) when:**
- Complex navigation with custom HTML
- Icons, buttons, or rich content needed
- Maximum flexibility and customization required
- Complex dropdown menus or special styling

## CSS Classes Applied

The component applies these classes to the body element:

- `.layout-top-nav`: Top navigation layout
- `.layout-left-nav`: Left sidebar layout  
- `.layout-right-nav`: Right sidebar layout
- `.layout-ad-layout`: Advertisement layout

## Responsive Behavior

On mobile devices (max-width: 768px):
- Sidebar layouts automatically convert to top navigation
- Navigation positioning adjusts for mobile UX
- Content margins reset for mobile optimization

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>WB Layout with Navigation</title>
  <link rel="stylesheet" href="components/wb-layout/wb-layout.css">
  <link rel="stylesheet" href="components/wb-nav/wb-nav.css">
</head>
<body>
  <!-- Complete layout with embedded navigation (concise version) -->
  <wb-layout layout="top-nav" show-control>
    <wb-nav layout="top-nav" 
            brand-text="🏠 My Website"
            items='[
              {"text": "Home", "href": "#home"},
              {"text": "About", "href": "#about"},
              {"text": "Services", "href": "#services"},
              {"text": "Contact", "href": "#contact"}
            ]'>
    </wb-nav>
    
    <main>
      <h1>Welcome to My Website</h1>
      <p>This content is automatically positioned based on the layout configuration.</p>
    </main>
    
    <footer>
      <p>&copy; 2025 My Website. All rights reserved.</p>
    </footer>
  </wb-layout>
  
  <script src="components/wb-layout/wb-layout.js"></script>
  <script src="components/wb-nav/wb-nav.js"></script>
  
  <script>
    // Listen for layout changes
    document.addEventListener('wb-layout-changed', (e) => {
      console.log('Layout changed to:', e.detail.layout);
    });
    
    // Programmatically switch layouts
    setTimeout(() => {
      document.querySelector('wb-layout').setLayout('left-nav');
    }, 5000);
  </script>
</body>
</html>
```

## Layout-Specific Examples

### Dashboard Layout (Left Navigation)
```html
<wb-layout layout="left-nav">
  <wb-nav type="vertical" position="left" width="200px">
    <div slot="brand">📊 Dashboard</div>
    <div slot="nav-items">
      <a href="#overview">📈 Overview</a>
      <a href="#analytics">📊 Analytics</a>
      <a href="#reports">📋 Reports</a>
      <a href="#settings">⚙️ Settings</a>
    </div>
  </wb-nav>
  <main>
    <h1>Dashboard Overview</h1>
    <!-- Dashboard content -->
  </main>
</wb-layout>
```

### Blog Layout (Right Sidebar)
```html
<wb-layout layout="right-nav">
  <main>
    <article>
      <h1>Blog Post Title</h1>
      <p>Blog post content goes here...</p>
    </article>
  </main>
  <wb-nav type="vertical" position="right" width="200px">
    <div slot="brand">📚 Related</div>
    <div slot="nav-items">
      <a href="#">📖 Similar Posts</a>
      <a href="#">🏷️ Tags</a>
      <a href="#">💬 Comments</a>
    </div>
    <div slot="extra">
      <div style="padding: 1rem; background: #f0f0f0;">
        Advertisement Space
      </div>
    </div>
  </wb-nav>
</wb-layout>
```

### E-commerce Layout (Enhanced Navigation)
```html
<wb-layout layout="ad-layout">
  <wb-nav type="enhanced" branding="true" cta="true">
    <div slot="brand">
      <strong>🛒 Shop Now</strong>
    </div>
    <div slot="nav-items">
      <a href="#">Products</a>
      <a href="#">Categories</a>
      <a href="#">Deals</a>
      <a href="#">Support</a>
    </div>
    <div slot="cta">
      <button style="background: #28a745; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px;">
        🛍️ Shop Now
      </button>
    </div>
  </wb-nav>
  <main>
    <h1>Featured Products</h1>
    <!-- Product listings -->
  </main>
  <aside>
    <div style="padding: 1rem;">
      <h3>🎯 Special Offers</h3>
      <!-- Advertisement content -->
    </div>
  </aside>
</wb-layout>
```

## Development Notes

- Component uses CSS Grid and Flexbox for layout management
- Smooth transitions between layout changes
- Automatic cleanup of old layout classes
- Event-driven architecture for component coordination
- Mobile-first responsive design approach

## Browser Support

- Modern browsers with Custom Elements support
- CSS Custom Properties support required
- ES6 class syntax

## Dependencies

- **wb-nav component**: Required for navigation functionality
  - Must be included within wb-layout structure
  - Configured automatically based on layout type
  - Supports all navigation types: horizontal, vertical, enhanced
- **CSS Custom Properties**: For responsive layout management
- **Custom Elements API**: For web component functionality
- **CSS Grid/Flexbox**: For layout positioning
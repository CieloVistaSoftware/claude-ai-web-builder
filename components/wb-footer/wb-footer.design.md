# WB-Footer Component Design Document

## Overview
The wb-footer component is a flexible, responsive footer web component for the Website Builder system. It provides various layout options, navigation links, social media integration, and customizable content areas.

## Component Structure

### Semantic HTML
```html
<wb-footer>
  <footer class="wb-footer">
    <div class="wb-footer-container">
      <div class="wb-footer-top">
        <!-- Navigation links, company info, etc. -->
      </div>
      <div class="wb-footer-bottom">
        <!-- Copyright, legal links, etc. -->
      </div>
    </div>
  </footer>
</wb-footer>
```

## Layout Variants

### 1. Simple Footer
- Single row layout
- Copyright text centered
- Minimal styling

### 2. Standard Footer  
- Two-row layout
- Top: Navigation links, company info
- Bottom: Copyright and legal links

### 3. Complex Footer
- Multi-column layout
- Company info, navigation groups, social media
- Newsletter signup
- Contact information

### 4. Sticky Footer
- Fixed to bottom of viewport
- Compact design
- Essential links only

## Content Sections

### Navigation Groups
```json
{
  "navigation": [
    {
      "title": "Products",
      "links": [
        { "text": "Web Components", "href": "/products/components" },
        { "text": "Templates", "href": "/products/templates" }
      ]
    },
    {
      "title": "Support", 
      "links": [
        { "text": "Documentation", "href": "/docs" },
        { "text": "Contact", "href": "/contact" }
      ]
    }
  ]
}
```

### Company Information
- Logo/brand name
- Tagline/description
- Contact details
- Social media links

### Legal/Copyright
- Copyright notice
- Privacy policy link
- Terms of service link
- Legal disclaimers

## Configuration Options

### Layout Options
- `layout`: `"simple" | "standard" | "complex" | "sticky"`
- `columns`: Number of columns for complex layout (2-4)
- `alignment`: `"left" | "center" | "right"`

### Styling Options
- `theme`: `"light" | "dark" | "auto"`
- `background`: Background color/pattern
- `border`: Top border styling
- `spacing`: Internal padding/margins

### Content Options
- `showLogo`: Boolean to display company logo
- `showSocial`: Boolean to show social media links
- `showNewsletter`: Boolean to include newsletter signup
- `copyright`: Custom copyright text

## Responsive Behavior

### Desktop (1024px+)
- Multi-column layout for complex variant
- Horizontal navigation groups
- Full content visibility

### Tablet (768px - 1023px)
- Reduced columns (max 2-3)
- Stacked navigation groups
- Maintained spacing

### Mobile (< 768px)
- Single column layout
- Accordion-style navigation groups
- Compact spacing
- Essential content only

## CSS Variables

### Layout Variables
```css
:root {
  --wb-footer-height: auto;
  --wb-footer-padding: var(--space-lg);
  --wb-footer-gap: var(--space-md);
  --wb-footer-columns: 4;
}
```

### Color Variables
```css
:root {
  --wb-footer-bg: var(--bg-secondary);
  --wb-footer-text: var(--text-secondary);
  --wb-footer-border: var(--border-color);
  --wb-footer-link-color: var(--text-primary);
  --wb-footer-link-hover: var(--primary);
}
```

## Integration with Layout System

### Grid Area Assignment
- Footer always assigned to `footer` grid area
- Spans full width regardless of main layout
- Proper integration with left/right nav layouts

### Footer Positioning Modes
- `same-page`: Footer at bottom of content
- `bottom`: Fixed to bottom of viewport
- Controlled by body `data-footer` attribute

## Accessibility Features

### Semantic Structure
- Proper heading hierarchy
- Navigation landmarks
- Clear content grouping

### Keyboard Navigation
- Tab order through all links
- Skip links for large footers
- Focus indicators

### Screen Reader Support
- ARIA labels for navigation groups
- Descriptive link text
- Proper heading structure

## API Design

### JavaScript Interface
```javascript
// Create footer
const footer = WBFooter.create({
  layout: 'standard',
  theme: 'dark',
  navigation: [...],
  copyright: '© 2024 Company Name'
});

// Update content
footer.updateNavigation(newNavData);
footer.setCopyright(newText);

// Layout control
footer.setLayout('complex');
footer.setColumns(3);
```

### Web Component Usage
```html
<wb-footer 
  layout="standard"
  theme="dark"
  show-logo="true"
  show-social="true">
</wb-footer>
```

## Content Loading

### JSON Configuration
```json
{
  "layout": "standard",
  "theme": "dark",
  "logo": {
    "src": "/logo.svg",
    "alt": "Company Logo",
    "href": "/"
  },
  "navigation": [...],
  "social": [...],
  "copyright": "© 2024 Website Builder",
  "legal": [...]
}
```

### Dynamic Content
- Load from external JSON files
- CMS integration support
- Real-time content updates

## Performance Considerations

### Lazy Loading
- Images loaded when footer comes into view
- Social media widgets on demand
- Newsletter signup forms

### Caching
- Cache navigation data
- Persist user preferences
- Minimize re-renders

## Testing Requirements

### Unit Tests
- Component creation and destruction
- Configuration updates
- Layout switching

### Integration Tests
- Footer positioning with different layouts
- Responsive behavior
- Accessibility compliance

### Visual Tests
- Layout variants rendering
- Theme switching
- Mobile responsive design

## Dependencies

### Required Components
- `wb-component-utils.js` - Shared utilities
- Base CSS variables from website builder system

### Optional Components
- `wb-social-links` - Social media component
- `wb-newsletter` - Newsletter signup component
- `wb-logo` - Logo component

## Future Enhancements

### Advanced Features
- Animation on scroll
- Parallax background effects
- Dynamic content feeds

### Customization
- Visual theme builder
- Custom CSS injection
- Component composition

### Analytics
- Footer link tracking
- Engagement metrics
- A/B testing support
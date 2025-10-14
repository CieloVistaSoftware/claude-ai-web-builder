# WB Footer Component

A responsive footer component with multiple layouts, positioning modes, and 
back navigation restoration.

## Features

### Layout Variants

- **Simple**: Just copyright text
- **Standard**: Navigation + copyright
- **Complex**: Full featured with company info, social, newsletter
- **Sticky**: Fixed to bottom with essential links


### Positioning Modes

- **Same Page**: Flows with content
- **Fixed Bottom**: Always visible at bottom
- **Expanded**: Full width regardless of layout


### Back Navigation Restoration

The footer demo includes intelligent navigation restoration that:
- **Saves click position**: Records exact Y scroll position when any element is clicked
- **Restores on return**: When using browser back button, returns to exact same scroll position
- **Highlights target**: Briefly highlights the element that was clicked before navigation
- **Works with any navigation**: Functions with test links, external navigation, or page refreshes

#### How Navigation Restoration Works

1. **Click tracking**: Every click saves the element ID and Y scroll position to localStorage
2. **Navigation detection**: Detects when test navigation links are clicked
3. **Restoration on load**: On page load, checks for saved state and restores:
   - Exact Y scroll position where element was clicked
   - Highlights the original clicked element for 4 seconds
   - Clears saved state after restoration

## Usage

### Using the Web Component (Recommended)

```html
<!-- Basic footer with default settings -->
<wb-footer></wb-footer>

<!-- Footer with custom attributes -->
<wb-footer 
  layout="complex" 
  positioning="bottom" 
  theme="dark" 
  show-logo="true" 
  show-social="true" 
  show-newsletter="true">
</wb-footer>

<!-- Footer with custom content via attributes -->
<wb-footer 
  layout="standard" 
  company-name="My Company" 
  copyright="© 2024 My Company. All rights reserved.">
</wb-footer>

<!-- Footer with JSON configuration -->
<wb-footer 
  config='{"layout": "complex", "theme": "auto", "showSocial": true}'>
</wb-footer>
```

### Using the JavaScript API

```javascript
// Create footer with default content
const footer = WBFooter.create();
document.body.appendChild(footer);

// Create footer with custom options
const footer = WBFooter.create({
  company: {
    name: "My Company", 
    description: "Building amazing websites"
  },
  copyright: "© 2024 My Company. All rights reserved."
}, {
  layout: 'complex',
  positioning: 'bottom',
  showLogo: true,
  showSocial: true,
  showNewsletter: true
});
```

### Configuring via Attributes

```html
<!-- Layout options -->
<wb-footer layout="simple"></wb-footer>
<wb-footer layout="standard"></wb-footer>
<wb-footer layout="complex"></wb-footer>
<wb-footer layout="sticky"></wb-footer>

<!-- Positioning options -->
<wb-footer positioning="same-page"></wb-footer>
<wb-footer positioning="bottom"></wb-footer>
<wb-footer positioning="expanded"></wb-footer>

<!-- Theme options -->
<wb-footer theme="light"></wb-footer>
<wb-footer theme="dark"></wb-footer>
<wb-footer theme="auto"></wb-footer>

<!-- Content visibility options -->
<wb-footer show-logo="true"></wb-footer>
<wb-footer show-social="false"></wb-footer>
<wb-footer show-newsletter="true"></wb-footer>
```

### Updating Footer

```javascript
// Change layout
WBFooter.setLayout(footer, 'simple');

// Change positioning  
WBFooter.setPosition(footer, 'bottom');

// Update content
WBFooter.updateContent(footer, {
  copyright: "© 2024 Updated Company Name"
});
```

### Reusing the Component

#### Reusing Across Multiple Pages (HTML)

```html
<!-- homepage.html - Standard footer -->
<wb-footer 
  layout="standard" 
  positioning="same-page" 
  company-name="My Company" 
  copyright="© 2024 My Company. All rights reserved." 
  show-logo="true" 
  show-social="true">
</wb-footer>

<!-- about.html - Enhanced footer -->
<wb-footer 
  layout="complex" 
  positioning="same-page" 
  company-name="My Company" 
  copyright="© 2024 My Company. All rights reserved." 
  show-logo="true" 
  show-social="true" 
  show-newsletter="true">
</wb-footer>

<!-- contact.html - Minimal footer -->
<wb-footer 
  layout="simple" 
  copyright="© 2024 My Company. All rights reserved.">
</wb-footer>
```

#### Reusing Across Multiple Pages (JavaScript)

```javascript
// Create a reusable footer configuration
const sharedFooterConfig = {
  company: {
    name: "My Company",
    description: "Consistent branding across all pages"
  },
  copyright: "© 2024 My Company. All rights reserved."
};

const sharedFooterOptions = {
  layout: 'standard',
  positioning: 'same-page',
  showLogo: true,
  showSocial: true
};

// Use on homepage
const homeFooter = WBFooter.create(
  sharedFooterConfig, 
  sharedFooterOptions
);
document.body.appendChild(homeFooter);

// Use on about page with slight modifications
const aboutFooter = WBFooter.create(sharedFooterConfig, {
  ...sharedFooterOptions,
  layout: 'complex',
  showNewsletter: true
});
document.body.appendChild(aboutFooter);
```

#### Reusing with Different Themes

```html
<!-- Light theme footer for main site -->
<wb-footer 
  layout="complex" 
  theme="light" 
  positioning="same-page" 
  company-name="My Company">
</wb-footer>

<!-- Dark theme footer for admin panel -->
<wb-footer 
  layout="simple" 
  theme="dark" 
  positioning="bottom" 
  company-name="My Company">
</wb-footer>

<!-- Auto theme footer (adapts to system preference) -->
<wb-footer 
  layout="standard" 
  theme="auto" 
  company-name="My Company">
</wb-footer>
```

```javascript
// JavaScript API version
const lightFooter = WBFooter.create(footerContent, {
  layout: 'complex',
  theme: 'light',
  positioning: 'same-page'
});

const darkFooter = WBFooter.create(footerContent, {
  layout: 'simple', 
  theme: 'dark',
  positioning: 'bottom'
});
```

#### Reusing with Dynamic Content

```javascript
// Base footer that can be updated dynamically
const dynamicFooter = WBFooter.create({
  company: { name: "Loading..." }
}, {
  layout: 'simple'
});

// Add to page first
document.body.appendChild(dynamicFooter);

// Update with real data when available
fetch('/api/company-info')
  .then(response => response.json())
  .then(data => {
    WBFooter.updateContent(dynamicFooter, {
      company: data.company,
      copyright: data.copyright
    });
    WBFooter.setLayout(dynamicFooter, 'complex');
  });
```

#### Reusing in Different Layouts

```javascript
// Mobile-first responsive footer
const responsiveFooter = WBFooter.create(footerContent, {
  layout: 'simple',  // Start simple for mobile
  positioning: 'same-page'
});

// Enhance for larger screens
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    WBFooter.setLayout(responsiveFooter, 'complex');
  } else {
    WBFooter.setLayout(responsiveFooter, 'simple');
  }
});
```

#### Reusing with Component Factory

```javascript
// Create a footer factory for consistent reuse
class FooterFactory {
  static create(variant = 'default') {
    const configs = {
      minimal: {
        content: { copyright: "© 2024 Company" },
        options: { layout: 'simple', positioning: 'same-page' }
      },
      standard: {
        content: this.getStandardContent(),
        options: { layout: 'standard', showLogo: true }
      },
      full: {
        content: this.getFullContent(),
        options: { 
          layout: 'complex', 
          showSocial: true, 
          showNewsletter: true 
        }
      }
    };
    
    const config = configs[variant] || configs.standard;
    return WBFooter.create(config.content, config.options);
  }
  
  static getStandardContent() {
    return {
      company: { name: "My Company" },
      copyright: "© 2024 My Company. All rights reserved."
    };
  }
  
  static getFullContent() {
    return {
      company: {
        name: "My Company",
        description: "Building amazing websites"
      },
      copyright: "© 2024 My Company. All rights reserved."
    };
  }
}

// Usage
const minimalFooter = FooterFactory.create('minimal');
const standardFooter = FooterFactory.create('standard');
const fullFooter = FooterFactory.create('full');
```

## Configuration Options

### Layout Options

- `layout`: "simple" | "standard" | "complex" | "sticky"
- `positioning`: "same-page" | "bottom" | "expanded"  
- `theme`: "light" | "dark" | "auto"

### Content Options

- `showLogo`: Boolean to display company logo
- `showSocial`: Boolean to show social media links
- `showNewsletter`: Boolean to include newsletter signup

## Events

The footer component dispatches several events:
- `wbFooterReady`: Component initialized
- `wbFooterLinkClick`: Footer link clicked
- `wbFooterSocialClick`: Social media link clicked
- `wbFooterNewsletterSubmit`: Newsletter form submitted
- `wbFooterPositionChange`: Footer position changed

```javascript
// Listen for footer events
document.addEventListener('wbFooterLinkClick', (e) => {
  console.log('Link clicked:', e.detail.text, e.detail.href);
});

document.addEventListener('wbFooterNewsletterSubmit', (e) => {
  console.log('Newsletter signup:', e.detail.email);
});
```

## Integration

The footer component integrates seamlessly with the Website Builder control panel:
- ✅ Responds to footer positioning changes
- ✅ Adapts to theme changes  
- ✅ Respects layout constraints
- ✅ Event-driven communication
- ✅ Back navigation restoration for demos
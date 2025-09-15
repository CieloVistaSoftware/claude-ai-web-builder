# Blue Theme Content Injection Guide

## Overview
This guide explains how to use the JSON content system to dynamically populate HTML templates, making the blue theme highly reusable and customizable.

## File Structure
```
blue-theme/
├── content-schema.json          # JSON schema definition
├── ocean-tech-content.json      # OceanTech website content
├── blue-theme-content.json      # Demo website content
├── ocean-tech.html              # Business website template
├── blue_theme_website.html      # Demo website template
└── CONTENT-INJECTION-GUIDE.md   # This guide
```

## Injection Points

### 1. Site Metadata
**JSON Path:** `site.*`
**HTML Injection Points:**
```html
<title>{{site.title}}</title>
<meta name="description" content="{{site.description}}">
<!-- Footer copyright -->
<p>&copy; {{site.year}} {{site.company}}. All rights reserved.</p>
```

### 2. Navigation
**JSON Path:** `navigation.*`
**HTML Injection Points:**
```html
<!-- Logo -->
<div class="logo">{{navigation.logo}}</div>

<!-- Navigation Links -->
<ul class="nav-links">
  {{#each navigation.links}}
  <li><a href="{{href}}" id="{{id}}">{{text}}</a></li>
  {{/each}}
</ul>
```

### 3. Hero Section
**JSON Path:** `hero.*`
**HTML Injection Points:**
```html
<section id="home" class="hero">
  <div class="hero-content">
    <h1>{{hero.heading}}</h1>
    <p>{{hero.description}}</p>
    <a href="{{hero.primaryButton.href}}" class="{{hero.primaryButton.class}}">
      {{hero.primaryButton.text}}
    </a>
    <a href="{{hero.secondaryButton.href}}" class="{{hero.secondaryButton.class}}">
      {{hero.secondaryButton.text}}
    </a>
  </div>
</section>
```

### 4. Features Section
**JSON Path:** `features.*`
**HTML Injection Points:**
```html
<section id="features" class="features">
  <h2>{{features.sectionTitle}}</h2>
  <div class="feature-cards">
    {{#each features.cards}}
    <div class="feature-card" id="{{id}}">
      <div class="feature-icon">{{icon}}</div>
      <h3>{{title}}</h3>
      <p>{{description}}</p>
    </div>
    {{/each}}
  </div>
</section>
```

### 5. Statistics Section
**JSON Path:** `stats.*`
**HTML Injection Points:**
```html
<section class="stats">
  <div class="stats-grid">
    {{#each stats}}
    <div class="stat-item" id="{{id}}">
      <h4>{{value}}</h4>
      <p>{{label}}</p>
    </div>
    {{/each}}
  </div>
</section>
```

### 6. Pricing Section
**JSON Path:** `pricing.*`
**HTML Injection Points:**
```html
<section id="pricing" class="pricing">
  <h2>{{pricing.sectionTitle}}</h2>
  {{#each pricing.plans}}
  <div id="{{id}}-card" class="pricing-card {{#if featured}}featured{{/if}}">
    <h3 id="{{id}}-title">{{title}}</h3>
    <div id="{{id}}-price" class="price">
      {{price}}<span id="{{id}}-period">{{period}}</span>
    </div>
    <p id="{{id}}-subtitle" class="price-subtitle">{{subtitle}}</p>
    <ul id="{{id}}-features" class="feature-list">
      {{#each features}}
      <li id="{{../id}}-feature-{{@index}}">{{this}}</li>
      {{/each}}
    </ul>
    <a id="{{id}}-btn" href="#" class="{{buttonClass}}">{{buttonText}}</a>
  </div>
  {{/each}}
</section>
```

### 7. Contact Section
**JSON Path:** `contact.*`
**HTML Injection Points:**
```html
<section id="contact" class="contact">
  <div class="contact-content">
    <h2>{{contact.title}}</h2>
    <p>{{contact.description}}</p>
    <div class="contact-info">
      {{#each contact.info}}
      <div class="contact-item">
        <h4>{{label}}</h4>
        <p>{{{value}}}</p>
      </div>
      {{/each}}
    </div>
    <a href="mailto:{{contact.email}}" class="btn btn-primary">
      {{contact.buttonText}}
    </a>
  </div>
</section>
```

### 8. Footer Section
**JSON Path:** `footer.*`
**HTML Injection Points:**
```html
<footer class="footer">
  <div class="footer-content">
    {{#each footer.sections}}
    <div class="footer-section">
      <h4>{{title}}</h4>
      {{#each links}}
      <a href="{{href}}">{{text}}</a>
      {{/each}}
    </div>
    {{/each}}
  </div>
  <div class="footer-bottom">
    <p>{{footer.copyright}}</p>
    {{#if footer.bottomLinks}}
    <nav>
      {{#each footer.bottomLinks}}
      <a href="{{href}}">{{text}}</a>{{#unless @last}} | {{/unless}}
      {{/each}}
    </nav>
    {{/if}}
  </div>
</footer>
```

## Implementation Methods

### Method 1: JavaScript Template Engine
Use a library like Handlebars.js or Mustache.js:

```javascript
// Load content JSON
fetch('ocean-tech-content.json')
  .then(response => response.json())
  .then(content => {
    // Compile and render templates
    const template = Handlebars.compile(document.getElementById('template').innerHTML);
    document.getElementById('output').innerHTML = template(content);
  });
```

### Method 2: Server-Side Rendering
Use Node.js with a template engine:

```javascript
const fs = require('fs');
const handlebars = require('handlebars');

const content = JSON.parse(fs.readFileSync('ocean-tech-content.json'));
const template = handlebars.compile(fs.readFileSync('template.hbs', 'utf8'));
const html = template(content);
```

### Method 3: Build-Time Generation
Use a static site generator or build script:

```javascript
// Generate multiple sites from the same template
const contents = [
  require('./ocean-tech-content.json'),
  require('./blue-theme-content.json')
];

contents.forEach((content, index) => {
  const html = generateHTML(template, content);
  fs.writeFileSync(`site-${index}.html`, html);
});
```

## Benefits

1. **Reusability**: Same HTML structure can generate different websites
2. **Maintainability**: Content changes only require JSON updates
3. **Consistency**: Enforced structure through JSON schema
4. **Scalability**: Easy to add new sites with different content
5. **Localization**: Can create language-specific JSON files
6. **A/B Testing**: Quick content variations for testing

## Advanced Features

### Conditional Content
```json
{
  "pricing": {
    "showFreeTier": true,
    "plans": [...]
  }
}
```

### Dynamic IDs and Classes
```json
{
  "features": {
    "cards": [
      {
        "id": "feature-performance",
        "additionalClasses": ["highlight", "premium"]
      }
    ]
  }
}
```

### Content Variants
```json
{
  "hero": {
    "variants": {
      "default": {
        "heading": "Dive Deep into Innovation"
      },
      "holiday": {
        "heading": "Holiday Special: Dive Deep into Innovation"
      }
    }
  }
}
```

## Best Practices

1. **Validate JSON**: Always validate against the schema
2. **Sanitize HTML**: Escape user content to prevent XSS
3. **Use Semantic IDs**: Make IDs meaningful and predictable
4. **Keep Content Atomic**: Break complex content into smaller pieces
5. **Version Control**: Track content changes alongside code
6. **Document Changes**: Update schema when adding new content types

## Schema Validation

Validate your content JSON against the schema:

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = require('./content-schema.json');
const content = require('./ocean-tech-content.json');

const validate = ajv.compile(schema);
const valid = validate(content);

if (!valid) {
  console.log('Validation errors:', validate.errors);
}
```

This system transforms static HTML templates into dynamic, content-driven websites that can be easily customized, maintained, and scaled.
# Search Plugin

A powerful search functionality for the Website Builder that allows users to find content across all sections of your website.

## Features

- Fast full-text search across all website content
- Customizable search UI with themes support
- Category-based filtering
- Highlighting of matched terms
- Analytics for tracking popular searches
- Fuzzy matching for better results
- Mobile-responsive design

## Installation

1. Include the search plugin in your project:

```html
<!-- Include the search plugin CSS -->
<link rel="stylesheet" href="./plugins/search/search-styles.css">

<!-- Include the search plugin JavaScript -->
<script type="module" src="./plugins/search/site-search.js"></script>
```

2. Configure the search plugin in your `site-content.json` file:

```json
{
  "plugins": {
    "search": {
      "enabled": true,
      "placement": "navigation",
      "buttonText": "Search",
      "buttonIcon": "🔍",
      "placeholder": "Search website..."
    }
  }
}
```

3. Add a search button to your navigation:

```json
"navigation": {
  "items": [
    { "text": "Home", "href": "#home" },
    { "text": "About", "href": "#about" },
    { "text": "Contact", "href": "#contact" },
    { 
      "type": "search",
      "text": "Search", 
      "icon": "🔍",
      "action": "open-search"
    }
  ]
}
```

## Configuration Options

See the [SiteSearch.md](../../docs/SiteSearch.md) documentation for detailed configuration options and examples.

## Usage

The search plugin will automatically initialize if it's enabled in your site-content.json file. You can also manually initialize it:

```javascript
// Get the search instance
const search = window.WebsiteBuilder.Plugins.Search;

// Open the search modal programmatically
search.openModal();

// Perform a search programmatically
search.query("services", function(results) {
  console.log(`Found ${results.length} results`);
});
```

## Customization

You can customize the search modal appearance by adding CSS overrides or using the built-in styles configuration:

```json
"plugins": {
  "search": {
    "enabled": true,
    "styles": {
      "modalBackground": "rgba(0, 0, 0, 0.85)",
      "inputBorderColor": "#007bff",
      "resultHoverColor": "#f0f0f0",
      "highlightColor": "#ffde7d"
    }
  }
}
```

## Requirements

- ES6+ compatible browser
- Website Builder with site-content.json configuration

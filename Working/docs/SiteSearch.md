# Site Search Implementation Guide

## Overview

This document explains how to implement and configure the site search functionality in the Website Builder. The search system allows users to find content across all sections of your website quickly and efficiently.

## How Site Search Works

The Website Builder's search functionality works by:

1. **Indexing**: When the site loads, it automatically indexes all content from your `site-content.json` file
2. **Query Processing**: When a user enters a search term, it processes the query against the indexed content
3. **Result Ranking**: Results are ranked by relevance, with exact matches prioritized
4. **Display**: Search results are presented in a user-friendly modal with direct navigation links

## Adding the Search Plugin

### Step 1: Include the Search Plugin in site-content.json

Add the search configuration to your `site-content.json` file:

```json
{
  "plugins": {
    "search": {
      "enabled": true,
      "placement": "navigation", // Options: "navigation", "footer", "floating"
      "buttonText": "Search",
      "buttonIcon": "🔍",
      "placeholder": "Search website...",
      "indexContent": true,
      "searchableElements": ["title", "subtitle", "description", "content", "items"],
      "highlightResults": true
    }
  }
}
```

### Step 2: Add the Search Button to Navigation

Add a search button to your navigation menu:

```json
"navigation": {
  "items": [
    { "text": "Home", "href": "#home" },
    { "text": "Services", "href": "#services" },
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

### Step 3: Include the Search Plugin JavaScript

Add the search plugin script to your HTML:

```html
<script src="plugins/search/site-search.js"></script>
```

## Search Configuration Options

### Basic Configuration

| Option | Description | Default | Example Values |
|--------|-------------|---------|---------------|
| `enabled` | Enables or disables search functionality | `false` | `true`, `false` |
| `placement` | Where the search button appears | `"navigation"` | `"navigation"`, `"footer"`, `"floating"` |
| `buttonText` | Text displayed on the search button | `"Search"` | Any string |
| `buttonIcon` | Icon displayed on the search button | `"🔍"` | Any emoji, icon class, or URL to an image |
| `placeholder` | Placeholder text for the search input | `"Search website..."` | Any string |

### Advanced Configuration

| Option | Description | Default | Example Values |
|--------|-------------|---------|---------------|
| `indexContent` | Whether to index all content for searching | `true` | `true`, `false` |
| `searchableElements` | Which elements to include in search | `["title", "subtitle", "description", "content"]` | Array of element types |
| `highlightResults` | Whether to highlight matching text in results | `true` | `true`, `false` |
| `minQueryLength` | Minimum number of characters for a search | `2` | Any integer |
| `maxResults` | Maximum number of results to display | `10` | Any integer |
| `fuzzySearch` | Whether to use fuzzy matching for search | `true` | `true`, `false` |
| `excludeSections` | Sections to exclude from search | `[]` | Array of section IDs |

## Search Modal Customization

You can customize the appearance of the search modal by adding CSS overrides:

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

## Predefined Search Categories

You can define predefined search categories to help users find specific types of content quickly:

```json
"plugins": {
  "search": {
    "enabled": true,
    "categories": [
      {
        "name": "Services",
        "icon": "💼",
        "filter": "services",
        "description": "Find our professional services"
      },
      {
        "name": "Team",
        "icon": "👥",
        "filter": "team,about",
        "description": "Meet our team members"
      },
      {
        "name": "Contact",
        "icon": "📞",
        "filter": "contact,location,email,phone",
        "description": "Ways to reach us"
      }
    ]
  }
}
```

## Search Job Execution

The search job runs in the following sequence:

1. **Initialization**: When the page loads, the search system initializes and checks for the search plugin configuration
2. **Content Indexing**: All content from `site-content.json` is parsed and indexed
3. **Event Binding**: Event listeners are attached to the search button and search input field
4. **Search Execution**:
   - When a user types in the search box, the search job executes after a brief debounce delay (300ms)
   - The system filters content based on the user's query
   - Results are ranked by relevance score
   - The UI is updated with matching results

### Performance Optimization

The search system is optimized for performance:

- Content is indexed only once during initial load
- Search operations use efficient algorithms to minimize processing time
- Results are cached for identical queries
- Long operations are executed asynchronously to prevent UI blocking

## Implementation Examples

### Basic Search Implementation

```json
{
  "plugins": {
    "search": {
      "enabled": true
    }
  },
  "navigation": {
    "items": [
      { "text": "Home", "href": "#home" },
      { "text": "About", "href": "#about" },
      { "text": "Services", "href": "#services" },
      { "text": "Contact", "href": "#contact" },
      { "type": "search", "text": "Search", "icon": "🔍" }
    ]
  }
}
```

### Advanced Search with Categories

```json
{
  "plugins": {
    "search": {
      "enabled": true,
      "placement": "floating",
      "buttonIcon": "🔎",
      "placeholder": "What are you looking for?",
      "maxResults": 15,
      "categories": [
        {
          "name": "Products",
          "icon": "📦",
          "filter": "product,item,purchase",
          "description": "Browse our products"
        },
        {
          "name": "Support",
          "icon": "🛟",
          "filter": "help,support,faq",
          "description": "Get help with our products"
        }
      ],
      "styles": {
        "modalBackground": "rgba(25, 25, 50, 0.9)",
        "inputBorderColor": "#6a11cb",
        "resultHoverColor": "#2d3748",
        "highlightColor": "#ffc107"
      }
    }
  }
}
```

## Search Results Display

Search results are displayed in a modal that shows:

1. The section title where the match was found
2. A snippet of the matched content with the search term highlighted
3. The type of content (e.g., heading, description, list item)
4. A link to navigate directly to that section

Example search result display:

```
SERVICES → Professional Web Development
"...our expert team creates responsive web development solutions tailored to your business needs..."
[In section description]

ABOUT → Our Process
"...development phase includes coding, testing, and quality assurance..."
[In list item]
```

## Advanced Search Functions

### Content Boosting

You can boost certain types of content to appear higher in search results:

```json
"plugins": {
  "search": {
    "enabled": true,
    "boostFactors": {
      "title": 2.0,
      "subtitle": 1.5,
      "services": 1.3,
      "contact": 1.2
    }
  }
}
```

### Custom Search Handlers

You can register custom search handlers for specialized content:

```javascript
// In your custom.js file
WebsiteBuilder.Plugins.Search.registerHandler({
  name: "pdfDocuments",
  filter: function(query, callback) {
    // Custom logic to search PDF documents
    // Return results via callback(resultsArray)
  }
});
```

## Search Analytics

The search plugin can optionally track search analytics:

```json
"plugins": {
  "search": {
    "enabled": true,
    "analytics": {
      "enabled": true,
      "trackQueries": true,
      "trackClicks": true,
      "storageMethod": "localStorage" // Options: "localStorage", "server", "none"
    }
  }
}
```

This feature helps you understand:
- Most common search terms
- Search terms with no results (to identify content gaps)
- Which search results are being clicked

## Troubleshooting

### Common Issues

1. **Search button not appearing**:
   - Ensure `plugins.search.enabled` is set to `true`
   - Check that you've added the search button to navigation or footer

2. **No search results appearing**:
   - Verify content is being properly indexed (check console for errors)
   - Ensure searchable content exists in your site-content.json
   - Check minimum query length setting

3. **Search results not navigating properly**:
   - Ensure section IDs match the href values in search results
   - Check that sections have the proper ID attributes in HTML

### Debugging

Enable debug mode to see detailed logging:

```json
"plugins": {
  "search": {
    "enabled": true,
    "debug": true
  }
}
```

This will output detailed information to the browser console about indexing, search execution, and result ranking.

## Best Practices for Searchable Content

1. **Use descriptive titles and headings** that contain relevant keywords
2. **Include detailed descriptions** for all sections and items
3. **Organize content logically** into well-defined sections
4. **Use consistent terminology** throughout your site
5. **Include alternate terms** for specialized content to improve search matching

## Site Search API

For advanced implementations, you can access the search functionality programmatically:

```javascript
// Initialize search
const search = WebsiteBuilder.Plugins.Search.initialize();

// Perform a search
search.query("services", function(results) {
  console.log(`Found ${results.length} results`);
  
  // Process results
  results.forEach(result => {
    console.log(`${result.sectionTitle} → ${result.matchedText}`);
  });
});

// Open search modal programmatically
WebsiteBuilder.Plugins.Search.openModal();
```

## Content Creation Guidelines for Search Optimization

When creating content for your website, consider these guidelines to optimize for search:

1. **Front-load important information** in titles and descriptions
2. **Include synonyms** for key terms to improve search matching
3. **Use consistent naming conventions** for similar content types
4. **Structure content hierarchically** with clear categories
5. **Add detailed metadata** to help with content categorization

By following these guidelines, you'll ensure that users can easily find relevant content through the search functionality.

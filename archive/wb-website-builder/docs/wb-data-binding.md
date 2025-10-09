# Website Builder Data Binding System

The Website Builder now uses a data-driven architecture where all content is stored in `wb.json` and dynamically bound to HTML elements at runtime.

## Overview

Instead of hardcoded content in HTML, the system now:
1. **Loads content from wb.json** - All text, navigation, features, etc.
2. **Dynamically populates HTML** - Content is injected into placeholder elements
3. **Tracks changes in real-time** - Edits are captured and stored
4. **Auto-saves content** - Changes are persisted automatically

## Key Files

### `wb.json`
Central data store containing:
- **Metadata**: Page title, description, keywords
- **Settings**: Theme, layout, edit mode state
- **Navigation**: Menu items and links
- **Content Sections**: Header, hero, features, gallery, about, footer
- **Templates**: Reusable HTML templates for dynamic content

### `data-binding.js`
Core data binding engine that:
- Loads content from wb.json
- Populates HTML elements
- Tracks content changes
- Handles save/load operations
- Provides event-based communication

## Data Structure

```json
{
  "metadata": {
    "title": "Page Title",
    "description": "Page description",
    "keywords": "keywords"
  },
  "settings": {
    "layout": "top-nav",
    "theme": "dark", 
    "footer": "same-page"
  },
  "navigation": {
    "items": [
      {
        "id": "nav-item-1",
        "label": "Home", 
        "href": "#home",
        "active": true
      }
    ]
  },
  "sections": {
    "features": {
      "title": "Features",
      "items": [
        {
          "icon": "🚀",
          "title": "Feature Title",
          "description": "Feature description"
        }
      ]
    }
  }
}
```

## How It Works

### 1. Initial Load
```javascript
// Data binding system loads wb.json
await DataBinding.loadData();

// Populates all HTML elements
DataBinding.bindAllContent();
```

### 2. Content Binding
```html
<!-- Before: Hardcoded content -->
<h1>Your Amazing Website</h1>

<!-- After: Data-bound placeholder -->
<h1 id="site-title" class="editable">
  <!-- Title will be populated from wb.json -->
</h1>
```

### 3. Real-time Updates
```javascript
// When user edits content in edit mode
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('editable')) {
    // Update JSON data automatically
    DataBinding.handleContentChange(e.target);
  }
});
```

### 4. Auto-save
```javascript
// Automatically saves changes every 30 seconds
setInterval(() => {
  if (DataBinding.isDirty()) {
    DataBinding.saveData();
  }
}, 30000);
```

## API Reference

### DataBinding Service

#### Methods
- `DataBinding.init()` - Initialize the system
- `DataBinding.getData()` - Get current data
- `DataBinding.saveData()` - Save changes
- `DataBinding.isDirty()` - Check if data has changes
- `DataBinding.reset()` - Reset to original data

#### Events
- `dataBindingReady` - System initialized
- `contentChanged` - Content was modified
- `dataSaved` - Data was saved

### Integration with Components

#### Control Panel Integration
```javascript
// Listen for data binding events
document.addEventListener('dataBindingReady', (e) => {
  // Sync control panel with data settings
  syncWithDataBinding();
});

// Save includes data binding
saveWebsite() {
  if (window.DataBinding && window.DataBinding.isDirty()) {
    window.DataBinding.saveData();
  }
  // ... save HTML
}
```

#### Status Service Integration
```javascript
// Status service shows data binding status
document.addEventListener('dataSaved', () => {
  updateStatus('Content saved successfully', 'success');
});
```

## Benefits

### 1. **Separation of Concerns**
- **Content** (wb.json) separate from **Structure** (HTML) 
- **Presentation** (CSS) separate from **Data**
- **Behavior** (JS) separate from **Content**

### 2. **Dynamic Content Management**
- Add/remove sections without touching HTML
- Change content without redeploying
- Easy content localization/translation
- Content versioning and backup

### 3. **Better User Experience**
- Real-time content updates
- Auto-save prevents data loss
- Undo/redo capabilities
- Live preview of changes

### 4. **Developer Benefits**
- Clean, maintainable code
- Event-driven architecture
- Easy to extend and customize
- Testable components

## Usage Examples

### Adding New Content
```json
{
  "sections": {
    "testimonials": {
      "title": "What Our Customers Say",
      "items": [
        {
          "quote": "Amazing service!",
          "author": "John Doe",
          "company": "Acme Corp"
        }
      ]
    }
  }
}
```

### Custom Content Binding
```javascript
// Bind custom section
bindTestimonialsSection(testimonialsData) {
  const container = document.getElementById('testimonials-container');
  container.innerHTML = '';
  
  testimonialsData.items.forEach(testimonial => {
    const item = document.createElement('div');
    item.className = 'testimonial';
    item.innerHTML = `
      <blockquote>${testimonial.quote}</blockquote>
      <cite>${testimonial.author}, ${testimonial.company}</cite>
    `;
    container.appendChild(item);
  });
}
```

### Listening for Changes
```javascript
document.addEventListener('contentChanged', (e) => {
  console.log(`${e.detail.elementId} changed to: ${e.detail.content}`);
  
  // Update other components based on content changes
  if (e.detail.elementId === 'site-title') {
    updatePageTitle(e.detail.content);
  }
});
```

## Migration from Static Content

### Before (Static HTML)
```html
<h1 class="site-title">Hardcoded Title</h1>
<p class="hero-text">Hardcoded description text</p>
```

### After (Data-bound)
```html
<h1 id="site-title" class="site-title editable">
  <!-- Title populated from wb.json -->
</h1>
<p id="hero-description" class="hero-text editable">
  <!-- Description populated from wb.json -->
</p>
```

## Future Enhancements

1. **Server Integration** - Save to database instead of localStorage
2. **Multi-language Support** - Multiple wb.json files for different languages
3. **Content Validation** - Schema validation for wb.json structure
4. **Visual Editor** - Drag-and-drop content editing
5. **Content Templates** - Pre-built content templates for different industries
6. **Asset Management** - Image and media file handling

## Troubleshooting

### Common Issues

1. **Content not loading**: Check wb.json file path and syntax
2. **Changes not saving**: Verify localStorage is available
3. **Edit mode not working**: Ensure elements have 'editable' class
4. **Data binding events not firing**: Check event listeners are set up correctly

### Debug Mode
```javascript
// Enable debug logging
DataBinding.configure({ enableConsoleLogging: true });

// Check current data
console.log(DataBinding.getData());

// Check if data is dirty
console.log(DataBinding.isDirty());
```

This data-driven approach provides a solid foundation for building dynamic, maintainable websites with the Website Builder system.
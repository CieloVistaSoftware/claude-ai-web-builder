# Website Builder Configuration Guide

## Overview

The Website Builder uses a JSON configuration file (`wb-config.json`) to control various aspects of the build process, export options, and advanced features. This document explains all available configuration settings and their usage.

## Configuration File Location

The configuration file should be located in the same directory as your `wb.html` file:
```
/dist/wb/
├── wb.html
├── wb.css
├── wb-config.json  ← Configuration file
└── ...
```

## Configuration Structure

The configuration file follows this JSON structure:

```json
{
  "website_builder_config": {
    "build_settings": { ... },
    "export_settings": { ... },
    "file_settings": { ... },
    "editor_settings": { ... },
    "advanced_settings": { ... }
  }
}
```

## Configuration Sections

### 🔧 Build Settings

Controls how the website builder processes and generates code.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `obfuscate_js` | boolean | `false` | Obfuscates JavaScript code in saved websites |
| `minify_css` | boolean | `false` | Minifies CSS output (future feature) |
| `include_comments` | boolean | `true` | Includes helpful comments in generated code |
| `development_mode` | boolean | `false` | Enables debug features and verbose logging |

**Example:**
```json
"build_settings": {
  "obfuscate_js": true,
  "minify_css": false,
  "include_comments": false,
  "development_mode": false
}
```

### 📤 Export Settings

Controls what files are created when saving a website.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `copy_css_file` | boolean | `true` | Creates a separate CSS file alongside the HTML |
| `copy_js_file` | boolean | `true` | Creates a separate JavaScript file alongside the HTML |
| `embed_styles` | boolean | `false` | Embeds CSS directly in the HTML file |
| `embed_scripts` | boolean | `false` | Embeds JavaScript directly in the HTML file |

**Example:**
```json
"export_settings": {
  "copy_css_file": true,
  "copy_js_file": true,
  "embed_styles": false,
  "embed_scripts": false
}
```

**Note:** If `embed_styles` is `true`, `copy_css_file` is ignored. Same applies to `embed_scripts` and `copy_js_file`.

### 📁 File Settings

Controls naming conventions for generated files.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `css_filename` | string | `"wb.css"` | Name for the generated CSS file |
| `js_filename` | string | `"wb.min.js"` | Name for the generated JavaScript file |
| `html_prefix` | string | `"Sites_"` | Prefix added to saved HTML files |

**Example:**
```json
"file_settings": {
  "css_filename": "styles.css",
  "js_filename": "app.min.js",
  "html_prefix": "Website_"
}
```

### ⚙️ Editor Settings

Controls the behavior of the website builder interface.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `default_site_name` | string | `"MyWebsite"` | Default name for new websites |
| `default_theme` | string | `"default"` | Default theme selection |
| `auto_save_interval` | number | `0` | Auto-save interval in seconds (0 = disabled) |
| `show_tooltips` | boolean | `true` | Shows helpful tooltips in edit mode |

**Example:**
```json
"editor_settings": {
  "default_site_name": "NewSite",
  "default_theme": "dark",
  "auto_save_interval": 30,
  "show_tooltips": true
}
```

### 🔧 Advanced Settings

Controls advanced processing and cleanup options.

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `remove_edit_indicators` | boolean | `true` | Removes edit mode attributes from saved HTML |
| `clean_broken_images` | boolean | `true` | Removes broken image references |
| `add_smooth_scrolling` | boolean | `true` | Adds smooth scrolling to navigation links |
| `include_console_logs` | boolean | `true` | Includes console logging in generated JavaScript |
| `cleanup_on_save` | boolean | `true` | Performs general cleanup when saving |

**Example:**
```json
"advanced_settings": {
  "remove_edit_indicators": true,
  "clean_broken_images": true,
  "add_smooth_scrolling": true,
  "include_console_logs": false,
  "cleanup_on_save": true
}
```

## Complete Configuration Example

Here's a complete configuration file example:

```json
{
  "website_builder_config": {
    "build_settings": {
      "obfuscate_js": false,
      "minify_css": false,
      "include_comments": true,
      "development_mode": false
    },
    "export_settings": {
      "copy_css_file": true,
      "copy_js_file": true,
      "embed_styles": false,
      "embed_scripts": false
    },
    "file_settings": {
      "css_filename": "wb.css",
      "js_filename": "wb.min.js",
      "html_prefix": "Sites_"
    },
    "editor_settings": {
      "default_site_name": "MyWebsite",
      "default_theme": "default",
      "auto_save_interval": 0,
      "show_tooltips": true
    },
    "advanced_settings": {
      "remove_edit_indicators": true,
      "clean_broken_images": true,
      "add_smooth_scrolling": true,
      "include_console_logs": true,
      "cleanup_on_save": true
    }
  }
}
```

## Usage Scenarios

### Scenario 1: Development Mode
For development with readable code and debugging:
```json
{
  "website_builder_config": {
    "build_settings": {
      "obfuscate_js": false,
      "include_comments": true,
      "development_mode": true
    },
    "advanced_settings": {
      "include_console_logs": true
    }
  }
}
```

### Scenario 2: Production Mode
For production with optimized, obfuscated code:
```json
{
  "website_builder_config": {
    "build_settings": {
      "obfuscate_js": true,
      "include_comments": false,
      "development_mode": false
    },
    "advanced_settings": {
      "include_console_logs": false,
      "cleanup_on_save": true
    }
  }
}
```

### Scenario 3: Embedded Assets
For single-file websites with embedded CSS/JS:
```json
{
  "website_builder_config": {
    "export_settings": {
      "copy_css_file": false,
      "copy_js_file": false,
      "embed_styles": true,
      "embed_scripts": true
    }
  }
}
```

## Configuration UI

The website builder provides checkboxes in the interface to control common settings:

- **Obfuscate JavaScript**: Controls `build_settings.obfuscate_js`
- **Copy CSS/JS Files**: Controls `export_settings.copy_css_file` and `copy_js_file`
- **Remove Edit Indicators**: Controls `advanced_settings.remove_edit_indicators`

Changes made through the UI are applied immediately to the configuration but are not persisted to the JSON file automatically.

## Troubleshooting

### Configuration Not Loading
- Ensure `wb-config.json` is in the same directory as `wb.html`
- Check JSON syntax using a JSON validator
- Check browser console for error messages

### Settings Not Applied
- Verify the setting name matches exactly (case-sensitive)
- Ensure the setting is in the correct section
- Check that the value type matches (boolean, string, number)

### Default Fallback
If the configuration file cannot be loaded, the website builder will use built-in defaults and display a warning message.

## Version History

- **v1.0** (September 2025): Initial configuration system with build, export, file, editor, and advanced settings

## Related Documentation

- [Website Builder User Guide](main.md)
- [Implementation Roadmap](Implementation-roadmap.md)
- [Architecture Documentation](Architecture-organization.md)
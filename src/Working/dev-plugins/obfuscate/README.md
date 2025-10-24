# Obfuscator Development Plugin

This plugin provides a flexible interface to connect any external obfuscation tool with the Website Builder. It's designed as a development-only tool that won't be included in exported websites.

## Important: Development Use Only

This plugin is intended for **development use only** and should NOT be included in websites exported for customers. The plugin system is designed to automatically exclude all developer plugins when saving/exporting websites.

## Features

- Flexible interface for code obfuscation
- Support for JavaScript, CSS, and HTML obfuscation
- Configurable obfuscation options through UI
- Development-only UI in the editor
- Automatic exclusion from exported websites
- Settings persistence across sessions

## Setup

1. The plugin is automatically loaded by the development plugin system when the Website Builder loads
2. Access development tools by clicking the "🛠️ Dev Tools" button in the bottom right corner
3. Connect to your obfuscation tool by implementing the `callObfuscationTool()` method
4. Configure options in the Settings tab
5. Use the obfuscation buttons to process your code

## How It Works

The plugin provides a framework with:
1. UI for triggering obfuscation and configuring options
2. Integration with the Website Builder's plugin system
3. Hooks for connecting to your specific obfuscation tools
4. Automatic cleanup before website export

You simply need to implement the connection to your specific obfuscation tool in the `callObfuscationTool()` method. The plugin handles everything else.

## Implementing Your Tool Connection

Edit the `callObfuscationTool()` method in `obfuscator-plugin.js` to connect to your specific obfuscation tool. The plugin supports multiple integration methods:

### HTTP API Integration
```javascript
async callObfuscationTool(code, type, options) {
  const response = await fetch('http://localhost:3000/obfuscate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, type, options })
  });
  
  if (!response.ok) {
    throw new Error(`API responded with status: ${response.status}`);
  }
  
  return await response.text();
}
```

### JavaScript Library Integration
```javascript
async callObfuscationTool(code, type, options) {
  // Assuming you've imported or loaded your obfuscator library
  switch (type) {
    case 'js':
      return this.jsObfuscator.obfuscate(code, options);
    case 'css':
      return this.cssObfuscator.minify(code, options);
    case 'html':
      return this.htmlObfuscator.obfuscate(code, options);
    default:
      return code;
  }
}
```

### Command Line Tool Integration (via proxy)
```javascript
async callObfuscationTool(code, type, options) {
  // This would typically be handled through a server-side proxy
  const response = await fetch('/api/obfuscate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      type,
      options,
      command: `/path/to/obfuscator --level=${options.level}`
    })
  });
  
  return await response.text();
}
```

## Security

The plugin includes a `isDevelopmentOnly` flag that ensures it will never be included in exported websites, keeping your obfuscation tools private and not exposing them to customers.

## Directory Structure

```
dev-plugins/
  ├── dev-plugin-loader.js     # Main developer plugin system
  └── obfuscate/
      ├── obfuscator-plugin.js # Obfuscator plugin implementation
      └── README.md            # This file
```

## Configuration Options

The plugin provides configurable options for different types of obfuscation:

### JavaScript Options
- Compact code
- Control flow flattening
- Dead code injection
- Debug protection
- Identifier naming strategies

### CSS Options
- Restructure CSS
- Minify CSS
- Remove comments

### HTML Options
- Remove comments
- Collapse whitespace
- Remove attribute quotes

These options are accessible through the plugin's UI and are saved to localStorage for persistence across sessions.

---

**Note:** The implementation currently contains placeholder obfuscation functions. You need to implement the actual connection to your obfuscation tool by editing the `callObfuscationTool()` method in `obfuscator-plugin.js`.

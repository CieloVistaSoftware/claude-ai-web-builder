# File Stacking Utility

This project provides tools to stack HTML files with their corresponding CSS and JS/TS files in a user-friendly way.

## Overview

The File Stacking Utility helps organize web development files by ensuring files with the same prefix are properly stacked together (e.g., `file.html`, `file.css`, `file.js`). This is useful for keeping related files together and ensuring they are properly bundled for deployment.

## Available Tools

This project includes several tools for file stacking:

### 1. Project File Stacker (project-file-stacker.html)

This is the main entry point for stacking files. It provides a user-friendly interface for:

- Auto-detecting files in a selected directory
- Stacking files with matching names
- Saving stacked files to a location of your choice

### 2. File Stacker Tool (file-stacker-tool.html)

A standalone tool for manually selecting files to stack. This is useful when you want more control over which files are stacked together.

### 3. FileStacker Library (file-stacker.js)

The core library that handles the stacking logic. This can be used programmatically in your own projects.

### 4. Auto-Stacker (auto-stack-files.js)

A script that automatically detects and stacks files with matching names. This can be used both via the UI and programmatically.

## How to Use

### Quick Start

1. Open `project-file-stacker.html` in your web browser
2. Click "Select Directory" to choose a folder with your HTML, CSS, and JS/TS files
3. Review the detected file groups
4. Click "Save Stacked Files" to save the stacked files to your chosen location

### Manual Selection

1. Open `file-stacker-tool.html` in your web browser
2. Select the HTML, CSS, and JS/TS files you want to stack
3. Click "Stack Selected Files"
4. Save the stacked files

### Programmatic Usage

You can also use the FileStacker library programmatically:

```javascript
// Create a new FileStacker instance
const stacker = new FileStacker("output-directory");

// Add files to the stacker
stacker.addFile("app.html", htmlContent, "text/html");
stacker.addFile("app.css", cssContent, "text/css");
stacker.addFile("app.js", jsContent, "application/javascript");

// Save all files in stacked order
await stacker.saveAll();
```

## File Types Supported

The stacking utility supports the following file types:

- HTML: `.html`, `.htm`
- CSS: `.css`
- JavaScript: `.js`
- TypeScript: `.ts`

## Browser Compatibility

This utility uses modern browser APIs and is compatible with:

- Chrome 86+
- Edge 86+
- Safari 15.2+
- Firefox 95+

For older browsers, files will be downloaded directly rather than saved to a directory.

## Notes

- Files are stacked by their base name (without extension)
- HTML files are required as the main file in a group
- The stacking order is: HTML, CSS, JS, TS
- Directory structure is preserved when using auto-detection

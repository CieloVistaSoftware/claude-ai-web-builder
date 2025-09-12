# Claude AI Website Builder - Development Setup

## Quick Start

To run the website builder in development mode:

```bash
# Install dependencies (first time only)
npm install http-server

# Start the development server
npm run dev
```

This will:
- Start a local HTTP server on port 3000
- Automatically open wb.html in your default browser
- Serve files from the wb/ directory
- Disable caching for development

## Alternative Commands

```bash
# Start dev server (same as npm run dev)
npm start

# Start server on port 8080 without auto-opening
npm run serve

# Manual server start (if npm scripts don't work)
cd wb
npx http-server -p 3000 -o wb.html -c-1
```

## Development Features

- **Live Reload**: Refresh the browser to see changes
- **No Caching**: The `-c-1` flag disables caching for development
- **Auto Open**: Browser automatically opens to wb.html
- **Local Server**: Proper HTTP server for CORS and module loading

## File Structure

```
wb/
├── wb.html       # Main website builder interface
├── wb.js         # Core JavaScript functionality  
├── wb.css        # All styles (moved from inline)
└── pageTemplates.json # Page templates data
```

## Browser Requirements

- Modern browser with ES6+ support
- JavaScript enabled
- Local storage access for state saving

## Troubleshooting

If the dev server doesn't start:
1. Make sure Node.js is installed (v14+)
2. Install http-server: `npm install -g http-server`
3. Navigate to wb folder: `cd wb`
4. Start manually: `npx http-server -p 3000 -o wb.html`
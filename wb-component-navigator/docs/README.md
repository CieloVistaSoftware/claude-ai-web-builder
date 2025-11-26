# WB Component Navigator

A VS Code extension that provides C#-style language intelligence for Web Components. Get **Go to Definition**, **Find All References**, **Hover Info**, and intelligent **Auto-Complete** for your WB Framework components.

## The Problem It Solves

Modern web development with components creates **file explosion**:
- 41+ components = 160+ files minimum
- Hard to track what's already built
- Difficult to find the right file to edit
- No easy way to see component relationships
- Missing cross-references like C# provides

## Features

### 🎯 Go to Definition
Click on any `<wb-button>` usage in HTML and jump directly to `wb-button.js` definition.

### 🔍 Find All References
Right-click a component and see everywhere it's used across your entire project.

### 📋 Hover Information
Hover over a component to see:
- Component name and class
- Related files (JS, CSS, demo, docs)
- File paths

### ✨ Auto-Complete
Type `<` in HTML and get intelligent suggestions for all your WB components.

### 🌳 Component Tree View
Visual hierarchical view of all components and their related files:
```
📦 wb-button
	├─ wb-button.js
	├─ wb-button.css
	├─ wb-button.md
	└─ wb-button-demo.html
```

## Installation

### 1. Install Dependencies

```bash
cd wb-component-navigator
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 2. Compile TypeScript

```bash
npm run compile
```

### 3. Run in VS Code

1. Open the `wb-component-navigator` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. Open your WB Framework workspace in the new window

## Usage

### Setting Up

1. Open your WB Framework project in VS Code
2. The extension automatically activates for HTML/JS/TS files
3. Component index builds automatically on startup

### Configuration

Configure the components directory path in VS Code settings:

```json
{
	"wbComponentNavigator.componentsPath": "components"
}
```

### Commands

- **Refresh Component Index**: `Ctrl+Shift+P` → "Refresh Component Index"

### Keyboard Shortcuts

- **Go to Definition**: `F12` or `Ctrl+Click` on component name
- **Find References**: `Shift+F12` on component name
- **Show Hover**: Hover mouse over component

## How It Works

### Component Detection

The Language Server scans your `components/` directory and indexes:

1. **Component Registration**:
	 ```javascript
	 customElements.define('wb-button', WBButton);
	 ```

2. **Related Files**:
	 - `wb-button.js` - Component logic
	 - `wb-button.css` - Styles
	 - `wb-button.md` - Documentation
	 - `wb-button-demo.html` - Demo
	 - `wb-button.schema.json` - Schema

3. **Component Usages**:
	 - Scans all HTML files for `<wb-component>` tags
	 - Tracks import relationships

### Symbol Index

Builds an in-memory graph:
```
wb-button → {
	name: "wb-button",
	className: "WBButton",
	definitionFile: "/components/wb-button/wb-button.js",
	definitionLine: 245,
	cssFile: "/components/wb-button/wb-button.css",
	usages: [...]
}
```

## Architecture

```
┌─────────────────────────────────────┐
│   VS Code Extension (Client)        │
│   - Tree View Provider               │
│   - Command Handlers                 │
│   - UI Integration                   │
└──────────────┬──────────────────────┘
							 │ LSP Protocol
┌──────────────▼──────────────────────┐
│   Language Server                    │
│   - Component Parser                 │
│   - Symbol Index Builder             │
│   - Definition Provider              │
│   - References Provider              │
│   - Hover Provider                   │
│   - Completion Provider              │
└─────────────────────────────────────┘
```

## Development

### Project Structure

```
wb-component-navigator/
├── client/               # VS Code extension
│   ├── src/
│   │   └── extension.ts
│   └── package.json
├── server/               # Language Server
│   ├── src/
│   │   └── server.ts
│   └── package.json
└── package.json          # Root package
```

### Building

```bash
# Compile everything
npm run compile

# Watch mode (auto-compile on changes)
npm run watch
```

### Debugging

1. Open `wb-component-navigator` in VS Code
2. Set breakpoints in `client/src/extension.ts` or `server/src/server.ts`
3. Press `F5` to launch debugger
4. Extension Development Host opens with debugging attached

### Testing

1. Open Extension Development Host (`F5`)
2. Open your WB Framework workspace
3. Test features:
	 - Open an HTML file with `<wb-button>`
	 - `Ctrl+Click` to test Go to Definition
	 - Right-click → "Find All References"
	 - Hover over component name
	 - Type `<` and check auto-complete

## Extending the Extension

### Adding New Features

1. **Custom Commands**: Add to `client/src/extension.ts`
2. **LSP Handlers**: Add to `server/src/server.ts`
3. **UI Views**: Register in `package.json` under `contributes.views`

### Supporting Other Component Libraries

The parser can be extended to support other Web Component patterns:

```typescript
// In server.ts, modify scanComponent()
const patterns = [
	/customElements\.define\s*\(\s*['"]([^'"]+)['"]\s*,\s*(\w+)\s*\)/,
	/define\(['"]([^'"]+)['"]\s*,\s*(\w+)\)/,  // Add more patterns
];
```

## Roadmap

### Phase 1 (Current)
- ✅ Go to Definition
- ✅ Find All References
- ✅ Hover Information
- ✅ Component Tree View
- ✅ Auto-Complete

### Phase 2 (Planned)
- 🔲 Rename Symbol (updates everywhere)
- 🔲 Component dependency graph visualization
- 🔲 CSS duplication detection
- 🔲 Unused component detection
- 🔲 Component usage statistics

### Phase 3 (Future)
- 🔲 Live preview integration
- 🔲 Component generator templates
- 🔲 Test coverage indicators
- 🔲 Documentation generator
- 🔲 Snippet library

## Troubleshooting

### Extension Not Activating

- Check VS Code output panel: "WB Component Navigator"
- Verify workspace has `components/` directory
- Try "Refresh Component Index" command

### Go to Definition Not Working

- Ensure component follows naming convention: `wb-component-name`
- Verify `customElements.define()` exists in JS file
- Check file paths in hover tooltip

### Components Not Appearing in Tree

- Verify components directory path in settings
- Component folders must start with `wb-`
- Run "Refresh Component Index" command

## Contributing

This is a proof-of-concept demonstrating Language Server Protocol for Web Components. Contributions welcome!

### Ideas for Contributors

1. Support for other component libraries (Lit, Stencil)
2. CSS analysis and duplication detection
3. Component usage analytics
4. Visual dependency graphs
5. Integration with testing frameworks

## License

MIT

## Author

John - CieloVistaSoftware

Built to solve the "too many files" problem in component-based web development.
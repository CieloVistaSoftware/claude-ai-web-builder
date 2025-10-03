# Website Builder

A versatile tool for building and modifying websites with an easy-to-use control panel.

## Project Architecture

The Website Builder system has been reorganized into a modular structure for better clarity:

```
wb/
├── wb-core/               # Core WB app
│   ├── wb.html
│   ├── wb.css
│   └── wb.js
│
├── components/            # Web components
│   └── wb-controller/
│       └── wb-controller.js
│
├── conversion/            # Conversion system
│   ├── conversion-engine.js
│   ├── css-compatibility.js
│   ├── file-watcher.js
│   └── cli-converter.js
│
├── stacking/              # File stacking
│   ├── file-stacker.js
│   └── auto-stacker.js
│
├── ui/                    # User interfaces
│   ├── converter-ui/
│   └── stacker-ui/
│
├── toBeConverted/         # Input folder for conversion
└── converted/             # Output folder for conversion
```

For a detailed architecture diagram, see [docs/architecture-diagram.md](docs/architecture-diagram.md).

## Automated Conversion Workflow

The Website Builder supports an automated conversion workflow that allows any website to be made compatible with the Website Builder system.

### How It Works

1. Place any HTML website files into the `toBeConverted` folder
2. The file watcher automatically detects new or changed files and processes them
3. Processed files are saved in the `converted` folder with the same filename
4. When opening a converted file, only the Website Builder control panel is injected (not the entire app)

### Features

- **Automatic CSS Compatibility**: Adds standard CSS properties alongside vendor-prefixed ones
- **Clean Separation**: Control panel is implemented as a web component for clean separation from content
- **Minimalistic Injection**: Only injects the necessary controller code, not the entire Website Builder
- **Real-time Watching**: Automatically detects and processes changes to files in the toBeConverted folder

## Getting Started

1. Clone this repository
2. Run `npm install` to install dependencies
3. Start the file watcher with `npm run watch`
4. Place HTML files in the `toBeConverted` folder
5. Check the `converted` folder for the processed files

## Manual Conversion

If you prefer to convert files manually, you can use the CLI converter:

```bash
node conversion/cli-converter.js path/to/your/file.html
```

## Web Component Controller

The Website Builder control panel is implemented as a web component (`<wb-controller>`), which:

- Loads its own styles
- Provides a user interface for editing, saving, and exporting
- Is draggable and minimizable
- Only appears if the document is marked as wb-compatible
- `converted/`: Output folder for processed files
- `conversion/file-watcher.js`: Watches for file changes and triggers conversion
- `components/wb-controller/wb-controller.js`: Web component for the control panel
- `conversion/cli-converter.js`: Command-line utility for manual conversion

## Starting Development

To run the development environment:

```bash
# Install dependencies (first time only)
npm install

# Start both the file watcher and development server
npm run dev

# Or run the file watcher separately
npm run watch
```

## Documentation

- [Architecture Diagram](docs/architecture-diagram.md): Visual representation of system components
- [File Structure Clarification](docs/file-structure-clarification.md): Detailed explanation of components
- [Code Reorganization Plan](docs/code-reorganization.md): Plan for the modular structure
- [Fixes Log](docs/fixes.md): Record of all system improvements

## Notes

- The `toBeConverted` folder is just a staging area; files should not be tracked there
- CSS compatibility fixes are automatically applied during conversion
- The web component controller is only injected if the document is marked as wb-compatible
- All components are modular and have clear responsibilities

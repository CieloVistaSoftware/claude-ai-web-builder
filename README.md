# WB (Website Builder) - Component-Based Web Development System

A sophisticated web development system featuring 41+ custom web components, wave-based color harmony, and reactive architecture.

## 🎯 What is WB?

WB is a comprehensive web development framework that combines:

- **41+ Web Components** - All prefixed with `wb-` (wb-nav, wb-color-harmony, wb-control-panel, etc.)
- **Wave-Based Color Harmony** - Advanced color theory with PM/FM/AM modulation engines
- **Harmonic Color System (HCS)** - CSS variable-based theming with 15+ color variations
- **Reactive Architecture** - Event-driven components with observable patterns
- **Component Ecosystem** - Self-contained components with demos and documentation

## 🏗️ Architecture Overview

```
wb/
├── components/                    # 41+ web components (wb-*)
│   ├── wb-base/                  # Foundation component
│   ├── wb-color-harmony/         # Wave-based color system
│   ├── wb-control-panel/         # HCS control interface
│   ├── wb-nav/                   # Navigation component
│   └── [39 other components]     # Complete component library
│
├── docs/                         # Comprehensive documentation
│   ├── currentstatus.md          # Project status & roadmap
│   ├── fixes.md                  # All code change log
│   ├── architecture/             # System architecture docs
│   └── component-guides/         # Component development guides
│
├── html/                         # Demo pages & articles
│   └── [Color Harmony System]/   # Professional demos
│
├── styles/                       # Global styles & themes
│   └── main.css                  # HCS color system
│
└── [config & build files]
```

## 🌈 Key Features

### Wave-Based Color Harmony System
- **Traditional Modes**: Complementary, Analogous, Triadic, Split-Complementary, Monochromatic
- **Wave-Based Modes**: Phase Modulation (PM), Frequency Modulation (FM), Amplitude Modulation (AM)
- **Advanced Features**: Beat Patterns, Doppler Shift, Wave Superposition
- **Real-time Modulation**: Audio-reactive color generation
- **15 Color Variations**: Primary, Secondary, Accent, Highlight + 11 angle variations

### Component Architecture
- **41 Web Components** - Complete UI component library
- **Reactive Patterns** - Event-driven with observable state
- **Shadow DOM** - Style encapsulation where needed
- **CSS-First** - External stylesheets, no inline styles
- **Self-Contained** - Each component includes JS, CSS, demo, and docs

### Development Standards
- **ES6 Modules Only** - No CommonJS/require
- **WebSockets** - Backend communication protocol
- **Playwright Testing** - Automated test framework
- **Windows-First** - PowerShell build scripts
- **claude.md Files** - Component-specific documentation and issues

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Windows environment (PowerShell)
- Modern browser (Chrome 60+, Firefox 55+, Safari 12+)

### Installation
```bash
# Clone repository
git clone https://github.com/CieloVistaSoftware/claude-ai-web-builder.git
cd claude-ai-web-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Basic Usage
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>WB Components Demo</title>
    <link rel="stylesheet" href="/styles/main.css">
</head>
<body data-theme="dark">
    <!-- Navigation -->
    <wb-nav layout="vertical" items='[
        {"text": "🌙 Dark", "id": "mode-dark", "data-mode": "dark"},
        {"text": "☀️ Light", "id": "mode-light", "data-mode": "light"}
    ]'></wb-nav>

    <!-- Color Harmony System -->
    <wb-color-harmony mode="complementary" base-hue="240"></wb-color-harmony>

    <!-- Control Panel -->
    <wb-control-panel></wb-control-panel>

    <!-- Load components -->
    <script src="/components/wb-nav/wb-nav.js"></script>
    <script src="/components/wb-color-harmony/wb-color-harmony.js"></script>
    <script src="/components/wb-control-panel/wb-control-panel.js"></script>
</body>
</html>
```

## 📚 Documentation

### Getting Started
- **[Architecture Standards](docs/architecture/ARCHITECTURE-STANDARDS.md)** - System design principles
- **[Component Guide](docs/component-guides/COMPONENT-GUIDE.md)** - Component development standards
- **[Current Status](docs/currentstatus.md)** - Project progress and roadmap

### Component Documentation
- **[wb-color-harmony](components/wb-color-harmony/README.md)** - Wave-based color system
- **[wb-control-panel](components/wb-control-panel/wb-control-panel.md)** - HCS interface
- **[wb-nav](components/wb-nav/wb-nav.md)** - Navigation component
- **[Complete Component List](docs/status-issues/DOCUMENTATION-STATUS-REPORT.md)** - All 41 components

### Development
- **[Fixes Log](docs/fixes.md)** - All code changes with reasons
- **[Unified Instructions](docs/UnifiedInstructions.md)** - Complete development standards
- **[Testing Standards](docs/component-guides/WB-Component-Testing-Standards.md)** - Quality assurance

## 🎨 Color Harmony System (HCS)

The Harmonic Color System provides mathematically harmonious colors using wave theory:

### Traditional Modes
- **Complementary** - Opposite colors on color wheel
- **Analogous** - Adjacent colors (30° apart)
- **Triadic** - Three colors 120° apart
- **Split-Complementary** - Base + two adjacent to complement
- **Monochromatic** - Variations of single hue

### Wave-Based Modes
- **Phase Modulation (PM)** - Hue oscillation patterns
- **Frequency Modulation (FM)** - Sweeping color transitions
- **Amplitude Modulation (AM)** - Saturation pulsing effects
- **Beat Patterns** - Rhythmic color variations
- **Doppler Shift** - Directional color transitions

### Usage
```javascript
// Initialize color harmony
const harmony = new WBColorHarmony({
    mode: 'complementary',
    baseHue: 240,        // Blue
    saturation: 70,
    lightness: 50
});

// Get color palette
const colors = harmony.generatePalette();
console.log(colors.primary);    // Main brand color
console.log(colors.secondary);  // 180° complement
console.log(colors.accent);     // 30° variation
```

## 🧩 Component System

### Component Categories
- **UI Components** - Buttons, inputs, selects, modals
- **System Components** - Control panels, navigation, layouts
- **Utility Components** - Color transformers, event logs, dev tools
- **Specialized Components** - Color pickers, harmony generators, audio controls

### Component Standards
- **Naming**: All start with `wb-` prefix
- **Inheritance**: Extend `WBBaseComponent` (not HTMLElement)
- **Structure**: JS, CSS, demo.html, claude.md, schema.json
- **Events**: Custom events with `wb:` prefix
- **Styling**: External CSS files, CSS variables
- **Testing**: Playwright test suites

### Example Component
```javascript
import { WBBaseComponent } from '../wb-base/wb-base.js';

class WBButton extends WBBaseComponent {
    constructor() {
        super();
        this.variant = 'primary';
        this.size = 'medium';
    }

    render() {
        this.innerHTML = `
            <button class="wb-button ${this.variant} ${this.size}">
                <slot></slot>
            </button>
        `;
    }
}

customElements.define('wb-button', WBButton);
```

## 🛠️ Development Workflow

### Component Development
1. **Create Structure** - JS, CSS, demo.html, claude.md
2. **Extend WBBaseComponent** - Get logging, events, theme handling
3. **Follow Patterns** - Reactive architecture, event-driven
4. **Add Documentation** - Comprehensive .md file
5. **Create Tests** - Playwright test suite
6. **Update Status** - Log in currentstatus.md and fixes.md

### Quality Gates
- **TypeScript Clean** - No compilation errors
- **ESLint Clean** - Code style compliance
- **Test Passing** - All Playwright tests pass
- **Documentation Complete** - Component fully documented
- **Demo Working** - Interactive demo functional

### Build & Deploy
```bash
# Development
npm run dev          # Start dev server
npm run watch        # File watcher
npm run test         # Run tests

# Production
npm run build        # Build for production
npm run deploy       # Deploy to production
```

## 📊 Project Status

- **Components**: 41 total, 5 documented (12%)
- **Inheritance**: 1/41 properly extended (WBBaseComponent)
- **Testing**: Framework configured, tests pending
- **Documentation**: Active sprint in progress
- **Health**: 🟢 Excellent - systematic development approach

See **[Current Status](docs/currentstatus.md)** for detailed progress tracking.

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/component-name`
3. Follow component development standards
4. Add comprehensive tests
5. Update documentation
6. Submit pull request

### Standards Compliance
- All code changes logged in `docs/fixes.md`
- Components extend `WBBaseComponent`
- ES6 modules only, no CommonJS
- CSS-first architecture
- Reactive event patterns
- Playwright testing

### Documentation Requirements
- Component `.md` file with all sections
- `claude.md` for issues and development notes
- Update `currentstatus.md` with progress
- Demo HTML file with working examples

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Wave-based color theory research
- Web Components API innovation
- Reactive programming patterns
- Open source community contributions

---

**Built with ❤️ using Web Components, Wave Theory, and Reactive Architecture**

*Last Updated: October 18, 2025*

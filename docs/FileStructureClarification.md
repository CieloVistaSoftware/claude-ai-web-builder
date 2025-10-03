# Website Builder - File Structure Clarification (Updated 2025-09-29)

## Current System Architecture

The Website Builder (WB) system has been significantly reorganized and evolved into a comprehensive component-based architecture:

### 1. Core Website Builder (`/Working`)

- **Purpose**: Primary development workspace with main app functionality
- **Key Files**:
  - `index.html` - Main application entry point
  - `main.ts`, `script.ts` - Core application logic (TypeScript)
  - `styles.css` - Main application styles
  - `server.ts` - Development server
- **Architecture**: Modern TypeScript-based with modular components
- **Status**: Active development area with comprehensive testing

### 2. Component System (`/components`)

- **Purpose**: Modular web components library with data-driven architecture
- **Structure**: Each component has standardized structure:
  ```
  wb-component-name/
  ├── wb-component-name.js      # Component logic
  ├── wb-component-name.css     # Component styles
  ├── wb-component-name.json    # Data-driven config
  ├── wb-component-name-demo.html # Demo page
  ├── wb-component-name.md      # Documentation
  └── claude.md                 # Component-specific issues/notes
  ```
- **Components**: 13 active components (wb-button, wb-select, wb-input, wb-modal, wb-status, etc.)
- **Issues**: Some components have functionality gaps (documented in claude.md files)

### 3. WB Core System (`/wb-core`)

- **Purpose**: Standalone website builder core functionality
- **Key Files**:
  - `wb.html`, `wb.css`, `wb.js` - Core standalone implementation
  - `backup/` - Version backups and documentation
  - `layouts/` - Layout management system
  - `wb-data-binding.js` - Data binding utilities
- **Status**: Standalone version with save functionality issues

### 4. File Processing Systems

#### Conversion System (`/conversion`)
- **Purpose**: Convert external websites for WB compatibility
- **Files**:
  - `conversion-engine.ts` - Main conversion logic
  - `cli-converter.ts` - Command-line interface
  - `file-watcher.ts` - Automatic file watching
- **Status**: TypeScript implementation, mature system

#### Stacking System (`/stacking`)
- **Purpose**: Combine related files into single packages
- **Files**:
  - `file-stacker.ts` - Core stacking functionality
  - `auto-stacker.ts` - Automated stacking
- **Status**: Consolidated, TypeScript-based

### 5. Development Infrastructure

#### Testing (`/tests`, `/Working/tests`)
- **Framework**: Playwright for end-to-end testing
- **Coverage**: Component functionality, theme management, WebSocket communication
- **Results**: Test reports in `/test-results` and `/playwright-report`

#### Server Architecture (`/src/servers`)
- **WebSocket Server**: `unified-claude-websocket-server.ts`
- **Health Monitoring**: `server-health-check.ts`
- **Testing**: Dedicated test servers for development

#### Build & Development
- **TypeScript**: Full TypeScript migration completed
- **Vite**: Modern build system (`vite.config.ts`)
- **Package Management**: Multiple `package.json` files for different modules

## Current Workflows & Integrations

The system now operates through several mature workflows:

### 1. Component Development Workflow
- **Component Creation**: Standardized structure with `.js`, `.css`, `.json`, `.md`, and demo files
- **Data-Driven Configuration**: JSON-based component configuration
- **Testing**: Individual component demos with Playwright integration
- **Documentation**: Automated documentation generation and claude.md issue tracking

### 2. Website Building Workflow
- **Main Application**: `/Working/index.html` serves as primary interface
- **Component Integration**: Components load dynamically via factory pattern
- **Theme Management**: Centralized theme system with dark mode support
- **Save/Load**: Persistent website state management (with known issues in standalone version)

### 3. Development & Testing Workflow
- **TypeScript Development**: Full TS support with build pipeline
- **Live Server**: Development server with hot reload
- **Automated Testing**: Playwright tests with comprehensive coverage
- **WebSocket Communication**: Real-time communication for advanced features

### 4. File Processing Workflow
- **Conversion**: External website compatibility conversion (TypeScript-based)
- **Stacking**: File combination and packaging system
- **Monitoring**: File watching and automatic processing

## Current System Responsibilities (2025)

The system has evolved into clearly defined responsibilities:

### 1. Core Website Builder (`/Working`)
- ✅ **Primary UI**: Modern TypeScript-based application interface
- ✅ **Component Integration**: Dynamic component loading and management
- ✅ **Theme System**: Comprehensive dark/light mode with multiple themes
- ✅ **State Management**: Website state persistence and management
- ⚠️ **Save Functionality**: Known issues in standalone version

### 2. Component Library (`/components`)
- ✅ **Modular Architecture**: 13 standardized web components
- ✅ **Data-Driven Design**: JSON configuration for all components
- ✅ **Documentation System**: Comprehensive docs and demo structure
- ⚠️ **Functionality Gaps**: Some components need fixes (see claude.md files)

### 3. Development Infrastructure
- ✅ **TypeScript Migration**: Complete conversion from JavaScript
- ✅ **Testing Framework**: Playwright-based comprehensive testing
- ✅ **Build System**: Modern Vite configuration
- ✅ **Server Architecture**: WebSocket-based communication

### 4. File Processing Systems
- ✅ **Conversion Engine**: Mature TypeScript-based website conversion
- ✅ **Stacking System**: Consolidated file combination utilities
- ✅ **Automation**: File watching and automatic processing

### 5. Specialized Tools
- ✅ **Chrome Extension**: Root CSS extractor (`/components/rootextractor`)
- ✅ **MCP Server**: Documentation server integration
- ✅ **Plugin System**: Extensible plugin architecture

## Current File Structure (2025)

```
wb/
├── Working/                    # Primary development workspace
│   ├── index.html             # Main application entry
│   ├── main.ts                # Core TypeScript logic
│   ├── server.ts              # Development server
│   ├── components/            # Working components
│   ├── core/                  # Core systems (theme, state, etc.)
│   ├── tests/                 # Playwright test suite
│   └── docs/                  # Working documentation
│
├── components/                 # Component library
│   ├── wb-button/             # Button component
│   ├── wb-select/             # Select component
│   ├── wb-input/              # Input component
│   ├── wb-modal/              # Modal component
│   ├── wb-status/             # Status component
│   ├── wb-toggle/             # Toggle component
│   ├── wb-slider/             # Slider component
│   ├── wb-viewport/           # Viewport component
│   ├── wb-nav/                # Navigation component
│   ├── wb-log-error/          # Error logging component
│   ├── change-text/           # Text editing component
│   ├── image-insert/          # Image insertion component
│   ├── color-bar/             # Color bar component
│   ├── control-panel/         # Control panel component
│   ├── control-panel-new/     # New control panel (in progress)
│   ├── rootextractor/         # Chrome extension for CSS extraction
│   └── wb-component-utils.js  # Shared component utilities
│
├── wb-core/                   # Standalone WB system
│   ├── wb.html, wb.css, wb.js # Core standalone files
│   ├── layouts/               # Layout management
│   └── backup/                # Version backups
│
├── src/                       # Source utilities
│   ├── servers/               # Server implementations
│   ├── converters/            # Website conversion tools
│   ├── file-handling/         # File operation utilities
│   └── utils/                 # General utilities
│
├── conversion/                # Conversion system
│   ├── conversion-engine.ts   # Main conversion logic
│   ├── cli-converter.ts       # CLI interface
│   └── file-watcher.ts        # File monitoring
│
├── stacking/                  # File stacking system
│   ├── file-stacker.ts        # Core stacking
│   └── auto-stacker.ts        # Automated stacking
│
├── tests/                     # Main test suite
├── docs/                      # Documentation
├── config/                    # Configuration files
├── scripts/                   # Build and utility scripts
├── ui/                        # User interfaces
│   ├── converter-ui/          # Conversion interface
│   └── stacker-ui/            # Stacking interface
│
├── mcp-server/                # MCP documentation server
├── plugins/                   # Plugin system
├── examples/                  # Example implementations
├── toBeConverted/             # Conversion input
└── converted/                 # Conversion output
```

## Current Status & Priorities (2025)

### ✅ Completed Improvements
1. **TypeScript Migration**: Full conversion from JavaScript to TypeScript
2. **Component Standardization**: Unified component structure across 13 components
3. **Testing Infrastructure**: Comprehensive Playwright test suite
4. **Documentation System**: Standardized docs with claude.md issue tracking
5. **Build System**: Modern Vite-based build pipeline
6. **Server Architecture**: WebSocket-based communication system

### ⚠️ Current Issues
1. **Component Functionality**: Several components have broken functionality (see `/docs/component-issues-proposal.md`)
2. **Save System**: Standalone version save functionality needs repair
3. **Dark Mode**: Inconsistent dark mode implementation across components
4. **Documentation Gaps**: Missing .md files for some components

### 🎯 Immediate Priorities
1. **Component Repair**: Fix broken functionality in wb-select, wb-input, wb-status, change-text
2. **Dark Mode Standardization**: Implement consistent dark mode across all components
3. **Documentation Completion**: Create missing documentation files
4. **Testing Coverage**: Expand test coverage for all components

### 🔄 Ongoing Maintenance
1. **Code Deduplication**: Remove duplicate utility functions across components
2. **Performance Optimization**: Improve component loading and rendering
3. **Accessibility**: Ensure WCAG 2.1 compliance across all components
4. **Browser Compatibility**: Test and fix cross-browser issues

## Development Workflow

### Component Development
1. Create component in `/components/wb-component-name/`
2. Follow standardized structure: `.js`, `.css`, `.json`, `.md`, demo
3. Add component-specific issues to `claude.md`
4. Test with Playwright in both main and Working test suites

### System Development
1. Primary development in `/Working/` workspace
2. TypeScript-first approach for all new code
3. WebSocket communication for advanced features
4. Comprehensive testing before deployment

### File Organization
- **Working Code**: `/Working/` - Active development
- **Components**: `/components/` - Reusable component library
- **Core System**: `/wb-core/` - Standalone implementation
- **Utilities**: `/src/` - Supporting tools and services
- **Documentation**: `/docs/` - System documentation
- **Testing**: `/tests/` and `/Working/tests/` - Test suites

## Architecture Evolution

The Website Builder has evolved from a simple file-based system into a sophisticated component-based architecture with:

- **Modern TypeScript**: Type safety and better development experience
- **Component Library**: Reusable, data-driven web components
- **Testing Framework**: Automated testing with visual regression
- **Documentation System**: Comprehensive docs with issue tracking
- **Build Pipeline**: Modern development and deployment tools
- **Plugin Architecture**: Extensible system for custom functionality

This represents a significant advancement in code quality, maintainability, and developer experience compared to the original file structure.

---
*Last Updated: 2025-09-29*
*Version: 2.0.0*
*Author: Claude Code Assistant*
*Status: Current - Updated with 2025 architecture*
---

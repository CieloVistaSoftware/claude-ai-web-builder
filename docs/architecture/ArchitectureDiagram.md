
# Website Builder System Architecture (2025)

---
*Last Updated: 2025-09-29*
*Version: 2.0.0*
*Status: Current - Modular TypeScript Architecture*
---

## System Layers & Key Folders

| Layer                | Folder         | Key Files/Features                                      |
|----------------------|---------------|---------------------------------------------------------|
| Working Core         | /Working       | index.html, main.ts, server.ts, styles.css              |
| Component Library    | /components    | wb-button, wb-select, wb-input, ... (13+ components)    |
| WB Standalone Core   | /wb-core       | wb.html, wb.js, wb.css, layouts/, backup/               |
| Conversion System    | /conversion    | conversion-engine.ts, cli-converter.ts, file-watcher.ts |
| Stacking System      | /stacking      | file-stacker.ts, auto-stacker.ts                        |
| User Interfaces      | /ui            | converter-ui, stacker-ui                                |
| Plugins/Extensions   | /plugins       | obfuscator-plugin, rootextractor                        |
| Documentation        | /docs          | Architecture, issues, guides                            |
| Tests                | /tests         | Playwright test suite                                   |
| Data/Config          | /data, /config | knowledge-base.json, components.config.json             |

---



## High-Level Architecture Diagram





Website Builder System (v2.0)

### Components Folders

- [components/](../../components/)
   - [archive/](../../components/archive/)
   - [claude-logger/](../../components/claude-logger/)
   - [component-helpers/](../../components/component-helpers/)
   - [layout/](../../components/layout/)
   - [wb-1rem/](../../components/wb-1rem/)
   - [wb-base/](../../components/wb-base/)
   - [wb-button/](../../components/wb-button/)
   - [wb-card/](../../components/wb-card/)
   - [wb-change-text/](../../components/wb-change-text/)
   - [wb-chatbot/](../../components/wb-chatbot/)
   - [wb-claude-logger/](../../components/wb-claude-logger/)
   - [wb-color-bar/](../../components/wb-color-bar/)
   - [wb-color-bars/](../../components/wb-color-bars/)
   - [wb-color-harmony/](../../components/wb-color-harmony/)
   - [wb-color-mapper/](../../components/wb-color-mapper/)
   - [wb-color-organ/](../../components/wb-color-organ/)
   - [wb-color-picker/](../../components/wb-color-picker/)
   - [wb-color-transformer/](../../components/wb-color-transformer/)
   - [wb-color-utils/](../../components/wb-color-utils/)
   - [wb-control-panel/](../../components/wb-control-panel/)
   - [wb-css/](../../components/wb-css/)
   - [wb-css-loader/](../../components/wb-css-loader/)
   - [wb-demo/](../../components/wb-demo/)
   - [wb-dev-toolbox/](../../components/wb-dev-toolbox/)
   - [wb-event-log/](../../components/wb-event-log/)
   - [wb-footer/](../../components/wb-footer/)
   - [wb-grid/](../../components/wb-grid/)
   - [wb-header/](../../components/wb-header/)
   - [wb-hero/](../../components/wb-hero/)
   - [wb-image-insert/](../../components/wb-image-insert/)
   - [wb-inject-test/](../../components/wb-inject-test/)
   - [wb-input/](../../components/wb-input/)
   - [wb-keyboard-manager/](../../components/wb-keyboard-manager/)
   - [wb-layout/](../../components/wb-layout/)
   - [wb-linkedinAd/](../../components/wb-linkedinAd/)
   - [wb-log-error/](../../components/wb-log-error/)
   - [wb-log-viewer/](../../components/wb-log-viewer/)
   - [wb-modal/](../../components/wb-modal/)
   - [wb-nav/](../../components/wb-nav/)
   - [wb-rag/](../../components/wb-rag/)
   - [wb-reactive-base/](../../components/wb-reactive-base/)
   - [wb-resize-both/](../../components/wb-resize-both/)
   - [wb-resize-eastwest/](../../components/wb-resize-eastwest/)
   - [wb-resize-panel/](../../components/wb-resize-panel/)
   - [wb-resize-updown/](../../components/wb-resize-updown/)
   - [wb-search/](../../components/wb-search/)
   - [wb-select/](../../components/wb-select/)
   - [wb-semanticElements/](../../components/wb-semanticElements/)
   - [wb-slider/](../../components/wb-slider/)
   - [wb-status/](../../components/wb-status/)
   - [wb-tab/](../../components/wb-tab/)
   - [wb-table/](../../components/wb-table/)
   - [wb-theme/](../../components/wb-theme/)
   - [wb-toggle/](../../components/wb-toggle/)
   - [wb-viewport/](../../components/wb-viewport/)
   - [wb-xtest/](../../components/wb-xtest/)
   - [_TEMPLATE/](../../components/_TEMPLATE/)

### Docs Folders

- [docs/](../../docs/)
   - [api-specs/](../../docs/api-specs/)
   - [architecture/](../../docs/architecture/)
   - [archive/](../../docs/archive/)
   - [articles/](../../docs/articles/)
   - [build/](../../docs/build/)
   - [claude/](../../docs/claude/)
   - [component-guides/](../../docs/component-guides/)
   - [configuration/](../../docs/configuration/)
   - [contributing/](../../docs/contributing/)
   - [design/](../../docs/design/)
   - [events-logging/](../../docs/events-logging/)
   - [finished/](../../docs/finished/)
   - [guides/](../../docs/guides/)
   - [howto/](../../docs/howto/)
   - [learning/](../../docs/learning/)
   - [migration/](../../docs/migration/)
   - [misc/](../../docs/misc/)
   - [prototype/](../../docs/prototype/)
   - [reference/](../../docs/reference/)
   - [reports/](../../docs/reports/)
   - [scripts/](../../docs/scripts/)
   - [setup/](../../docs/setup/)
   - [simple-ide/](../../docs/simple-ide/)
   - [status/](../../docs/status/)
   - [system/](../../docs/system/)
   - [testing/](../../docs/testing/)
   - [todo/](../../docs/todo/)
   - [troubleshooting/](../../docs/troubleshooting/)
   - [_archived/](../../docs/_archived/)
   - [_today/](../../docs/_today/)

**Enhanced Features:**
- Theme System: 6+ themes, live switching
- Layout Management: top/left/right nav, sticky, z-index fixes
- Save/Import: full state persistence
- Color Variable Mapping: legacy CSS compatibility
- Plugins: obfuscation, dev-only tools, auto-removal on export
- Local Storage: persistent settings
- CSS Compatibility: vendor prefix fixes, layout fixes
- WebSocket communication, health monitoring
- Playwright automated testing
- MCP documentation server integration

### Quick Reference Table

| Layer/Module         | Folder         | Key Features/Files                |
|----------------------|---------------|-----------------------------------|
| Working Core         | /Working      | UI Layer, main.ts, server.ts, docs|
| Components Library   | /components   | 13+ components, Chrome extension  |
| WB Standalone Core   | /wb-core      | wb.html, wb.js, wb.css, layouts   |
| Conversion System    | /conversion   | conversion-engine.ts, CLI, watcher|
| Stacking System      | /stacking     | file-stacker.ts, auto-stacker.ts  |
| Source Utilities     | /src          | servers, converters, utils        |
| User Interfaces      | /ui           | converter-ui, stacker-ui          |
| Plugins/Extensions   | /plugins      | obfuscator-plugin, rootextractor  |
| Documentation        | /docs         | Architecture, issues, guides      |
| Tests                | /tests        | Playwright test suite             |
| Config/Data          | /config, /data| config.json, knowledge-base.json  |
| MCP Server           | /mcp-server   | Documentation server integration  |
| Examples             | /examples     | Example implementations           |
| Conversion Input     | /toBeConverted| Input files for conversion        |
| Conversion Output    | /converted    | WB-compatible output              |

---

## Component Relationships (2025)

**Working Core**: Main app, dynamic component integration, theme/layout/state management, live server.

**Component Library**: 13+ modular web components, JSON config, demos, Playwright tests.

**Conversion System**: TypeScript-based, CLI and file watcher, legacy CSS compatibility, controller/color-mapper injection.

**Stacking System**: File combination, auto-detection, dependency management.

**Plugins**: Obfuscator, Chrome extension, extensible dev tools, auto-removal on export.

**User Interfaces**: Converter UI, Stacker UI, unified design, batch ops, progress feedback.

---

## Data Flow (v2.0)

1. **Conversion Workflow**
   - User places files in `/toBeConverted`
   - File watcher triggers conversion
   - Conversion engine applies enhancements, injects components, maps legacy CSS
   - Outputs to `/converted` (WB-compatible)

2. **Theme/Layout Management**
   - User selects theme/layout in UI/component
   - Updates attributes, triggers color-mapper, persists via localStorage

3. **Save/Import System**
   - Save captures full state (theme, layout, CSS vars, content)
   - Import restores state, cleans dev tools

4. **Plugin Integration**
   - Plugins available in dev, auto-removed on export

5. **Stacking Operations**
   - Auto-detects related files, combines with dependency management

6. **Error Handling**
   - UI feedback, console logging, graceful fallback

---

## Summary

- Modular, TypeScript-first architecture
- Standardized component library
- Automated testing and build pipeline
- Enhanced theme/layout/save systems
- Extensible plugin and UI layers
- Clear separation of concerns for maintainability

## Component Relationships (Updated)

1. **Website Builder Core** - The main application for building and editing websites
   - Enhanced with comprehensive theme system (Light, Dark, Cyberpunk, Ocean, Sunset, Forest)
   - Advanced layout management (Top/Left/Right navigation with sticky positioning)
   - Improved save/import functionality with complete state persistence
   - Integrated localStorage for session persistence

2. **Web Components System** - Advanced reusable custom elements
   - `wb-controller` component with enhanced mini control panel
   - Theme switching capabilities with live preview
   - Layout controls with real-time layout switching
   - Color selection with preset themes and custom colors
   - `color-mapper` component for legacy CSS variable compatibility
   - Automatically injected into converted sites for seamless editing

3. **Conversion System** - Enhanced website conversion for WB compatibility
   - Processes HTML files from toBeConverted folder with advanced parsing
   - Applies comprehensive CSS compatibility fixes including vendor prefixes
   - Marks sites as WB-compatible with proper metadata
   - Injects both wb-controller and color-mapper components
   - Auto-detects and maps legacy CSS variables to new theme system
   - Outputs fully enhanced sites to converted folder

4. **Theme & Color Management System** - NEW comprehensive theming engine
   - Bridges legacy color variables with modern theme system
   - Supports multiple themes with consistent variable mapping
   - Handles color theming across different website architectures
   - Provides seamless theme switching for converted sites
   - Ensures visual consistency across all supported themes

5. **File Stacking System** - Enhanced file combination utilities
   - Intelligent grouping of HTML, CSS, and JS files by name and relationship
   - Advanced auto-detection with improved file matching algorithms
   - Creates optimized stacked file packages with dependency management

6. **Developer Plugins System** - NEW development-only tools
   - Obfuscation plugin for code protection during development
   - Auto-removal of development plugins from exported websites
   - Secure development environment with customer-safe exports
   - Extensible plugin architecture for additional development tools

7. **User Interfaces** - Enhanced separate UIs for different tools
   - Converter UI with progress feedback and batch operations
   - Stacker UI with advanced file operations and results display
   - Unified design language across all interface components

## Data Flow (Enhanced v2.0)

### Primary Conversion Workflow
1. User places HTML files in `toBeConverted` folder
2. File watcher detects changes and triggers enhanced conversion process
3. Conversion engine processes files with comprehensive enhancements:
   - Applies CSS compatibility fixes (vendor prefixes, layout fixes)
   - Injects wb-controller component for editing capabilities
   - Injects color-mapper component for theme compatibility
   - Maps legacy CSS variables to new theme system
   - Adds metadata for WB compatibility tracking
4. Enhanced files are saved to `converted` folder with full functionality

### Theme and Layout Management
1. User selects theme/layout in wb-controller or main app
2. Theme selection triggers:
   - Update of data-theme, data-layout, data-mode attributes
   - Color-mapper activation for legacy variable mapping
   - CSS custom property updates for seamless theme switching
   - localStorage persistence for session management
3. Changes are immediately visible and persist across sessions

### Save and Import System
1. User triggers save in Website Builder Core
2. Save system captures complete state:
   - Current theme, layout, and mode settings
   - All CSS custom properties and variables
   - Content structure and meta information
   - Class names and attribute states
3. Generated HTML file includes:
   - Embedded theme CSS and variables
   - Initialization script for proper loading
   - Cleaned content (no edit controls or dev tools)
   - Complete standalone functionality
4. Import process reverses this, restoring full state

### Developer Plugin Integration
1. Development plugins (e.g., obfuscator) are available during development
2. Plugins communicate with main system via plugin API
3. On export/save, development plugins are automatically removed
4. Final output is clean and customer-ready

### File Stacking Operations
1. Auto-stacker detects related files by name and type
2. Intelligent grouping analyzes file relationships
3. Core stacker combines files with dependency management
4. Result packages maintain functionality while reducing file count

### Error Handling and Feedback
- Comprehensive error handling at each stage
- User feedback through UI status messages
- Console logging for debugging and development
- Graceful degradation with fallback defaults

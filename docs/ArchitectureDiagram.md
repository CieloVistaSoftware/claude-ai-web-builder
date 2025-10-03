# Website Builder Architecture Diagram (Updated)

---
*Last Updated: 2025-09-29*
*Version: 1.1.0*
*Author: Claude Code Assistant*
*Status: Current - System architecture overview*
---

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        Website Builder System (WB v2.0)                                    │
│                                                                                                             │
│  ┌─────────────────────────────────┐     ┌─────────────────────────────────┐     ┌─────────────────────────┐  │
│  │      Website Builder Core       │     │        Conversion System        │     │     Theme & Color       │  │
│  │       (wb-core folder)          │     │      (conversion folder)        │     │   Management System     │  │
│  │                                 │     │                                 │     │                         │  │
│  │  ┌─────────────┐ ┌────────────┐ │     │  ┌─────────────────────────────┐ │     │  ┌─────────────────────┐ │  │
│  │  │   wb.html   │ │   wb.js    │ │     │  │   conversion-engine.js      │ │     │  │  color-mapper.js    │ │  │
│  │  │             │ │            │ │     │  │                             │ │     │  │                     │ │  │
│  │  │ • Main app  │ │ • Core     │ │     │  │ • Process HTML files        │ │     │  │ • Legacy variable   │ │  │
│  │  │ • Edit UI   │ │   logic    │ │     │  │ • CSS compatibility fixes   │ │     │  │   mapping           │ │  │
│  │  │ • Themes    │ │ • Layout   │ │     │  │ • Mark as compatible        │ │     │  │ • Theme bridging    │ │  │
│  │  │ • Layouts   │ │   mgmt     │ │     │  │ • Inject wb-controller      │ │     │  │ • Color theming     │ │  │
│  │  └─────────────┘ └────────────┘ │     │  └─────────────┬───────────────┘ │     │  └─────────────────────┘ │  │
│  │           │                     │     │                │                 │     │                         │  │
│  │           ▼                     │     │                ▼                 │     │                         │  │
│  │  ┌─────────────────────────────┐ │     │  ┌─────────────────────────────┐ │     │                         │  │
│  │  │         wb.css              │ │     │  │     file-watcher.js         │ │     │                         │  │
│  │  │                             │ │     │  │                             │ │     │                         │  │
│  │  │ • Layout CSS (top/left/rt)  │ │     │  │ • Watch toBeConverted      │ │     │                         │  │
│  │  │ • Theme variables           │ │     │  │ • Auto convert files       │ │     │                         │  │
│  │  │ • Navigation styling        │ │     │  │ • CSS compatibility        │ │     │                         │  │
│  │  └─────────────────────────────┘ │     │  └─────────────────────────────┘ │     │                         │  │
│  └─────────────────────────────────┘     └─────────────────────────────────┘     └─────────────────────────┘  │
│                     │                                       │                                       │          │
│                     ▼                                       ▼                                       ▼          │
│  ┌─────────────────────────────────┐     ┌─────────────────────────────────┐     ┌─────────────────────────┐  │
│  │      Web Components System      │     │      File Stacking System       │     │    Developer Plugins    │  │
│  │      (components folder)        │     │       (stacking folder)         │     │                         │  │
│  │                                 │     │                                 │     │                         │  │
│  │  ┌─────────────────────────────┐ │     │  ┌─────────────────────────────┐ │     │  ┌─────────────────────┐ │  │
│  │  │     wb-controller.js        │ │     │  │     file-stacker.js         │ │     │  │  obfuscator plugin  │ │  │
│  │  │                             │ │     │  │                             │ │     │  │                     │ │  │
│  │  │ • Mini control panel        │ │     │  │ • Core stacking logic       │ │     │  │ • Code obfuscation  │ │  │
│  │  │ • Theme switching           │ │     │  │ • Combine HTML/CSS/JS       │ │     │  │ • Dev-only tools    │ │  │
│  │  │ • Layout controls           │ │     │  │ • Group by name             │ │     │  │ • Auto-removal      │ │  │
│  │  │ • Color selection           │ │     │  └─────────────┬───────────────┘ │     │  │   on export         │ │  │
│  │  │ • Injected into sites       │ │     │                │                 │     │  └─────────────────────┘ │  │
│  │  └─────────────┬───────────────┘ │     │                ▼                 │     │                         │  │
│  │                │                 │     │  ┌─────────────────────────────┐ │     │                         │  │
│  │                ▼                 │     │  │     auto-stacker.js         │ │     │                         │  │
│  │  ┌─────────────────────────────┐ │     │  │                             │ │     │                         │  │
│  │  │     color-mapper.js          │ │     │  │ • Auto detect files        │ │     │                         │  │
│  │  │                             │ │     │  │ • Intelligent grouping      │ │     │                         │  │
│  │  │ • Maps legacy variables     │ │     │  └─────────────────────────────┘ │     │                         │  │
│  │  │ • Theme compatibility       │ │     │                                 │     │                         │  │
│  │  │ • Injected during conv.     │ │     │                                 │     │                         │  │
│  │  └─────────────────────────────┘ │     │                                 │     │                         │  │
│  └─────────────────────────────────┘     └─────────────────────────────────┘     └─────────────────────────┘  │
│                     │                                       │                                                  │
│                     ▼                                       ▼                                                  │
│  ┌─────────────────────────────────┐     ┌─────────────────────────────────┐                                  │
│  │       User Interfaces           │     │          Input/Output           │                                  │
│  │        (ui folder)              │     │                                 │                                  │
│  │                                 │     │  ┌────────────┐  ┌────────────┐ │                                  │
│  │  ┌─────────────┐ ┌─────────────┐ │     │  │            │  │            │ │                                  │
│  │  │converter-ui │ │ stacker-ui  │ │     │  │toBeConvrted│  │  converted │ │                                  │
│  │  │             │ │             │ │     │  │  (input)   │  │  (output)  │ │                                  │
│  │  │• Manual     │ │• File stack │ │     │  │            │  │            │ │                                  │
│  │  │  conversion │ │  operations │ │     │  │• HTML files│  │• WB sites  │ │                                  │
│  │  │• Progress   │ │• Batch ops  │ │     │  │• Raw sites │  │• Controller│ │                                  │
│  │  │  feedback   │ │• Results    │ │     │  │            │  │  injected  │ │                                  │
│  │  └─────────────┘ └─────────────┘ │     │  └────────────┘  └────────────┘ │                                  │
│  │                                 │     │                                 │                                  │
│  └─────────────────────────────────┘     └─────────────────────────────────┘                                  │
│                                                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                    Enhanced Features (v2.0)                                              │ │
│  │                                                                                                           │ │
│  │  • Theme System: Light, Dark, Cyberpunk, Ocean, Sunset, Forest themes with live switching               │ │
│  │  • Layout Management: Top/Left/Right navigation with sticky positioning and z-index fixes               │ │
│  │  • Save/Import System: Complete state persistence including themes, layouts, colors, and settings       │ │
│  │  • Color Variable Mapping: Legacy CSS variable compatibility for converted sites                         │ │
│  │  • Developer Plugins: Obfuscation tools and other dev-only features with auto-removal on export         │ │
│  │  • Navigation Fixes: Proper sticky positioning, layout enforcement, and cross-browser compatibility     │ │
│  │  • Local Storage Integration: Persistent settings across sessions with fallback defaults                 │ │
│  │  • CSS Compatibility Engine: Auto-fixes for vendor prefixes and layout inconsistencies                   │ │
│  └─────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                               │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

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

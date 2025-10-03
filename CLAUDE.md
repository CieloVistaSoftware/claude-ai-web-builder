# Website Builder Project

## Current Focus: Code Deduplication & Web Components Conversion

### Updated Codebase Analysis (Validated January 2025)

**✅ GOOD PROGRESS ON MODERNIZATION:**
- **65% of components** are now proper Web Components (extend HTMLElement)
- **15 components converted** to modern Web Component standard
- **Shared utilities implemented** via `WBComponentUtils` system

**⚠️ REMAINING DUPLICATE CODE (~250-300 lines total):**
- **CSS Loading Patterns**: 18 components with manual CSS loading (~90-144 lines)
- **hslToHex Functions**: 6 components with color utility duplicates (~120 lines)
- **generateId Functions**: 2 components with ID generation duplicates (~13 lines)
- **Miscellaneous utilities**: ~30 lines of other duplicate patterns

**⚠️ LEGACY COMPONENTS NEEDING CONVERSION (8 remaining):**
- image-insert.js, wb-viewport.js, change-text.js, change-text-simple.js
- wb-input.js, wb-table.js, wb-button-v2.js, plus utility components

### Priority Tasks (Updated)
1. **Convert CSS Loading to Shared Utility** (HIGH PRIORITY)
   - 18 files need to use `WBComponentUtils.loadCSS()` instead of manual CSS loading
   - Remove manual `createElement('link')` implementations

2. **Complete Web Component Conversions** (MEDIUM PRIORITY)
   - Convert remaining 8 legacy IIFE components to extend HTMLElement
   - Register with customElements.define()

3. **Consolidate Color Utilities** (MEDIUM PRIORITY)
   - 6 components have duplicate `hslToHex` functions
   - Use `WBComponentUtils.ColorUtils.hslToHex()` consistently

4. **Final ID Generation Cleanup** (LOW PRIORITY)
   - 2 components still have local `generateId()` functions
   - Use `WBComponentUtils.generateId()` consistently

### Build System Analysis ⚠️ **ISSUE IDENTIFIED & FIXED**
- **Problem Found**: Multiple `node_modules` folders indicated poor dependency management
  - Root project: `C:\Users\jwpmi\Downloads\AI\wb\node_modules` ✅
  - MCP docs server: Had separate `node_modules` ❌ (Removed)
  - MCP server: Had separate `node_modules` ❌ (Removed) 
  - Stale backup: Old `node_modules` in backup folder ❌ (Removed)

- **Solution Applied**: 
  - ✅ Implemented npm workspaces in root `package.json`
  - ✅ Removed duplicate `node_modules` folders
  - ✅ Fixed naming conflicts between MCP servers
  - ✅ Cleaned up stale backup directories

- **Current State**: Clean single `node_modules` in root with workspace support
- **Tools**: Vite, Playwright, Jest, TypeScript (standard modern stack)
- **Assessment**: ✅ **Build system now properly organized**

## Previous Focus: Components System

### Component Architecture
- Data-driven component system in `/components`
- Component factory pattern for dynamic loading
- Each component has: JS file, CSS file, JSON config, and demo HTML
- Components use Web Components API (custom elements)

### Key Components
- **wb-button** - Button component with variants and themes ✅
- **wb-color-picker** - Color picker with Material Design support
- **wb-slider** - Range slider for numeric inputs ✅
- **wb-toggle** - Toggle switch component ✅
- **wb-select** - Dropdown select component ✅
- **wb-status** - Status bar for events and settings ✅
- **wb-modal** - Modal dialog component
- **wb-nav-menu** - Navigation menu component
- **wb-viewport** - Viewport simulator for responsive testing ✅
- **control-panel** - Main control panel for website builder
- **control-panel-new** - New control panel with JSON issues ⚠️
- **change-text** - Text editing component (edit mode issues) ⚠️
- **color-bar** - Color visualization component (needs tabs) ⚠️
- **image-insert** - Image insertion component (needs edit button) ⚠️

### Component Structure
```
components/
├── component-name/
│   ├── component-name.js      # Component logic
│   ├── component-name.css     # Component styles
│   ├── component-name.json    # Data-driven config
│   ├── component-name-demo.html # Demo page
│   ├── component-name.md      # Documentation
│   └── component-name.issues.md # Known issues
```

### Recent Fixes (Component Issues)
1. **wb-button**: 
   - Removed hardcoded viewport, now uses wb-viewport component properly ✅
   - Added viewport constraints for modals to keep them within viewport boundaries ✅
2. **wb-slider**: Already had tabs and dark mode, fixed minor HTML structure issue ✅
3. **wb-select**: Fixed hardcoded white backgrounds, now properly uses dark mode CSS variables ✅
4. **wb-toggle**: Fixed label position mapping (was 'label-left' → now 'left') ✅
5. **wb-status**: Added tabs for docs/examples, created wb-status.md documentation ✅

### Remaining Issues
- **Duplicate Code Cleanup**: ~500 lines of duplicate utility functions still need removal (partially complete)
- **Web Component Conversion**: 11 components need proper HTMLElement extension
- **control-panel-new**: JSON parsing errors and incorrect path references (HIGH priority)
- **wb-input**: Input elements not functional - users cannot enter text (CRITICAL)
- **change-text**: Disable edit mode functionality not working
- **color-bar**: Needs tabs for presentation/documentation
- **image-insert**: Needs edit button for image insertion control
- **wb-viewport**: Content appears darker in smaller viewports

### Additional Issues (From wb-core)
- **Save button issue**: When the save button is pressed in the standalone version, changes are not being saved
- **Control panel dropdown**: Dropdown in the control panel doesn't have proper background color in dark mode
- **TypeScript files**: We are no longer using .ts files to avoid compilation steps
- **File consolidation**: Need to merge all similar named files into one file
- **Chrome Extension Created**: Created complete Chrome extension under components/rootextractor for CSS :root color extraction

### Files with Duplicate Code Needing Cleanup
**Path Detection Functions (13 files):**
- ✅ wb-button.js, wb-select.js, wb-input.js (already using wb-component-utils.js)
- ✅ wb-button-webcomponent.js, wb-select-webcomponent.js (fixed)
- ⚠️ wb-modal.js, wb-status.js, control-panel.js, image-insert.js
- ⚠️ wb-log-error.js, wb-viewport.js, wb-nav-menu.js
- ✅ wb-toggle.js (already cleaned up)

**CSS Loading Patterns (40+ files):**
- Most component .js files have manual CSS loading
- Should use `WBComponentUtils.loadCSS()` instead

**Component Initialization Patterns:**
- Similar IIFE patterns repeated across all components
- Should be converted to proper Web Components

### Working Directory
- Main application in `/Working`
- Control panel integration in `/Working/components/control-panel`
- Theme management in `/Working/core/theme/ThemeManager.ts`

### Testing
- Playwright tests in `/tests` and `/Working/tests`
- Test helpers available
- Component-specific tests for control panel functionality

### Known Issues
- Some components have `.issues.md` files documenting problems
- Control panel tests showing failures in test-results
- Focus on improving component stability and test coverage
- insert-image function not working
- change-text-simple-demo.html make the edit mode buttons sticky and add a green light red light when in edit mode

### Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build the project
- `npm test` - Run Playwright tests

## Important Lessons Learned

### wb-event-log Integration
The wb-event-log component is designed to be **passive and zero-configuration**. When integrating it:

1. **Keep it simple**: Just include `<wb-event-log></wb-event-log>` in your HTML
2. **Dispatch events with wb: prefix**: Use `document.dispatchEvent(new CustomEvent('wb:info', { detail: { message: 'your message' }}))`
3. **Don't overcomplicate**: No need for initialization checks, timing worries, or using static methods

**What NOT to do:**
- Don't check if WBEventLog is loaded before using
- Don't use WBEventLog.logInfo() static methods (they're just convenience wrappers)
- Don't worry about timing - the component sets up listeners immediately

**Lesson**: When a component says it's "passive" and "zero-configuration", believe it! Start with the simplest implementation first.

## Resolved Issues (Merged from wb-core)

### Completed Tasks
- ✅ **Color Bar Web Component**: Abstracted color bar from materialdesigncolorPickerWorks into reusable web component at `components/color-bar/`
- ✅ **Playwright Configuration**: Updated to stop on first failure
- ✅ **Documentation Files**: Merged websocket and fixes documentation
- ✅ **Working Folder Merge**: Created working folder merge proposal
- ✅ **Claude WebSocket Servers**: Consolidated into unified implementation

### Color System Fixes
- ✅ **Color Explorer Demo Fixed**: Fixed components/color-explorer-demo.html by replacing missing color-explorer component with color-bar component
- ✅ **Color Explorer in WB-Core**: Fixed missing wb.js file, created comprehensive JavaScript implementation
- ✅ **Color Explorer Demo Display**: Fixed missing JavaScript functionality preventing display
- ✅ **Color Slider**: Fixed missing script.js in Material Design Color Picker

### Documentation & Testing Fixes
- ✅ **Merged Documentation**: Combined related markdown files with same prefix into comprehensive documents
- ✅ **Test Runner Failures**: Modified Playwright configs with `maxFailures: 1`, `fullyParallel: false`
- ✅ **HTTP/WebSocket Transition**: Modified tests to use WebSocket server, implemented WebSocketDependencyLoader

### Theme & UI Fixes  
- ✅ **Theme Control Test**: Implemented proper test cases in theme-control.spec.js
- ✅ **Theme Implementation**: Created missing dist/src/main.js with theme switching functionality
- ✅ **Theme Options**: Updated tests to use actual theme options ('default', 'cyberpunk', 'ocean', 'sunset', 'forest')
- ✅ **Theme Persistence**: Fixed state persistence after page reload
- ✅ **Module Format**: Converted test files from CommonJS to ES modules
- ✅ **UI Element Targeting**: Updated URLs from wb.html to index.html
- ✅ **Theme Defaults**: Updated tests to expect 'default' theme instead of 'dark'

### Claude AI & WebSocket Fixes
- ✅ **API Key Security**: Fixed vulnerability - keys now only held in memory, never persisted
- ✅ **API Variable Naming**: Standardized on CLAUDE_API_KEY format
- ✅ **API Key Retrieval**: Implemented socket-based retrieval from backend
- ✅ **Mock Code Removal**: Removed all mock code from socket implementation
- ✅ **HTTP/WebSocket Requests**: Fixed unnecessary HTTP requests when WebSocket active
- ✅ **WebSocket Events**: Enhanced event registration and handling
- ✅ **Claude Socket Test Page**: Updated with proper CSS, TypeScript, dark mode, real API integration

### Development & Testing Infrastructure
- ✅ **Cross-Platform Testing**: Replaced PowerShell-specific tests with Node.js tests
- ✅ **Module Consistency**: Converted all test files to ES module format
- ✅ **Manual Testing**: Created automated CLI test runner for all WebSocket cases
- ✅ **Unified Testing**: Implemented single command test runner for all categories
- ✅ **HTTP Server Tests**: Documented tests using HTTP vs pure WebSocket
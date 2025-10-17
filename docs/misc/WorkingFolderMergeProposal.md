# Working Folder Merge Proposal

---
*Last Updated: 2025-09-29*
*Version: 1.0.0*
*Author: Claude Code Assistant*
*Status: Current - Folder structure proposal*
---

## Overview

This document outlines a comprehensive plan to merge the `Working` directory into the main `wb` directory, consolidating our codebase into a more maintainable structure. The goal is to have a single set of core files (wb.html, wb.css, wb.ts) while organizing all components and plugins into their proper folders.

## Current Structure Analysis

Currently, we have parallel structures:

1. **Main directory**: Contains core files like `wb.html`, `wb.css`, and multiple versions of WebSocket servers.
2. **Working directory**: Contains duplicated functionality with its own versions of core files and components.
3. **Components directory**: Contains some shared components.

This duplication causes several issues:
- Inconsistent code across similar files
- Difficulty tracking the "source of truth" for each feature
- Increased maintenance burden
- Testing complexity due to multiple implementations

## Proposed Directory Structure

```
wb/
├── src/                          # Core source code
│   ├── index.html                # Main entry point (renamed from wb.html)
│   ├── index.ts                  # Main TypeScript file (renamed from wb.ts)
│   ├── styles/
│   │   ├── main.css              # Main stylesheet (renamed from wb.css)
│   │   └── themes/               # Theme-specific stylesheets
│   ├── core/                     # Core functionality modules
│   │   ├── WebsiteBuilder.ts     # Main builder class
│   │   ├── UIController.ts       # UI control logic
│   │   ├── edit/                 # Edit-related functionality
│   │   │   └── MediaManager.ts   # Media management
│   │   └── save/                 # Save-related functionality
│   │       └── SaveLoadManager.ts # Save/load operations
│   └── utils/                    # Utility functions
│       └── env-loader.ts         # Environment configuration
│
├── components/                    # Web components
│   ├── control-panel/            # Control panel component
│   ├── color-mapper/             # Color mapping component
│   ├── theme-bridge/             # Theme management
│   └── wb-controller/            # Main controller component
│
├── plugins/                      # Plugin system
│   ├── plugin-loader.ts          # Plugin loading system
│   ├── search/                   # Search plugin
│   │   └── site-search.ts
│   └── other-plugins/            # Other plugins
│
├── dev-plugins/                  # Development-only plugins
│   ├── dev-plugin-loader.ts      # Development plugin loader
│   └── obfuscate/                # Obfuscation plugin
│
├── server/                       # Server implementations
│   ├── websocket-server.ts       # Unified WebSocket server
│   └── claude-api-handler.ts     # Claude API handling logic
│
├── conversion/                   # Conversion tools
│   ├── conversion-engine.ts      # Core conversion logic
│   ├── file-watcher.ts           # File watching service
│   └── cli-converter.ts          # CLI conversion tool
│
├── stacking/                     # File stacking functionality
│   ├── file-stacker.ts           # Stacking implementation
│   └── auto-stacker.ts           # Automatic stacking
│
├── ui/                           # User interfaces
│   ├── converter-ui/             # Converter interface
│   └── stacker-ui/               # Stacker interface
│
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   ├── e2e/                      # End-to-end tests
│   └── utils/                    # Test utilities
│
├── dist/                         # Compiled output
│
├── toBeConverted/                # Input folder for conversion
├── converted/                    # Output folder for conversion
│
├── docs/                         # Documentation
│
├── package.json                  # Single package.json file
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## Migration Plan

### Phase 1: Preparation (1-2 days)

1. Create the new directory structure in a temporary branch
2. Identify all files that need to be merged/consolidated
3. Document dependency relationships between files
4. Create a detailed mapping of old paths to new paths

### Phase 2: Core File Consolidation (2-3 days)

1. Merge `wb.html` and `Working/index.html` into `src/index.html`
   - Use the more comprehensive implementation as the base
   - Ensure all required functionality is preserved
   - Update all references and imports

2. Merge `wb.css` and `Working/styles.css` into `src/styles/main.css`
   - Consolidate all styles, removing duplicates
   - Organize into logical sections
   - Extract theme-specific styles into theme files

3. Merge `wb.ts` and related JS/TS files into a modular structure
   - Create proper ES modules with clear exports/imports
   - Establish consistent TypeScript typing
   - Split functionality into logical modules

### Phase 3: Component Migration (2-3 days)

1. Move and consolidate components
   - For each component, choose the most complete implementation
   - Update import paths throughout the codebase
   - Ensure consistent interfaces between components

2. Consolidate the control panel implementations
   - Migrate from both existing implementations to `components/control-panel/`
   - Ensure all functionality is preserved
   - Update all references to the control panel

3. Standardize component interfaces
   - Use consistent patterns for event handling
   - Establish clear component lifecycle management
   - Document public APIs for each component

### Phase 4: Server Consolidation (1-2 days)

1. Merge WebSocket server implementations
   - Consolidate `claude-socket-server.ts`, `claude-socket-test-server.ts`, and `claude-websocket-server.ts`
   - Create a unified server with configuration options
   - Add proper TypeScript typing for all server functionality

2. Update all client-side references
   - Update import paths and API usage
   - Ensure backward compatibility where needed
   - Update tests to use the consolidated server

### Phase 5: Plugin System Migration (1-2 days)

1. Consolidate plugin system
   - Merge plugin loaders into a unified system
   - Update plugin registration and loading
   - Document plugin API

2. Migrate individual plugins
   - Standardize plugin structure
   - Update import paths
   - Ensure proper integration with the core application

### Phase 6: Testing & Validation (2-3 days)

1. Update and consolidate tests
   - Merge test suites to avoid duplication
   - Update import paths in tests
   - Add tests for merged functionality

2. Comprehensive testing
   - Run all tests against the merged codebase
   - Fix any integration issues
   - Verify all features work correctly

3. Performance validation
   - Compare performance before and after merge
   - Address any performance regressions
   - Optimize critical paths

### Phase 7: Documentation & Cleanup (1-2 days)

1. Update documentation
   - Update README.md and other documentation
   - Document the new structure and organization
   - Provide migration guides for developers

2. Clean up obsolete files
   - Remove deprecated or unused code
   - Delete temporary files created during migration
   - Remove redundant code paths

3. Final review
   - Code review of the entire merge
   - Address feedback
   - Final testing and validation

## Package.json Consolidation

We'll maintain a single `package.json` file at the root level. Key actions:

1. Merge all dependencies from both `package.json` files
2. Consolidate scripts to provide unified commands
3. Update paths and configurations
4. Ensure all TypeScript settings are properly configured
5. Add new scripts for the unified build process

## Node Modules Consolidation

To address the node_modules duplication issue:

1. Remove all nested node_modules folders
2. Install dependencies only at the root level
3. Update any path references that might have relied on nested modules
4. Use workspaces for any subprojects that need their own dependencies

## Considerations & Challenges

1. **Breaking Changes**:
   - Some import paths will change
   - We'll need to update references in all files

2. **Testing Impact**:
   - Tests may need significant updates
   - Ensure test coverage is maintained

3. **Feature Parity**:
   - Ensure no functionality is lost during merging
   - Carefully compare implementations before consolidating

4. **Documentation**:
   - Comprehensive documentation will be critical
   - Update all references to file paths

## Timeline

The complete migration is estimated to take approximately 12-15 days of work.

- **Phase 1 (Preparation)**: 1-2 days
- **Phase 2 (Core Files)**: 2-3 days
- **Phase 3 (Components)**: 2-3 days
- **Phase 4 (Server)**: 1-2 days
- **Phase 5 (Plugins)**: 1-2 days
- **Phase 6 (Testing)**: 2-3 days
- **Phase 7 (Documentation)**: 1-2 days

## Conclusion

This consolidation will significantly improve the maintainability of the Website Builder project by removing duplication, standardizing the codebase, and establishing a clear structure. While the migration will require careful coordination and thorough testing, the benefits in terms of improved developer productivity and code quality will be substantial.

Once approved, we recommend starting with Phase 1 to establish the new structure and proceeding methodically through the migration plan.

# WB Pseudo Build System Documentation

## Overview

The WB pseudo build system provides validation, symbol discovery, and build-time utilities for the Website Builder component ecosystem. It is designed to catch errors, generate symbol tables, and automate component analysis before deployment.

## Key Tools

- **component-discovery.js**: Scans all WB components, builds symbol tables, and analyzes dependencies.
- **build-symbols.js**: Main pseudo-compiler. Integrates discovery into the build process, validates usage, and generates runtime artifacts.

## Main Commands

- `npm run build:scripts` — Full build validation (recommended before deployment)
- `npm run validate:components` — Component usage validation
- `node tools/build-symbols.js build` — Direct build
- `node tools/build-symbols.js validate` — Direct validation

## What the Build System Does

- Validates all component usage and import paths
- Detects syntax errors, missing files, and dependency issues
- Generates symbol tables for runtime and IDE autocomplete
- Outputs artifacts to `dist/symbols/wb-symbols.js`

## Typical Workflow

1. Edit or add components in the `components/` directory.
2. Run `npm run build:scripts` to validate and build symbol tables.
3. Fix any errors or warnings reported by the build.
4. Serve or deploy the application.

## Output Artifacts

- `dist/symbols/wb-symbols.js`: Runtime symbol table
- IDE autocomplete data (for editor integration)

## Troubleshooting

- Always run the build scripts before serving or deploying.
- If you see runtime errors, re-run `npm run build:scripts` and check for validation issues.
- For port conflicts, use the provided kill-port utility.

## References

- See `tools/claude.md` for detailed architecture and tool descriptions.
- See `component-discovery.js` and `build-symbols.js` in the `tools/` directory for implementation details.

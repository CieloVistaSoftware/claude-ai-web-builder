# package.md

## NPM Scripts Overview

This document explains all the npm scripts available in the `package.json` for this project. Use these scripts to build, test, serve, and manage the development workflow for the Claude AI Web Builder.

---

### Build & Discovery Scripts

- **build:scripts** — Runs all major build scripts in sequence (componentsjson, cssdata, manifest, symbols).
- **build:componentsjson** — Aggregates all component tags into `wb-components.html-data.json` for VS Code IntelliSense.
- **build:cssdata** — Scans CSS custom properties and generates `wb-components.css-data.json` for CSS IntelliSense.
- **build:manifest** — Builds the main manifest file for the project.
- **build:symbols** — Builds the symbol table for all components.
- **discover** — Runs the component discovery tool to update registry and metadata.
- **validate:components** — Validates all discovered components and their symbols.
- **dev:watch** — Watches for changes and rebuilds the symbol table automatically.

### Main Build & Serve Scripts

- **build** — Runs the main build for the WB website builder and then serves the root index.html.
- **wb:build** — Builds the WB website builder package.
- **wb:build:watch** — Watches and rebuilds the WB website builder on changes.
- **wb:dev** — Starts development mode with live rebuild and local server.
- **wb:install** — Installs dependencies for the WB website builder.
- **wb:serve** — Serves the WB website builder demo.
- **wb:serve:demo** — Serves the WB website builder demo page.
- **wb:serve:root** — Serves the root index.html.
- **wb:setup** — Installs and builds the WB website builder.

### API & Socket Scripts

- **api** — Starts the Claude Events API server.
- **build:socket** — Builds the WebSocket server scripts with TypeScript.
- **socket:test** — Builds and starts the WebSocket server for testing.
- **claude:build** — Builds the Claude socket server with TypeScript.
- **claude:server** — Builds and starts the Claude socket server.
- **claude:test** — Builds and starts the Claude socket server for testing.
- **unified:build** — Builds the unified Claude WebSocket server.
- **unified:server** — Builds and starts the unified Claude WebSocket server.
- **unified:server:mock** — Starts the unified server with mock responses.

### Test Scripts

- **test** — Runs all Playwright tests.
- **test:all** — Runs all tests using the custom runner.
- **test:category** — Runs tests by category.
- **test:config** — Runs tests with a specific config.
- **test:failfast** — Runs Playwright tests and stops on first failure.
- **test:safe** — Checks server health and runs Playwright tests.
- **test:serve** — Starts a server and runs Playwright tests.
- **test:socket-only** — Runs only socket-related tests.
- **test:ui** — Runs Playwright UI tests.
- **test:ui-only** — Runs only UI-related tests.

### Schema & Conversion Scripts

- **schemas:docs** — Generates documentation from all schemas.
- **schemas:list** — Lists all schema files in the project.
- **schemas:validate** — Validates all schemas using AJV.
- **convert** — Runs the CLI converter for data conversion tasks.

### Utility & Maintenance Scripts

- **check-server** — Checks the health of the server.
- **kill-port** — Kills any node process and frees up ports.
- **nuke** — Force kills node processes and cleans up.
- **remove-puppeteer** — Removes Puppeteer from the project.
- **serve** — Kills any running server and starts a new one on port 3000.
- **serve:root** — Kills any running server and serves the root index.html on port 8080.
- **start** — Alias for `dev` (starts development mode).
- **start-mcp** — Starts the MCP docs server.
- **watch** — Runs the file watcher for conversion tasks.

---

For more details on each script, see the corresponding file in the `scripts/` or `tools/` directory, or check the `package.json` directly.

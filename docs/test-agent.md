# Test Agent Documentation

## Overview

The **WB Test Agent** is an automation system that enables programmatic test execution. It integrates with the existing Playwright test infrastructure and provides a structured API for running tests.

## Purpose

- **Claude AI Integration**: Allow Claude to run tests programmatically and receive structured results
- **Automation**: Support CI/CD pipelines and automated testing workflows
- **Development**: Quick test execution during development
- **Shadow DOM Diagnostics**: Specialized component testing using `wb-shadow-diagnostics.html`

## Installation

The test agent is included with the project. No additional installation required.

## Commands

### CLI Commands

```bash
# Run all tests
node agents/test-agent.cjs run all

# Run by category
node agents/test-agent.cjs run control-panel
node agents/test-agent.cjs run color
node agents/test-agent.cjs run theme

# Run specific component tests
node agents/test-agent.cjs component button
node agents/test-agent.cjs component modal
node agents/test-agent.cjs component tab

# Shadow DOM diagnostics
node agents/test-agent.cjs diagnose wb-button
node agents/test-agent.cjs diagnose wb-modal

# Utility commands
node agents/test-agent.cjs categories   # List all categories
node agents/test-agent.cjs health       # Check test infrastructure
node agents/test-agent.cjs help         # Show help
```

### NPM Scripts

```bash
npm run agent:test              # Run all tests
npm run agent:test:component    # Run all component tests
npm run agent:test:category     # Run by category (requires argument)
npm run agent:component         # Run specific component (requires argument)
npm run agent:diagnose          # Shadow DOM diagnostics
npm run agent:categories        # List categories
npm run agent:health            # Health check
npm run agent:help              # Help
```

### Programmatic API

```javascript
const TestAgent = require('./agents/test-agent.cjs');

// Run tests with options
const result = await TestAgent.run({
  category: 'control-panel',  // Test category
  headed: false,              // Browser visibility
  debug: false,               // Debug mode
  failFast: false,            // Stop on first failure
  timeout: 60000              // Timeout in ms
});

// Run component tests
const result = await TestAgent.component('button');

// Run diagnostics
const result = await TestAgent.diagnose('wb-modal');

// List categories
TestAgent.categories();

// Health check
await TestAgent.health();
```

## Test Categories

| Category | Description | Test Files |
|----------|-------------|------------|
| `all` | All tests | `**/*.spec.ts`, `**/*.spec.js` |
| `component` | All component tests | `wb-*/**/*.spec.*` |
| `control-panel` | Control panel | `wb-control-panel/**/*.spec.ts` |
| `color` | Color system | `wb-color/**/*.spec.ts` |
| `theme` | Theme system | `wb-theme/**/*.spec.ts` |
| `modal` | Modal dialogs | `wb-modal/**/*.spec.ts` |
| `button` | Button component | `wb-button/**/*.spec.*` |
| `tab` | Tab component | `wb-tab/**/*.spec.ts` |
| `nav` | Navigation | `wb-nav/**/*.spec.ts` |
| `layout` | Layout | `wb-layout/**/*.spec.*` |
| `integration` | Integration | `integration/**/*.spec.ts` |
| `socket` | WebSocket | `socket/**/*.spec.ts` |
| `shadow-diagnostics` | Shadow DOM | `wb-shadow-diagnostics.spec.js` |

## Result Format

```typescript
interface AgentResult {
  success: boolean;      // Overall pass/fail
  category: string;      // Category run
  passed: number;        // Passed tests
  failed: number;        // Failed tests
  skipped: number;       // Skipped tests
  total: number;         // Total tests
  duration: number;      // Duration (ms)
  timestamp: string;     // ISO timestamp
  exitCode: number;      // Process exit code
  summary: string;       // Human-readable summary
  details: Array;        // Individual test results
  errors: Object|null;   // Errors if any
}
```

## Integration with wb-shadow-diagnostics

The agent integrates with the Shadow DOM diagnostic tool for component testing:

```bash
# Run diagnostics for specific component
node agents/test-agent.cjs diagnose wb-button
node agents/test-agent.cjs diagnose wb-card
node agents/test-agent.cjs diagnose wb-modal
```

This runs the `wb-shadow-diagnostics.spec.js` tests against the component.

## Files

- `agents/test-agent.js` - ES Module version
- `agents/test-agent.cjs` - CommonJS version (recommended)
- `agents/AGENT.md` - Detailed API documentation
- `agents/README.md` - Agent folder overview
- `test-results/agent-results-*.json` - Results output

## Related Documentation

- [tests/tests.howto.md](../tests/tests.howto.md) - General testing guide
- [wb-shadow-diagnostics.html](../wb-shadow-diagnostics.html) - Diagnostic tool
- [playwright.config.js](../playwright.config.js) - Playwright configuration

## Troubleshooting

### Port conflicts
The agent automatically kills processes on ports 8080 and 3000 before running.

### Timeout issues
Increase timeout: `TestAgent.run({ timeout: 120000 })`

### Missing tests
Run `node agents/test-agent.cjs categories` to see available categories.

### Component not found
Check the component name matches test file naming convention: `wb-<name>/**/*.spec.*`

# WB Test Agent

## Overview

The **Test Agent** is a callable automation system for running tests programmatically. It can be invoked by:
- Claude AI (through tool calls or scripts)
- Command line (CLI)
- Other JavaScript/Node.js scripts
- npm scripts

## Quick Start

### CLI Usage

```bash
# Run all tests
node agents/test-agent.cjs run all

# Run specific category
node agents/test-agent.cjs run control-panel

# Run component tests
node agents/test-agent.cjs component button

# Run Shadow DOM diagnostics
node agents/test-agent.cjs diagnose wb-button

# List categories
node agents/test-agent.cjs categories

# Health check
node agents/test-agent.cjs health
```

### NPM Scripts

```bash
# Run through npm
npm run agent:test              # Run all tests
npm run agent:test:component    # Run component tests
npm run agent:diagnose          # Run Shadow DOM diagnostics
npm run agent:categories        # List categories
npm run agent:health            # Health check
```

### Programmatic Usage

```javascript
// CommonJS
const TestAgent = require('./agents/test-agent.cjs');

// Run all tests
const result = await TestAgent.run({ category: 'all' });

// Run component tests
const result = await TestAgent.component('button');

// Run diagnostics
const result = await TestAgent.diagnose('wb-button');

// List categories
TestAgent.categories();
```

```javascript
// ES Modules
import TestAgent from './agents/test-agent.js';

// Same API as above
const result = await TestAgent.run({ category: 'control-panel' });
```

## Test Categories

| Category | Description | Files |
|----------|-------------|-------|
| `all` | All tests | All .spec.ts/js files |
| `component` | All component tests | wb-*/**/*.spec.* |
| `control-panel` | Control panel tests | wb-control-panel/**/*.spec.ts |
| `color` | Color system tests | wb-color/**/*.spec.ts |
| `theme` | Theme tests | wb-theme/**/*.spec.ts |
| `modal` | Modal tests | wb-modal/**/*.spec.ts |
| `button` | Button tests | wb-button/**/*.spec.* |
| `tab` | Tab tests | wb-tab/**/*.spec.ts |
| `nav` | Navigation tests | wb-nav/**/*.spec.ts |
| `integration` | Integration tests | integration/**/*.spec.ts |
| `shadow-diagnostics` | Shadow DOM diagnostics | wb-shadow-diagnostics.spec.js |

## API Reference

### TestAgent.run(options)

Run tests with specified options.

**Options:**
- `category` (string): Test category (default: 'all')
- `pattern` (string): Grep pattern to filter tests
- `headed` (boolean): Run in headed browser mode
- `debug` (boolean): Run in debug mode
- `failFast` (boolean): Stop on first failure
- `timeout` (number): Test timeout in ms (default: 60000)
- `specific` (string): Run specific test file

**Returns:** `Promise<AgentResult>`

### TestAgent.component(componentName)

Run tests for a specific component.

**Parameters:**
- `componentName` (string): Component name (e.g., 'button', 'modal')

**Returns:** `Promise<AgentResult>`

### TestAgent.diagnose(componentTag)

Run Shadow DOM diagnostics for a component.

**Parameters:**
- `componentTag` (string): Component tag (default: 'wb-button')

**Returns:** `Promise<AgentResult>`

### TestAgent.categories()

List all available test categories.

**Returns:** `Object` - Category definitions

### TestAgent.health()

Run health check on test infrastructure.

**Returns:** `Promise<Object>` - Health check results

### TestAgent.killPorts(ports)

Kill processes on specified ports before testing.

**Parameters:**
- `ports` (number[]): Ports to free (default: [8080, 3000])

## Result Structure

```typescript
interface AgentResult {
  success: boolean;      // Overall success
  category: string;      // Test category run
  passed: number;        // Passed test count
  failed: number;        // Failed test count
  skipped: number;       // Skipped test count
  total: number;         // Total tests
  duration: number;      // Duration in ms
  timestamp: string;     // ISO timestamp
  exitCode: number;      // Process exit code
  summary: string;       // Human-readable summary
  details: Array;        // Detailed test results
  errors: Object|null;   // Any errors encountered
}
```

## Integration with Claude

### How Claude Can Call the Test Agent

Claude can invoke the test agent through several methods:

1. **Direct Script Execution:**
```bash
node agents/test-agent.cjs run control-panel
```

2. **NPM Script:**
```bash
npm run agent:test -- control-panel
```

3. **Programmatic Import:**
```javascript
const TestAgent = require('./agents/test-agent.cjs');
const result = await TestAgent.run({ category: 'button' });
console.log(result.summary);
```

### Example Claude Workflow

```
User: "Run the button component tests"

Claude: Let me run the button component tests using the test agent.

[Executes: node agents/test-agent.cjs component button]

Results:
✅ PASSED
📊 Statistics:
   ✅ Passed:  12
   ❌ Failed:  0
   ⏭️  Skipped: 2
   📋 Total:   14
   ⏱️  Duration: 23s

All button component tests passed successfully!
```

## Best Practices

1. **Always kill ports first:** Use `TestAgent.killPorts()` before running tests
2. **Check health:** Run `TestAgent.health()` to verify infrastructure
3. **Use categories:** Target specific categories rather than running all tests
4. **Review results:** Check the `details` array for specific test outcomes
5. **Save results:** Results are automatically saved to `test-results/`

## Troubleshooting

### Port Already in Use

```bash
node agents/test-agent.cjs run all
# Automatically kills ports 8080 and 3000
```

### Tests Timing Out

Increase timeout:
```javascript
TestAgent.run({ category: 'all', timeout: 120000 });
```

### Component Not Found

Check available categories:
```bash
node agents/test-agent.cjs categories
```

## Files

- `agents/test-agent.js` - ES Module version
- `agents/test-agent.cjs` - CommonJS version
- `agents/AGENT.md` - This documentation
- `test-results/agent-results-*.json` - Test result files

## Related Documentation

- [tests/tests.howto.md](../tests/tests.howto.md) - General test documentation
- [tests/wb-shadow-diagnostics.spec.js](../tests/wb-shadow-diagnostics.spec.js) - Shadow diagnostics tests
- [playwright.config.js](../playwright.config.js) - Playwright configuration

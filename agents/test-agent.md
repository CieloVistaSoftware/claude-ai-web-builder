# Test Agent

The primary test automation agent for running Playwright tests.

## Quick Start

```bash
cd C:\Users\jwpmi\Downloads\AI\wb

# Run all component tests
node agents/test-agent.cjs run component

# Run specific category
node agents/test-agent.cjs run button
node agents/test-agent.cjs run control-panel
node agents/test-agent.cjs run color
node agents/test-agent.cjs run theme
node agents/test-agent.cjs run modal

# Run shadow diagnostics for a component
node agents/test-agent.cjs diagnose wb-button
node agents/test-agent.cjs diagnose wb-slider
node agents/test-agent.cjs diagnose wb-modal

# See all available categories
node agents/test-agent.cjs categories

# Check test infrastructure health
node agents/test-agent.cjs health
```

## NPM Scripts

```bash
npm run agent:test              # Run all tests
npm run agent:test:component    # Run all component tests  
npm run agent:component button  # Run specific component
npm run agent:diagnose          # Shadow DOM diagnostics
npm run agent:categories        # List categories
npm run agent:health            # Health check
```

## All Commands

| Command | Description |
|---------|-------------|
| `run all` | Run all tests |
| `run component` | Run all component tests |
| `run <category>` | Run specific category |
| `component <name>` | Run tests for specific component |
| `diagnose <component>` | Run Shadow DOM diagnostics |
| `categories` | List all test categories |
| `health` | Check test infrastructure |
| `help` | Show help |

## Test Categories

| Category | Test Files |
|----------|------------|
| `all` | `**/*.spec.ts`, `**/*.spec.js` |
| `component` | `wb-*/**/*.spec.*` |
| `control-panel` | `wb-control-panel/**/*.spec.ts` |
| `color` | `wb-color/**/*.spec.ts` |
| `theme` | `wb-theme/**/*.spec.ts` |
| `modal` | `wb-modal/**/*.spec.ts` |
| `button` | `wb-button/**/*.spec.*` |
| `tab` | `wb-tab/**/*.spec.ts` |
| `nav` | `wb-nav/**/*.spec.ts` |
| `layout` | `wb-layout/**/*.spec.*` |
| `integration` | `integration/**/*.spec.ts` |
| `socket` | `socket/**/*.spec.ts` |
| `shadow-diagnostics` | `wb-shadow-diagnostics.spec.js` |

---

## Test Results Analysis

### Results Location

| Location | Contents |
|----------|----------|
| `test-results/.last-run.json` | Last run status and failed test IDs |
| `test-results/*/error-context.md` | Page snapshots at failure time |
| `test-results/*/*.png` | Screenshots of failures |
| `tests/test-results/` | Additional test artifacts |

### Common Failure Patterns

#### 1. wb-demo-width-centering Tests

| Test | Expected | Common Issue |
|------|----------|---------------|
| Style variants | Width 93-97%, Centered | Uses `file:///` URL instead of localhost |

**Fix:** Update test to use relative paths:
```javascript
// Change from:
await page.goto('file:///C:/Users/jwpmi/Downloads/AI/wb/...');
// To:
await page.goto('/components/wb-shadow-diagnostics/wb-shadow-diagnostics.html');
```

#### 2. Shadow DOM CSS Issues

| Issue | Details |
|-------|---------|
| No CSS link in Shadow DOM | `❌ No CSS link found in Shadow DOM` |
| CSS Variables undefined | `--primary`, `--bg-primary` show "⚠️ Not defined" |
| Gray background fallback | Buttons showing `rgb(240, 240, 240)` |

**Root Cause:** Components may not be loading external CSS via `<link>` in Shadow DOM.

#### 3. Component Visibility Issues

| Component | Issue | Impact |
|-----------|-------|--------|
| `wb-button` | No CSS link in Shadow DOM | Gray fallback colors |
| `wb-slider` | Track shows gray, not colors | Visual regression |
| CSS Variables | Not defined at `:root` | All theme colors fail |

### Interpreting Diagnostic Results

When running `diagnose <component>`, look for:

```
✅ GOOD Signs:
- Shadow DOM created
- Visible (width×height)
- Component registered with customElements
- CSS link present in Shadow DOM

❌ PROBLEM Signs:
- No CSS link found in Shadow DOM
- CSS Variables "⚠️ Not defined"
- rgb(240, 240, 240) background (gray fallback)
- 0×0 dimensions (invisible component)
```

---

## Programmatic API

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

---

## Troubleshooting

### Port conflicts
The agent automatically kills processes on ports 8080 and 3000 before running.

### Timeout issues
Increase timeout: `TestAgent.run({ timeout: 120000 })`

### Missing tests
Run `node agents/test-agent.cjs categories` to see available categories.

### Component not found
Check the component name matches test file naming convention: `wb-<name>/**/*.spec.*`

### Test infrastructure health
Run `node agents/test-agent.cjs health` to verify:
- Playwright is installed
- Test directory exists
- Config file is present
- Required ports are available

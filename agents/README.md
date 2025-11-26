# Agents

This folder contains automation agents that can be called programmatically or via CLI.

## Available Agents

### MCP Command Server (`mcp-command-server.js`) ⭐ NEW

Allows Claude to run commands on your local Windows machine. This bridges the gap between Claude's cloud environment and your local system.

**Setup:**
```bash
# Test the server
node agents/mcp-command-server.js --test

# Add to Claude Desktop config (see mcp-command-server.md)
```

**Once configured, Claude can run:**
```
run_agent("test-agent.cjs run component")
run_agent("test-agent.cjs diagnose wb-button")
run_command("npm run test")
```

See [mcp-command-server.md](./mcp-command-server.md) for full setup instructions.

---

### Test Agent (`test-agent.js` / `test-agent.cjs`)

A comprehensive test automation agent for running Playwright tests.

**Features:**
- Run tests by category (component, theme, modal, etc.)
- Run tests for specific components
- Shadow DOM diagnostics
- Health checks
- JSON result output for AI consumption

**Usage:**
```bash
# CLI
node agents/test-agent.cjs run all
node agents/test-agent.cjs run component
node agents/test-agent.cjs component button
node agents/test-agent.cjs diagnose wb-modal
node agents/test-agent.cjs categories
node agents/test-agent.cjs health

# NPM Scripts
npm run agent:test
npm run agent:component -- button
npm run agent:diagnose
```

**Programmatic:**
```javascript
const TestAgent = require('./agents/test-agent.cjs');

// Run all tests
const result = await TestAgent.run({ category: 'all' });

// Check result
if (result.success) {
  console.log(`✅ All tests passed: ${result.passed}/${result.total}`);
} else {
  console.log(`❌ Tests failed: ${result.failed} failures`);
}
```

---

### Test-Fix-Retest Agent (`test-fix-retest.js`)

Self-healing agent that runs tests, asks Claude to fix failures, and retests until all pass.

**Usage:**
```bash
node agents/test-fix-retest.js
```

**Workflow:**
1. Run Playwright tests
2. Parse failed tests
3. Ask Claude for code fixes
4. Apply fixes
5. Rerun until all pass (or max attempts)

---

### RunAllComponentTests (`RunAllComponentTests.js`)

Simple batch runner for all component tests with failure summary.

**Usage:**
```bash
node agents/RunAllComponentTests.js
```

---

## Adding New Agents

1. Create a new file in this folder: `my-agent.js` or `my-agent.cjs`
2. Export an API object with callable methods
3. Add npm scripts to `package.json`
4. Create documentation: `my-agent.md`
5. Update this README

## Documentation

| File | Purpose |
|------|---------|
| [AGENT.md](./AGENT.md) | Full Test Agent API documentation |
| [mcp-command-server.md](./mcp-command-server.md) | MCP Command Server setup |
| [test-agent.md](./test-agent.md) | Test Agent usage guide |
| [test-fix-retest.md](./test-fix-retest.md) | Self-healing agent guide |
| [RunAllComponentTests.md](./RunAllComponentTests.md) | Batch runner guide |
| [WhatAreAgents.md](./WhatAreAgents.md) | Conceptual guide to agents |

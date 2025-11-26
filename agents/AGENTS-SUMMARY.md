# Agents & Commands Summary

## Quick Reference

| Task | Direct Command | Agent Command |
|------|----------------|---------------|
| Run all tests | `npx playwright test` | `node agents/test-agent.cjs run all` |
| Run component tests | `npx playwright test wb-button` | `node agents/test-agent.cjs run button` |
| JSON output | `npx playwright test --reporter=json` | Built into agent |
| Health check | N/A | `node agents/test-agent.cjs health` |
| List categories | N/A | `node agents/test-agent.cjs categories` |

---

## Available Agents

| Agent | File | Purpose |
|-------|------|---------|
| **Test Agent** | `test-agent.cjs` | Run Playwright tests with structured output |
| **Test-Fix-Retest** | `test-fix-retest.js` | Self-healing: test → Claude fixes → retest |
| **RunAllComponentTests** | `RunAllComponentTests.js` | Batch run all component tests |
| **MCP Command Server** | `mcp-command-server.cjs` | Allows Claude to execute commands locally |

---

## Do You Need Agents?

**Probably not.** Playwright provides everything natively:

```powershell
# Run tests
npx playwright test

# JSON output
npx playwright test --reporter=json

# Specific tests
npx playwright test wb-button

# UI mode
npx playwright test --ui
```

### When Agents ARE Useful

- **Self-healing loop** (`test-fix-retest.js`) - automated fix cycle
- **Claude Code CLI** - structured output for AI consumption
- **Categorized test runs** - predefined test groupings

### When to Skip Agents

- Running tests manually in VS Code
- Using Playwright Test Explorer extension
- Simple test runs with native reporting

---

## MCP Command Runner

Allows Claude to execute commands on your local machine.

### Where It Works

| Claude Interface | MCP Command Runner |
|------------------|-------------------|
| Claude Code CLI | ✅ Works |
| Claude Desktop App | ✅ Works (with config) |
| Claude.ai Browser | ❌ Not supported |

### Configuration

**Claude Code CLI:**
```powershell
claude mcp add wb-command-runner node C:\Users\jwpmi\Downloads\AI\wb\agents\mcp-command-server.cjs
claude mcp list
```

**Claude Desktop App** (`%APPDATA%\Claude\claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "wb-command-runner": {
      "command": "node",
      "args": ["C:\\Users\\jwpmi\\Downloads\\AI\\wb\\agents\\mcp-command-server.cjs"]
    }
  }
}
```

---

## Recommended Workflow

### Option A: Simple (No Agents)

1. Run tests directly in VS Code terminal:
   ```powershell
   npx playwright test
   ```
2. Review results in terminal or Playwright UI
3. Fix code manually or ask Claude

### Option B: With Claude (Browser)

1. Run tests in VS Code terminal
2. Paste results to Claude.ai
3. Claude reads/fixes code via file access
4. You run tests again

### Option C: Claude Code CLI (Full Automation)

1. Open Claude Code: `claude`
2. Ask: "Run all component tests"
3. Claude executes via MCP, sees results, fixes code
4. Repeat until passing

---

## Test Agent Commands

```powershell
# Run tests by category
node agents/test-agent.cjs run all
node agents/test-agent.cjs run component
node agents/test-agent.cjs run button
node agents/test-agent.cjs run theme
node agents/test-agent.cjs run modal

# Diagnostics
node agents/test-agent.cjs diagnose wb-button
node agents/test-agent.cjs diagnose wb-slider

# Info
node agents/test-agent.cjs categories
node agents/test-agent.cjs health
```

---

## Files in This Folder

| File | Description |
|------|-------------|
| `AGENT.md` | Full Test Agent API docs |
| `AGENTS-SUMMARY.md` | This file - quick reference |
| `README.md` | Overview of all agents |
| `WhatAreAgents.md` | Conceptual guide |
| `mcp-command-server.md` | MCP server setup |
| `test-agent.md` | Test agent usage |
| `test-fix-retest.md` | Self-healing agent |
| `RunAllComponentTests.md` | Batch runner |

---

## Bottom Line

**For most cases:** Just use `npx playwright test` directly.

**Agents are useful for:** Automated Claude workflows and structured output.

**MCP Command Runner:** Only works in Claude Code CLI or Claude Desktop, not browser.

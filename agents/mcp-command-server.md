# MCP Command Server

Allows Claude to run commands on your local Windows machine, bridging the gap between Claude's cloud environment and your local system.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR WINDOWS PC                          │
│                                                             │
│  ┌─────────────────────┐    ┌──────────────────────────┐   │
│  │ mcp-command-server  │    │   agents/test-agent.cjs  │   │
│  │   (runs locally)    │───►│   agents/test-fix-...    │   │
│  └──────────┬──────────┘    │   agents/Run...          │   │
│             │               └──────────────────────────┘   │
└─────────────┼──────────────────────────────────────────────┘
              │ stdio (JSON-RPC)
              ▼
┌─────────────────────────────────────────────────────────────┐
│                  CLAUDE DESKTOP                             │
│                                                             │
│    "Run all component tests"                                │
│         ▼                                                   │
│    run_agent("test-agent.cjs run component")                │
│         ▼                                                   │
│    Results returned as JSON                                 │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Test the Server

```bash
cd C:\Users\jwpmi\Downloads\AI\wb
node agents/mcp-command-server.js --test
```

### 2. Add to Claude Desktop

Find your Claude Desktop config file:
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add this to the `mcpServers` section:

```json
{
  "mcpServers": {
    "wb-command-runner": {
      "command": "node",
      "args": ["C:\\Users\\jwpmi\\Downloads\\AI\\wb\\agents\\mcp-command-server.js"]
    }
  }
}
```

### 3. Restart Claude Desktop

After adding the config, restart Claude Desktop for it to pick up the new MCP server.

## Available Tools

### `run_command`

Run any allowed shell command.

```
run_command({ command: "node agents/test-agent.cjs run component" })
```

### `run_agent`

Run a specific agent (shorthand for node agents/...).

```
run_agent({ agent: "test-agent.cjs run component" })
run_agent({ agent: "test-agent.cjs diagnose wb-button" })
run_agent({ agent: "test-fix-retest.js" })
```

### `list_agents`

List all available agents and their commands.

```
list_agents()
```

## Allowed Commands

For security, only these command patterns are allowed:

| Pattern | Examples |
|---------|----------|
| `node agents/*` | `node agents/test-agent.cjs run all` |
| `npm run agent:*` | `npm run agent:test` |
| `npm run test*` | `npm run test` |
| `npm test` | `npm test` |
| `npx playwright` | `npx playwright test` |
| `dir` | `dir agents` |
| `type` | `type package.json` |
| `echo` | `echo hello` |

## Example Usage

Once configured, you can ask Claude:

- "Run all component tests"
- "Run the button tests"
- "Diagnose the wb-slider component"
- "Run the self-healing test agent"
- "List available test categories"
- "Check test infrastructure health"

Claude will use the `run_agent` or `run_command` tools to execute on your machine.

## Configuration

Edit the `CONFIG` object in `mcp-command-server.js`:

```javascript
const CONFIG = {
  workingDir: 'C:\\Users\\jwpmi\\Downloads\\AI\\wb',  // Base directory
  timeout: 120000,                                    // Command timeout (ms)
  allowedPatterns: [...],                             // Allowed command regex
  blockedPatterns: [...]                              // Blocked command regex
};
```

## Security Notes

1. **Whitelist Only**: Only commands matching `allowedPatterns` will run
2. **Blocked Patterns**: Dangerous commands (rm -rf, format, shutdown) are blocked
3. **Working Directory**: Commands run in the configured `workingDir`
4. **Local Only**: The server only accepts stdio connections (no network)

## Troubleshooting

### Server not starting

```bash
# Check Node.js is installed
node --version

# Test the server directly
node agents/mcp-command-server.js --test
```

### Commands not allowed

Check the `allowedPatterns` in the CONFIG and add your pattern if needed.

### Claude can't see the server

1. Check the config path is correct in `claude_desktop_config.json`
2. Use double backslashes in Windows paths
3. Restart Claude Desktop after config changes

## Files

| File | Purpose |
|------|---------|
| `mcp-command-server.js` | The MCP server |
| `mcp-command-server.md` | This documentation |

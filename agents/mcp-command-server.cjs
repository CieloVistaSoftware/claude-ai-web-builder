/**
 * MCP Command Server
 * 
 * Allows Claude to run commands on your local Windows machine.
 * This bridges the gap between Claude's cloud environment and your local system.
 * 
 * Usage:
 *   node agents/mcp-command-server.js
 * 
 * Then add to Claude Desktop config (claude_desktop_config.json)
 */

const { spawn } = require('child_process');
const readline = require('readline');

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG = {
  // Working directory for all commands
  workingDir: 'C:\\Users\\jwpmi\\Downloads\\AI\\wb',
  
  // Timeout for commands (ms)
  timeout: 120000,
  
  // Allowed command patterns (regex)
  // Only these commands will be permitted
  allowedPatterns: [
    /^node\s+agents\//,           // node agents/*
    /^npm\s+run\s+agent:/,        // npm run agent:*
    /^npm\s+run\s+test/,          // npm run test*
    /^npm\s+test/,                // npm test
    /^npx\s+playwright/,          // npx playwright
    /^dir\s/,                     // dir (list files)
    /^type\s/,                    // type (view file)
    /^echo\s/,                    // echo
  ],
  
  // Blocked patterns (always denied)
  blockedPatterns: [
    /rm\s+-rf/,
    /del\s+\/[sq]/i,
    /format\s/i,
    /shutdown/i,
    /restart/i,
  ]
};

// ============================================================
// MCP SERVER IMPLEMENTATION
// ============================================================

class MCPCommandServer {
  constructor() {
    this.name = 'wb-command-runner';
    this.version = '1.0.0';
  }

  // Check if command is allowed
  isAllowed(command) {
    // Check blocked patterns first
    for (const pattern of CONFIG.blockedPatterns) {
      if (pattern.test(command)) {
        return { allowed: false, reason: 'Command matches blocked pattern' };
      }
    }
    
    // Check allowed patterns
    for (const pattern of CONFIG.allowedPatterns) {
      if (pattern.test(command)) {
        return { allowed: true };
      }
    }
    
    return { allowed: false, reason: 'Command not in allowed list' };
  }

  // Execute a command
  async runCommand(command, options = {}) {
    const check = this.isAllowed(command);
    if (!check.allowed) {
      return {
        success: false,
        error: check.reason,
        command,
        stdout: '',
        stderr: '',
        exitCode: -1
      };
    }

    const cwd = options.cwd || CONFIG.workingDir;
    const timeout = options.timeout || CONFIG.timeout;

    return new Promise((resolve) => {
      const startTime = Date.now();
      let stdout = '';
      let stderr = '';
      let timedOut = false;

      // Use cmd.exe on Windows
      const proc = spawn('cmd.exe', ['/c', command], {
        cwd,
        shell: false,
        windowsHide: true
      });

      const timer = setTimeout(() => {
        timedOut = true;
        proc.kill('SIGTERM');
      }, timeout);

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        clearTimeout(timer);
        const duration = Date.now() - startTime;

        resolve({
          success: code === 0,
          command,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: code,
          duration,
          timedOut,
          cwd
        });
      });

      proc.on('error', (err) => {
        clearTimeout(timer);
        resolve({
          success: false,
          command,
          stdout: '',
          stderr: err.message,
          exitCode: -1,
          error: err.message
        });
      });
    });
  }

  // Run a specific agent
  async runAgent(agentCommand) {
    const fullCommand = `node agents/${agentCommand}`;
    return this.runCommand(fullCommand);
  }

  // Get list of available agents
  getAgents() {
    return [
      {
        name: 'test-agent',
        file: 'test-agent.cjs',
        commands: [
          'test-agent.cjs run all',
          'test-agent.cjs run component',
          'test-agent.cjs run button',
          'test-agent.cjs run control-panel',
          'test-agent.cjs run color',
          'test-agent.cjs run theme',
          'test-agent.cjs run modal',
          'test-agent.cjs diagnose wb-button',
          'test-agent.cjs diagnose wb-slider',
          'test-agent.cjs categories',
          'test-agent.cjs health'
        ]
      },
      {
        name: 'test-fix-retest',
        file: 'test-fix-retest.js',
        commands: ['test-fix-retest.js']
      },
      {
        name: 'RunAllComponentTests',
        file: 'RunAllComponentTests.js',
        commands: ['RunAllComponentTests.js']
      }
    ];
  }

  // MCP Tool definitions
  getTools() {
    return [
      {
        name: 'run_command',
        description: 'Run a shell command on the local Windows machine. Only allowed commands will execute.',
        inputSchema: {
          type: 'object',
          properties: {
            command: {
              type: 'string',
              description: 'The command to run (e.g., "node agents/test-agent.cjs run component")'
            },
            timeout: {
              type: 'number',
              description: 'Timeout in milliseconds (default: 120000)'
            }
          },
          required: ['command']
        }
      },
      {
        name: 'run_agent',
        description: 'Run a specific agent from the agents folder',
        inputSchema: {
          type: 'object',
          properties: {
            agent: {
              type: 'string',
              description: 'Agent command (e.g., "test-agent.cjs run component")'
            }
          },
          required: ['agent']
        }
      },
      {
        name: 'list_agents',
        description: 'List all available agents and their commands',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ];
  }

  // Handle MCP requests
  async handleRequest(request) {
    const { method, params } = request;

    switch (method) {
      case 'initialize':
        return {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: this.name, version: this.version }
        };

      case 'tools/list':
        return { tools: this.getTools() };

      case 'tools/call':
        return await this.handleToolCall(params.name, params.arguments);

      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }

  // Handle tool calls
  async handleToolCall(toolName, args) {
    switch (toolName) {
      case 'run_command':
        const result = await this.runCommand(args.command, { timeout: args.timeout });
        return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };

      case 'run_agent':
        const agentResult = await this.runAgent(args.agent);
        return { content: [{ type: 'text', text: JSON.stringify(agentResult, null, 2) }] };

      case 'list_agents':
        const agents = this.getAgents();
        return { content: [{ type: 'text', text: JSON.stringify(agents, null, 2) }] };

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

  // Start MCP server (stdio mode)
  start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    console.error(`[${this.name}] MCP Command Server started`);
    console.error(`[${this.name}] Working directory: ${CONFIG.workingDir}`);

    rl.on('line', async (line) => {
      try {
        const request = JSON.parse(line);
        const response = await this.handleRequest(request);
        
        const output = JSON.stringify({
          jsonrpc: '2.0',
          id: request.id,
          result: response
        });
        
        process.stdout.write(output + '\n');
      } catch (error) {
        const errorResponse = JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32603, message: error.message }
        });
        process.stdout.write(errorResponse + '\n');
      }
    });

    rl.on('close', () => {
      console.error(`[${this.name}] Server shutting down`);
      process.exit(0);
    });
  }
}

// ============================================================
// STANDALONE MODE (for testing)
// ============================================================

async function standaloneTest() {
  const server = new MCPCommandServer();
  
  console.log('🚀 MCP Command Server - Standalone Test Mode\n');
  console.log('Available agents:');
  console.log(JSON.stringify(server.getAgents(), null, 2));
  
  console.log('\n📋 Testing: node agents/test-agent.cjs categories\n');
  const result = await server.runAgent('test-agent.cjs categories');
  console.log(result.stdout || result.stderr);
  
  console.log('\n✅ Test complete. To run as MCP server, configure in Claude Desktop.');
}

// ============================================================
// ENTRY POINT
// ============================================================

const args = process.argv.slice(2);

if (args.includes('--test') || args.includes('-t')) {
  // Run standalone test
  standaloneTest();
} else if (args.includes('--help') || args.includes('-h')) {
  console.log(`
MCP Command Server
==================

Usage:
  node mcp-command-server.js          Start as MCP server (stdio mode)
  node mcp-command-server.js --test   Run standalone test
  node mcp-command-server.js --help   Show this help

Configuration:
  Edit CONFIG object in this file to customize:
  - workingDir: Base directory for commands
  - timeout: Command timeout
  - allowedPatterns: Regex patterns for allowed commands
  - blockedPatterns: Regex patterns for blocked commands

Claude Desktop Setup:
  Add to claude_desktop_config.json:
  
  {
    "mcpServers": {
      "wb-command-runner": {
        "command": "node",
        "args": ["C:\\\\Users\\\\jwpmi\\\\Downloads\\\\AI\\\\wb\\\\agents\\\\mcp-command-server.js"]
      }
    }
  }
`);
} else {
  // Start MCP server
  const server = new MCPCommandServer();
  server.start();
}

module.exports = { MCPCommandServer, CONFIG };

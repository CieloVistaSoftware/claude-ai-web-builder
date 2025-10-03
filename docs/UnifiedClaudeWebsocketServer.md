# Unified Claude WebSocket Server

---
*Last Updated: 2025-09-29*
*Version: 1.0.0*
*Author: Claude Code Assistant*
*Status: Current - WebSocket server implementation*
---

## Overview

This document describes the Unified Claude WebSocket Server implementation, which consolidates functionality from three previous server implementations:

1. `claude-socket-server.ts`
2. `claude-socket-test-server.ts` 
3. `claude-websocket-server.ts`

## Key Features

- **WebSocket Communication**: Uses Socket.IO for real-time bidirectional communication
- **Claude API Integration**: Connects to Anthropic's Claude AI API for AI responses
- **Static File Serving**: Serves HTML, CSS, and JavaScript files for testing
- **Mock Response Mode**: Can operate with mock responses for testing without API credentials
- **Environment Configuration**: Configurable via environment variables
- **Port Management**: Automatic detection and termination of conflicting processes

## Usage

### Starting the Server

```bash
# With real Claude API (requires CLAUDE_API_KEY environment variable)
npm run unified:server

# With mock responses (no API key required)
npm run unified:server:mock
```

You can also use the VS Code task "Start Unified Claude WebSocket Server" to run the server in mock mode.

### Environment Variables

- `PORT`: The port to run the server on (default: 3000)
- `CLAUDE_API_KEY`: Your Claude API key from Anthropic (required for real API mode)
- `USE_MOCK_RESPONSES`: Set to "true" to use mock responses instead of calling the real API
- `DEFAULT_MODEL`: The default Claude model to use (default: claude-3-sonnet-20240229)

### WebSocket Events

The server implements the following Socket.IO events:

#### Client → Server
- `register:client`: Register a new client with the server
- `claude:request`: Send a request to the Claude API
- `get:file`: Request a file from the server
- `get:env`: Request environment variables (limited to safe values)

#### Server → Client
- `register:ack`: Acknowledge client registration
- `claude:status`: Updates about Claude request status
- `claude:response`: Claude API response
- `claude:error`: Error from Claude API or server
- `file:[path]`: Response to file request
- `env:[key]`: Response to environment variable request

## Testing

1. Start the server using one of the methods above
2. Open a browser to http://localhost:3000/test-claude-socket.html
3. Use the test interface to interact with the WebSocket server and Claude API

## Implementation Details

The implementation follows these principles:

1. **Single Responsibility**: Each component has a clear responsibility
2. **Error Handling**: Comprehensive error handling for all operations
3. **Security**: Protection against common vulnerabilities
4. **Configurability**: Easy configuration via environment variables
5. **Testability**: Support for mock mode to facilitate testing

## Benefits of Unified Implementation

- **Reduced Duplication**: Eliminates code duplication across multiple server files
- **Consistent Interface**: Provides a unified interface for all client interactions
- **Simplified Maintenance**: Single codebase to maintain and update
- **Better Configuration**: Centralized configuration options
- **Improved Testing**: Supports both real API and mock modes

## Future Improvements

- Add authentication for production use
- Implement rate limiting
- Add support for streaming responses
- Enhance error handling and logging
- Add more comprehensive testing

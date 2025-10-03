# Removed HTTP Server Tests

The following tests have been removed from the test suite as they relied on HTTP server communication, which conflicts with our pure WebSocket architecture:

## Playwright Browser Tests Using HTTP

1. `tests/websocket-dependency-loading.spec.js` - This test was loading an initial page via HTTP and then testing if subsequent resources were loaded via WebSocket
2. `tests/claude-socket-real.spec.js` - This test was also using HTTP to load the initial page

## Test Categories Affected

- WebSocket dependency loading tests
- Claude socket communication with real backend

These tests have been removed because in our architecture, all communication including the initial page load should happen through WebSockets. Using HTTP for any part of the communication is inconsistent with this approach.

## Pure WebSocket Testing

The current test suite now focuses exclusively on testing WebSocket functionality directly:

- `run-claude-tests.js` - Tests WebSocket communication directly
- `tests/claude-socket-direct.test.js` - Uses Node.js test runner to test WebSocket communication
- `tests/socket-basic.test.js` - Tests basic socket.io functionality

These tests verify the same functionality but do so without relying on HTTP servers or browser-based testing that would require HTTP.

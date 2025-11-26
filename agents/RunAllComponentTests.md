# RunAllComponentTests Agent

This agent runs all Playwright component tests, collects failures, and issues a final summary report.

## How It Works
- Runs all tests using Playwright's JSON reporter
- Parses results to find failed tests
- Generates a summary report listing all failures

## Usage

### Start Locally
```bash
node agents/RunAllComponentTests.js
```
Or in code:
```js
const { runAgent } = require('./RunAllComponentTests');
runAgent();
```

### Start via AI Agent
You can invoke this agent from an AI orchestration system (e.g., Claude, Copilot) using a prompt like:
```
"Run all component tests and summarize failures."
```
The agent will execute and return the summary report.

## Example Output
```
❌ Component Test Failures:
Component: wb-button
Test: should render primary button
Error: Expected ...
---
```

If all tests pass:
```
✅ All component tests passed.
```

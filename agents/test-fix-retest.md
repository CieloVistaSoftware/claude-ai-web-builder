# test-fix-retest Agent

This agent runs Playwright tests, analyzes failures, asks Claude to fix code, applies the fix, and repeats until all tests pass or a limit is reached.

## Workflow
1. Run Playwright tests
2. Parse failed tests
3. Ask Claude for code fixes
4. Apply fixes
5. Rerun until all tests pass or max attempts reached

## Example

### Start Locally
```bash
node agents/test-fix-retest.js
```
Or in code:
```js
const { selfHealingAgent } = require('./test-fix-retest');
selfHealingAgent();
```

### Start via AI Agent
Invoke with a prompt like:
```
"Run the self-healing agent to fix failing tests until all pass."
```
The agent will execute, apply fixes, and report results.

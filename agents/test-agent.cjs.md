# test-agent.cjs

CommonJS version of the test agent. Use this for projects with "type": "module" in package.json to avoid import/export issues.

## Usage

### Start Locally
```bash
node agents/test-agent.cjs
```
Or in code:
```js
const agent = require('./test-agent.cjs');
agent.run();
```

### Start via AI Agent
Invoke with a prompt like:
```
"Run the test-agent.cjs and report results."
```
The agent will execute and return results.

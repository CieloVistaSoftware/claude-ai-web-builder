# Run Script Server

This server allows you to run PowerShell (`.ps1`) and Node.js (`.js`) scripts from the browser and view their output live.

## How It Works
- The backend is a Node.js Express server (`run-script-server.cjs`).
- The frontend is `runscripts.html`, which lists all scripts in the `scripts` folder.
- When you click "Run" on a script, the server executes it and returns the output, which is displayed in the browser.

## Usage Instructions

### 1. Start the Server
```sh
node scripts/run-script-server.cjs
```
The server will listen on [http://localhost:3030](http://localhost:3030).

### 2. Open the Frontend
Open `runscripts.html` in your browser at:
```
http://localhost:3030/scripts/runscripts.html
```

### 3. Run Scripts
- Click any "Run" button to execute a script.
- The button turns green while running, then blue when done.
- Output appears in the `<pre>` element below the script list.

## Security Notes
- Only `.ps1` and `.js` scripts in the `scripts` folder are allowed.
- Script names are validated to prevent path traversal.

## Backend Details
- Uses Express for HTTP server.
- Uses `exec` to run PowerShell or Node.js scripts.
- Serves static files from the `scripts` directory.

## Frontend Details
- Lists all scripts in the folder.
- Fetches `/run-script?name=...` to run a script and display output.
- Simulates button color changes for status feedback.

---

**For real production use, add authentication and further security controls.**

// Simple Node.js server to run scripts and return output

const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const PORT = 3030;


// Serve static files at /scripts/ for browser access, including .md files
app.use('/scripts', express.static(__dirname));
app.use('/scripts', express.static(path.join(__dirname))); // fallback for subfolders
// Optionally, keep root static serving for backward compatibility
app.use(express.static(path.join(__dirname)));


app.get('/run-script', (req, res) => {
  const script = req.query.name;
  if (!script || !script.match(/^[\w\-.\/]+$/)) {
    return res.status(400).send('Invalid script name');
  }
  const scriptPath = path.join(__dirname, script);
  // Only allow .ps1 and .js scripts
  if (!scriptPath.endsWith('.ps1') && !scriptPath.endsWith('.js')) {
    return res.status(400).send('Only .ps1 and .js scripts allowed');
  }
  // Run PowerShell or Node.js script
  let cmd;
  if (scriptPath.endsWith('.ps1')) {
    cmd = `pwsh -ExecutionPolicy Bypass -File "${scriptPath}"`;
  } else {
    cmd = `node "${scriptPath}"`;
  }
  exec(cmd, { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      return res.send(`Error: ${err.message}\n${stderr}`);
    }
    res.send(stdout || stderr);
  });
});

// Serve scripts/runscripts.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'runscripts.html'));
});

// File watcher for test-results folder
const fs = require('fs');
const testResultsDir = path.join(__dirname, '../test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}
fs.watch(testResultsDir, { persistent: true }, (eventType, filename) => {
  if (filename && (eventType === 'change' || eventType === 'rename')) {
    console.log(`[Watcher] Detected ${eventType} in test-results: ${filename}`);
    // Here you could trigger parsing, fixing, rerunning, etc.
    // For now, just log the event
    // TODO: Integrate with AI-powered fix and rerun workflow
  }
});

app.listen(PORT, () => {
  console.log(`Run Script Server listening on http://localhost:${PORT}`);
});

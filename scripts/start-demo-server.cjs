// start-demo-server.cjs
// Starts Vite dev server for demo viewing

const { exec } = require('child_process');

console.log('Starting Vite dev server for Demo Viewer...');

const vite = exec('npm run dev', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting Vite: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Vite stderr: ${stderr}`);
  }
  console.log(stdout);
});

vite.stdout.pipe(process.stdout);
vite.stderr.pipe(process.stderr);

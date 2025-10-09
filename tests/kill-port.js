#!/usr/bin/env node
// Kill processes using specified port
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function killPort(port = 3000) {
    try {
        console.log(`Attempting to kill processes on port ${port}...`);
        
        // Windows command to find and kill process using the port
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
        
        if (stdout.trim()) {
            console.log(`Found processes on port ${port}:`);
            console.log(stdout);
            
            // Extract PIDs and kill them
            const lines = stdout.trim().split('\n');
            const pids = new Set();
            
            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                const pid = parts[parts.length - 1];
                if (pid && pid !== '0') {
                    pids.add(pid);
                }
            });
            
            for (const pid of pids) {
                try {
                    await execAsync(`taskkill /F /PID ${pid}`);
                    console.log(`Killed process ${pid}`);
                } catch (error) {
                    console.log(`Could not kill process ${pid}: ${error.message}`);
                }
            }
        } else {
            console.log(`No processes found on port ${port}`);
        }
    } catch (error) {
        console.log(`No processes found on port ${port} or error occurred: ${error.message}`);
    }
}

// If run directly, kill the port specified as argument or default to 3000
if (import.meta.url === `file://${process.argv[1]}`) {
    const port = process.argv[2] || 3000;
    killPort(port);
}

export { killPort };
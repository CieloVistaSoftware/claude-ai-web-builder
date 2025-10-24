// Simple kill-ports script for testing
import { exec } from 'child_process';

console.log('Killing ports...');

// Kill common development ports
const ports = [3000, 5000, 8000, 8080, 4000];

ports.forEach(port => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        if (stdout) {
            const lines = stdout.split('\n');
            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                if (parts.length > 4) {
                    const pid = parts[parts.length - 1];
                    if (pid && !isNaN(pid)) {
                        exec(`taskkill /PID ${pid} /F`, (killError) => {
                            if (!killError) {
                                console.log(`Killed process ${pid} on port ${port}`);
                            }
                        });
                    }
                }
            });
        }
    });
});

console.log('Port cleanup complete');
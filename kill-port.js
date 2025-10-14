#!/usr/bin/env node
/**
 * Simple port killer for development
 * Kills processes on ports 8080, 3000, etc.
 */

import { exec } from 'child_process';

const PORTS = [8080, 3000, 3001, 8000, 5000];

function clearPorts() {
    console.log('🧹 Clearing development ports...');
    
    PORTS.forEach(port => {
        exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
            if (!error && stdout) {
                const lines = stdout.split('\n').filter(line => line.includes('LISTENING'));
                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1];
                    if (pid && pid !== '0' && !isNaN(pid)) {
                        exec(`taskkill /PID ${pid} /F`, () => {
                            console.log(`🔥 Killed process ${pid} on port ${port}`);
                        });
                    }
                });
            }
        });
    });
    
    setTimeout(() => {
        console.log('✅ Port cleanup complete');
    }, 1000);
}

clearPorts();
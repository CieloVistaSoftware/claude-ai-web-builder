#!/usr/bin/env node
/**
 * Simple port killer for development
 * Kills processes on ports 8080, 3000, etc.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const PORTS = [8080, 3000, 3001, 8000, 5000];

async function clearPort(port) {
    try {
        const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
        if (stdout) {
            const lines = stdout.split('\n').filter(line => line.includes('LISTENING'));
            for (const line of lines) {
                const parts = line.trim().split(/\s+/);
                const pid = parts[parts.length - 1];
                if (pid && pid !== '0' && !isNaN(pid)) {
                    try {
                        await execPromise(`taskkill /PID ${pid} /F`);
                        console.log(`🔥 Killed process ${pid} on port ${port}`);
                    } catch (e) {
                        // Process might already be gone
                    }
                }
            }
        }
    } catch (error) {
        // No process on this port
    }
}

async function clearAllPorts() {
    console.log('🧹 Clearing development ports...');
    
    for (const port of PORTS) {
        await clearPort(port);
    }
    
    // Wait a moment for ports to be released
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ Port cleanup complete');
}

clearAllPorts();

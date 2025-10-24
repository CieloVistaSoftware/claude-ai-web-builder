#!/usr/bin/env node

/**
 * SIMPLE BUT EFFECTIVE port and process killer
 * Kills node processes and clears development ports
 */

import { exec } from 'child_process';

// Ports to clear
const PORTS = [8080, 3000, 3001, 8000, 5000, 5173, 4200];

function killNodeProcesses() {
    return new Promise((resolve) => {
        console.log(`🔥 KILLING ALL NODE.EXE PROCESSES...`);
        
        exec(`taskkill /F /IM node.exe /T`, (error) => {
            if (error) {
                console.log(`⚠️ No node.exe processes to kill`);
            } else {
                console.log(`✅ KILLED ALL NODE.EXE PROCESSES`);
            }
            
            // Wait for processes to clear then check ports
            setTimeout(() => {
                clearPorts(resolve);
            }, 1000);
        });
    });
}

function clearPorts(callback) {
    let portsChecked = 0;
    
    PORTS.forEach(port => {
        exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
            if (!error && stdout) {
                const lines = stdout.split('\n').filter(line => line.includes('LISTENING'));
                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1];
                    if (pid && pid !== '0' && !isNaN(pid)) {
                        exec(`taskkill /PID ${pid} /F`, () => {
                            console.log(`🔥 KILLED PID ${pid} ON PORT ${port}`);
                        });
                    }
                });
            }
            
            portsChecked++;
            if (portsChecked === PORTS.length) {
                console.log(`✅ ALL PORTS CLEARED`);
                callback();
            }
        });
    });
}

async function main() {
    console.log('🧹 NUCLEAR PORT CLEANUP STARTING...');
    await killNodeProcesses();
    console.log('✨ NUCLEAR CLEANUP COMPLETE');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { killNodeProcesses, main as killAllPorts };
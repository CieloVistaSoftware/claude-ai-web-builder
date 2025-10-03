#!/usr/bin/env node

/**
 * Kill processes running on specific ports
 * Used to clean up development servers before starting new ones
 */

import { exec } from 'child_process';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Ports to kill - 8080 first for development server
const PORTS = [8080, 3000, 3001];

function killPort(port) {
    return new Promise((resolve) => {
        const isWindows = os.platform() === 'win32';
        
        if (isWindows) {
            // Windows: aggressive approach - kill all related processes first
            console.log(`🔥 Aggressively killing all node and PowerShell processes...`);
            
            // Force kill all node processes
            exec(`taskkill /F /IM node.exe /T`, (nodeError) => {
                if (!nodeError) {
                    console.log(`✅ Force killed all node.exe processes`);
                } else {
                    console.log(`⚠️ No node.exe processes to kill`);
                }
                
                // Force kill all PowerShell processes  
                exec(`taskkill /F /IM pwsh.exe /T`, (pwshError) => {
                    if (!pwshError) {
                        console.log(`✅ Force killed all pwsh.exe processes`);
                    } else {
                        console.log(`⚠️ No pwsh.exe processes to kill`);
                    }
                    
                    // Now check specific port
                    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
                        if (error || !stdout) {
                            console.log(`✅ Port ${port} is now available`);
                            resolve();
                            return;
                        }
                        
                        const lines = stdout.split('\n').filter(line => line.includes('LISTENING'));
                        if (lines.length === 0) {
                            console.log(`✅ Port ${port} is now available`);
                            resolve();
                            return;
                        }
                        
                        lines.forEach(line => {
                            const parts = line.trim().split(/\s+/);
                            const pid = parts[parts.length - 1];
                            if (pid && pid !== '0') {
                                exec(`taskkill /PID ${pid} /F`, (killError) => {
                                    if (killError) {
                                        console.log(`⚠️  Could not kill process ${pid} on port ${port}`);
                                    } else {
                                        console.log(`🔥 Killed process ${pid} on port ${port}`);
                                    }
                                    resolve();
                                });
                            } else {
                                resolve();
                            }
                        });
                    });
                });
            });
        } else {
            // Unix/Linux/Mac: use lsof and kill
            exec(`lsof -ti:${port}`, (error, stdout) => {
                if (error || !stdout.trim()) {
                    console.log(`✅ Port ${port} is available`);
                    resolve();
                    return;
                }
                
                const pid = stdout.trim();
                exec(`kill -9 ${pid}`, (killError) => {
                    if (killError) {
                        console.log(`⚠️  Could not kill process ${pid} on port ${port}`);
                    } else {
                        console.log(`🔥 Killed process ${pid} on port ${port}`);
                    }
                    resolve();
                });
            });
        }
    });
}

async function killAllPorts() {
    console.log('🧹 Cleaning up development ports...');
    
    for (const port of PORTS) {
        await killPort(port);
    }
    
    console.log('✨ Port cleanup complete');
}

// Run if called directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
    killAllPorts().catch(console.error);
}

export { killPort, killAllPorts };
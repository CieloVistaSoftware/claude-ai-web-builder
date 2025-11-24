#!/usr/bin/env node

/**
 * Kill Port Utility
 * Kills processes running on specified ports (default: 3000, 8080)
 * Used by npm test scripts to ensure ports are available
 */

import { exec } from 'child_process';
import os from 'os';

const PORTS = [3000, 3001, 8080];
const isWindows = os.platform() === 'win32';

/**
 * Kill port using Windows command
 */
function killPortWindows(port) {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (error || !stdout) {
        resolve();
        return;
      }

      const lines = stdout.split('\n');
      const pids = new Set();

      lines.forEach(line => {
        const match = line.match(/\s+(\d+)\s*$/);
        if (match) {
          pids.add(match[1]);
        }
      });

      if (pids.size === 0) {
        resolve();
        return;
      }

      let completed = 0;
      pids.forEach(pid => {
        exec(`taskkill /PID ${pid} /F`, () => {
          completed++;
          if (completed === pids.size) {
            resolve();
          }
        });
      });
    });
  });
}

/**
 * Kill port using Unix command
 */
function killPortUnix(port) {
  return new Promise((resolve) => {
    exec(`lsof -i :${port} | grep LISTEN | awk '{print $2}' | xargs kill -9`, (error) => {
      // Ignore errors - port might not be in use
      resolve();
    });
  });
}

/**
 * Kill all configured ports
 */
async function killPorts() {
  console.log('🔪 Killing ports:', PORTS.join(', '));

  try {
    for (const port of PORTS) {
      if (isWindows) {
        await killPortWindows(port);
      } else {
        await killPortUnix(port);
      }
      console.log(`✅ Port ${port} cleared`);
    }
    console.log('✅ All ports cleared\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error killing ports:', error.message);
    process.exit(1);
  }
}

// Run
killPorts();

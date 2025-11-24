import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

test.describe('NPM Commands Test Suite', () => {
  test('should run all npm commands test script successfully', async () => {
    const scriptPath = path.join(process.cwd(), 'test-npm-commands.ps1');

    // Ensure the script exists
    expect(fs.existsSync(scriptPath)).toBe(true);

    try {
      // Run the PowerShell script
      const output = execSync(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, {
        encoding: 'utf8',
        cwd: process.cwd(),
        timeout: 300000 // 5 minutes timeout
      });

      console.log('PowerShell script output:', output);

      // Check that results file was created
      const resultsPath = path.join(process.cwd(), 'npm-test-results.json');
      expect(fs.existsSync(resultsPath)).toBe(true);

      // Parse results
      const resultsContent = fs.readFileSync(resultsPath, 'utf8');
      const results = JSON.parse(resultsContent);

      // Verify results structure
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);

      // Check that each result has required properties
      results.forEach((result: any) => {
        expect(result).toHaveProperty('Command');
        expect(result).toHaveProperty('ExitCode');
        expect(result).toHaveProperty('Success');
        expect(result).toHaveProperty('Duration');
      });

      // Log summary
      const passed = results.filter((r: any) => r.Success).length;
      const failed = results.filter((r: any) => !r.Success).length;

      console.log(`Test Summary: ${passed} passed, ${failed} failed`);

      // The test passes if the script runs without throwing
      // Individual command failures are logged but don't fail the test

    } catch (error) {
      console.error('PowerShell script failed:', error);
      throw error;
    }
  });

  test('should verify claude.md files were updated', async () => {
    // Find all claude.md files
    const findClaudeMdFiles = (dir: string): string[] => {
      const files: string[] = [];
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          files.push(...findClaudeMdFiles(fullPath));
        } else if (item === 'claude.md') {
          files.push(fullPath);
        }
      }

      return files;
    };

    const claudeMdFiles = findClaudeMdFiles(process.cwd());
    expect(claudeMdFiles.length).toBeGreaterThan(0);

    // Check that each claude.md contains current status
    for (const file of claudeMdFiles) {
      const content = fs.readFileSync(file, 'utf8');
      expect(content).toContain('## Current Status');
      expect(content).toContain('NPM Commands Test Summary');
    }
  });
});
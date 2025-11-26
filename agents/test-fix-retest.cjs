// Agent: test-fix-retest.cjs
// This agent runs Playwright tests, analyzes failures, asks Claude to fix code, applies the fix, and repeats until all tests pass or a limit is reached.

const { exec } = require('child_process');
const fs = require('fs').promises;
const claude = require('./claude'); // Assume claude API wrapper is available

// 1. Run Tests
async function runTests() {
  return new Promise((resolve, reject) => {
    exec('npx playwright test --reporter=json', (error, stdout, stderr) => {
      if (error) return reject(error);
      try {
        const results = JSON.parse(stdout);
        resolve(results);
      } catch (e) {
        reject(e);
      }
    });
  });
}

// 2. Analyze Failures
function parseTestResults(results) {
  if (!results || !results.suites) return [];
  const failedTests = [];
  for (const suite of results.suites) {
    for (const test of suite.tests) {
      if (test.status === 'failed') {
        failedTests.push({ name: test.title, error: test.error });
      }
    }
  }
  return failedTests;
}

// 3. Ask Claude to Fix Code
async function fixWithClaude(failure) {
  const prompt = `Fix the following test failure: ${failure.name}\nError: ${failure.error}`;
  return await claude.suggestFix(prompt);
}

// 4. Apply the Fix
async function applyFix(fix) {
  await fs.writeFile(fix.file, fix.code);
}


// 5. Rerun Until Pass
async function selfHealingAgent() {
  let attempts = 0;
  let lastFailures = [];
  while (attempts < 5) {
    const results = await runTests();
    const failures = parseTestResults(results);
    lastFailures = failures;
    if (failures.length === 0) {
      const result = {
        passed: true,
        attempts: attempts + 1,
        failures: [],
        summary: 'All tests passed!'
      };
      console.log(JSON.stringify(result, null, 2));
      return result;
    }
    for (const failure of failures) {
      const fix = await fixWithClaude(failure);
      await applyFix(fix);
    }
    attempts++;
  }
  const result = {
    passed: false,
    attempts,
    failures: lastFailures,
    summary: 'Some tests still failing after 5 attempts.'
  };
  console.log(JSON.stringify(result, null, 2));
  return result;
}

module.exports = {
  runTests,
  parseTestResults,
  fixWithClaude,
  applyFix,
  selfHealingAgent
};

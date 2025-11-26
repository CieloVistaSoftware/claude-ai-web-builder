// Agent: RunAllComponentTests
// Runs all component tests, collects failures, and issues a final summary report.

const { exec } = require('child_process');

// 1. Run all tests (assumes Playwright or similar test runner)
async function runAllTests() {
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

// 2. Collect all failures
function collectFailures(results) {
  const failures = [];
  if (!results || !results.suites) return failures;
  for (const suite of results.suites) {
    for (const test of suite.tests) {
      if (test.status === 'failed') {
        failures.push({
          component: suite.title,
          test: test.title,
          error: test.error
        });
      }
    }
  }
  return failures;
}

// 3. Issue final summary report
function summaryReport(failures) {
  if (failures.length === 0) {
    return '✅ All component tests passed.';
  }
  let report = '❌ Component Test Failures:\n';
  for (const fail of failures) {
    report += `Component: ${fail.component}\nTest: ${fail.test}\nError: ${fail.error}\n---\n`;
  }
  return report;
}


// Main agent function
async function runAgent() {
  try {
    const results = await runAllTests();
    const failures = collectFailures(results);
    const report = summaryReport(failures);
    const passed = failures.length === 0;
    const result = {
      passed,
      failures,
      summary: report
    };
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (e) {
    console.error('Error running tests:', e);
    return { passed: false, failures: [], summary: 'Error running tests.' };
  }
}

module.exports = {
  runAllTests,
  collectFailures,
  summaryReport,
  runAgent
};

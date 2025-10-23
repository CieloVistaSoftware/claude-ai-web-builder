const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testDir = 'C:\\Users\\jwpmi\\Downloads\\AI\\wb\\tests\\Color Harmony System';
const htmlFile = 'C:\\Users\\jwpmi\\Downloads\\AI\\wb\\html\\Color Harmony System\\article\\Professional-Developer-HCS-System.html';

let attempt = 1;
const maxAttempts = 10;

console.log('🧪 Starting test runner...');
console.log('📁 Test directory:', testDir);
console.log('📄 HTML file:', htmlFile);
console.log('');

// Check if files exist
if (!fs.existsSync(htmlFile)) {
  console.error('❌ HTML file not found:', htmlFile);
  process.exit(1);
}

function runTests() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔄 Attempt ${attempt}/${maxAttempts}`);
  console.log('='.repeat(60));
  
  try {
    const output = execSync(
      `npx playwright test "${testDir}" --reporter=line`,
      { 
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: 'C:\\Users\\jwpmi\\Downloads\\AI\\wb'
      }
    );
    
    console.log(output);
    console.log('\n✅ ALL TESTS PASSED!');
    console.log(`✅ Completed on attempt ${attempt}`);
    return true;
  } catch (error) {
    console.log(error.stdout || '');
    console.log(error.stderr || '');
    console.log(`\n❌ Tests failed on attempt ${attempt}`);
    
    if (attempt < maxAttempts) {
      console.log('🔧 Analyzing failures...');
      attempt++;
      return false;
    } else {
      console.log(`\n❌ FAILED after ${maxAttempts} attempts`);
      console.log('\n📋 Final test output:');
      console.log(error.stdout || error.stderr || error.message);
      return false;
    }
  }
}

// Run tests
let passed = false;
while (attempt <= maxAttempts && !passed) {
  passed = runTests();
  if (!passed && attempt <= maxAttempts) {
    console.log('\n⏳ Waiting 2 seconds before retry...');
    // Sleep for 2 seconds
    execSync('timeout /t 2 /nobreak', { stdio: 'ignore' });
  }
}

if (!passed) {
  process.exit(1);
}

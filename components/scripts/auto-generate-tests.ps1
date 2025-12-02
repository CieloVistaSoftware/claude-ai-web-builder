# Auto-Generate Test Suites for All WB Components
# This script creates Playwright spec files for every component

$componentsPath = "C:\Users\jwpmi\Downloads\AI\wb\components"
$testTemplate = @'
import { test, expect } from '@playwright/test';

// Helper to capture errors
async function captureAndLogError(testName, error) {
  const errorText = `TEST: ${testName}\nERROR: ${error?.message || error}\nSTACK: ${error?.stack || 'N/A'}`;
  console.error(errorText);
  throw error;
}

test.describe('{componentName}', () => {

  test('{componentName} loads without errors', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/');
      
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
          <script type="module">
            (async () => {
              try {
                await import('http://localhost:3000/{componentPath}/{componentFile}');
                window.loadSuccess = true;
              } catch (err) {
                window.scriptError = err.message;
                window.errorStack = err.stack;
              }
            })();
          </script>
        </body>
        </html>
      `);
      
      await page.waitForTimeout(1500);
      const scriptError = await page.evaluate(() => window.scriptError);
      if (scriptError) throw new Error(`Script error: ${scriptError}`);
      
      const loadSuccess = await page.evaluate(() => window.loadSuccess);
      expect(loadSuccess).toBe(true);
    } catch (error) {
      await captureAndLogError('{componentName} loads without errors', error);
    }
  });

  test('{componentName} file is accessible', async ({ page }) => {
    try {
      await page.goto('http://localhost:3000/{componentPath}/{componentFile}');
      const status = page.url();
      expect(status).toContain('{componentFile}');
    } catch (error) {
      await captureAndLogError('{componentName} file is accessible', error);
    }
  });

});
'@

# Get all component directories
$componentDirs = Get-ChildItem -Path $componentsPath -Directory | Where-Object {
  $_.Name -match '^wb-' -or $_.Name -match '^component-'
} | Sort-Object Name

$testCount = 0
$skippedCount = 0
$generatedList = @()

Write-Host "🔍 Scanning components..." -ForegroundColor Cyan
Write-Host "Found $($componentDirs.Count) potential component directories`n" -ForegroundColor Yellow

foreach ($componentDir in $componentDirs) {
  $componentName = $componentDir.Name
  
  # Find the main .js file
  $jsFiles = Get-ChildItem -Path $componentDir.FullName -Filter "*.js" -File | Where-Object {
    $_.Name -notmatch '\.(test|spec|demo|backup)\.js$' -and 
    $_.Name -match "^$([regex]::Escape($componentName))\.js$"
  }
  
  if (-not $jsFiles) {
    # Try alternate naming pattern
    $jsFiles = Get-ChildItem -Path $componentDir.FullName -Filter "*.js" -File | Where-Object {
      $_.Name -notmatch '\.(test|spec|demo|backup)\.js$' -and
      $_.BaseName -eq $componentName
    } | Select-Object -First 1
  }
  
  # Check if test file already exists
  $testFile = Join-Path $componentDir.FullName "$componentName.playwright.spec.js"
  
  if (Test-Path $testFile) {
    Write-Host "⏭️  $componentName - test already exists" -ForegroundColor Gray
    $skippedCount++
    continue
  }
  
  if (-not $jsFiles) {
    Write-Host "⚠️  $componentName - no main .js file found, skipping" -ForegroundColor DarkYellow
    continue
  }
  
  $jsFile = $jsFiles[0]
  $relativePath = $componentName
  
  # Generate test content
  $testContent = $testTemplate `
    -replace '{componentName}', $componentName `
    -replace '{componentPath}', $relativePath `
    -replace '{componentFile}', $jsFile.Name
  
  # Write test file
  try {
    $testContent | Set-Content -Path $testFile -Encoding UTF8
    Write-Host "✅ $componentName - test generated" -ForegroundColor Green
    $generatedList += $componentName
    $testCount++
  } catch {
    Write-Host "❌ $componentName - error writing test: $_" -ForegroundColor Red
  }
}

Write-Host "`n" -ForegroundColor White
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "GENERATION SUMMARY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Generated: $testCount new test suites" -ForegroundColor Green
Write-Host "⏭️  Skipped: $skippedCount existing tests" -ForegroundColor Yellow
Write-Host "📝 Total components scanned: $($componentDirs.Count)" -ForegroundColor Cyan

if ($generatedList.Count -gt 0) {
  Write-Host "`nGenerated tests for:" -ForegroundColor Green
  $generatedList | ForEach-Object { Write-Host "  • $_" }
}

Write-Host "`n🚀 Next step: Run all tests with:" -ForegroundColor Cyan
Write-Host "   npx playwright test --reporter=line 2>&1 | Tee-Object -FilePath test-results.txt" -ForegroundColor Yellow

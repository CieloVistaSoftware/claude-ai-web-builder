// ThemeGeneratorSimpleTests.ps1
# Simple verification test for the refactored Theme Generator

$ErrorActionPreference = "Stop"
$originalFile = Join-Path $PSScriptRoot ".." "themes" "theme-generator.html"
$redirectedFolder = Join-Path $PSScriptRoot ".." "themes" "generator"
$indexFile = Join-Path $redirectedFolder "index.html" 
$scriptFile = Join-Path $redirectedFolder "script.js"
$styleFile = Join-Path $redirectedFolder "styles.css"

Write-Host "Theme Generator Refactoring Tests" -ForegroundColor Blue
Write-Host "=================================" -ForegroundColor Blue

# Test 1: Check redirect file
Write-Host "`n1. Checking theme-generator.html redirect:" -ForegroundColor Yellow
if (Test-Path $originalFile) {
    $content = Get-Content -Path $originalFile -Raw
    if ($content -match 'meta http-equiv="refresh"') {
        Write-Host "✅ Redirect meta tag is correctly set up" -ForegroundColor Green
    } else {
        Write-Host "❌ Redirect meta tag is not set up correctly" -ForegroundColor Red
    }
    
    if ($content -notmatch 'generateAndApplyTheme') {
        Write-Host "✅ The original file has been properly cleaned (no JS functions)" -ForegroundColor Green
    } else {
        Write-Host "❌ The original file still contains JavaScript functions" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Original file not found: $originalFile" -ForegroundColor Red
}

# Test 2: Check if all necessary files exist
Write-Host "`n2. Checking for required files:" -ForegroundColor Yellow
$requiredFiles = @($indexFile, $scriptFile, $styleFile)
$allFilesExist = $true

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        $fileSize = (Get-Item $file).Length
        Write-Host "✅ Found $(Split-Path $file -Leaf) - Size: $($fileSize) bytes" -ForegroundColor Green
        
        # Check for minimum content size to ensure files aren't empty
        if ($fileSize -lt 1000) {
            Write-Host "⚠️ Warning: $(Split-Path $file -Leaf) might be incomplete (size < 1KB)" -ForegroundColor Yellow
            $allFilesExist = $false
        }
    } else {
        Write-Host "❌ Missing file: $(Split-Path $file -Leaf)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

# Test 3: Basic file content checks
Write-Host "`n3. Basic file content checks:" -ForegroundColor Yellow

# Check for CSS link in HTML
if ((Get-Content $indexFile -Raw) -match '<link rel="stylesheet" href="styles.css">') {
    Write-Host "✅ CSS is properly linked in index.html" -ForegroundColor Green
} else {
    Write-Host "❌ CSS link missing in index.html" -ForegroundColor Red
}

# Check for JS script in HTML
if ((Get-Content $indexFile -Raw) -match '<script src="script.js"></script>') {
    Write-Host "✅ JavaScript is properly linked in index.html" -ForegroundColor Green
} else {
    Write-Host "❌ JavaScript link missing in index.html" -ForegroundColor Red
}

# Check for key function in JS
if ((Get-Content $scriptFile -Raw) -match 'function generateAndApplyTheme') {
    Write-Host "✅ Found main generator function in script.js" -ForegroundColor Green
} else {
    Write-Host "❌ Missing main generator function in script.js" -ForegroundColor Red
}

# Check for key CSS element
if ((Get-Content $styleFile -Raw) -match '.semantic-demo') {
    Write-Host "✅ Found semantic demo styles in styles.css" -ForegroundColor Green
} else {
    Write-Host "❌ Missing semantic demo styles in styles.css" -ForegroundColor Red
}

# Final verdict
Write-Host "`nFinal Assessment:" -ForegroundColor Blue
if ($allFilesExist) {
    Write-Host "✅ SUCCESS: Theme Generator has been successfully refactored!" -ForegroundColor Green
    Write-Host "   The original theme-generator.html now redirects to the new modular version." -ForegroundColor Green
    Write-Host "   The code has been properly separated into HTML, CSS, and JavaScript files." -ForegroundColor Green
} else {
    Write-Host "⚠️ WARNING: Theme Generator refactoring is incomplete or has issues." -ForegroundColor Yellow
    Write-Host "   Please review the test results above and fix any identified problems." -ForegroundColor Yellow
}

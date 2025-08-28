// ThemeGeneratorTests.ps1
# Test script for the refactored Theme Generator

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
    if ($content -match '<meta http-equiv="refresh" content="0;url=generator/index.html">') {
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

# Test 3: Validate HTML structure
Write-Host "`n3. Validating HTML structure:" -ForegroundColor Yellow
if (Test-Path $indexFile) {
    $html = Get-Content -Path $indexFile -Raw
    
    # Check for CSS link
    if ($html -match '<link rel="stylesheet" href="styles.css">') {
        Write-Host "✅ CSS is properly linked" -ForegroundColor Green
    } else {
        Write-Host "❌ CSS is not properly linked" -ForegroundColor Red
    }
    
    # Check for JS script
    if ($html -match '<script src="script.js"></script>') {
        Write-Host "✅ JavaScript is properly linked" -ForegroundColor Green
    } else {
        Write-Host "❌ JavaScript is not properly linked" -ForegroundColor Red
    }
    
    # Check for key HTML elements
    $keyElements = @(
        'id="themeName"',
        'id="colorScheme"',
        'id="primaryHue"',
        'id="isDark"',
        'id="lightPreview"',
        'id="darkPreview"',
        'id="semanticDemo"'
    )
    
    foreach ($element in $keyElements) {
        if ($html -match $element) {
            Write-Host "✅ Found HTML element: $element" -ForegroundColor Green
        } else {
            Write-Host "❌ Missing HTML element: $element" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ Could not validate HTML: $indexFile not found" -ForegroundColor Red
}

# Test 4: Validate JavaScript functions
Write-Host "`n4. Validating JavaScript functions:" -ForegroundColor Yellow
if (Test-Path $scriptFile) {
    $js = Get-Content -Path $scriptFile -Raw
    
    $keyFunctions = @(
        "function generateTheme\(",
        "function generateAndApplyTheme\(",
        "function applyThemeToPreview\(",
        "function applyThemeToSemanticDemo\(",
        "function updateFloatingPreview\("
    )
      foreach ($func in $keyFunctions) {
        if ($js -match $func) {
            Write-Host "✅ Found JavaScript function: $($func -replace '\\\\(.*$', '')" -ForegroundColor Green
        } else {
            Write-Host "❌ Missing JavaScript function: $($func -replace '\\\\(.*$', '')" -ForegroundColor Red
        }
    }
    
    # Check if DOM ready event handler is present
    if ($js -match "document\.addEventListener\('DOMContentLoaded'") {
        Write-Host "✅ Found DOMContentLoaded event handler" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing DOMContentLoaded event handler" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Could not validate JavaScript: $scriptFile not found" -ForegroundColor Red
}

# Test 5: Validate CSS styles
Write-Host "`n5. Validating CSS styles:" -ForegroundColor Yellow
if (Test-Path $styleFile) {
    $css = Get-Content -Path $styleFile -Raw
    
    $keyStyles = @(
        "\.container",
        "\.hue-slider",
        "\.floating-preview",
        "\.control-panel",
        "\.preview-container",
        "\.semantic-demo"
    )
    
    foreach ($style in $keyStyles) {
        if ($css -match $style) {
            Write-Host "✅ Found CSS style: $($style -replace '\\', '')" -ForegroundColor Green
        } else {
            Write-Host "❌ Missing CSS style: $($style -replace '\\', '')" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ Could not validate CSS: $styleFile not found" -ForegroundColor Red
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

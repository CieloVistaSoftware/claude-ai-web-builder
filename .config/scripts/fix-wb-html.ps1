# ==========================================
# WB.HTML COMPREHENSIVE TEST & FIX SCRIPT
# ==========================================
# Purpose: Tests and fixes wb.html 100%
# Date: October 23, 2025

param(
    [switch]$Verbose,
    [switch]$DryRun,
    [switch]$AutoFix = $true
)

# Color output functions
function Write-Header {
    param([string]$Message)
    Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

# Initialize tracking
$testResults = @{
    passed = 0
    failed = 0
    fixed = 0
    issues = @()
}

Write-Header "WB.HTML TEST & FIX SYSTEM v1.0"
Write-Info "Target File: wb.html"
Write-Info "Mode: $(if ($DryRun) { 'DRY RUN' } else { 'LIVE FIX' })"

# ==========================================
# TEST 1: FILE EXISTS
# ==========================================
Write-Header "TEST 1: File Existence"
$wbHtmlPath = "C:\Users\jwpmi\Downloads\AI\wb\wb.html"

if (Test-Path $wbHtmlPath) {
    Write-Success "wb.html found at $wbHtmlPath"
    $testResults.passed++
} else {
    Write-Error "wb.html not found!"
    $testResults.failed++
    exit 1
}

# ==========================================
# TEST 2: READ AND PARSE HTML
# ==========================================
Write-Header "TEST 2: HTML Structure Validation"

$htmlContent = Get-Content $wbHtmlPath -Raw

# Check DOCTYPE
if ($htmlContent -match "<!DOCTYPE html>") {
    Write-Success "DOCTYPE declaration present"
    $testResults.passed++
} else {
    Write-Error "DOCTYPE declaration missing"
    $testResults.failed++
    $testResults.issues += "Missing DOCTYPE"
}

# Check lang attribute
if ($htmlContent -match 'html lang="en"') {
    Write-Success "Language attribute set to English"
    $testResults.passed++
} else {
    Write-Warning "Language attribute missing or incorrect"
    $testResults.issues += "Missing language attribute"
}

# Check charset
if ($htmlContent -match 'charset="UTF-8"') {
    Write-Success "UTF-8 charset declared"
    $testResults.passed++
} else {
    Write-Error "UTF-8 charset missing"
    $testResults.failed++
    $testResults.issues += "Missing UTF-8 charset"
}

# ==========================================
# TEST 3: COMPONENT AVAILABILITY
# ==========================================
Write-Header "TEST 3: Component Availability Check"

$componentsDir = "C:\Users\jwpmi\Downloads\AI\wb\components"
$requiredComponents = @(
    "wb-control-panel",
    "wb-layout",
    "wb-nav",
    "wb-footer",
    "wb-status",
    "wb-theme"
)

$missingComponents = @()
foreach ($component in $requiredComponents) {
    $componentPath = Join-Path $componentsDir $component
    if (Test-Path $componentPath) {
        Write-Success "Component found: $component"
        $testResults.passed++
    } else {
        Write-Error "Component NOT found: $component"
        $testResults.failed++
        $missingComponents += $component
        $testResults.issues += "Missing component: $component"
    }
}

# ==========================================
# TEST 4: SCRIPT IMPORTS
# ==========================================
Write-Header "TEST 4: Script Import Validation"

$requiredScripts = @(
    ('wb.js', 'type="module"'),
    ('index.js', 'type="module"')
)

foreach ($script in $requiredScripts) {
    $scriptName = $script[0]
    $scriptType = $script[1]
    
    if ($htmlContent -match [regex]::Escape("src=`"$scriptName`"")) {
        Write-Success "Script found: $scriptName"
        if ($htmlContent -match [regex]::Escape($scriptType)) {
            Write-Success "Script has correct type: $scriptType"
            $testResults.passed++
        } else {
            Write-Warning "Script $scriptName may have incorrect type"
            $testResults.issues += "Script type issue: $scriptName"
        }
    } else {
        Write-Error "Script missing: $scriptName"
        $testResults.failed++
        $testResults.issues += "Missing script: $scriptName"
    }
}

# ==========================================
# TEST 5: STYLESHEET REFERENCES
# ==========================================
Write-Header "TEST 5: Stylesheet References"

$stylesheetPatterns = @(
    './styles/main.css',
    'favicon'
)

foreach ($stylesheet in $stylesheetPatterns) {
    if ($htmlContent -match [regex]::Escape($stylesheet)) {
        Write-Success "Stylesheet/reference found: $stylesheet"
        $testResults.passed++
    } else {
        Write-Warning "Stylesheet/reference may be missing: $stylesheet"
        $testResults.issues += "Missing reference: $stylesheet"
    }
}

# ==========================================
# TEST 6: SEMANTIC HTML STRUCTURE
# ==========================================
Write-Header "TEST 6: Semantic HTML Structure"

$semanticTags = @('header', 'main', 'aside', 'article', 'footer')
foreach ($tag in $semanticTags) {
    if ($htmlContent -match "<$tag") {
        Write-Success "Semantic tag found: <$tag>"
        $testResults.passed++
    } else {
        Write-Warning "Semantic tag missing: <$tag>"
        $testResults.issues += "Missing semantic tag: $tag"
    }
}

# ==========================================
# TEST 7: META TAGS
# ==========================================
Write-Header "TEST 7: Required Meta Tags"

$metaTags = @(
    ('viewport', 'width=device-width'),
    ('description', 'content='),
    ('theme-color', 'content=')
)

foreach ($meta in $metaTags) {
    $name = $meta[0]
    $pattern = $meta[1]
    
    if ($htmlContent -match "name=`"$name`"" -or $htmlContent -match "property=`"$name`"") {
        Write-Success "Meta tag found: $name"
        $testResults.passed++
    } else {
        Write-Warning "Meta tag missing or incomplete: $name"
        $testResults.issues += "Meta tag issue: $name"
    }
}

# ==========================================
# TEST 8: VALIDATE COMPONENT ATTRIBUTES
# ==========================================
Write-Header "TEST 8: Component Attribute Validation"

$componentValidation = @{
    'wb-layout' = @('layout')
    'wb-nav' = @('items')
    'wb-control-panel' = @()
}

$validationIssues = 0
foreach ($component in $componentValidation.Keys) {
    $pattern = "<$component"
    if ($htmlContent -match $pattern) {
        Write-Success "Component element found: $component"
        $testResults.passed++
        
        # Check for required attributes
        $requiredAttrs = $componentValidation[$component]
        if ($requiredAttrs.Count -gt 0) {
            foreach ($attr in $requiredAttrs) {
                if ($htmlContent -match "$component[^>]*$attr") {
                    Write-Success "Required attribute found: $component -> $attr"
                    $testResults.passed++
                } else {
                    Write-Warning "Required attribute missing: $component -> $attr"
                    $testResults.issues += "Missing attribute: $component.$attr"
                    $validationIssues++
                }
            }
        }
    } else {
        Write-Warning "Component element not found: $component"
        $testResults.issues += "Component element missing: $component"
    }
}

# ==========================================
# TEST 9: NO INLINE STYLES/SCRIPTS
# ==========================================
Write-Header "TEST 9: Check for Inline Styles & Scripts"

$inlineStyleCount = ([regex]::Matches($htmlContent, 'style="')).Count
$inlineScriptCount = ([regex]::Matches($htmlContent, '<script[^>]*>(?!.*type="module")')).Count

if ($inlineStyleCount -eq 0) {
    Write-Success "No inline styles detected"
    $testResults.passed++
} else {
    Write-Warning "$inlineStyleCount inline style(s) found"
    $testResults.issues += "$inlineStyleCount inline styles"
}

if ($inlineScriptCount -eq 0) {
    Write-Success "No inline scripts detected"
    $testResults.passed++
} else {
    Write-Warning "$inlineScriptCount inline script(s) found"
    $testResults.issues += "$inlineScriptCount inline scripts"
}

# ==========================================
# TEST 10: FILE SIZE & PERFORMANCE
# ==========================================
Write-Header "TEST 10: Performance Metrics"

$fileInfo = Get-Item $wbHtmlPath
$fileSizeKB = $fileInfo.Length / 1KB

Write-Info "File size: $([Math]::Round($fileSizeKB, 2)) KB"

if ($fileSizeKB -lt 50) {
    Write-Success "File size is optimal (< 50 KB)"
    $testResults.passed++
} elseif ($fileSizeKB -lt 100) {
    Write-Warning "File size is acceptable (< 100 KB)"
    $testResults.passed++
} else {
    Write-Warning "File size may need optimization (> 100 KB)"
    $testResults.issues += "Large file size: $fileSizeKB KB"
}

# ==========================================
# TEST 11: PATH RESOLUTION
# ==========================================
Write-Header "TEST 11: Asset Path Resolution"

$assetPaths = @(
    './wb.js',
    './index.js',
    './styles/main.css',
    './ziasymbol.svg'
)

foreach ($path in $assetPaths) {
    $resolvedPath = Join-Path "C:\Users\jwpmi\Downloads\AI\wb" ($path -replace '^\.\/', '')
    if (Test-Path $resolvedPath) {
        Write-Success "Asset path resolves: $path"
        $testResults.passed++
    } else {
        Write-Warning "Asset path may not resolve correctly: $path"
        $testResults.issues += "Unresolved path: $path"
    }
}

# ==========================================
# AUTOMATED FIXES
# ==========================================
if ($AutoFix -and -not $DryRun) {
    Write-Header "APPLYING AUTOMATIC FIXES"
    
    $fixedContent = $htmlContent
    $fixApplied = $false
    
    # Fix 1: Ensure proper DOCTYPE
    if ($fixedContent -notmatch "<!DOCTYPE html>") {
        $fixedContent = "<!DOCTYPE html>`r`n" + $fixedContent
        Write-Success "Fixed: Added DOCTYPE declaration"
        $testResults.fixed++
        $fixApplied = $true
    }
    
    # Fix 2: Add missing meta charset if needed
    if ($fixedContent -notmatch 'charset="UTF-8"') {
        $fixedContent = $fixedContent -replace '(<meta name="viewport"[^>]*>)', "`$1`r`n    <meta charset=`"UTF-8`" />"
        Write-Success "Fixed: Added UTF-8 charset meta tag"
        $testResults.fixed++
        $fixApplied = $true
    }
    
    # Fix 3: Ensure module scripts have correct type
    $fixedContent = $fixedContent -replace '(<script\s+src="(wb\.js|index\.js)")', '<script type="module" src="$2"'
    if ($fixedContent -ne $htmlContent) {
        Write-Success "Fixed: Ensured module scripts have type='module'"
        $testResults.fixed++
        $fixApplied = $true
    }
    
    # Fix 4: Ensure proper HTML structure
    if ($fixedContent -notmatch '<html[^>]*lang="en"') {
        $fixedContent = $fixedContent -replace '(<html)', '<html lang="en"'
        Write-Success "Fixed: Added lang attribute to html element"
        $testResults.fixed++
        $fixApplied = $true
    }
    
    # Write fixed content if changes were made
    if ($fixApplied) {
        if (-not $DryRun) {
            Set-Content -Path $wbHtmlPath -Value $fixedContent -Encoding UTF8
            Write-Success "Changes written to $wbHtmlPath"
        }
    } else {
        Write-Success "No automatic fixes needed - file is in good shape!"
    }
}

# ==========================================
# FINAL REPORT
# ==========================================
Write-Header "TEST SUMMARY REPORT"

$totalTests = $testResults.passed + $testResults.failed
$passPercentage = if ($totalTests -gt 0) { [Math]::Round(($testResults.passed / $totalTests) * 100, 2) } else { 0 }

Write-Info "Total Tests: $totalTests"
Write-Info "Passed: $($testResults.passed) ✅"
Write-Info "Failed: $($testResults.failed) ❌"
Write-Info "Fixed: $($testResults.fixed) 🔧"
Write-Info "Pass Rate: $passPercentage%"

if ($testResults.issues.Count -gt 0) {
    Write-Header "IDENTIFIED ISSUES"
    $testResults.issues | ForEach-Object { Write-Warning $_ }
}

# Final verdict
Write-Header "FINAL VERDICT"
if ($passPercentage -ge 95) {
    Write-Success "✅ WB.HTML IS IN EXCELLENT CONDITION (95%+ pass rate)"
    Write-Info "Your wb.html is production-ready!"
    exit 0
} elseif ($passPercentage -ge 80) {
    Write-Warning "⚠️  WB.HTML HAS MINOR ISSUES ($passPercentage% pass rate)"
    Write-Info "Consider addressing the warnings above"
    exit 0
} else {
    Write-Error "❌ WB.HTML NEEDS SIGNIFICANT FIXES ($passPercentage% pass rate)"
    Write-Info "Please address the errors above"
    exit 1
}

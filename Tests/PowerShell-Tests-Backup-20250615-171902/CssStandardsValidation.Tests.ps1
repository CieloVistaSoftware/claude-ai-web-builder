# CSS Standards Validation Test Script for Claude AI Website Builder
# This script validates that CSS files follow the Unified Web Development Instructions

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath

Write-Host "=== CSS Standards Validation Test ===" -ForegroundColor Cyan
Write-Host "Testing CSS files against Unified Web Development Standards"

# Files to test
$cssFiles = @(
    "$projectRoot\wb.css"
)

# Standards to verify
$standards = @{
    # Golden Ratio Foundation variables
    "GoldenRatio" = "--golden-ratio:\s*1\.618"
    "InverseGoldenRatio" = "--inverse-golden-ratio:\s*0\.618"
    
    # Layout Dimensions
    "HeaderHeight" = "--header-height:\s*20vh"
    "NavWidth" = "--nav-width:\s*calc\(100vw\s*/\s*\(var\(--golden-ratio\)\s*\*\s*2\.75\)\)"
    "ContentPadding" = "--content-padding:\s*calc\(1rem\s*\*\s*var\(--golden-ratio\)\)"
    
    # Spacing Scale
    "SpaceXs" = "--space-xs:\s*0\.25rem"
    "SpaceSm" = "--space-sm:\s*0\.5rem"
    "SpaceMd" = "--space-md:\s*1rem"
    "SpaceLg" = "--space-lg:\s*calc\(1rem\s*\*\s*var\(--golden-ratio\)\)"
    "SpaceXl" = "--space-xl:\s*calc\(1rem\s*\*\s*var\(--golden-ratio\)\s*\*\s*var\(--golden-ratio\)\)"
    
    # Grid Layouts
    "LeftNavGrid" = "grid-template-columns:\s*var\(--nav-width\)\s+1fr"
    "HeaderSideNavGrid" = "grid-template-areas:.*nav.*header"
    "TopNavGrid" = "grid-template-areas:.*header"
}

# Test Results
$passCount = 0
$failCount = 0
$warningCount = 0
$results = @{}

foreach ($file in $cssFiles) {
    Write-Host "`nTesting file: $file" -ForegroundColor Yellow
    
    if (Test-Path $file) {
        $cssContent = Get-Content -Path $file -Raw
        
        foreach ($standard in $standards.GetEnumerator()) {
            $standardName = $standard.Key
            $pattern = $standard.Value
            
            $match = $cssContent -match $pattern
              if ($match) {
                $passCount++
                $results[$standardName] = "PASS"
                Write-Host "Pass: $standardName standard found" -ForegroundColor Green
            } else {
                $failCount++
                $results[$standardName] = "FAIL"
                Write-Host "Fail: $standardName standard missing or incorrect" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
        $warningCount++
    }
}

# Color system validation
Write-Host "`n=== Color System Validation ===" -ForegroundColor Cyan

$colorVariables = @(
    "--primary", 
    "--primary-light", 
    "--primary-dark", 
    "--primary-contrast",
    "--secondary",
    "--secondary-light",
    "--secondary-dark",
    "--secondary-contrast",
    "--accent",
    "--accent-light",
    "--accent-dark",
    "--accent-contrast",
    "--neutral-50",
    "--neutral-100",
    "--neutral-200",
    "--neutral-300",
    "--neutral-400",
    "--neutral-500",
    "--neutral-600",
    "--neutral-700",
    "--neutral-800",
    "--neutral-900",
    "--background",
    "--surface",
    "--text-primary",
    "--text-secondary",
    "--border"
)

foreach ($color in $colorVariables) {
    if ($cssContent -match "${color}:\s*#[0-9a-fA-F]{3,6}" -or $cssContent -match "${color}:\s*var\(--[a-zA-Z0-9-]+\)") {
        Write-Host "Pass: $color color defined correctly" -ForegroundColor Green
        $passCount++
    } else {
        Write-Host "Warning: $color color may not be defined per standards" -ForegroundColor Yellow
        $warningCount++
    }
}

# BEM naming convention check
Write-Host "`n=== BEM Naming Convention Check ===" -ForegroundColor Cyan

# Simple BEM pattern detection
$bemElementPattern = '\.[a-z0-9-]+__[a-z0-9-]+'
$bemModifierPattern = '\.[a-z0-9-]+--[a-z0-9-]+'

$bemElementMatches = [regex]::Matches($cssContent, $bemElementPattern).Count
$bemModifierMatches = [regex]::Matches($cssContent, $bemModifierPattern).Count

if ($bemElementMatches -gt 0) {
    Write-Host "Pass: Found $bemElementMatches BEM element patterns (block__element)" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "Warning: No BEM element patterns detected (block__element)" -ForegroundColor Yellow
    $warningCount++
}

if ($bemModifierMatches -gt 0) {
    Write-Host "Pass: Found $bemModifierMatches BEM modifier patterns (block--modifier)" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "Warning: No BEM modifier patterns detected (block--modifier)" -ForegroundColor Yellow
    $warningCount++
}

# Responsive design patterns check
Write-Host "`n=== Responsive Design Patterns Check ===" -ForegroundColor Cyan

$mobileFirstPatterns = [regex]::Matches($cssContent, '`@media\s*\(\s*min-width').Count
$maxWidthPatterns = [regex]::Matches($cssContent, '`@media\s*\(\s*max-width').Count

if ($mobileFirstPatterns -gt 0) {
    Write-Host "Pass: Found $mobileFirstPatterns mobile-first patterns (@media min-width)" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "Warning: No mobile-first media queries detected (@media min-width)" -ForegroundColor Yellow
    $warningCount++
}

if ($maxWidthPatterns -gt 0) {
    Write-Host "Info: Found $maxWidthPatterns desktop-first patterns (@media max-width)" -ForegroundColor Blue
}

# Check CSS custom properties usage as per Development Guidelines
Write-Host "`n=== CSS Custom Properties Check ===" -ForegroundColor Cyan

# Look for direct color values which should be using variables
$directColorPattern = '(?<!var\(--)[:#]\s*#[0-9a-fA-F]{3,6}'
$directColorMatches = [regex]::Matches($cssContent, $directColorPattern).Count

if ($directColorMatches -gt 0) {
    Write-Host "Warning: Found $directColorMatches direct color values that should be using CSS custom properties" -ForegroundColor Yellow
    $warningCount++
} else {
    Write-Host "Pass: Using CSS custom properties for colors" -ForegroundColor Green
    $passCount++
}

# Check for direct dimension values that should be using variables
$directDimensionPattern = '(?<!var\()(?:width|height|margin|padding):\s*\d+px'
$directDimensionMatches = [regex]::Matches($cssContent, $directDimensionPattern).Count

if ($directDimensionMatches -gt 10) { # Allow some direct values but flag if excessive
    Write-Host "Warning: Found $directDimensionMatches direct dimension values that should be using CSS custom properties" -ForegroundColor Yellow
    $warningCount++
} else {
    Write-Host "Pass: Using CSS custom properties for dimensions" -ForegroundColor Green
    $passCount++
}

# Accessibility contrast check
Write-Host "`n=== Accessibility Contrast Check ===" -ForegroundColor Cyan

# Simple check for defined contrast ratio variables or classes
$contrastPatterns = @(
    # Look for contrast ratio comments or variables
    '\/\*.*contrast.*ratio.*4\.5:1',
    '\/\*.*contrast.*ratio.*3:1',
    '--[a-zA-Z0-9-]*contrast[a-zA-Z0-9-]*:\s*#',
    'high-contrast',
    'accessible-color'
)

$contrastFound = $false
foreach ($pattern in $contrastPatterns) {
    if ($cssContent -match $pattern) {
        $contrastFound = $true
        break
    }
}

if ($contrastFound) {
    Write-Host "Pass: Found evidence of contrast ratio considerations" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "Warning: No clear evidence of contrast ratio standards (4.5:1 for normal text, 3:1 for large text)" -ForegroundColor Yellow
    $warningCount++
}

# Check for semantic HTML support
Write-Host "`n=== Semantic HTML Support Check ===" -ForegroundColor Cyan

$semanticSelectors = @('header', 'nav', 'main', 'section', 'article', 'footer', 'aside')
$semanticSelectorsFound = 0

foreach ($selector in $semanticSelectors) {
    if ($cssContent -match "(?<![a-zA-Z0-9-])$selector(?![a-zA-Z0-9-])[\s{]") {
        $semanticSelectorsFound++
    }
}

if ($semanticSelectorsFound -ge 4) { # At least 4 semantic elements styled
    Write-Host "Pass: Found styles for $semanticSelectorsFound semantic HTML elements" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "Warning: Limited styles for semantic HTML elements ($semanticSelectorsFound/$($semanticSelectors.Count))" -ForegroundColor Yellow
    $warningCount++
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
$totalChecks = $standards.Count + $colorVariables.Count + 6 # Add 6 for the additional tests
Write-Host "Total standards checked: $totalChecks"
Write-Host "Pass: $passCount" -ForegroundColor Green
Write-Host "Fail: $failCount" -ForegroundColor Red
Write-Host "Warning: $warningCount" -ForegroundColor Yellow

# Compliance calculation
$totalTests = $passCount + $failCount
if ($totalTests -gt 0) {
    $compliancePercentage = [Math]::Round(($passCount / $totalTests) * 100)
    
    Write-Host "`nOverall compliance with Unified Web Development Standards: $compliancePercentage%" -ForegroundColor Cyan

    if ($compliancePercentage -ge 90) {
        Write-Host "EXCELLENT: CSS meets or exceeds unified standards" -ForegroundColor Green
        $exitCode = 0
    } elseif ($compliancePercentage -ge 70) {
        Write-Host "GOOD: Most key standards are implemented but some improvements needed" -ForegroundColor Yellow
        $exitCode = 0
    } else {
        Write-Host "NEEDS IMPROVEMENT: Significant deviations from unified standards" -ForegroundColor Red
        $exitCode = 1
    }
} else {
    Write-Host "`nWarning: No tests were executed. Check if CSS file exists and is readable." -ForegroundColor Yellow
    $exitCode = 1
}

# Recommendations
Write-Host "`n=== Recommendations ===" -ForegroundColor Cyan
foreach ($result in $results.GetEnumerator()) {
    if ($result.Value -eq "FAIL") {
        $standardName = $result.Key
        Write-Host "- Add missing $standardName standard" -ForegroundColor Yellow
    }
}

# Return exit code for use with the unified test runner
exit $exitCode

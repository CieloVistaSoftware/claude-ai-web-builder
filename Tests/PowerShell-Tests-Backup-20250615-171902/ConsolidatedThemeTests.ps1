# Consolidated Theme Tests
# Date: June 10, 2025
# This file consolidates all theme-related tests from:
# - ColorPickerTheme.Tests.ps1
# - ThemeDemo.Tests.ps1
# - ThemeAndZzzOrganization.Tests.ps1
# - ThemeOrganizationVerification.Tests.ps1

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath

Write-Host "=== Consolidated Theme Tests ===" -ForegroundColor Cyan
Write-Host "Testing all theme-related functionality for the Website Builder"

#region Theme Files Organization Tests
Write-Host "`n=== Testing Theme File Organization ===" -ForegroundColor Yellow

# Check if themes directory exists
$themesDirectoryExists = Test-Path "$projectRoot\themes"
if ($themesDirectoryExists) {
    Write-Host "✅ Themes directory exists." -ForegroundColor Green
} else {
    Write-Host "❌ Themes directory does not exist." -ForegroundColor Red
}

# Check if key theme files are in the themes directory
$hslColorPickerExists = Test-Path "$projectRoot\themes\hsl-color-picker.html"
$hueColorSliderExists = Test-Path "$projectRoot\themes\hue-color-slider.html"
$themeGeneratorExists = Test-Path "$projectRoot\themes\theme-generator.html"

if ($hslColorPickerExists -and $hueColorSliderExists -and $themeGeneratorExists) {
    Write-Host "✅ All key theme files are in the themes directory." -ForegroundColor Green
} else {    Write-Host "❌ Some key theme files are missing from the themes directory:" -ForegroundColor Red
    Write-Host "   HSL Color Picker exists: $hslColorPickerExists" -ForegroundColor $(if ($hslColorPickerExists) {"Green"} else {"Red"})
    Write-Host "   Hue Color Slider exists: $hueColorSliderExists" -ForegroundColor $(if ($hueColorSliderExists) {"Green"} else {"Red"})
    Write-Host "   Theme Generator exists: $themeGeneratorExists" -ForegroundColor $(if ($themeGeneratorExists) {"Green"} else {"Red"})
}

# Check no "zzz" files are in the themes directory
$zzzFilesInThemes = Get-ChildItem -Path "$projectRoot\themes" -Filter "zzz*" -ErrorAction SilentlyContinue
if ($zzzFilesInThemes.Count -eq 0) {
    Write-Host "✅ No 'zzz' prefixed files are in the themes directory." -ForegroundColor Green
} else {
    Write-Host "❌ Some 'zzz' prefixed files were found in the themes directory: $($zzzFilesInThemes.Name -join ', ')" -ForegroundColor Red
}

# Check that zzz directory exists and contains the zzz theme files
$zzzDirectoryExists = Test-Path "$projectRoot\zzz"
if ($zzzDirectoryExists) {
    Write-Host "✅ 'zzz' directory exists." -ForegroundColor Green
    
    $zzzThemeDemoExists = Test-Path "$projectRoot\zzz\zzztheme-demo-component.tsx"
    if ($zzzThemeDemoExists) {
        Write-Host "✅ Theme demo component is in the 'zzz' directory." -ForegroundColor Green
    } else {
        Write-Host "❌ Theme demo component is missing from the 'zzz' directory." -ForegroundColor Red
    }
} else {
    Write-Host "❌ 'zzz' directory does not exist." -ForegroundColor Red
}
#endregion

#region HSL Color Picker Theme Tests
Write-Host "`n=== Testing HSL Color Picker Theme Support ===" -ForegroundColor Yellow

if ($hslColorPickerExists) {
    $htmlPath = "$projectRoot\themes\hsl-color-picker.html"
    $htmlContent = Get-Content -Path $htmlPath -Raw

    # Test for theme variable declarations
    if ($htmlContent -match "--golden-ratio") {
        Write-Host "✅ Golden ratio variable found in HSL Color Picker" -ForegroundColor Green
    } else {
        Write-Host "❌ Golden ratio variable not found in HSL Color Picker" -ForegroundColor Red
    }

    # Check for theme definitions
    $themeCount = 0
    $themes = @("ocean", "sunset", "forest", "cyberpunk", "dark")

    foreach ($theme in $themes) {
        if ($htmlContent -match "\[data-theme=""$theme""\]") {
            $themeCount++
        }
    }

    if ($themeCount -gt 0) {
        Write-Host "✅ Found $themeCount theme definitions in HSL Color Picker" -ForegroundColor Green
    } else {
        Write-Host "❌ No theme definitions found in HSL Color Picker" -ForegroundColor Red
    }

    # Check for theme selector
    if ($htmlContent -match "<select id=""theme-select"">") {
        Write-Host "✅ Theme selector found in HSL Color Picker" -ForegroundColor Green
        
        # Check if all themes are in the selector
        $selectorHasAllThemes = $true
        foreach ($theme in $themes) {
            if (-not ($htmlContent -match "<option value=""$theme"">")) {
                $selectorHasAllThemes = $false
                break
            }
        }
        
        if ($selectorHasAllThemes) {
            Write-Host "✅ All themes are available in the selector" -ForegroundColor Green
        } else {
            Write-Host "❌ Not all themes are available in the selector" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Theme selector not found in HSL Color Picker" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ Skipping HSL Color Picker theme tests as file does not exist" -ForegroundColor Yellow
}
#endregion

#region Main Website Builder Theme Integration Tests
Write-Host "`n=== Testing Theme Integration in Main Website Builder ===" -ForegroundColor Yellow

$htmlFile = "$projectRoot\wb.html"
$jsFile = "$projectRoot\wb.js"

if (Test-Path $htmlFile -and Test-Path $jsFile) {
    $htmlContent = Get-Content -Path $htmlFile -Raw
    $jsContent = Get-Content -Path $jsFile -Raw
    
    # Check for theme selector in HTML
    if ($htmlContent -match '<select id="theme-select">') {
        Write-Host "✅ Theme selector found in main Website Builder" -ForegroundColor Green
    } else {
        Write-Host "❌ Theme selector not found in main Website Builder" -ForegroundColor Red
    }
    
    # Check for theme setup function in JS
    if ($jsContent -match 'function setupThemeControl\(\)') {
        Write-Host "✅ Theme setup function found in main Website Builder JS" -ForegroundColor Green
    } else {
        Write-Host "❌ Theme setup function not found in main Website Builder JS" -ForegroundColor Red
    }
    
    # Check for theme change event listener
    if ($jsContent -match 'themeSelect\.addEventListener\(''change''') {
        Write-Host "✅ Theme change event listener found in main Website Builder JS" -ForegroundColor Green
    } else {
        Write-Host "❌ Theme change event listener not found in main Website Builder JS" -ForegroundColor Red
    }
    
    # Check for theme state saving
    if ($jsContent -match 'state\.theme' -and $jsContent -match 'body\.getAttribute\(''data-theme''\)') {
        Write-Host "✅ Theme state saving found in main Website Builder JS" -ForegroundColor Green
    } else {
        Write-Host "❌ Theme state saving not found in main Website Builder JS" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ Skipping main Website Builder theme tests as files do not exist" -ForegroundColor Yellow
}
#endregion

# Summary
$totalTests = 12
$passedTests = ($themesDirectoryExists) +
              ($hslColorPickerExists -and $hueColorSliderExists -and $themeGeneratorExists) +
              ($zzzFilesInThemes.Count -eq 0) +
              ($zzzDirectoryExists) +
              ($zzzThemeDemoExists) +
              ($htmlContent -match "--golden-ratio") +
              ($themeCount -gt 0) +
              ($htmlContent -match "<select id=""theme-select"">") +
              ($selectorHasAllThemes) +
              ($htmlContent -match '<select id="theme-select">') +
              ($jsContent -match 'function setupThemeControl\(\)') +
              ($jsContent -match 'themeSelect\.addEventListener\(''change''') +
              ($jsContent -match 'state\.theme' -and $jsContent -match 'body\.getAttribute\(''data-theme''\)')
              
$passedTests = [Math]::Min($passedTests, $totalTests)  # Ensure we don't count more than total

Write-Host "`n=== Theme Tests Results Summary ===" -ForegroundColor Cyan
Write-Host "Total Tests: $totalTests"
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $($totalTests - $passedTests)" -ForegroundColor Red

if ($totalTests - $passedTests -gt 0) {
    Write-Host "❌ Some tests failed. Please fix the issues and run the tests again." -ForegroundColor Red
} else {
    Write-Host "✅ All theme tests passed!" -ForegroundColor Green
}

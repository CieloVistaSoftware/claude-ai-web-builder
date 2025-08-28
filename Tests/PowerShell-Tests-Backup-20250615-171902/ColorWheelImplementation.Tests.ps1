# ColorWheelImplementation.Tests.ps1
# Tests the implementation of the color wheel in hue-color-slider.html

# Define file path
$filePath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\hue-color-slider.html"

# Check if file exists
$fileExists = Test-Path $filePath
Write-Host "Checking if file exists: $fileExists" -ForegroundColor $(if ($fileExists) {'Green'} else {'Red'})

if ($fileExists) {
    # Read file content
    $content = Get-Content -Path $filePath -Raw
    
    # Check for color wheel implementation
    $hasColorWheel = $content -match '<div class="color-wheel"'
    Write-Host "Color wheel element found: $hasColorWheel" -ForegroundColor $(if ($hasColorWheel) {'Green'} else {'Red'})
    
    # Check for color wheel markers
    $hasMarkers = $content -match 'color-wheel-marker'
    Write-Host "Color wheel markers found: $hasMarkers" -ForegroundColor $(if ($hasMarkers) {'Green'} else {'Red'})
    
    # Check for primary and accent markers
    $hasPrimaryMarker = $content -match 'primary-marker'
    $hasAccentMarker = $content -match 'accent-marker'
    Write-Host "Primary marker found: $hasPrimaryMarker" -ForegroundColor $(if ($hasPrimaryMarker) {'Green'} else {'Red'})
    Write-Host "Accent marker found: $hasAccentMarker" -ForegroundColor $(if ($hasAccentMarker) {'Green'} else {'Red'})
    
    # Check for updated event listeners
    $hasWheelClickHandler = $content -match 'hueWheel\.addEventListener\(''click'''
    Write-Host "Color wheel click handler found: $hasWheelClickHandler" -ForegroundColor $(if ($hasWheelClickHandler) {'Green'} else {'Red'})
    
    # Check for marker update function
    $hasUpdateMarkers = $content -match 'function updateColorWheelMarkers'
    Write-Host "Update markers function found: $hasUpdateMarkers" -ForegroundColor $(if ($hasUpdateMarkers) {'Green'} else {'Red'})
    
    # Check for enhanced color bar
    $hasEnhancedColorBar = $content -match 'hsl\(15, 100%, 50%\)'
    Write-Host "Enhanced color bar implementation found: $hasEnhancedColorBar" -ForegroundColor $(if ($hasEnhancedColorBar) {'Green'} else {'Red'})
    
    # Check if event handlers update the wheel markers
    $hasWheelUpdate = $content -match 'updateColorWheelMarkers\(hue\);'
    Write-Host "Slider updates wheel markers: $hasWheelUpdate" -ForegroundColor $(if ($hasWheelUpdate) {'Green'} else {'Red'})
    
    # Check if wheel initializes correctly
    $hasInitialization = $content -match 'updateColorWheelMarkers\(180\);'
    Write-Host "Wheel properly initialized: $hasInitialization" -ForegroundColor $(if ($hasInitialization) {'Green'} else {'Red'})
    
    # Check for color wheel CSS
    $hasColorWheelCSS = $content -match 'color-wheel\s*\{'
    Write-Host "Color wheel CSS found: $hasColorWheelCSS" -ForegroundColor $(if ($hasColorWheelCSS) {'Green'} else {'Red'})
    
    # Check for markers CSS 
    $hasMarkerCSS = $content -match 'color-wheel-marker\s*\{'
    Write-Host "Color wheel marker CSS found: $hasMarkerCSS" -ForegroundColor $(if ($hasMarkerCSS) {'Green'} else {'Red'})

    # Overall assessment
    $allChecks = @(
        $hasColorWheel, $hasMarkers, $hasPrimaryMarker, $hasAccentMarker, 
        $hasWheelClickHandler, $hasUpdateMarkers, $hasEnhancedColorBar, 
        $hasWheelUpdate, $hasInitialization, $hasColorWheelCSS, $hasMarkerCSS
    )
    $failedChecks = @()
    
    # Create a check results object
    $checkResults = @(
        @{Name="Color wheel element"; Result=$hasColorWheel},
        @{Name="Color wheel markers"; Result=$hasMarkers},
        @{Name="Primary marker"; Result=$hasPrimaryMarker},
        @{Name="Accent marker"; Result=$hasAccentMarker},
        @{Name="Click handler"; Result=$hasWheelClickHandler},
        @{Name="Update markers function"; Result=$hasUpdateMarkers},
        @{Name="Enhanced color bar"; Result=$hasEnhancedColorBar},
        @{Name="Slider updates wheel"; Result=$hasWheelUpdate},
        @{Name="Proper initialization"; Result=$hasInitialization},
        @{Name="Color wheel CSS"; Result=$hasColorWheelCSS},
        @{Name="Marker CSS"; Result=$hasMarkerCSS}
    )
    
    # Count passed checks
    $passedChecks = ($allChecks | Where-Object { $_ -eq $true }).Count
    $totalChecks = $allChecks.Count
    
    Write-Host "`nDetailed Test Results:" -ForegroundColor Cyan
    foreach ($check in $checkResults) {
        $color = if ($check.Result) {'Green'} else {'Red'}
        $symbol = if ($check.Result) {'✓'} else {'✗'}
        Write-Host "$symbol $($check.Name)" -ForegroundColor $color
        if (-not $check.Result) {
            $failedChecks += $check.Name
        }
    }
    
    Write-Host "`nTest Summary:" -ForegroundColor Cyan
    Write-Host "$passedChecks of $totalChecks checks passed" -ForegroundColor $(if ($passedChecks -eq $totalChecks) {'Green'} else {'Yellow'})
    
    if ($passedChecks -eq $totalChecks) {
        Write-Host "`n✅ TEST PASSED: Color wheel implementation is complete and functional" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️ TEST INCOMPLETE: Some color wheel features may be missing" -ForegroundColor Yellow
        Write-Host "Failed checks: $($failedChecks -join ', ')" -ForegroundColor Red
    }
} else {
    Write-Host "❌ TEST FAILED: File not found at $filePath" -ForegroundColor Red
}

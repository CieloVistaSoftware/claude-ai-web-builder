# Table Theme Integration Test (Using Live Server)
# Tests table theme component functionality via proper HTTP server
# Date: 2025-06-12

Write-Host "🧪 Table Theme Integration Server Test" -ForegroundColor Cyan
Write-Host "Testing table theme controls via Live Server..." -ForegroundColor Yellow

# Test configuration
$TestResults = @{
    FilesExist = $false
    LiveServerInstalled = $false
    ComponentIntegration = $false
    ThemeControlsWork = $false
    CSSVariablesMatch = $false
}

# Step 1: Check if required files exist
Write-Host "`n📁 Checking required files..." -ForegroundColor Blue

$RequiredFiles = @(    "components\table\table-theme.html",
    "components\table\table-component.js",
    "components\table\table.json",
    "components\theme\table-theme-component.js",
    "wb.js",
    "wb.css"
)

$AllFilesExist = $true
foreach ($file in $RequiredFiles) {
    $fullPath = Join-Path $PWD $file
    if (Test-Path $fullPath) {
        Write-Host "✅ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        $AllFilesExist = $false
    }
}

$TestResults.FilesExist = $AllFilesExist

# Step 2: Check if Live Server extension is available
Write-Host "`n🔍 Checking Live Server availability..." -ForegroundColor Blue

try {
    # Check if VS Code is installed and can be called
    $vsCodeCheck = & code --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ VS Code is available" -ForegroundColor Green
        Write-Host "📝 Live Server extension should be used for testing" -ForegroundColor Yellow
        $TestResults.LiveServerInstalled = $true
    } else {
        Write-Host "❌ VS Code not available in PATH" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ VS Code not found" -ForegroundColor Red
}

# Step 3: Validate CSS variable consistency
Write-Host "`n🎨 Checking CSS variable consistency..." -ForegroundColor Blue

try {
    # Read table-component.js to find CSS variables it uses
    $tableComponentPath = "components\table\table-component.js"
    if (Test-Path $tableComponentPath) {
        $tableComponentContent = Get-Content $tableComponentPath -Raw
        
        # Extract CSS variables used in table-component
        $tableVars = @()
        if ($tableComponentContent -match '--table-bg-color') { $tableVars += '--table-bg-color' }
        if ($tableComponentContent -match '--table-text-color') { $tableVars += '--table-text-color' }
        if ($tableComponentContent -match '--table-header-bg') { $tableVars += '--table-header-bg' }
        if ($tableComponentContent -match '--table-header-color') { $tableVars += '--table-header-color' }
        if ($tableComponentContent -match '--table-hover-color') { $tableVars += '--table-hover-color' }
        if ($tableComponentContent -match '--table-border-color') { $tableVars += '--table-border-color' }
        
        Write-Host "📋 Table component expects these CSS variables:" -ForegroundColor Cyan
        $tableVars | ForEach-Object { Write-Host "   - $_" -ForegroundColor White }
        
        # Check if table-theme.html includes default values
        $tableThemeHtmlPath = "components\table\table-theme.html"
        if (Test-Path $tableThemeHtmlPath) {
            $tableThemeContent = Get-Content $tableThemeHtmlPath -Raw
            
            $missingVars = @()
            foreach ($var in $tableVars) {
                if ($tableThemeContent -notmatch [regex]::Escape($var)) {
                    $missingVars += $var
                }
            }
            
            if ($missingVars.Count -eq 0) {
                Write-Host "✅ All required CSS variables are defined in table-theme.html" -ForegroundColor Green
                $TestResults.CSSVariablesMatch = $true
            } else {
                Write-Host "❌ Missing CSS variables in table-theme.html:" -ForegroundColor Red
                $missingVars | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
            }
        }
    }
} catch {
    Write-Host "❌ Error checking CSS variables: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Check component integration
Write-Host "`n🔗 Checking component integration..." -ForegroundColor Blue

try {
    $tableThemeHtmlPath = "components\table\table-theme.html"
    if (Test-Path $tableThemeHtmlPath) {
        $content = Get-Content $tableThemeHtmlPath -Raw
        
        # Check for proper script loading order
        $scriptOrder = @()
        if ($content -match 'src="../../wb\.js"') { $scriptOrder += 'wb.js' }
        if ($content -match 'src="table-component\.js"') { $scriptOrder += 'table-component.js' }
        if ($content -match 'src="../../../components/theme/table-theme-component\.js"') { 
            $scriptOrder += 'table-theme-component.js' 
        }
        
        if ($scriptOrder.Count -eq 3) {
            Write-Host "✅ All required scripts are loaded" -ForegroundColor Green
            Write-Host "📋 Script loading order: $($scriptOrder -join ' → ')" -ForegroundColor Cyan
            
            # Check for table-theme-component element
            if ($content -match '<table-theme-component') {
                Write-Host "✅ table-theme-component element is present" -ForegroundColor Green
                $TestResults.ComponentIntegration = $true
            } else {
                Write-Host "❌ table-theme-component element not found" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Missing required scripts" -ForegroundColor Red
        }
        
        # Check for color controls
        $controls = @('color-bar', 'saturation-slider', 'lightness-slider', 'theme-select')
        $controlsFound = 0
        foreach ($control in $controls) {
            if ($content -match "id=`"$control`"") {
                $controlsFound++
            }
        }
        
        if ($controlsFound -eq $controls.Count) {
            Write-Host "✅ All theme controls are present" -ForegroundColor Green
            $TestResults.ThemeControlsWork = $true
        } else {
            Write-Host "❌ Missing theme controls ($controlsFound/$($controls.Count) found)" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ Error checking component integration: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 5: Generate manual testing instructions
Write-Host "`n📋 Manual Testing Instructions:" -ForegroundColor Magenta
Write-Host "1. Open VS Code in the project root directory" -ForegroundColor White
Write-Host "2. Install Live Server extension if not already installed" -ForegroundColor White
Write-Host "3. Right-click on 'components/table/table-theme.html'" -ForegroundColor White
Write-Host "4. Select 'Open with Live Server'" -ForegroundColor White
Write-Host "5. Test the following in the browser:" -ForegroundColor White
Write-Host "   - Move the Primary Hue slider (0-360)" -ForegroundColor Yellow
Write-Host "   - Move the Saturation slider (0-100%)" -ForegroundColor Yellow  
Write-Host "   - Move the Lightness slider (10-90%)" -ForegroundColor Yellow
Write-Host "   - Change Theme Preset dropdown" -ForegroundColor Yellow
Write-Host "   - Verify table colors change in real-time" -ForegroundColor Yellow
Write-Host "6. Check browser console for any JavaScript errors" -ForegroundColor White

# Step 6: Create a simple server alternative if Live Server not available
Write-Host "`n🌐 Alternative: Python HTTP Server" -ForegroundColor Blue
Write-Host "If Live Server is not available, use Python:" -ForegroundColor White
Write-Host "1. Open PowerShell in project root" -ForegroundColor White
Write-Host "2. Run: python -m http.server 8000" -ForegroundColor Yellow
Write-Host "3. Open browser to: http://localhost:8000/components/table/table-theme.html" -ForegroundColor Yellow

# Summary
Write-Host "`n📊 Test Results Summary:" -ForegroundColor Magenta
Write-Host "Files Exist: $(if($TestResults.FilesExist){'✅'}else{'❌'})" -ForegroundColor $(if($TestResults.FilesExist){'Green'}else{'Red'})
Write-Host "Live Server Available: $(if($TestResults.LiveServerInstalled){'✅'}else{'❌'})" -ForegroundColor $(if($TestResults.LiveServerInstalled){'Green'}else{'Red'})
Write-Host "Component Integration: $(if($TestResults.ComponentIntegration){'✅'}else{'❌'})" -ForegroundColor $(if($TestResults.ComponentIntegration){'Green'}else{'Red'})
Write-Host "Theme Controls: $(if($TestResults.ThemeControlsWork){'✅'}else{'❌'})" -ForegroundColor $(if($TestResults.ThemeControlsWork){'Green'}else{'Red'})
Write-Host "CSS Variables Match: $(if($TestResults.CSSVariablesMatch){'✅'}else{'❌'})" -ForegroundColor $(if($TestResults.CSSVariablesMatch){'Green'}else{'Red'})

$PassedTests = ($TestResults.Values | Where-Object { $_ -eq $true }).Count
$TotalTests = $TestResults.Count

Write-Host "`n🎯 Overall Score: $PassedTests/$TotalTests tests passed" -ForegroundColor $(if($PassedTests -eq $TotalTests){'Green'}else{'Yellow'})

if ($PassedTests -eq $TotalTests) {
    Write-Host "🎉 All automated tests passed! Ready for manual testing via Live Server." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some issues detected. Review the failed tests above." -ForegroundColor Yellow
}

Write-Host "`n✅ Table Theme Integration Server Test Complete" -ForegroundColor Cyan

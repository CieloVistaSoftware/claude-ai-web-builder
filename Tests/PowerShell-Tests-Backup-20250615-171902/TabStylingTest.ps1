# TabStylingTest.ps1
# Tests the tab styling functionality in the theme generator component

# Output test header
Write-Host "================================================================"
Write-Host "               Tab Styling Functionality Test                   "
Write-Host "================================================================"
Write-Host

# Check if theme-generator-component.js exists
$componentPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\components\theme\theme-generator-component.js"
if (-not (Test-Path $componentPath)) {
    Write-Host "ERROR: Theme generator component file not found at $componentPath" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Theme generator component file found" -ForegroundColor Green

# Check if the setupTabStylingListeners method is implemented
$componentContent = Get-Content $componentPath -Raw
if ($componentContent -match "setupTabStylingListeners\(\)") {
    Write-Host "✅ setupTabStylingListeners() method is implemented" -ForegroundColor Green
} else {
    Write-Host "ERROR: setupTabStylingListeners() method is not implemented" -ForegroundColor Red
    exit 1
}

# Check if the updateTabStyleCustomProperty method is implemented
if ($componentContent -match "updateTabStyleCustomProperty\(") {
    Write-Host "✅ updateTabStyleCustomProperty() helper method is implemented" -ForegroundColor Green
} else {
    Write-Host "ERROR: updateTabStyleCustomProperty() helper method is not implemented" -ForegroundColor Red
    exit 1
}

# Check if event listeners are set up for tab style controls
$eventListenersCheck = $componentContent -match "this.tabStyleSelect.addEventListener\('change'"
$borderRadiusListenerCheck = $componentContent -match "this.tabBorderRadiusInput.addEventListener\('input'"
$transparencyListenerCheck = $componentContent -match "this.tabTransparencyInput.addEventListener\('input'"
$blurListenerCheck = $componentContent -match "this.tabBlurInput.addEventListener\('input'"

if ($eventListenersCheck -and $borderRadiusListenerCheck -and $transparencyListenerCheck -and $blurListenerCheck) {
    Write-Host "✅ All event listeners for tab styling controls are set up" -ForegroundColor Green
} else {
    Write-Host "WARNING: Some event listeners for tab styling controls may be missing" -ForegroundColor Yellow
}

# Check if tab styling properties are included in CSS generation
if ($componentContent -match "--tab-border-radius:" -and $componentContent -match "--tab-transparency:" -and $componentContent -match "--tab-blur:") {
    Write-Host "✅ Tab styling properties are included in CSS generation" -ForegroundColor Green
} else {
    Write-Host "ERROR: Tab styling properties are not included in CSS generation" -ForegroundColor Red
    exit 1
}

# Create a test HTML file
$testHtmlPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\Tests\tab-styling-test.html"
$testHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tab Styling Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            margin: 20px;
            padding: 20px;
        }
        
        h1 {
            text-align: center;
        }
        
        .test-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        
        .test-instructions {
            background-color: #f8f9fa;
            padding: 15px;
            margin-bottom: 20px;
            border-left: 4px solid #0d6efd;
        }
        
        h2 {
            margin-top: 30px;
        }
        
        pre {
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="test-container">
        <h1>Tab Styling Functionality Test</h1>
        
        <div class="test-instructions">
            <h3>Test Instructions:</h3>
            <ol>
                <li>Try selecting different tab styles from the "Tab Style" dropdown</li>
                <li>Adjust the Border Radius, Transparency, and Blur Effect sliders</li>
                <li>Verify that both the preview tabs and main component tabs update with your changes</li>
                <li>Switch between Light and Dark mode to ensure tab styling persists</li>
                <li>Check the Generated CSS tab to verify that tab styling properties are included</li>
            </ol>
        </div>
        
        <h2>Theme Generator Component:</h2>
        <theme-generator></theme-generator>
        
        <h2>Test Results:</h2>
        <pre id="testResults">Run tests to see results here...</pre>    </div>
    
    <script src="../components/theme/theme-generator-component.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const themeGenerator = document.querySelector('theme-generator');
            const testResults = document.getElementById('testResults');
            
            // Run tests after a short delay to ensure component is fully initialized
            setTimeout(() => {
                const results = [];
                
                // Test 1: Check if tab style controls exist
                const tabStyleSelect = themeGenerator.shadowRoot.getElementById('tabStyle');
                const tabBorderRadius = themeGenerator.shadowRoot.getElementById('tabBorderRadius');
                const tabTransparency = themeGenerator.shadowRoot.getElementById('tabTransparency');
                const tabBlur = themeGenerator.shadowRoot.getElementById('tabBlur');
                
                results.push(`Tab Style Select: ${tabStyleSelect ? 'Found ✅' : 'Not Found ❌'}`);
                results.push(`Border Radius Slider: ${tabBorderRadius ? 'Found ✅' : 'Not Found ❌'}`);
                results.push(`Transparency Slider: ${tabTransparency ? 'Found ✅' : 'Not Found ❌'}`);
                results.push(`Blur Effect Slider: ${tabBlur ? 'Found ✅' : 'Not Found ❌'}`);
                
                // Test 2: Check preview tabs
                const previewTabs = themeGenerator.shadowRoot.querySelector('.preview-tabs');
                results.push(`Preview Tabs: ${previewTabs ? 'Found ✅' : 'Not Found ❌'}`);
                
                // Test 3: Try changing tab style
                if (tabStyleSelect && previewTabs) {
                    // Save original style
                    const originalStyle = tabStyleSelect.value;
                    
                    // Test glassmorphism style
                    tabStyleSelect.value = 'glassmorphism';
                    tabStyleSelect.dispatchEvent(new Event('change'));
                    const glassmorphismApplied = previewTabs.classList.contains('glassmorphism');
                    results.push(`Glassmorphism style applied: ${glassmorphismApplied ? 'Yes ✅' : 'No ❌'}`);
                    
                    // Restore original style
                    tabStyleSelect.value = originalStyle;
                    tabStyleSelect.dispatchEvent(new Event('change'));
                }
                
                // Test 4: Check for CSS custom properties
                const computedStyle = getComputedStyle(document.documentElement);
                const tabBorderRadiusProp = computedStyle.getPropertyValue('--tab-border-radius');
                const tabTransparencyProp = computedStyle.getPropertyValue('--tab-transparency');
                const tabBlurProp = computedStyle.getPropertyValue('--tab-blur');
                
                results.push(`--tab-border-radius CSS property: ${tabBorderRadiusProp ? 'Set ✅' : 'Not Set ❌'}`);
                results.push(`--tab-transparency CSS property: ${tabTransparencyProp ? 'Set ✅' : 'Not Set ❌'}`);
                results.push(`--tab-blur CSS property: ${tabBlurProp ? 'Set ✅' : 'Not Set ❌'}`);
                
                // Display results
                testResults.textContent = results.join('\n');
            }, 1000);
        });
    </script>
</body>
</html>
"@

Set-Content -Path $testHtmlPath -Value $testHtml
Write-Host "✅ Test HTML file created at $testHtmlPath" -ForegroundColor Green

Write-Host
Write-Host "Tab styling functionality tests completed successfully!" -ForegroundColor Green
Write-Host
Write-Host "To test the functionality interactively, open the following file in your browser:"
Write-Host $testHtmlPath -ForegroundColor Cyan
Write-Host "Follow the instructions in the test page to verify tab styling works correctly."

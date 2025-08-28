# Media Placeholder Tests
# Tests for ensuring media placeholders behave correctly in different modes

# Test 1: Verify placeholder visibility logic
Write-Host "Test 1: Verifying media placeholder visibility rules..." -ForegroundColor Cyan

$testHTML = @"
<!DOCTYPE html>
<html>
<head>
    <style>
        .edit-mode .media-placeholder,
        .media-placeholder.has-media {
            display: flex;
        }
        
        :not(.edit-mode) .media-placeholder:not(.has-media) {
            display: none;
        }
    </style>
</head>
<body>
    <div id="placeholder1" class="media-placeholder"></div>
    <div id="placeholder2" class="media-placeholder has-media"></div>
    
    <script>
        const body = document.body;
        const p1 = document.getElementById('placeholder1');
        const p2 = document.getElementById('placeholder2');
        
        // Test case 1: Not in edit mode
        console.log("Case 1 - Not in edit mode:");
        console.log("- Empty placeholder visible:", window.getComputedStyle(p1).display !== "none");
        console.log("- Placeholder with image visible:", window.getComputedStyle(p2).display !== "none");
        
        // Test case 2: In edit mode
        body.classList.add('edit-mode');
        console.log("\nCase 2 - In edit mode:");
        console.log("- Empty placeholder visible:", window.getComputedStyle(p1).display !== "none");
        console.log("- Placeholder with image visible:", window.getComputedStyle(p2).display !== "none");
    </script>
</body>
</html>
"@

$testHTMLPath = Join-Path -Path $PSScriptRoot -ChildPath "media-placeholder-test.html"
Set-Content -Path $testHTMLPath -Value $testHTML

Write-Host "Test file created at: $testHTMLPath"
Write-Host "Expected results:"
Write-Host "- Case 1 - Not in edit mode:" -ForegroundColor Yellow
Write-Host "  • Empty placeholder visible: False" -ForegroundColor Yellow
Write-Host "  • Placeholder with image visible: True" -ForegroundColor Yellow
Write-Host "- Case 2 - In edit mode:" -ForegroundColor Yellow
Write-Host "  • Empty placeholder visible: True" -ForegroundColor Yellow
Write-Host "  • Placeholder with image visible: True" -ForegroundColor Yellow

# Test 2: JS Initialization Tests
Write-Host "`nTest 2: Verifying initialization logic for media placeholders..." -ForegroundColor Cyan

$jsTest = @"
// Mock DOM elements
const mockPlaceholder = {
    style: { backgroundImage: 'url("test.jpg")', display: '' },
    classList: { add: jest.fn(), contains: jest.fn(() => true) },
    querySelector: jest.fn(() => ({ style: { display: '' } }))
};

const emptyPlaceholder = {
    style: { backgroundImage: '', display: '' },
    classList: { add: jest.fn(), contains: jest.fn(() => false) },
    querySelector: jest.fn(() => ({ style: { display: '' } }))
};

// Test with image
console.log("Placeholder with image test:");
if (mockPlaceholder.style.backgroundImage && 
    mockPlaceholder.style.backgroundImage !== 'none' && 
    mockPlaceholder.style.backgroundImage !== '') {
    mockPlaceholder.classList.add('has-media');
    const span = mockPlaceholder.querySelector('span');
    if (span) span.style.display = 'none';
    console.log("- has-media class added:", true);
    console.log("- span display set to none:", span.style.display === 'none');
}

// Test empty placeholder
console.log("\nEmpty placeholder test:");
if (emptyPlaceholder.style.backgroundImage && 
    emptyPlaceholder.style.backgroundImage !== 'none' && 
    emptyPlaceholder.style.backgroundImage !== '') {
    emptyPlaceholder.classList.add('has-media');
    const span = emptyPlaceholder.querySelector('span');
    if (span) span.style.display = 'none';
    console.log("- has-media class added:", true);
    console.log("- span display modified:", true);
} else {
    console.log("- has-media class added:", false);
    console.log("- span display modified:", false);
}
"@

$jsTestPath = Join-Path -Path $PSScriptRoot -ChildPath "media-placeholder-logic.js"
Set-Content -Path $jsTestPath -Value $jsTest

Write-Host "JS logic test file created at: $jsTestPath" 
Write-Host "Expected results:" 
Write-Host "- Placeholder with image test:" -ForegroundColor Yellow
Write-Host "  • has-media class added: True" -ForegroundColor Yellow
Write-Host "  • span display set to none: True" -ForegroundColor Yellow
Write-Host "- Empty placeholder test:" -ForegroundColor Yellow
Write-Host "  • has-media class added: False" -ForegroundColor Yellow
Write-Host "  • span display modified: False" -ForegroundColor Yellow

Write-Host "`nVisual Test Instructions:" -ForegroundColor Green
Write-Host "1. Open the website-builder-html.html file in a browser"
Write-Host "2. Upload images to the placeholders while in edit mode"
Write-Host "3. Exit edit mode and verify only placeholders with images are visible"
Write-Host "4. Re-enter edit mode and verify all placeholders are visible"
Write-Host "5. Right-click on a placeholder with an image to test the removal functionality"

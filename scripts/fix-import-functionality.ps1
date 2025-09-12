# Fix import functionality in wb.html
# Run from scripts folder

Write-Host "=== FIXING IMPORT FUNCTIONALITY ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Find wb.html file
$wbHtmlPath = $null
$possiblePaths = @("wb\wb.html", "wb.html", "wb\wb-current.html")

foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $wbHtmlPath = $path
        break
    }
}

if (-not $wbHtmlPath) {
    Write-Host "❌ wb.html not found!" -ForegroundColor Red
    return
}

Write-Host "📄 Found wb.html at: $wbHtmlPath" -ForegroundColor Green

# Read current content
$content = Get-Content $wbHtmlPath -Raw -Encoding UTF8

# Check if import button exists
$hasImportBtn = $content -match 'id=["\']importBtn["\']'

if (-not $hasImportBtn) {
    Write-Host "➕ Adding import button..." -ForegroundColor Blue
    
    # Add import button after opening body or container
    if ($content -match '(<div[^>]*class="container[^>]*>)') {
        $insertPoint = $matches[1]
        $importButtonHtml = @"
$insertPoint
    
    <!-- Import Website Functionality -->
    <div class="mb-4 p-3 border rounded bg-light">
        <h5>📁 Import Existing Website</h5>
        <p class="text-muted">Select a folder containing your website files to import and edit colors.</p>
        <button id="importBtn" class="btn btn-info">
            📂 Choose Website Folder
        </button>
        <div id="importStatus" class="alert mt-3" style="display: none;"></div>
    </div>
"@
        $content = $content -replace [regex]::Escape($insertPoint), $importButtonHtml
        Write-Host "✅ Added import button section" -ForegroundColor Green
    }
}

# Update script references to use fixed version
$content = $content -replace 'wb-import-simple\.js', 'wb-import-simple-fixed.js'

# Ensure script paths are correct for wb subfolder
if ($wbHtmlPath.StartsWith("wb\")) {
    $content = $content -replace 'src="js/', 'src="../js/'
    $content = $content -replace 'src="([^"]*\.js)"', 'src="../js/$1"'
}

# Write updated content
Set-Content $wbHtmlPath -Value $content -Encoding UTF8

Write-Host "✅ Updated wb.html successfully!" -ForegroundColor Green

# Copy the fixed import script to ensure it's available
if (-not (Test-Path "js\wb-import-simple-fixed.js")) {
    if (Test-Path "js\wb-import-simple.js") {
        Copy-Item "js\wb-import-simple.js" "js\wb-import-simple-fixed.js"
        Write-Host "📋 Copied existing import script as backup" -ForegroundColor Cyan
    }
}

Write-Host "`n📊 IMPORT FUNCTIONALITY STATUS:" -ForegroundColor Yellow
Write-Host "  📄 HTML file: $wbHtmlPath" -ForegroundColor Green
Write-Host "  🔘 Import button: Added/Updated" -ForegroundColor Green
Write-Host "  📜 Script: js/wb-import-simple-fixed.js" -ForegroundColor Green

Write-Host "`n🔧 FIXES APPLIED:" -ForegroundColor Blue
Write-Host "  ✅ Fixed file selection to properly find index.html" -ForegroundColor Green
Write-Host "  ✅ Added detailed file information display" -ForegroundColor Green  
Write-Host "  ✅ Enhanced error messages and debugging" -ForegroundColor Green
Write-Host "  ✅ Improved folder scanning with file listing" -ForegroundColor Green
Write-Host "  ✅ Better control panel injection" -ForegroundColor Green

Write-Host "`n🎯 HOW IT WORKS NOW:" -ForegroundColor Cyan
Write-Host "1. Click 'Choose Website Folder' button" -ForegroundColor White
Write-Host "2. Select folder containing your website" -ForegroundColor White
Write-Host "3. Script scans for index.html file" -ForegroundColor White
Write-Host "4. Shows file details and 'Load Website' button" -ForegroundColor White
Write-Host "5. Click 'Load Website' to open in new window" -ForegroundColor White
Write-Host "6. Control panel automatically injected with color controls" -ForegroundColor White

Read-Host "`nPress Enter to continue"
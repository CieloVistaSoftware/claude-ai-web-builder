# Update HTML files to reference JS files in js/ folder
# Run from scripts folder

Write-Host "=== UPDATING HTML FILES FOR JS FOLDER REORGANIZATION ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Find HTML files that might need updating
Write-Host "`n🔍 Scanning for HTML files that might reference JS files..." -ForegroundColor Blue

$htmlFilesToCheck = @(
    "index.html",
    "wb.html", 
    "wb\wb.html",
    "wb\wb-current.html",
    "wb\wb-clean.html",
    "html\*.html"
)

$foundFiles = @()

foreach ($pattern in $htmlFilesToCheck) {
    if ($pattern.Contains("*")) {
        $files = Get-ChildItem $pattern -ErrorAction SilentlyContinue
        if ($files) {
            $foundFiles += $files
        }
    } else {
        if (Test-Path $pattern) {
            $foundFiles += Get-Item $pattern
        }
    }
}

if ($foundFiles.Count -eq 0) {
    Write-Host "No HTML files found to update" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    return
}

Write-Host "Found $($foundFiles.Count) HTML files to check:" -ForegroundColor Green
foreach ($file in $foundFiles) {
    Write-Host "  📄 $($file.FullName)" -ForegroundColor Gray
}

# Define JavaScript files that were moved to js/ folder
$jsFilesToUpdate = @(
    "wb.js",
    "wb-import-simple.js",
    "server.js",
    "build.js",
    "simple-server.js",
    "standalone-server.js",
    "add-favicon.js",
    "add-zia-symbol.js",
    "build-complete.js",
    "build-dist.js",
    "check-build-process.js",
    "check-index-refs.js",
    "dynamic-pages.js",
    "find-bad-href.js",
    "mcp-client-example.js",
    "test-obfuscation.js",
    "verify-dist.js",
    "verify-security.js"
)

$totalUpdates = 0

Write-Host "`n🔄 Updating HTML files..." -ForegroundColor Blue

foreach ($htmlFile in $foundFiles) {
    try {
        Write-Host "`n  📄 Processing $($htmlFile.Name)..." -ForegroundColor Cyan
        
        $content = Get-Content $htmlFile.FullName -Raw -Encoding UTF8
        $originalContent = $content
        $fileUpdated = $false
        
        foreach ($jsFile in $jsFilesToUpdate) {
            # Update script src attributes
            $patterns = @(
                # Script tags: <script src="file.js"> -> <script src="js/file.js">
                "src=`"$([regex]::Escape($jsFile))`"",
                "src='$([regex]::Escape($jsFile))'",
                # Already with relative path: src="./file.js" -> src="./js/file.js"
                "src=`"\./($([regex]::Escape($jsFile)))`"",
                "src='\./($([regex]::Escape($jsFile)))'"
            )
            
            $replacements = @(
                "src=`"js/$jsFile`"",
                "src='js/$jsFile'",
                "src=`"./js/$jsFile`"",
                "src='./js/$jsFile'"
            )
            
            for ($i = 0; $i -lt $patterns.Count; $i++) {
                $newContent = $content -replace $patterns[$i], $replacements[$i]
                if ($newContent -ne $content) {
                    $content = $newContent
                    $fileUpdated = $true
                    Write-Host "    ✅ Updated reference to $jsFile" -ForegroundColor Green
                }
            }
        }
        
        if ($fileUpdated) {
            Set-Content $htmlFile.FullName -Value $content -Encoding UTF8
            Write-Host "    💾 Saved updates to $($htmlFile.Name)" -ForegroundColor Green
            $totalUpdates++
        } else {
            Write-Host "    ℹ️  No JS references found in $($htmlFile.Name)" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "    ❌ Error processing $($htmlFile.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Show summary
Write-Host "`n📊 SUMMARY:" -ForegroundColor Yellow
Write-Host "  📄 HTML files checked: $($foundFiles.Count)" -ForegroundColor Cyan
Write-Host "  🔄 Files updated: $totalUpdates" -ForegroundColor Green

# Show current js folder contents for reference
Write-Host "`nCurrent js/ folder contents:" -ForegroundColor Blue
if (Test-Path "js") {
    Get-ChildItem "js" -Filter "*.js" | ForEach-Object {
        Write-Host "  📜 $($_.Name)" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⚠️  js/ folder not found!" -ForegroundColor Red
}

Write-Host "`n✅ HTML UPDATE COMPLETE!" -ForegroundColor Green

Write-Host "`nRecommendations:" -ForegroundColor Yellow
Write-Host "1. Test each HTML file in a browser to verify JS loads correctly" -ForegroundColor Cyan
Write-Host "2. Check browser developer console for any 404 errors" -ForegroundColor Cyan
Write-Host "3. Verify all functionality works as expected" -ForegroundColor Cyan
Write-Host "4. Update any additional HTML files manually if needed" -ForegroundColor Cyan

Read-Host "Press Enter to continue"
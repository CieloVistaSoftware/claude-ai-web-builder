# Move all .html files (except index.html) to html folder and update references
# Run from scripts folder

Write-Host "=== MOVING HTML FILES AND UPDATING REFERENCES ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Ensure html folder exists
if (-not (Test-Path "html")) {
    New-Item -ItemType Directory -Name "html" | Out-Null
    Write-Host "📁 Created html/ folder" -ForegroundColor Green
}

# Find all .html files in root directory (excluding index.html)
Write-Host "`n🔍 Scanning for HTML files in root directory..." -ForegroundColor Blue

$htmlFiles = Get-ChildItem -Filter "*.html" | Where-Object { 
    $_.PSIsContainer -eq $false -and 
    $_.Name -ne "index.html" 
}

if ($htmlFiles.Count -eq 0) {
    Write-Host "No HTML files found to move (index.html stays in root)" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    return
}

Write-Host "Found $($htmlFiles.Count) HTML files to move:" -ForegroundColor Green
foreach ($file in $htmlFiles) {
    Write-Host "  📄 $($file.Name)" -ForegroundColor Gray
}

Write-Host "`n📌 Keeping index.html in root directory" -ForegroundColor Blue

# Track moved files for reference updates
$movedFiles = @()

# Move HTML files
Write-Host "`n📦 Moving HTML files..." -ForegroundColor Blue
foreach ($file in $htmlFiles) {
    try {
        $targetPath = "html\$($file.Name)"
        if (Test-Path $targetPath) {
            Write-Host "  ⚠️  $($file.Name) already exists in html/ - skipping" -ForegroundColor Yellow
        } else {
            Move-Item $file.FullName "html\" -Force
            Write-Host "  ✅ Moved $($file.Name)" -ForegroundColor Green
            $movedFiles += $file.Name
        }
    } catch {
        Write-Host "  ❌ Failed to move $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

if ($movedFiles.Count -eq 0) {
    Write-Host "No files were moved, no references to update" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    return
}

# Update references in files
Write-Host "`n🔄 Updating references in files..." -ForegroundColor Blue

# Define file types that might contain HTML references
$fileTypesToScan = @('*.html', '*.css', '*.js', '*.md', '*.json', '*.ts', '*.tsx')

$filesScanned = 0
$referencesUpdated = 0

foreach ($filePattern in $fileTypesToScan) {
    $filesToScan = Get-ChildItem -Recurse -Filter $filePattern | Where-Object { 
        $_.PSIsContainer -eq $false -and 
        $_.DirectoryName -notlike "*node_modules*" -and
        $_.DirectoryName -notlike "*\.git*" -and
        $_.DirectoryName -notlike "*dist*"
    }
    
    foreach ($file in $filesToScan) {
        try {
            $content = Get-Content $file.FullName -Raw -Encoding UTF8
            $originalContent = $content
            $fileUpdated = $false
            
            foreach ($htmlName in $movedFiles) {
                # Update various reference patterns
                $patterns = @(
                    # Direct references: page.html -> html/page.html
                    "(?<!html/)(?<!['""`"])$([regex]::Escape($htmlName))(?!['""`"])",
                    # Quoted references: "page.html" -> "html/page.html"
                    "`"$([regex]::Escape($htmlName))`"",
                    # Single quoted: 'page.html' -> 'html/page.html'
                    "'$([regex]::Escape($htmlName))'",
                    # In href attributes: href="page.html" -> href="html/page.html"
                    "href=`"$([regex]::Escape($htmlName))`"",
                    # In src attributes: src="page.html" -> src="html/page.html"
                    "src=`"$([regex]::Escape($htmlName))`"",
                    # In action attributes: action="page.html" -> action="html/page.html"
                    "action=`"$([regex]::Escape($htmlName))`"",
                    # In data attributes: data-page="page.html" -> data-page="html/page.html"
                    "data-[^=]*=`"$([regex]::Escape($htmlName))`""
                )
                
                $replacements = @(
                    "html/$htmlName",
                    "`"html/$htmlName`"",
                    "'html/$htmlName'",
                    "href=`"html/$htmlName`"",
                    "src=`"html/$htmlName`"",
                    "action=`"html/$htmlName`"",
                    "data-page=`"html/$htmlName`""
                )
                
                for ($i = 0; $i -lt $patterns.Count; $i++) {
                    $newContent = $content -replace $patterns[$i], $replacements[$i]
                    if ($newContent -ne $content) {
                        $content = $newContent
                        $fileUpdated = $true
                    }
                }
            }
            
            if ($fileUpdated) {
                Set-Content $file.FullName -Value $content -Encoding UTF8
                Write-Host "  ✅ Updated references in $($file.Name)" -ForegroundColor Green
                $referencesUpdated++
            }
            
            $filesScanned++
            
        } catch {
            Write-Host "  ❌ Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Show summary
Write-Host "`n📊 SUMMARY:" -ForegroundColor Yellow
Write-Host "  📄 HTML files moved: $($movedFiles.Count)" -ForegroundColor Green
Write-Host "  📌 index.html kept in root" -ForegroundColor Cyan
Write-Host "  📄 Files scanned: $filesScanned" -ForegroundColor Cyan
Write-Host "  🔄 Files with updated references: $referencesUpdated" -ForegroundColor Green

Write-Host "`nMoved HTML files:" -ForegroundColor Blue
foreach ($html in $movedFiles) {
    Write-Host "  📄 $html -> html/$html" -ForegroundColor Gray
}

# Show what's now in html folder
Write-Host "`nContents of html/ folder:" -ForegroundColor Blue
Get-ChildItem "html" -Filter "*.html" | ForEach-Object {
    Write-Host "  📄 $($_.Name)" -ForegroundColor Gray
}

# Show current root structure
Write-Host "`nRoot HTML files (should only be index.html):" -ForegroundColor Blue
Get-ChildItem -Filter "*.html" | ForEach-Object {
    Write-Host "  📄 $($_.Name)" -ForegroundColor Green
}

Write-Host "`n✅ HTML ORGANIZATION AND REFERENCE UPDATE COMPLETE!" -ForegroundColor Green

Write-Host "`nRecommendations:" -ForegroundColor Yellow
Write-Host "1. Test navigation links to ensure they work correctly" -ForegroundColor Cyan
Write-Host "2. Check any JavaScript that dynamically loads HTML pages" -ForegroundColor Cyan
Write-Host "3. Verify form actions and iframe sources are working" -ForegroundColor Cyan
Write-Host "4. Update any hardcoded paths in configuration files" -ForegroundColor Cyan

Read-Host "Press Enter to continue"
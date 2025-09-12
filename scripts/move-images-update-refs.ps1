# Move all image files to images folder and update references
# Run from scripts folder

Write-Host "=== MOVING IMAGE FILES AND UPDATING REFERENCES ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Ensure images folder exists
if (-not (Test-Path "images")) {
    New-Item -ItemType Directory -Name "images" | Out-Null
    Write-Host "📁 Created images/ folder" -ForegroundColor Green
}

# Define image file extensions
$imageExtensions = @('*.jpg', '*.jpeg', '*.png', '*.gif', '*.bmp', '*.svg', '*.webp', '*.ico')

# Find all image files in root directory
Write-Host "`n🔍 Scanning for image files in root directory..." -ForegroundColor Blue

$imageFiles = @()
foreach ($ext in $imageExtensions) {
    $foundFiles = Get-ChildItem -Filter $ext | Where-Object { $_.PSIsContainer -eq $false }
    $imageFiles += $foundFiles
}

if ($imageFiles.Count -eq 0) {
    Write-Host "No image files found in root directory" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    return
}

Write-Host "Found $($imageFiles.Count) image files to move:" -ForegroundColor Green
foreach ($file in $imageFiles) {
    Write-Host "  📷 $($file.Name)" -ForegroundColor Gray
}

# Track moved files for reference updates
$movedFiles = @()

# Move image files
Write-Host "`n📦 Moving image files..." -ForegroundColor Blue
foreach ($file in $imageFiles) {
    try {
        $targetPath = "images\$($file.Name)"
        if (Test-Path $targetPath) {
            Write-Host "  ⚠️  $($file.Name) already exists in images/ - skipping" -ForegroundColor Yellow
        } else {
            Move-Item $file.FullName "images\" -Force
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

# Define file types that might contain image references
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
            
            foreach ($imageName in $movedFiles) {
                # Update various reference patterns
                $patterns = @(
                    # Direct references: image.png -> images/image.png
                    "(?<!images/)(?<!['""`"])$([regex]::Escape($imageName))(?!['""`"])",
                    # Quoted references: "image.png" -> "images/image.png"
                    "`"$([regex]::Escape($imageName))`"",
                    # Single quoted: 'image.png' -> 'images/image.png'
                    "'$([regex]::Escape($imageName))'",
                    # In src attributes: src="image.png" -> src="images/image.png"
                    "src=`"$([regex]::Escape($imageName))`"",
                    # In href attributes: href="image.png" -> href="images/image.png"
                    "href=`"$([regex]::Escape($imageName))`"",
                    # CSS url(): url(image.png) -> url(images/image.png)
                    "url\($([regex]::Escape($imageName))\)",
                    "url\(`"$([regex]::Escape($imageName))`"\)",
                    "url\('$([regex]::Escape($imageName))'\)"
                )
                
                $replacements = @(
                    "images/$imageName",
                    "`"images/$imageName`"",
                    "'images/$imageName'",
                    "src=`"images/$imageName`"",
                    "href=`"images/$imageName`"",
                    "url(images/$imageName)",
                    "url(`"images/$imageName`")",
                    "url('images/$imageName')"
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
Write-Host "  📷 Images moved: $($movedFiles.Count)" -ForegroundColor Green
Write-Host "  📄 Files scanned: $filesScanned" -ForegroundColor Cyan
Write-Host "  🔄 Files with updated references: $referencesUpdated" -ForegroundColor Green

Write-Host "`nMoved images:" -ForegroundColor Blue
foreach ($img in $movedFiles) {
    Write-Host "  📷 $img -> images/$img" -ForegroundColor Gray
}

# Show what's now in images folder
Write-Host "`nContents of images/ folder:" -ForegroundColor Blue
Get-ChildItem "images" | ForEach-Object {
    Write-Host "  🖼️  $($_.Name)" -ForegroundColor Gray
}

Write-Host "`n✅ IMAGE ORGANIZATION AND REFERENCE UPDATE COMPLETE!" -ForegroundColor Green

Write-Host "`nRecommendations:" -ForegroundColor Yellow
Write-Host "1. Test your website to ensure all images load correctly" -ForegroundColor Cyan
Write-Host "2. Check any custom paths that might need manual adjustment" -ForegroundColor Cyan
Write-Host "3. Verify CSS background images are working" -ForegroundColor Cyan

Read-Host "Press Enter to continue"
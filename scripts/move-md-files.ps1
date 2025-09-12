# Move all .md files to docs folder
# Run from scripts folder

Write-Host "=== MOVING .MD FILES TO DOCS FOLDER ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Ensure docs folder exists
if (-not (Test-Path "docs")) {
    New-Item -ItemType Directory -Name "docs" | Out-Null
    Write-Host "📁 Created docs/ folder" -ForegroundColor Green
}

# Find all .md files in root directory
$mdFiles = Get-ChildItem -Filter "*.md" | Where-Object { $_.PSIsContainer -eq $false }

if ($mdFiles.Count -eq 0) {
    Write-Host "No .md files found in root directory" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    return
}

Write-Host "`nFound $($mdFiles.Count) .md files to move:" -ForegroundColor Blue

$moved = 0
foreach ($file in $mdFiles) {
    try {
        # Check if file already exists in docs
        $targetPath = "docs\$($file.Name)"
        if (Test-Path $targetPath) {
            Write-Host "  ⚠️  $($file.Name) already exists in docs/ - skipping" -ForegroundColor Yellow
        } else {
            Move-Item $file.FullName "docs\" -Force
            Write-Host "  ✅ Moved $($file.Name)" -ForegroundColor Green
            $moved++
        }
    } catch {
        Write-Host "  ❌ Failed to move $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n📦 Successfully moved $moved .md files to docs/ folder" -ForegroundColor Cyan

# Show what's now in docs
Write-Host "`nContents of docs/ folder:" -ForegroundColor Blue
Get-ChildItem "docs" -Filter "*.md" | ForEach-Object {
    Write-Host "  📄 $($_.Name)" -ForegroundColor Gray
}

Write-Host "`n✅ MARKDOWN FILES ORGANIZATION COMPLETE!" -ForegroundColor Green

Read-Host "Press Enter to continue"
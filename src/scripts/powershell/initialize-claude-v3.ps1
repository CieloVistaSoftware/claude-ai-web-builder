# Initialize all claude.md files to claude.OK.md format
# v3 - Status code comes AFTER "claude"

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("NEW", "UPD", "OK", "ARC")]
    [string]$DefaultStatus = "OK"
)

$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "`n🚀 Initializing claude files to claude.$DefaultStatus.md format..." -ForegroundColor Cyan
Write-Host "   Pattern: claude.<STATUS>.md (v3 format)" -ForegroundColor White
Write-Host "   Searching in: $projectRoot`n" -ForegroundColor Gray

# Find all files matching claude.md or CLAUDE.md (without status code)
$allFiles = Get-ChildItem -Path $projectRoot -Recurse -File | Where-Object {
    $_.Name -eq "claude.md" -or $_.Name -eq "CLAUDE.md"
}

Write-Host "Found $($allFiles.Count) files to initialize...`n" -ForegroundColor Cyan

$stats = @{
    Renamed = 0
    Skipped = 0
    Errors = 0
    Details = @()
}

foreach ($file in $allFiles) {
    $directory = $file.DirectoryName
    $currentFilename = $file.Name
    
    # Check if file already has status code
    if ($currentFilename -match "^claude\.\w+\.md$") {
        $stats.Skipped++
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  ⏭️ Skipped (has status): $relativePath" -ForegroundColor Gray
        continue
    }
    
    # Build new filename
    $newFilename = "claude.$DefaultStatus.md"
    $newPath = Join-Path $directory $newFilename
    
    # Check if target already exists
    if (Test-Path $newPath) {
        $stats.Errors++
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  ❌ Target exists: $relativePath" -ForegroundColor Red
        $stats.Details += @{
            File = $relativePath
            Status = "Error"
            Error = "Target file already exists"
        }
        continue
    }
    
    # Rename file
    try {
        Rename-Item -Path $file.FullName -NewName $newFilename -ErrorAction Stop
        $stats.Renamed++
        
        $relativePath = $newPath.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  ✅ $relativePath" -ForegroundColor Green
        
        $stats.Details += @{
            File = $relativePath
            Status = "Renamed"
            OldName = $currentFilename
            NewName = $newFilename
        }
    }
    catch {
        $stats.Errors++
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  ❌ Error: $relativePath - $($_.Exception.Message)" -ForegroundColor Red
        
        $stats.Details += @{
            File = $relativePath
            Status = "Error"
            Error = $_.Exception.Message
        }
    }
}

# Summary
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 Initialization Summary (v3 format):" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "  ✅ Renamed: $($stats.Renamed) files → claude.$DefaultStatus.md" -ForegroundColor Green
Write-Host "  ⏭️ Skipped (has status): $($stats.Skipped) files" -ForegroundColor Yellow
Write-Host "  ❌ Errors: $($stats.Errors) files" -ForegroundColor Red
Write-Host "  📁 Total found: $($allFiles.Count) files" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($stats.Renamed -gt 0) {
    Write-Host "`n✅ Success! $($stats.Renamed) files initialized" -ForegroundColor Green
    Write-Host "   Format: claude.md → claude.$DefaultStatus.md" -ForegroundColor White
    Write-Host "`n   Next step: Run 'npm run check-status' to verify" -ForegroundColor Cyan
}
elseif ($allFiles.Count -eq 0) {
    Write-Host "`n⚠️ No claude.md files found without status codes." -ForegroundColor Yellow
    Write-Host "   All files may already be initialized." -ForegroundColor Gray
}
elseif ($stats.Skipped -gt 0) {
    Write-Host "`n✅ All found files already have status codes." -ForegroundColor Green
}

if ($stats.Errors -gt 0) {
    Write-Host "`n⚠️ $($stats.Errors) files had errors. Check output above.`n" -ForegroundColor Yellow
}

Write-Host ""

# Save results
$results = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Version = "v3 - claude.<STATUS>.md format"
    DefaultStatus = $DefaultStatus
    TotalFound = $allFiles.Count
    Renamed = $stats.Renamed
    Skipped = $stats.Skipped
    Errors = $stats.Errors
    Details = $stats.Details
}

$resultsPath = Join-Path $projectRoot "docs\reports\init-results.json"
$results | ConvertTo-Json -Depth 5 | Out-File $resultsPath -Encoding UTF8

Write-Host "💾 Results saved to: docs/reports/init-results.json" -ForegroundColor Green
Write-Host ""

# Next steps
if ($stats.Renamed -gt 0) {
    Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. npm run check-status    (verify initialization)" -ForegroundColor White
    Write-Host "   2. Create claude.index.md  (status code reference)" -ForegroundColor White
    Write-Host "   3. Tell AI to aggregate    (optional first-time aggregation)" -ForegroundColor White
    Write-Host ""
}

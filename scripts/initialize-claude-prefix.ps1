# Initialize all claude.md files with filename prefix
# Much faster than editing file contents!

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("NEW", "UPD", "OK", "ARC")]
    [string]$DefaultPrefix = "OK"
)

$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "`n🚀 Initializing filename prefixes for all claude.md files..." -ForegroundColor Cyan
Write-Host "   Default prefix: $DefaultPrefix-" -ForegroundColor White
Write-Host "   Searching in: $projectRoot`n" -ForegroundColor Gray

# Find all files matching *claude.md pattern (including CLAUDE.md uppercase)
$allFiles = Get-ChildItem -Path $projectRoot -Filter "*claude.md" -Recurse -File

$stats = @{
    Renamed = 0
    Skipped = 0
    Errors = 0
    Details = @()
}

Write-Host "Found $($allFiles.Count) claude.md files. Processing...`n" -ForegroundColor Cyan

foreach ($file in $allFiles) {
    $directory = $file.DirectoryName
    $filename = $file.Name
    
    # Check if file already has a prefix
    if ($filename -match "^(NEW-|UPD-|OK-|ARC-)") {
        $stats.Skipped++
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  ⏭️ Skipped (has prefix): $relativePath" -ForegroundColor Gray
        continue
    }
    
    # Build new filename with prefix
    $newFilename = "$DefaultPrefix-$filename"
    $newPath = Join-Path $directory $newFilename
    
    # Check if target file already exists
    if (Test-Path $newPath) {
        $stats.Errors++
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  ❌ Error: Target exists - $relativePath" -ForegroundColor Red
        $stats.Details += @{
            File = $relativePath
            Status = "Error"
            Error = "Target file already exists"
        }
        continue
    }
    
    # Rename the file
    try {
        Rename-Item -Path $file.FullName -NewName $newFilename -ErrorAction Stop
        $stats.Renamed++
        
        $relativePath = $newPath.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  ✅ Initialized: $relativePath" -ForegroundColor Green
        
        $stats.Details += @{
            File = $relativePath
            Status = "Renamed"
            Prefix = $DefaultPrefix
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

# Summary Report
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 Initialization Summary:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "  ✅ Renamed: $($stats.Renamed) files" -ForegroundColor Green
Write-Host "  ⏭️ Skipped (already prefixed): $($stats.Skipped) files" -ForegroundColor Yellow
Write-Host "  ❌ Errors: $($stats.Errors) files" -ForegroundColor Red
Write-Host "  📁 Total: $($allFiles.Count) files" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($stats.Renamed -gt 0) {
    Write-Host "`n✅ Success! $($stats.Renamed) files initialized with $DefaultPrefix- prefix" -ForegroundColor Green
    Write-Host "   All files renamed from 'claude.md' to '$DefaultPrefix-claude.md'" -ForegroundColor White
    Write-Host "`n   Next step: Run 'npm run check-status' to verify" -ForegroundColor Cyan
}
elseif ($stats.Skipped -eq $allFiles.Count) {
    Write-Host "`n✅ All files already have prefixes. No action needed." -ForegroundColor Green
}

if ($stats.Errors -gt 0) {
    Write-Host "`n⚠️ $($stats.Errors) files had errors. Check output above for details." -ForegroundColor Yellow
}

Write-Host ""

# Save detailed results to JSON
$results = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    DefaultPrefix = $DefaultPrefix
    TotalFiles = $allFiles.Count
    Renamed = $stats.Renamed
    Skipped = $stats.Skipped
    Errors = $stats.Errors
    Details = $stats.Details
}

$resultsPath = Join-Path $projectRoot "scripts\init-results.json"
$results | ConvertTo-Json -Depth 5 | Out-File $resultsPath -Encoding UTF8

Write-Host "💾 Results saved to: scripts\init-results.json" -ForegroundColor Green
Write-Host ""

# Show next steps
if ($stats.Renamed -gt 0) {
    Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. npm run check-status    (verify all files prefixed)" -ForegroundColor White
    Write-Host "   2. Tell AI to aggregate    (first-time aggregation)" -ForegroundColor White
    Write-Host ""
}

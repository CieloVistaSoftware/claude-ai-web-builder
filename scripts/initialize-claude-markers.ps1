# Initialize all claude.md files with status markers
# Usage: .\scripts\initialize-claude-markers.ps1

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("NEW", "READ", "UPDATED")]
    [string]$DefaultStatus = "READ"
)

$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"
$files = Get-ChildItem -Path $projectRoot -Filter "claude.md" -Recurse -File

Write-Host "`n🚀 Initializing status markers for $($files.Count) files..." -ForegroundColor Cyan
Write-Host "   Default status: $DefaultStatus`n" -ForegroundColor White

$stats = @{
    Initialized = 0
    Skipped = 0
    Errors = 0
    Details = @()
}

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        
        # Skip if already has marker
        if ($content -match "^<!--\s*STATUS:\s*\w+\s*-->") {
            $stats.Skipped++
            Write-Host "  ⏭️ Skipped (has marker): $($file.FullName.Replace($projectRoot, '').TrimStart('\'))" -ForegroundColor Gray
            continue
        }
        
        # Add marker to top of file
        $newContent = "<!-- STATUS: $DefaultStatus -->`n" + $content
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -ErrorAction Stop
        $stats.Initialized++
        
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  ✅ Initialized: $relativePath" -ForegroundColor Green
        
        $stats.Details += @{
            File = $relativePath
            Status = "Initialized"
            Marker = $DefaultStatus
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
Write-Host "  ✅ Initialized: $($stats.Initialized) files" -ForegroundColor Green
Write-Host "  ⏭️ Skipped (already marked): $($stats.Skipped) files" -ForegroundColor Yellow
Write-Host "  ❌ Errors: $($stats.Errors) files" -ForegroundColor Red
Write-Host "  📁 Total: $($files.Count) files" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($stats.Initialized -gt 0) {
    Write-Host "`n✅ Success! All files have been initialized with <!-- STATUS: $DefaultStatus --> marker" -ForegroundColor Green
    Write-Host "   Next step: Run .\scripts\check-claude-status.ps1 to verify`n" -ForegroundColor Cyan
}
elseif ($stats.Skipped -eq $files.Count) {
    Write-Host "`n✅ All files already have status markers. No action needed.`n" -ForegroundColor Green
}

if ($stats.Errors -gt 0) {
    Write-Host "⚠️ Some files had errors. Check output above for details.`n" -ForegroundColor Yellow
}

# Save results to JSON
$results = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    DefaultStatus = $DefaultStatus
    TotalFiles = $files.Count
    Initialized = $stats.Initialized
    Skipped = $stats.Skipped
    Errors = $stats.Errors
    Details = $stats.Details
}

$resultsPath = Join-Path $projectRoot "scripts\init-results.json"
$results | ConvertTo-Json -Depth 5 | Out-File $resultsPath -Encoding UTF8

Write-Host "💾 Results saved to: scripts\init-results.json" -ForegroundColor Green
Write-Host ""

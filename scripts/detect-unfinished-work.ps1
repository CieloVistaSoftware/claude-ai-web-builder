# Scan all claude.OK.md files for unfinished work indicators
# Helps identify which files should be marked as claude.UPD.md

$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "`n🔍 Scanning for unfinished work in claude.OK.md files...`n" -ForegroundColor Cyan

# Keywords that indicate unfinished work
$keywords = @(
    "TODO",
    "FIXME", 
    "BUG",
    "BROKEN",
    "NOT WORKING",
    "NEEDS FIX",
    "INCOMPLETE",
    "IN PROGRESS",
    "NOT STARTED",
    "CRITICAL",
    "HIGH PRIORITY",
    "URGENT",
    "BLOCKER",
    "⚠️",
    "❌",
    "🔴",
    "⏸️"
)

# Find all claude.OK.md files
$files = Get-ChildItem -Path $projectRoot -Filter "claude.OK.md" -Recurse -File

Write-Host "Found $($files.Count) claude.OK.md files to scan`n" -ForegroundColor White

$needsUpdate = @()
$stats = @{
    Scanned = 0
    HasIssues = 0
    IsOK = 0
}

foreach ($file in $files) {
    $stats.Scanned++
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if (-not $content) {
        $stats.IsOK++
        continue
    }
    
    $foundKeywords = @()
    
    foreach ($keyword in $keywords) {
        if ($content -match $keyword) {
            if (-not ($foundKeywords -contains $keyword)) {
                $foundKeywords += $keyword
            }
        }
    }
    
    if ($foundKeywords.Count -gt 0) {
        $stats.HasIssues++
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        
        $needsUpdate += @{
            Path = $file.FullName
            RelativePath = $relativePath
            Keywords = $foundKeywords
            KeywordCount = $foundKeywords.Count
        }
        
        Write-Host "🟡 HAS ISSUES: $relativePath" -ForegroundColor Yellow
        Write-Host "   Found: $($foundKeywords -join ', ')" -ForegroundColor Gray
    }
    else {
        $stats.IsOK++
    }
}

# Summary
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 Scan Results:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "  📁 Scanned: $($stats.Scanned) files" -ForegroundColor White
Write-Host "  🟡 Has Issues: $($stats.HasIssues) files (should be UPD)" -ForegroundColor Yellow
Write-Host "  ✅ Looks OK: $($stats.IsOK) files" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($needsUpdate.Count -gt 0) {
    Write-Host "`n🎯 Action Required:" -ForegroundColor Yellow
    Write-Host "   $($needsUpdate.Count) files should be marked as claude.UPD.md`n" -ForegroundColor White
    
    # Show top 10 files with most issues
    $topIssues = $needsUpdate | Sort-Object -Property KeywordCount -Descending | Select-Object -First 10
    Write-Host "📋 Top Files with Most Issues:" -ForegroundColor Cyan
    foreach ($item in $topIssues) {
        Write-Host "   $($item.KeywordCount) issues: $($item.RelativePath)" -ForegroundColor Gray
    }
    Write-Host ""
    
    $confirm = Read-Host "Automatically rename these $($needsUpdate.Count) files to claude.UPD.md? (y/n)"
    
    if ($confirm -eq "y") {
        Write-Host "`n🔄 Renaming files to claude.UPD.md...`n" -ForegroundColor Cyan
        $renamed = 0
        $failed = 0
        
        foreach ($item in $needsUpdate) {
            $directory = Split-Path $item.Path -Parent
            $newPath = Join-Path $directory "claude.UPD.md"
            
            # Check if target already exists
            if (Test-Path $newPath) {
                Write-Host "  ⚠️ Target exists (skipping): $($item.RelativePath)" -ForegroundColor Yellow
                $failed++
                continue
            }
            
            try {
                Rename-Item -Path $item.Path -NewName "claude.UPD.md" -ErrorAction Stop
                $renamed++
                Write-Host "  ✅ $($item.RelativePath)" -ForegroundColor Green
            }
            catch {
                Write-Host "  ❌ Failed: $($item.RelativePath) - $($_.Exception.Message)" -ForegroundColor Red
                $failed++
            }
        }
        
        Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "✅ Renamed: $renamed files to claude.UPD.md" -ForegroundColor Green
        if ($failed -gt 0) {
            Write-Host "❌ Failed: $failed files" -ForegroundColor Red
        }
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        
        Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
        Write-Host "   1. Run 'npm run check-status' to verify" -ForegroundColor White
        Write-Host "   2. Tell AI 'Aggregate changed claude.md files'" -ForegroundColor White
        Write-Host ""
    }
    else {
        Write-Host "`n⏭️ Skipped automatic renaming" -ForegroundColor Yellow
        Write-Host "   You can manually rename files later" -ForegroundColor Gray
        Write-Host "   Files list saved to: scripts/unfinished-work-files.json`n" -ForegroundColor Gray
    }
}
else {
    Write-Host "`n✅ All files look complete! No UPD markers needed.`n" -ForegroundColor Green
}

# Save results
$results = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Scanned = $stats.Scanned
    HasIssues = $stats.HasIssues
    IsOK = $stats.IsOK
    Keywords = $keywords
    FilesNeedingUpdate = $needsUpdate | Sort-Object -Property KeywordCount -Descending
}

$resultsPath = Join-Path $projectRoot "docs\reports\unfinished-work-files.json"
$results | ConvertTo-Json -Depth 5 | Out-File $resultsPath -Encoding UTF8

Write-Host "💾 Full results saved to: docs/reports/unfinished-work-files.json" -ForegroundColor Green
Write-Host ""

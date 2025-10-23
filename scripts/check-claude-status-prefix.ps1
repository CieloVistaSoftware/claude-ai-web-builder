# Fast check using filename prefixes only - NO FILE READING!
# This is 10-20x faster than reading file contents

$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "`n🔍 Fast scanning for *claude.md files (prefix-based)..." -ForegroundColor Cyan
$startTime = Get-Date

# Find all files matching pattern *claude.md (includes NEW-claude.md, UPD-claude.md, etc.)
$allFiles = Get-ChildItem -Path $projectRoot -Filter "*claude.md" -Recurse -File

$stats = @{
    NEW = @()
    UPDATED = @()
    CURRENT = @()
    ARCHIVED = @()
    NO_PREFIX = @()
}

foreach ($file in $allFiles) {
    $name = $file.Name
    
    if ($name -match "^NEW-") {
        $stats.NEW += $file.FullName
    }
    elseif ($name -match "^UPD-") {
        $stats.UPDATED += $file.FullName
    }
    elseif ($name -match "^OK-") {
        $stats.CURRENT += $file.FullName
    }
    elseif ($name -match "^ARC-") {
        $stats.ARCHIVED += $file.FullName
    }
    else {
        # No prefix found - needs initialization
        $stats.NO_PREFIX += $file.FullName
    }
}

$scanTime = (Get-Date) - $startTime

# Report
Write-Host "`n📊 Claude.md Status Check (Filename Prefix Scan):" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔴 NEW: $($stats.NEW.Count) files (NEW-claude.md)" -ForegroundColor Red
Write-Host "🟡 UPDATED: $($stats.UPDATED.Count) files (UPD-claude.md)" -ForegroundColor Yellow
Write-Host "✅ CURRENT: $($stats.CURRENT.Count) files (OK-claude.md)" -ForegroundColor Green
Write-Host "⚫ ARCHIVED: $($stats.ARCHIVED.Count) files (ARC-claude.md)" -ForegroundColor Gray
Write-Host "⚠️ NO PREFIX: $($stats.NO_PREFIX.Count) files (need initialization)" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📁 Total: $($allFiles.Count) files scanned" -ForegroundColor White
Write-Host "⚡ Scan completed in $([math]::Round($scanTime.TotalMilliseconds, 0)) milliseconds (no file reading!)`n" -ForegroundColor Green

$actionNeeded = $stats.NEW.Count + $stats.UPDATED.Count

if ($actionNeeded -gt 0) {
    Write-Host "🎯 Next Action: Aggregate $actionNeeded changed files" -ForegroundColor Yellow
    Write-Host "   Command: Tell AI to 'Aggregate changed claude.md files'`n" -ForegroundColor Cyan
}
else {
    Write-Host "✅ All files are current! No aggregation needed.`n" -ForegroundColor Green
}

# Show files needing attention (limit to 20)
if ($actionNeeded -gt 0) {
    Write-Host "📋 Files Needing Aggregation:" -ForegroundColor Yellow
    $displayCount = 0
    $maxDisplay = 20
    
    foreach ($file in $stats.NEW) {
        if ($displayCount -ge $maxDisplay) { break }
        $relativePath = $file.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  🔴 $relativePath" -ForegroundColor Red
        $displayCount++
    }
    
    foreach ($file in $stats.UPDATED) {
        if ($displayCount -ge $maxDisplay) { break }
        $relativePath = $file.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  🟡 $relativePath" -ForegroundColor Yellow
        $displayCount++
    }
    
    if ($actionNeeded -gt $maxDisplay) {
        Write-Host "  ... and $($actionNeeded - $maxDisplay) more files" -ForegroundColor Gray
    }
    Write-Host ""
}

# Show files needing initialization
if ($stats.NO_PREFIX.Count -gt 0) {
    Write-Host "⚠️ Files Without Prefix (Need Initialization):" -ForegroundColor Magenta
    Write-Host "   Run: npm run init-markers`n" -ForegroundColor Cyan
    
    $displayCount = 0
    $maxDisplay = 10
    
    foreach ($file in $stats.NO_PREFIX) {
        if ($displayCount -ge $maxDisplay) { break }
        $relativePath = $file.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  ⚠️ $relativePath" -ForegroundColor Magenta
        $displayCount++
    }
    
    if ($stats.NO_PREFIX.Count -gt $maxDisplay) {
        Write-Host "  ... and $($stats.NO_PREFIX.Count - $maxDisplay) more files" -ForegroundColor Gray
    }
    Write-Host ""
}

# Export results for AI to read
$results = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    ScanTimeMs = [math]::Round($scanTime.TotalMilliseconds, 0)
    TotalFiles = $allFiles.Count
    NewCount = $stats.NEW.Count
    UpdatedCount = $stats.UPDATED.Count
    CurrentCount = $stats.CURRENT.Count
    ArchivedCount = $stats.ARCHIVED.Count
    NoPrefixCount = $stats.NO_PREFIX.Count
    ActionNeeded = $actionNeeded
    NewFiles = $stats.NEW
    UpdatedFiles = $stats.UPDATED
    NoPrefixFiles = $stats.NO_PREFIX
}

$resultsPath = Join-Path $projectRoot "scripts\claude-status-results.json"
$results | ConvertTo-Json -Depth 5 | Out-File $resultsPath -Encoding UTF8

Write-Host "💾 Results saved to: scripts\claude-status-results.json" -ForegroundColor Green
Write-Host ""

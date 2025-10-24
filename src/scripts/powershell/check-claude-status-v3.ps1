# Fast check using filename pattern claude.*.md
# v3 - Status code comes AFTER "claude"

$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "`n🔍 Scanning for claude.*.md files..." -ForegroundColor Cyan
$startTime = Get-Date

# Find all files matching pattern claude.*.md
$allFiles = Get-ChildItem -Path $projectRoot -Recurse -File | Where-Object { 
    $_.Name -match "^claude\.\w+\.md$" -or $_.Name -eq "claude.md" -or $_.Name -eq "CLAUDE.md"
}

$stats = @{
    NEW = @()
    UPD = @()
    OK = @()
    ARC = @()
    NO_STATUS = @()
}

foreach ($file in $allFiles) {
    $name = $file.Name
    
    if ($name -eq "claude.NEW.md") {
        $stats.NEW += $file.FullName
    }
    elseif ($name -eq "claude.UPD.md") {
        $stats.UPD += $file.FullName
    }
    elseif ($name -eq "claude.OK.md") {
        $stats.OK += $file.FullName
    }
    elseif ($name -eq "claude.ARC.md") {
        $stats.ARC += $file.FullName
    }
    else {
        # claude.md or CLAUDE.md without status code
        $stats.NO_STATUS += $file.FullName
    }
}

$scanTime = (Get-Date) - $startTime

# Report
Write-Host "`n📊 Claude.md Status Check (v3 - claude.<STATUS>.md format):" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔴 NEW: $($stats.NEW.Count) files (claude.NEW.md)" -ForegroundColor Red
Write-Host "🟡 UPDATED: $($stats.UPD.Count) files (claude.UPD.md)" -ForegroundColor Yellow
Write-Host "✅ CURRENT: $($stats.OK.Count) files (claude.OK.md)" -ForegroundColor Green
Write-Host "⚫ ARCHIVED: $($stats.ARC.Count) files (claude.ARC.md)" -ForegroundColor Gray
Write-Host "⚠️ NO STATUS: $($stats.NO_STATUS.Count) files (need initialization)" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📁 Total: $($allFiles.Count) files scanned" -ForegroundColor White
Write-Host "⚡ Scan completed in $([math]::Round($scanTime.TotalMilliseconds, 0)) milliseconds`n" -ForegroundColor Green

$actionNeeded = $stats.NEW.Count + $stats.UPD.Count

if ($actionNeeded -gt 0) {
    Write-Host "🎯 Next Action: Aggregate $actionNeeded changed files" -ForegroundColor Yellow
    Write-Host "   Command: Tell AI to 'Aggregate changed claude.md files'`n" -ForegroundColor Cyan
}
else {
    Write-Host "✅ All files are current! No aggregation needed.`n" -ForegroundColor Green
}

# Show files needing attention
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
    
    foreach ($file in $stats.UPD) {
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

# Show files without status code
if ($stats.NO_STATUS.Count -gt 0) {
    Write-Host "⚠️ Files Without Status Code:" -ForegroundColor Magenta
    Write-Host "   Run: npm run init-markers`n" -ForegroundColor Cyan
    
    $displayCount = 0
    $maxDisplay = 10
    
    foreach ($file in $stats.NO_STATUS) {
        if ($displayCount -ge $maxDisplay) { break }
        $relativePath = $file.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  ⚠️ $relativePath" -ForegroundColor Magenta
        $displayCount++
    }
    
    if ($stats.NO_STATUS.Count -gt $maxDisplay) {
        Write-Host "  ... and $($stats.NO_STATUS.Count - $maxDisplay) more files" -ForegroundColor Gray
    }
    Write-Host ""
}

# Export results
$results = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Version = "v3 - claude.<STATUS>.md format"
    ScanTimeMs = [math]::Round($scanTime.TotalMilliseconds, 0)
    TotalFiles = $allFiles.Count
    NewCount = $stats.NEW.Count
    UpdatedCount = $stats.UPD.Count
    CurrentCount = $stats.OK.Count
    ArchivedCount = $stats.ARC.Count
    NoStatusCount = $stats.NO_STATUS.Count
    ActionNeeded = $actionNeeded
    NewFiles = $stats.NEW
    UpdatedFiles = $stats.UPD
    NoStatusFiles = $stats.NO_STATUS
}

$resultsPath = Join-Path $projectRoot "docs\reports\claude-status-results.json"
$results | ConvertTo-Json -Depth 5 | Out-File $resultsPath -Encoding UTF8

Write-Host "💾 Results saved to: docs/reports/claude-status-results.json" -ForegroundColor Green
Write-Host ""

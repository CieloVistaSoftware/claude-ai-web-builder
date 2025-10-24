# Check all claude.md files for status markers
# Usage: .\scripts\check-claude-status.ps1

$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"
$files = Get-ChildItem -Path $projectRoot -Filter "claude.md" -Recurse -File

$stats = @{
    NEW = @()
    UPDATED = @()
    READ = @()
    ARCHIVED = @()
    MISSING = @()
}

Write-Host "`n🔍 Scanning $($files.Count) claude.md files..." -ForegroundColor Cyan

foreach ($file in $files) {
    try {
        $firstLine = Get-Content $file.FullName -First 1 -ErrorAction Stop
        
        if ($firstLine -match "STATUS:\s*NEW") {
            $stats.NEW += $file.FullName
        }
        elseif ($firstLine -match "STATUS:\s*UPDATED") {
            $stats.UPDATED += $file.FullName
        }
        elseif ($firstLine -match "STATUS:\s*READ") {
            $stats.READ += $file.FullName
        }
        elseif ($firstLine -match "STATUS:\s*ARCHIVED") {
            $stats.ARCHIVED += $file.FullName
        }
        else {
            $stats.MISSING += $file.FullName
        }
    }
    catch {
        Write-Host "  ⚠️ Error reading: $($file.FullName)" -ForegroundColor Yellow
        $stats.MISSING += $file.FullName
    }
}

# Report
Write-Host "`n📊 Claude.md Status Check:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🔴 NEW: $($stats.NEW.Count) files need first-time aggregation" -ForegroundColor Red
Write-Host "🟡 UPDATED: $($stats.UPDATED.Count) files have new content" -ForegroundColor Yellow
Write-Host "✅ READ: $($stats.READ.Count) files are current" -ForegroundColor Green
Write-Host "⚫ ARCHIVED: $($stats.ARCHIVED.Count) files are deprecated" -ForegroundColor Gray
Write-Host "⚠️ MISSING MARKER: $($stats.MISSING.Count) files need initialization" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📁 Total: $($files.Count) files scanned`n" -ForegroundColor White

# Calculate action needed
$actionNeeded = $stats.NEW.Count + $stats.UPDATED.Count

if ($actionNeeded -gt 0) {
    Write-Host "🎯 Next Action: Aggregate $actionNeeded changed files" -ForegroundColor Yellow
    Write-Host "   Command: Tell AI to 'Aggregate changed claude.md files'`n" -ForegroundColor Cyan
}
else {
    Write-Host "✅ All files are current! No aggregation needed.`n" -ForegroundColor Green
}

# Show files needing attention (limit to 20 for readability)
if ($stats.NEW.Count -gt 0 -or $stats.UPDATED.Count -gt 0) {
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

# Show files missing markers (limit to 10)
if ($stats.MISSING.Count -gt 0) {
    Write-Host "⚠️ Files Missing Status Marker:" -ForegroundColor Magenta
    Write-Host "   Run: .\scripts\initialize-claude-markers.ps1`n" -ForegroundColor Cyan
    
    $displayCount = 0
    $maxDisplay = 10
    
    foreach ($file in $stats.MISSING) {
        if ($displayCount -ge $maxDisplay) { break }
        $relativePath = $file.Replace($projectRoot, "").TrimStart('\')
        Write-Host "  ⚠️ $relativePath" -ForegroundColor Magenta
        $displayCount++
    }
    
    if ($stats.MISSING.Count -gt $maxDisplay) {
        Write-Host "  ... and $($stats.MISSING.Count - $maxDisplay) more files" -ForegroundColor Gray
    }
    Write-Host ""
}

# Export results for programmatic use
$results = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    TotalFiles = $files.Count
    NewCount = $stats.NEW.Count
    UpdatedCount = $stats.UPDATED.Count
    ReadCount = $stats.READ.Count
    ArchivedCount = $stats.ARCHIVED.Count
    MissingCount = $stats.MISSING.Count
    ActionNeeded = $actionNeeded
    NewFiles = $stats.NEW
    UpdatedFiles = $stats.UPDATED
    MissingFiles = $stats.MISSING
}

# Save to JSON for AI to read
$resultsPath = Join-Path $projectRoot "scripts\claude-status-results.json"
$results | ConvertTo-Json -Depth 5 | Out-File $resultsPath -Encoding UTF8

Write-Host "💾 Results saved to: scripts\claude-status-results.json" -ForegroundColor Green
Write-Host ""

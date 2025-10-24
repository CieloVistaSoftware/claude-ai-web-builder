# Scan all claude files and assign priority levels based on content
# v4.0 - Priority-based system with emoji in filenames

$projectRoot = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "`n🔍 Analyzing claude files for priority levels...`n" -ForegroundColor Cyan

# Priority definitions
$priorities = @{
    CRITICAL = @{
        Emoji = "🔴"
        Name = "CRITICAL"
        Keywords = @(
            "CRITICAL", "BLOCKER", "BROKEN", "URGENT", "SECURITY",
            "ERROR", "FAILED", "NOT WORKING", "CRASH", "DOWN",
            "BLOCKS", "BLOCKING", "EMERGENCY", "SEVERITY.*CRITICAL"
        )
    }
    HIGH = @{
        Emoji = "🟡"
        Name = "HIGH"
        Keywords = @(
            "TODO", "FIXME", "HIGH PRIORITY", "NEEDS FIX", "IN PROGRESS",
            "NOT STARTED", "BUG", "WARNING", "⚠️", "INCOMPLETE",
            "MISSING", "REQUIRED", "MUST"
        )
    }
    CURRENT = @{
        Emoji = "✅"
        Name = "CURRENT"
        Keywords = @()  # Default if no issues found
    }
}

# Find all claude.md files (or already migrated claude.*.md files)
$files = Get-ChildItem -Path $projectRoot -Recurse -File | Where-Object {
    $_.Name -match "^claude\..*\.md$" -or $_.Name -eq "claude.md" -or $_.Name -eq "CLAUDE.md"
}

Write-Host "Found $($files.Count) claude files to analyze`n" -ForegroundColor White

$results = @{
    Critical = @()
    High = @()
    Current = @()
    Total = 0
}

foreach ($file in $files) {
    $results.Total++
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if (-not $content) {
        $results.Current += $file
        continue
    }
    
    # Check for CRITICAL issues first (highest priority)
    $criticalCount = 0
    $criticalKeywords = @()
    foreach ($keyword in $priorities.CRITICAL.Keywords) {
        if ($content -match $keyword) {
            $criticalCount++
            if (-not ($criticalKeywords -contains $keyword)) {
                $criticalKeywords += $keyword
            }
        }
    }
    
    if ($criticalCount -gt 0) {
        $results.Critical += @{
            File = $file
            Count = $criticalCount
            Keywords = $criticalKeywords
            Priority = "CRITICAL"
        }
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        Write-Host "🔴 CRITICAL: $relativePath" -ForegroundColor Red
        Write-Host "   Issues: $($criticalKeywords -join ', ')" -ForegroundColor Gray
        continue
    }
    
    # Check for HIGH priority issues
    $highCount = 0
    $highKeywords = @()
    foreach ($keyword in $priorities.HIGH.Keywords) {
        if ($content -match $keyword) {
            $highCount++
            if (-not ($highKeywords -contains $keyword)) {
                $highKeywords += $keyword
            }
        }
    }
    
    if ($highCount -gt 0) {
        $results.High += @{
            File = $file
            Count = $highCount
            Keywords = $highKeywords
            Priority = "HIGH"
        }
        $relativePath = $file.FullName.Replace($projectRoot, "").TrimStart('\')
        Write-Host "🟡 HIGH: $relativePath" -ForegroundColor Yellow
        Write-Host "   Issues: $($highKeywords -join ', ')" -ForegroundColor Gray
        continue
    }
    
    # Default to CURRENT (no issues found)
    $results.Current += $file
}

# Summary
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 Priority Analysis Results:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "  📁 Total Files: $($results.Total)" -ForegroundColor White
Write-Host "  🔴 CRITICAL: $($results.Critical.Count) files (blocking issues)" -ForegroundColor Red
Write-Host "  🟡 HIGH: $($results.High.Count) files (important work)" -ForegroundColor Yellow
Write-Host "  ✅ CURRENT: $($results.Current.Count) files (all good)" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Ask for confirmation
if ($results.Critical.Count -gt 0 -or $results.High.Count -gt 0) {
    Write-Host "`n🎯 Rename files with priority emoji? (y/n): " -ForegroundColor Yellow -NoNewline
    $confirm = Read-Host
    
    if ($confirm -eq "y") {
        Write-Host "`n🔄 Renaming files with priority levels...`n" -ForegroundColor Cyan
        $renamed = 0
        $failed = 0
        
        # Rename CRITICAL files first
        foreach ($item in $results.Critical) {
            $directory = $item.File.DirectoryName
            $newPath = Join-Path $directory "claude.🔴.md"
            
            if ((Test-Path $newPath) -and ($item.File.FullName -ne $newPath)) {
                Write-Host "  ⚠️ Target exists (skipping): $newPath" -ForegroundColor Yellow
                $failed++
                continue
            }
            
            if ($item.File.FullName -eq $newPath) {
                Write-Host "  ✅ Already correct: claude.🔴.md" -ForegroundColor Green
                continue
            }
            
            try {
                Rename-Item -Path $item.File.FullName -NewName "claude.🔴.md" -ErrorAction Stop
                $renamed++
                $relativePath = $newPath.Replace($projectRoot, "").TrimStart('\')
                Write-Host "  🔴 $relativePath" -ForegroundColor Red
            }
            catch {
                Write-Host "  ❌ Failed: $($item.File.Name) - $($_.Exception.Message)" -ForegroundColor Red
                $failed++
            }
        }
        
        # Rename HIGH priority files
        foreach ($item in $results.High) {
            $directory = $item.File.DirectoryName
            $newPath = Join-Path $directory "claude.🟡.md"
            
            if ((Test-Path $newPath) -and ($item.File.FullName -ne $newPath)) {
                Write-Host "  ⚠️ Target exists (skipping): $newPath" -ForegroundColor Yellow
                $failed++
                continue
            }
            
            if ($item.File.FullName -eq $newPath) {
                continue
            }
            
            try {
                Rename-Item -Path $item.File.FullName -NewName "claude.🟡.md" -ErrorAction Stop
                $renamed++
                $relativePath = $newPath.Replace($projectRoot, "").TrimStart('\')
                Write-Host "  🟡 $relativePath" -ForegroundColor Yellow
            }
            catch {
                Write-Host "  ❌ Failed: $($item.File.Name) - $($_.Exception.Message)" -ForegroundColor Red
                $failed++
            }
        }
        
        # Rename CURRENT files (only if they're still claude.md)
        foreach ($file in $results.Current) {
            if ($file.Name -eq "claude.md" -or $file.Name -eq "CLAUDE.md" -or $file.Name -eq "claude.OK.md") {
                $directory = $file.DirectoryName
                $newPath = Join-Path $directory "claude.✅.md"
                
                if (Test-Path $newPath) {
                    continue
                }
                
                try {
                    Rename-Item -Path $file.FullName -NewName "claude.✅.md" -ErrorAction Stop
                    $renamed++
                }
                catch {
                    # Silently continue for current files
                }
            }
        }
        
        Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        Write-Host "✅ Renamed: $renamed files with priority emoji" -ForegroundColor Green
        if ($failed -gt 0) {
            Write-Host "⚠️ Skipped: $failed files (conflicts or errors)" -ForegroundColor Yellow
        }
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
        
        Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
        Write-Host "   1. npm run check-status         (verify priorities)" -ForegroundColor White
        Write-Host "   2. Tell AI to aggregate 🔴 first (critical issues)" -ForegroundColor White
        Write-Host "   3. Then aggregate 🟡 files      (high priority)" -ForegroundColor White
        Write-Host ""
    }
    else {
        Write-Host "`n⏭️ Skipped automatic renaming" -ForegroundColor Yellow
        Write-Host "   Results saved for your review`n" -ForegroundColor Gray
    }
}
else {
    Write-Host "`n✅ All files look good! No priority issues found.`n" -ForegroundColor Green
}

# Save results
$saveResults = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Total = $results.Total
    CriticalCount = $results.Critical.Count
    HighCount = $results.High.Count
    CurrentCount = $results.Current.Count
    Critical = $results.Critical | ForEach-Object {
        @{
            Path = $_.File.FullName.Replace($projectRoot, "")
            Count = $_.Count
            Keywords = $_.Keywords
        }
    }
    High = $results.High | ForEach-Object {
        @{
            Path = $_.File.FullName.Replace($projectRoot, "")
            Count = $_.Count
            Keywords = $_.Keywords
        }
    }
}

# Ensure reports directory exists
$reportsDir = Join-Path $projectRoot "docs\reports"
if (-not (Test-Path $reportsDir)) {
    New-Item -Path $reportsDir -ItemType Directory -Force | Out-Null
}

$resultsPath = Join-Path $projectRoot "docs\reports\priority-analysis.json"
$saveResults | ConvertTo-Json -Depth 5 | Out-File $resultsPath -Encoding UTF8

Write-Host "💾 Full results saved to: docs/reports/priority-analysis.json" -ForegroundColor Green
Write-Host ""

# Create claude.md files for all wb-* components
# This ensures every component folder has a logging destination

$componentsPath = "components"
$components = Get-ChildItem -Path $componentsPath -Directory -Filter "wb-*"

$created = 0
$skipped = 0

foreach ($component in $components) {
    $claudePath = Join-Path $component.FullName "claude.md"
    
    if (Test-Path $claudePath) {
        Write-Host "✓ $($component.Name) already has claude.md" -ForegroundColor Gray
        $skipped++
    } else {
        $componentName = $component.Name
        $date = Get-Date -Format "yyyy-MM-dd"
        
        $template = @"
# $componentName - Development Log

**Component:** $componentName  
**Created:** $date  
**Last Updated:** $date

## Overview
This file tracks development progress, issues, fixes, and testing for the $componentName component.

---

## Issues

<!-- Issues will be logged here automatically -->

---

## Fixes

<!-- Fixes will be logged here automatically -->

---

## Tests

<!-- Test results will be logged here automatically -->

---

## Notes

<!-- General notes will be logged here automatically -->

---

## Session Logs

<!-- Session logs are appended below -->

"@
        
        Set-Content -Path $claudePath -Value $template -Encoding UTF8
        Write-Host "✅ Created claude.md for $componentName" -ForegroundColor Green
        $created++
    }
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "   Created: $created files" -ForegroundColor Green
Write-Host "   Skipped: $skipped files (already exist)" -ForegroundColor Gray
Write-Host "   Total components: $($components.Count)" -ForegroundColor White

Write-Host "`n✨ All component folders now have claude.md files!" -ForegroundColor Green
Write-Host "   Start logging with: logIssue(), logFix(), logTest(), logNote()" -ForegroundColor Yellow

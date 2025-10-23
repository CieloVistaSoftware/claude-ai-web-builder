#!/usr/bin/env pwsh
param([switch]$Force, [switch]$Fix)

$ProjectRoot = "C:\Users\jwpmi\Downloads\AI\wb"
$ComponentPath = Join-Path $ProjectRoot "components"
$SpecFile = Join-Path $ProjectRoot "docs\CLAUDE-MD-SPECIFICATION.md"
$ValidationReport = Join-Path $ProjectRoot "docs\status\claude-validation-report.md"

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  CLAUDE.MD VALIDATION & MIGRATION TOOL" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $SpecFile)) {
    Write-Host "ERROR: Specification file not found!" -ForegroundColor Red
    Write-Host "  Expected: $SpecFile" -ForegroundColor Red
    exit 1
}

$issues = @()
$warnings = @()
$validFiles = @()

$componentDirs = Get-ChildItem -Path $ComponentPath -Directory -Filter "wb-*" -ErrorAction SilentlyContinue

Write-Host "Validating $($componentDirs.Count) components..." -ForegroundColor Yellow
Write-Host ""

foreach ($dir in $componentDirs) {
    $componentName = $dir.Name
    $claudeFile = Get-ChildItem -Path $dir.FullName -Filter "*claude.md" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if (-not $claudeFile) {
        $issues += @{
            component = $componentName
            severity = "CRITICAL"
            message = "No claude.md file found"
        }
        Write-Host "  ✗ $componentName - MISSING FILE" -ForegroundColor Red
        continue
    }
    
    $content = Get-Content -Path $claudeFile.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) {
        $issues += @{
            component = $componentName
            severity = "CRITICAL"
            message = "Cannot read file"
        }
        Write-Host "  ✗ $componentName - READ ERROR" -ForegroundColor Red
        continue
    }
    
    $lines = @($content -split "`n")
    $lineCount = $lines.Count
    $hasIssues = $false
    
    # Check 1: Has header
    if ($content -notmatch "^# Component:") {
        $issues += @{
            component = $componentName
            severity = "HIGH"
            message = "Missing or wrong header format"
        }
        $hasIssues = $true
    }
    
    # Check 2: Has status line
    if ($content -notmatch "\*\*Status\*\*:\s*(✅|🟢|🟡|🔴|⚠️)") {
        $warnings += @{
            component = $componentName
            message = "Status indicator not in standard format"
        }
        $hasIssues = $true
    }
    
    # Check 3: Line count
    if ($lineCount -lt 150) {
        $warnings += @{
            component = $componentName
            message = "File too short ($lineCount lines, need 150+)"
        }
        $hasIssues = $true
    }
    
    # Check 4: Has required sections
    $requiredSections = @("Quick Summary", "Latest Update", "Current Status", "Testing Status")
    foreach ($section in $requiredSections) {
        if ($content -notmatch "## $section") {
            $issues += @{
                component = $componentName
                severity = "MEDIUM"
                message = "Missing section: $section"
            }
            $hasIssues = $true
        }
    }
    
    # Check 5: Date format
    if ($content -notmatch "(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+20\d{2}") {
        $warnings += @{
            component = $componentName
            message = "Date not in MMMM dd, YYYY format"
        }
        $hasIssues = $true
    }
    
    if ($hasIssues) {
        Write-Host "  ⚠️  $componentName - Has issues ($lineCount lines)" -ForegroundColor Yellow
    } else {
        Write-Host "  ✓ $componentName - Valid ($lineCount lines)" -ForegroundColor Green
        $validFiles += $componentName
    }
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  VALIDATION RESULTS" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Valid Files: $($validFiles.Count)/$($componentDirs.Count)" -ForegroundColor Green
Write-Host "Critical Issues: $(@($issues | Where-Object { $_.severity -eq 'CRITICAL' }).Count)" -ForegroundColor Red
Write-Host "High Issues: $(@($issues | Where-Object { $_.severity -eq 'HIGH' }).Count)" -ForegroundColor Yellow
Write-Host "Medium Issues: $(@($issues | Where-Object { $_.severity -eq 'MEDIUM' }).Count)" -ForegroundColor Cyan
Write-Host "Warnings: $($warnings.Count)" -ForegroundColor Gray
Write-Host ""

if ($issues.Count -gt 0) {
    Write-Host "CRITICAL & HIGH ISSUES:" -ForegroundColor Red
    foreach ($issue in ($issues | Where-Object { $_.severity -match "CRITICAL|HIGH" })) {
        Write-Host "  - $($issue.component): $($issue.message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Generate report
$report = "# Claude.md Validation Report`r`n`r`n"
$report += "Generated: $(Get-Date -Format 'MMMM dd, yyyy - HH:mm')`r`n"
$report += "Total Components: $($componentDirs.Count)`r`n"
$report += "Valid: $($validFiles.Count)`r`n"
$report += "Issues: $($issues.Count)`r`n"
$report += "Warnings: $($warnings.Count)`r`n`r`n"

$report += "## Summary`r`n`r`n"
$report += "- Valid Files: $($validFiles.Count)/$($componentDirs.Count)`r`n"
$report += "- Critical Issues: $(@($issues | Where-Object { $_.severity -eq 'CRITICAL' }).Count)`r`n"
$report += "- High Priority: $(@($issues | Where-Object { $_.severity -eq 'HIGH' }).Count)`r`n"
$report += "- Medium Priority: $(@($issues | Where-Object { $_.severity -eq 'MEDIUM' }).Count)`r`n"
$report += "- Warnings: $($warnings.Count)`r`n`r`n"

$report += "## Issues to Fix`r`n`r`n"
foreach ($issue in ($issues | Group-Object severity)) {
    $report += "### $($issue.Name) Issues ($($issue.Count))`r`n`r`n"
    foreach ($item in $issue.Group) {
        $report += "- **$($item.component)**: $($item.message)`r`n"
    }
    $report += "`r`n"
}

$report += "## Valid Components`r`n`r`n"
foreach ($valid in ($validFiles | Sort-Object)) {
    $report += "- ✅ $valid`r`n"
}

New-Item -ItemType Directory -Path (Split-Path $ValidationReport) -Force -ErrorAction SilentlyContinue | Out-Null
$report | Out-File -FilePath $ValidationReport -Encoding UTF8 -Force

Write-Host "Report saved: $ValidationReport" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review the validation report"
Write-Host "2. Fix critical issues first"
Write-Host "3. Use template at: /components/CLAUDE-MD-TEMPLATE.md"
Write-Host "4. Re-run validation to verify"
Write-Host ""

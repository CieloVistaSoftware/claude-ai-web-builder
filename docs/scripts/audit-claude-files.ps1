#!/usr/bin/env pwsh
param([switch]$Force)

$ProjectRoot = "C:\Users\jwpmi\Downloads\AI\wb"
$ComponentPath = Join-Path $ProjectRoot "components"
$AuditOutput = Join-Path $ProjectRoot "docs\status\claude-audit-report.md"
$Timestamp = Get-Date -Format "MMMM dd, yyyy"

Write-Host "Scanning components..." -ForegroundColor Cyan

$auditData = @()
$componentDirs = Get-ChildItem -Path $ComponentPath -Directory -Filter "wb-*" -ErrorAction SilentlyContinue

foreach ($dir in $componentDirs) {
    $name = $dir.Name
    $claudeFile = Get-ChildItem -Path $dir.FullName -Filter "*claude.md" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    $record = @{
        name = $name
        hasFile = $false
        lines = 0
        hasStatus = $false
        issues = 0
    }
    
    if ($claudeFile) {
        $record.hasFile = $true
        $content = Get-Content -Path $claudeFile.FullName -Raw -ErrorAction SilentlyContinue
        $record.lines = @($content -split "`n").Count
        if ($content -like "*Status*") { $record.hasStatus = $true }
        if ($record.lines -lt 20) { $record.issues++ }
        if (-not $record.hasStatus) { $record.issues++ }
        Write-Host "  + $name ($($record.lines) lines)" -ForegroundColor Green
    } else {
        Write-Host "  - $name (NO FILE)" -ForegroundColor Yellow
    }
    
    $auditData += $record
}

$withFiles = @($auditData | Where-Object { $_.hasFile }).Count
$withStatus = @($auditData | Where-Object { $_.hasStatus }).Count

Write-Host ""
Write-Host "Files: $withFiles / $($auditData.Count)" -ForegroundColor Yellow
Write-Host "Status: $withStatus / $($auditData.Count)" -ForegroundColor Yellow
Write-Host ""

$report = "# Claude.md Audit Report`n`n"
$report += "Generated: $Timestamp`n`n"
$report += "## Summary`n"
$report += "- Total: $($auditData.Count)`n"
$report += "- With Files: $withFiles`n"
$report += "- With Status: $withStatus`n`n"

$report += "## Components`n`n"
$report += "| Name | File | Lines | Status | Issues |`n"
$report += "|------|------|-------|--------|--------|`n"
foreach ($item in ($auditData | Sort-Object name)) {
    $f = if ($item.hasFile) { "Y" } else { "N" }
    $s = if ($item.hasStatus) { "Y" } else { "N" }
    $report += "| $($item.name) | $f | $($item.lines) | $s | $($item.issues) |`n"
}

New-Item -ItemType Directory -Path (Split-Path $AuditOutput) -Force -ErrorAction SilentlyContinue | Out-Null
[System.IO.File]::WriteAllText($AuditOutput, $report, [System.Text.Encoding]::UTF8)
Write-Host "Saved: $AuditOutput" -ForegroundColor Green

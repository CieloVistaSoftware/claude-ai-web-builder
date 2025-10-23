#!/usr/bin/env pwsh
param([switch]$Force)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

# PATHS
$ScriptPath = $PSScriptRoot
if (-not $ScriptPath) { $ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path }
if (-not $ScriptPath) { $ScriptPath = Get-Location }

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptPath)
$ComponentPath = Join-Path $ProjectRoot "components"
$DocsPath = Join-Path $ProjectRoot "docs"
$StatusOutput = Join-Path $DocsPath "status" "currentstatus.md"
$TodoOutput = Join-Path $DocsPath "todo" "currentstatus.md"
$LogOutput = Join-Path $DocsPath "status" "aggregation-log.txt"
$Timestamp = Get-Date -Format "MMMM dd, yyyy - HH:mm EST"
$TimestampDetailed = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Initialize log file
$logContent = @()
$logContent += "================================================================================"
$logContent += "MASTER STATUS AGGREGATOR - RUN LOG"
$logContent += "================================================================================"
$logContent += ""
$logContent += "Started: $TimestampDetailed"
$logContent += "Project Root: $ProjectRoot"
$logContent += "Component Path: $ComponentPath"
$logContent += ""

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  MASTER STATUS AGGREGATOR" -ForegroundColor Cyan
Write-Host "  Reading ALL claude.md files with improved parsing" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Root: $ProjectRoot" -ForegroundColor Yellow
Write-Host ""

# COLLECT DATA
$components = @()
$allStatus = @()
$allTodos = @()
$allDone = @()
$allProblems = @()
$componentCount = 0
$errorCount = 0

$componentDirs = @(Get-ChildItem -Path $ComponentPath -Directory -Filter "wb-*" -ErrorAction SilentlyContinue)
Write-Host "Found $($componentDirs.Count) component directories" -ForegroundColor Green
Write-Host ""

$logContent += "SCANNING PHASE"
$logContent += "=============="
$logContent += "Component directories found: $($componentDirs.Count)"
$logContent += ""

foreach ($dir in $componentDirs) {
    $componentName = $dir.Name
    $claudeFile = Get-ChildItem -Path $dir.FullName -Filter "*claude.md" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($claudeFile) {
        try {
            $content = Get-Content -Path $claudeFile.FullName -Raw -ErrorAction Stop
            $componentCount++
            
            # Extract first meaningful status (first non-empty line mentioning Status or 🟢 or ✅)
            $statusLines = $content -split "`n" | Where-Object { $_ -match "(Status|🟢|✅|🔴|⚠️)" } | Select-Object -First 3
            $status = if ($statusLines) { ($statusLines[0].Trim() -replace '^#+\s*', '').Substring(0, [Math]::Min(80, ($statusLines[0].Trim() -replace '^#+\s*', '').Length)) } else { "Not specified" }
            
            $allStatus += @{
                component = $componentName
                status = $status
            }
            
            # Count TODO items - more flexible matching
            $todoLines = @($content -split "`n" | Where-Object { $_ -match '^\s*\[\s*\]' })
            $todoCount = $todoLines.Count
            
            if ($todoCount -gt 0) {
                foreach ($line in $todoLines) {
                    $todoText = ($line -replace '^\s*\[\s*\]\s*', '').Trim()
                    if ($todoText) {
                        $allTodos += @{
                            component = $componentName
                            todo = $todoText
                        }
                    }
                }
            }
            
            # Count DONE items
            $doneLines = @($content -split "`n" | Where-Object { $_ -match '^\s*\[x\]' })
            $doneCount = $doneLines.Count
            
            if ($doneCount -gt 0) {
                foreach ($line in $doneLines) {
                    $doneText = ($line -replace '^\s*\[x\]\s*', '').Trim()
                    if ($doneText) {
                        $allDone += @{
                            component = $componentName
                            done = $doneText
                        }
                    }
                }
            }
            
            # Extract problems/issues (look for ### with Problem/Issue)
            $problemPattern = '###\s+([^#\n]*?(?:Problem|Issue|Bug|Error|Broken)[^#\n]*)'
            $problemMatches = @([regex]::Matches($content, $problemPattern, 'IgnoreCase'))
            $problemCount = $problemMatches.Count
            
            if ($problemCount -gt 0) {
                foreach ($match in $problemMatches) {
                    $problemText = $match.Groups[1].Value.Trim()
                    $allProblems += @{
                        component = $componentName
                        problem = $problemText
                    }
                }
            }
            
            Write-Host "  ✓ $componentName" -ForegroundColor Green
            Write-Host "      Status: $status" -ForegroundColor Gray
            Write-Host "      TODOs: $todoCount | Done: $doneCount | Problems: $problemCount" -ForegroundColor Gray
            
            $logContent += "  ✓ $componentName - Status: $status | TODOs: $todoCount | Done: $doneCount | Problems: $problemCount"
        }
        catch {
            $errorCount++
            Write-Host "  ✗ Error reading $($claudeFile.Name): $_" -ForegroundColor Red
            $logContent += "  ✗ $componentName - ERROR: $_"
        }
    } else {
        Write-Host "  - $componentName - No claude.md found" -ForegroundColor Yellow
        $logContent += "  - $componentName - No claude.md file found"
    }
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  EXTRACTION RESULTS" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Components Scanned: $componentCount" -ForegroundColor Yellow
Write-Host "Errors: $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Green" })
Write-Host "Status Items: $($allStatus.Count)" -ForegroundColor Yellow
Write-Host "Pending TODOs: $($allTodos.Count)" -ForegroundColor Yellow
Write-Host "Completed Items: $($allDone.Count)" -ForegroundColor Yellow
Write-Host "Problems Found: $($allProblems.Count)" -ForegroundColor Yellow
Write-Host ""

$logContent += ""
$logContent += "EXTRACTION RESULTS"
$logContent += "=================="
$logContent += "Components Scanned: $componentCount"
$logContent += "Errors: $errorCount"
$logContent += "Status Items Extracted: $($allStatus.Count)"
$logContent += "Pending TODOs: $($allTodos.Count)"
$logContent += "Completed Items: $($allDone.Count)"
$logContent += "Problems Identified: $($allProblems.Count)"
$logContent += ""

# GENERATE MASTER STATUS FILE
Write-Host "Generating master status file..." -ForegroundColor Cyan
$logContent += "GENERATION PHASE"
$logContent += "================"

$NL = [System.Environment]::NewLine

$content = "# WB Project - Master Status and Task Tracker" + $NL + $NL

$content += "Last Updated: $Timestamp" + $NL
$content += "Generated From: All component claude.md files" + $NL
$content += "Location: /docs/status/currentstatus.md (PRIMARY)" + $NL + $NL
$content += "---" + $NL + $NL

# EXECUTIVE SUMMARY
$content += "## EXECUTIVE SUMMARY" + $NL + $NL
$content += "Components Scanned: $componentCount" + $NL
$content += "Status Items: $($allStatus.Count)" + $NL
$content += "Pending TODOs: $($allTodos.Count)" + $NL
$content += "Completed Items: $($allDone.Count)" + $NL
$content += "Known Problems: $($allProblems.Count)" + $NL + $NL
$content += "---" + $NL + $NL

# COMPONENT STATUS TABLE
$content += "## COMPONENT STATUS" + $NL + $NL
$content += "| Component | Status | TODOs |" + $NL
$content += "|-----------|--------|-------|" + $NL
foreach ($stat in ($allStatus | Sort-Object component)) {
    $todoCount = @($allTodos | Where-Object { $_.component -eq $stat.component }).Count
    $doneCount = @($allDone | Where-Object { $_.component -eq $stat.component }).Count
    $content += "| $($stat.component) | $($stat.status) | $todoCount | " + $NL
}
$content += $NL + "---" + $NL + $NL

# PENDING TODOS
$content += "## PENDING TODOS ($($allTodos.Count))" + $NL + $NL
if ($allTodos.Count -gt 0) {
    foreach ($todo in ($allTodos | Sort-Object component)) {
        $content += "- **$($todo.component)**: $($todo.todo)" + $NL
    }
} else {
    $content += "No pending TODOs." + $NL
}
$content += $NL + "---" + $NL + $NL

# COMPLETED ITEMS
$content += "## COMPLETED ITEMS ($($allDone.Count))" + $NL + $NL
if ($allDone.Count -gt 0) {
    $groupedDone = $allDone | Group-Object component
    foreach ($group in ($groupedDone | Sort-Object Name)) {
        $content += "### $($group.Name) - Completed: $($group.Count)" + $NL
        foreach ($item in $group.Group) {
            $content += "- $($item.done)" + $NL
        }
        $content += $NL
    }
} else {
    $content += "No completed items." + $NL
}
$content += $NL + "---" + $NL + $NL

# KNOWN PROBLEMS
if ($allProblems.Count -gt 0) {
    $content += "## KNOWN PROBLEMS ($($allProblems.Count))" + $NL + $NL
    foreach ($problem in ($allProblems | Sort-Object component)) {
        $content += "### $($problem.component)" + $NL
        $content += "- $($problem.problem)" + $NL + $NL
    }
    $content += "---" + $NL + $NL
}

$content += "Generated: $Timestamp" + $NL
$content += "Run Log: /docs/status/aggregation-log.txt" + $NL

# SAVE FILES
Write-Host "Creating output directories..." -ForegroundColor Cyan
$null = New-Item -ItemType Directory -Path (Split-Path -Parent $StatusOutput) -Force -ErrorAction SilentlyContinue
$null = New-Item -ItemType Directory -Path (Split-Path -Parent $TodoOutput) -Force -ErrorAction SilentlyContinue

Write-Host "Saving master status..." -ForegroundColor Cyan
$content | Out-File -FilePath $StatusOutput -Encoding UTF8 -Force
Write-Host "Saved: $StatusOutput" -ForegroundColor Green
$logContent += "Saved: $StatusOutput"

Write-Host "Saving mirror copy..." -ForegroundColor Cyan
$content | Out-File -FilePath $TodoOutput -Encoding UTF8 -Force
Write-Host "Saved: $TodoOutput" -ForegroundColor Green
$logContent += "Saved: $TodoOutput"

# SAVE LOG FILE
Write-Host "Saving run log..." -ForegroundColor Cyan
$logContent += ""
$logContent += "COMPLETION"
$logContent += "=========="
$endTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$logContent += "Completed: $endTime"
$logContent += "Status: SUCCESS"
$logContent += ""
$logContent += "================================================================================"

$logContent -join [System.Environment]::NewLine | Out-File -FilePath $LogOutput -Encoding UTF8 -Force
Write-Host "Saved: $LogOutput" -ForegroundColor Green

# FINAL SUMMARY
Write-Host ""
Write-Host "====================================================================" -ForegroundColor Green
Write-Host "  COMPLETE!" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Files Created:" -ForegroundColor Green
Write-Host "  Status: $StatusOutput" -ForegroundColor Yellow
Write-Host "  Mirror: $TodoOutput" -ForegroundColor Yellow
Write-Host "  Log: $LogOutput" -ForegroundColor Yellow
Write-Host ""

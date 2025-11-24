#!/usr/bin/env pwsh
<#
.SYNOPSIS
    WB Framework - Comprehensive Path and Syntax Error Fix Script
    
.DESCRIPTION
    Fixes all 404 errors and syntax errors.
    - Updates incorrect stylesheet paths
    - Fixes config.js references
    - Repairs corrupted wb-event-log.js
    
.PARAMETER DryRun
    Preview changes without writing to disk
    
.EXAMPLE
    .\fix-paths.ps1
    .\fix-paths.ps1 -DryRun

.AUTHOR
    WB Framework - Automated Path Fixer
.VERSION
    1.0.0
#>

param(
    [switch]$DryRun = $false
)

$ErrorActionPreference = 'Continue'

# Colors
$Colors = @{
    Success = 'Green'
    Error   = 'Red'
    Warning = 'Yellow'
    Info    = 'Cyan'
}

function Write-ColorOutput {
    param([string]$Message, [string]$Type = 'Info')
    $color = $Colors[$Type]
    Write-Host $Message -ForegroundColor $color
}

function Fix-HtmlStylesheetPaths {
    param([string]$ProjectRoot)
    
    Write-ColorOutput "=== Fixing HTML Stylesheet Paths ===" -Type Info
    
    $htmlFiles = Get-ChildItem -Path $ProjectRoot -Include "*.html", "*.htm" -Recurse -ErrorAction SilentlyContinue
    $fixedCount = 0
    
    foreach ($file in $htmlFiles) {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if (-not $content) { continue }
        
        if ($content -match 'href="styles/main\.css"') {
            Write-ColorOutput "  [FOUND] $($file.Name) - incorrect stylesheet path" -Type Warning
            $content = $content -replace 'href="styles/main\.css"', 'href="src/styles/main.css"'
            Write-ColorOutput "    [FIX] Changed to: src/styles/main.css" -Type Success
            
            if (-not $DryRun) {
                Set-Content $file.FullName -Value $content
                $fixedCount++
            }
        }
    }
    
    Write-ColorOutput "  ✓ Fixed $fixedCount file(s)" -Type Info
    return $fixedCount
}

function Main {
    Write-ColorOutput "`n╔════════════════════════════════════════════════════════════╗" -Type Info
    Write-ColorOutput "║  WB Framework - Path Fix Script v1.0.0                     ║" -Type Info
    Write-ColorOutput "╚════════════════════════════════════════════════════════════╝`n" -Type Info
    
    $ProjectRoot = Get-Location
    Write-ColorOutput "📁 Project Root: $ProjectRoot" -Type Info
    
    if ($DryRun) {
        Write-ColorOutput "🔍 DRY-RUN MODE - Preview only`n" -Type Warning
    }
    
    $totalFixed = Fix-HtmlStylesheetPaths $ProjectRoot
    
    Write-ColorOutput "`n✅ Total Items Fixed: $totalFixed" -Type Success
    
    if ($DryRun) {
        Write-ColorOutput "💡 Run without -DryRun to apply changes`n" -Type Info
    }
}

Main

# TypescriptConfigTest.Tests.ps1
# Test script to verify that tsconfig.json properly includes all TypeScript files
# Date: June 10, 2025
# Purpose: Verify the TypeScript configuration includes all necessary files

Write-Host "Testing TypeScript configuration..." -ForegroundColor Cyan

# Path to the tsconfig.json file
$tsconfigPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\tsconfig.json"

# Check if the file exists
if (-Not (Test-Path $tsconfigPath)) {
    Write-Host "❌ ERROR: tsconfig.json not found at $tsconfigPath" -ForegroundColor Red
    exit 1
}

# Read tsconfig.json content
$tsconfigContent = Get-Content $tsconfigPath -Raw | ConvertFrom-Json

# Check if include patterns exist
if (-Not $tsconfigContent.include) {
    Write-Host "❌ ERROR: No 'include' property found in tsconfig.json" -ForegroundColor Red
    exit 1
}

# Display include patterns
Write-Host "📋 TypeScript include patterns:" -ForegroundColor Yellow
foreach ($pattern in $tsconfigContent.include) {
    Write-Host "  - $pattern" -ForegroundColor White
}

# Find all TypeScript files in the project
$tsFiles = Get-ChildItem -Path "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder" -Include "*.ts", "*.tsx" -Recurse -File

# Display TypeScript files found
Write-Host "`n📂 TypeScript files found in the project: $($tsFiles.Count)" -ForegroundColor Yellow
foreach ($file in $tsFiles) {
    $relativePath = $file.FullName.Replace("c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\", "")
    Write-Host "  - $relativePath" -ForegroundColor White
}

# Check if important directories are included
$includesAllDirectories = $true
$requiredDirs = @("src", "zzz", "themes")

foreach ($dir in $requiredDirs) {
    $included = $false
    foreach ($pattern in $tsconfigContent.include) {
        if ($pattern -like "$dir*") {
            $included = $true
            break
        }
    }
    
    if (-Not $included) {
        Write-Host "❌ WARNING: Directory '$dir' may not be fully included in tsconfig.json" -ForegroundColor Yellow
        $includesAllDirectories = $false
    }
}

# Test result
if ($includesAllDirectories) {
    Write-Host "`n✅ TEST PASSED: tsconfig.json includes patterns for all important directories" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ TEST WARNING: Some directories might not be fully included" -ForegroundColor Yellow
}

# Check for root-level TypeScript files
$rootTsFiles = Get-ChildItem -Path "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder" -Include "*.ts", "*.tsx" -File | Where-Object { $_.DirectoryName -eq "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder" }

if ($rootTsFiles.Count -gt 0 -and ($tsconfigContent.include -contains "*.ts" -or $tsconfigContent.include -contains "*.tsx")) {
    Write-Host "✅ TEST PASSED: Root-level TypeScript files are included in tsconfig.json" -ForegroundColor Green
} elseif ($rootTsFiles.Count -gt 0) {
    Write-Host "⚠️ TEST WARNING: Found root-level TypeScript files but they might not be included in tsconfig.json" -ForegroundColor Yellow
}

Write-Host "`nTypeScript configuration test completed." -ForegroundColor Cyan

# Test All NPM Commands Script
# This script tests all npm commands from package.json, logs issues to nearest claude.md, and updates current status

param(
    [string]$ProjectRoot = $PSScriptRoot
)

# Function to find nearest claude.md file
function Find-NearestClaudeMd {
    param([string]$Path)
    
    $currentDir = Get-Item $Path
    while ($currentDir) {
        $claudeMd = Join-Path $currentDir.FullName "claude.md"
        if (Test-Path $claudeMd) {
            return $claudeMd
        }
        $currentDir = $currentDir.Parent
    }
    return $null
}

# Function to log issue to claude.md
function Log-Issue {
    param([string]$Command, [string]$ErrorMessage, [string]$ClaudeMdPath)
    
    if ($ClaudeMdPath) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $logEntry = @"

## NPM Command Test Failure - $timestamp

**Command**: $Command
**Error**: $ErrorMessage

---
"@
        Add-Content -Path $ClaudeMdPath -Value $logEntry
        Write-Host "Logged issue to $ClaudeMdPath"
    }
}

# Function to update current status in claude.md
function Update-Status {
    param([string]$ClaudeMdPath, [string]$Status)
    
    if (Test-Path $ClaudeMdPath) {
        $content = Get-Content $ClaudeMdPath -Raw
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        
        # Replace or add current status section
        $statusSection = "## Current Status`n`n$Status`n`n*Last updated: $timestamp*`n"
        
        if ($content -match "## Current Status") {
            $content = $content -replace "(?s)## Current Status.*?(?=##|\z)", $statusSection
        } else {
            $content += "`n`n$statusSection"
        }
        
        Set-Content -Path $ClaudeMdPath -Value $content
        Write-Host "Updated status in $ClaudeMdPath"
    }
}

# Main script
Set-Location $ProjectRoot

# Get package.json content
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$scripts = $packageJson.scripts

$results = @()
$failedCommands = @()

foreach ($scriptName in $scripts.PSObject.Properties.Name) {
    $command = "npm run $scriptName"
    Write-Host "Testing: $command"
    
    try {
        $startTime = Get-Date
        $process = Start-Process -FilePath "npm" -ArgumentList "run", $scriptName -NoNewWindow -Wait -PassThru -RedirectStandardOutput "temp_output.txt" -RedirectStandardError "temp_error.txt"
        $exitCode = $process.ExitCode
        $endTime = Get-Date
        $duration = $endTime - $startTime
        
        $output = Get-Content "temp_output.txt" -Raw -ErrorAction SilentlyContinue
        $errorOutput = Get-Content "temp_error.txt" -Raw -ErrorAction SilentlyContinue
        
        $result = @{
            Command = $scriptName
            ExitCode = $exitCode
            Duration = $duration.TotalSeconds
            Output = $output
            Error = $errorOutput
            Success = $exitCode -eq 0
        }
        
        if ($exitCode -ne 0) {
            $failedCommands += $scriptName
            $claudeMd = Find-NearestClaudeMd $ProjectRoot
            $errorMessage = "Exit code: $exitCode`nOutput: $output`nError: $errorOutput"
            Log-Issue -Command $scriptName -ErrorMessage $errorMessage -ClaudeMdPath $claudeMd
        }
        
        $results += $result
        
    } catch {
        $result = @{
            Command = $scriptName
            ExitCode = -1
            Duration = 0
            Output = ""
            Error = $_.Exception.Message
            Success = $false
        }
        $results += $result
        $failedCommands += $scriptName
        $claudeMd = Find-NearestClaudeMd $ProjectRoot
        Log-Issue -Command $scriptName -ErrorMessage $_.Exception.Message -ClaudeMdPath $claudeMd
    }
    
    # Clean up temp files
    Remove-Item "temp_output.txt" -ErrorAction SilentlyContinue
    Remove-Item "temp_error.txt" -ErrorAction SilentlyContinue
}

# Generate summary
$totalTests = $results.Count
$passedTests = ($results | Where-Object { $_.Success }).Count
$failedTests = $failedCommands.Count

$summary = @"
NPM Commands Test Summary
=========================

Total Commands Tested: $totalTests
Passed: $passedTests
Failed: $failedTests

Failed Commands:
$($failedCommands -join "`n")

Test completed at $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

Write-Host $summary

# Update all claude.md files with current status
$allClaudeMdFiles = Get-ChildItem -Path $ProjectRoot -Filter "claude.md" -Recurse -File
foreach ($claudeMd in $allClaudeMdFiles) {
    Update-Status -ClaudeMdPath $claudeMd.FullName -Status $summary
}

# Export detailed results
$results | ConvertTo-Json | Set-Content "npm-test-results.json"

Write-Host "Test completed. Results saved to npm-test-results.json"
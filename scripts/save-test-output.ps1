#!/usr/bin/env pwsh

# Simple script to run npm test and save output to a file

Write-Host "Running npm test..." -ForegroundColor Cyan
Write-Host ""

# Run npm test and capture all output
$output = npm test 2>&1

# Save to file
$output | Out-File -FilePath "test-output.txt" -Force -Encoding UTF8

# Also display it
Write-Host $output

Write-Host ""
Write-Host "✅ Output saved to: test-output.txt" -ForegroundColor Green

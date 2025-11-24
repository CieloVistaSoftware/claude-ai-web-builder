#!/usr/bin/env pwsh

Write-Host "Running npm test and saving output..." -ForegroundColor Cyan
Write-Host ""

npm test 2>&1 | Tee-Object -FilePath "test-output-final.txt"

Write-Host ""
Write-Host "✅ Output saved to: test-output-final.txt" -ForegroundColor Green
Write-Host "You can now share this file with Claude" -ForegroundColor Green

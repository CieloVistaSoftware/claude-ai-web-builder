#!/usr/bin/env pwsh

Write-Host "Saving full test output..." -ForegroundColor Cyan
npm test 2>&1 | Tee-Object -FilePath "full-test-output.txt"

Write-Host ""
Write-Host "✅ Full output saved to: full-test-output.txt" -ForegroundColor Green

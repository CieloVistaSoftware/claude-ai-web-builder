#!/usr/bin/env pwsh

Write-Host "Running npm install..." -ForegroundColor Cyan
npm install --save-dev @playwright/test typescript ts-loader @types/node 2>&1 | Tee-Object -FilePath "install-output.txt"

Write-Host ""
Write-Host "Running npm test..." -ForegroundColor Cyan
npm test 2>&1 | Tee-Object -FilePath "test-output-2.txt"

Write-Host ""
Write-Host "✅ Outputs saved:" -ForegroundColor Green
Write-Host "   - install-output.txt" -ForegroundColor Gray
Write-Host "   - test-output-2.txt" -ForegroundColor Gray

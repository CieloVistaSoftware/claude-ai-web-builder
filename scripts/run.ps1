# Master script runner
param([string]$ScriptName)

if (-not $ScriptName) {
    Write-Host "Available scripts:" -ForegroundColor Yellow
    Get-ChildItem "scripts" -Filter "*.ps1" | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor White
    }
    Write-Host "`nUsage: .\run.ps1 scriptname.ps1" -ForegroundColor Cyan
    return
}

$scriptPath = "scripts\$ScriptName"

if (Test-Path $scriptPath) {
    Write-Host "Running $ScriptName..." -ForegroundColor Green
    & $scriptPath
} else {
    Write-Host "Script not found: $scriptPath" -ForegroundColor Red
}

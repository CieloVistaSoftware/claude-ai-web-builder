# SIMPLE ORGANIZATION SCRIPT - No syntax errors
# Run from scripts folder to organize everything

Write-Host "=== ORGANIZING FILES ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Create master runner script content as array (avoids here-string issues)
$runnerLines = @(
    '# Master script runner',
    'param([string]$ScriptName)',
    '',
    'if (-not $ScriptName) {',
    '    Write-Host "Available scripts:" -ForegroundColor Yellow',
    '    Get-ChildItem "scripts" -Filter "*.ps1" | ForEach-Object {',
    '        Write-Host "  - $($_.Name)" -ForegroundColor White',
    '    }',
    '    Write-Host "`nUsage: .\run.ps1 scriptname.ps1" -ForegroundColor Cyan',
    '    return',
    '}',
    '',
    '$scriptPath = "scripts\$ScriptName"',
    '',
    'if (Test-Path $scriptPath) {',
    '    Write-Host "Running $ScriptName..." -ForegroundColor Green',
    '    & $scriptPath',
    '} else {',
    '    Write-Host "Script not found: $scriptPath" -ForegroundColor Red',
    '}'
)

# Write the runner script
$runnerLines | Out-File -FilePath "run.ps1" -Encoding UTF8

Write-Host "✅ Created run.ps1 master runner" -ForegroundColor Green

# Show current structure
Write-Host "`nCurrent structure:" -ForegroundColor Yellow
Write-Host "wb/" -ForegroundColor Blue
Get-ChildItem | ForEach-Object {
    if ($_.PSIsContainer) {
        Write-Host "├── $($_.Name)/" -ForegroundColor Blue
        if ($_.Name -eq "scripts" -or $_.Name -eq "js") {
            Get-ChildItem $_.FullName | ForEach-Object {
                Write-Host "│   ├── $($_.Name)" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host "├── $($_.Name)" -ForegroundColor Green
    }
}

Write-Host "`n✅ ORGANIZATION COMPLETE!" -ForegroundColor Green
Write-Host "Use: .\run.ps1 to list scripts" -ForegroundColor Cyan
Write-Host "Use: .\run.ps1 scriptname.ps1 to run a script" -ForegroundColor Cyan

Read-Host "`nPress Enter to continue"
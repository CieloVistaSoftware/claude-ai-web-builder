$extensionPath = "C:\Users\jwpmi\Downloads\AI\wb\wb-component-navigator"
$workspacePath = "C:\Users\jwpmi\Downloads\AI\wb"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Launching WB Framework with Extension" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Extension Path: $extensionPath" -ForegroundColor Yellow
Write-Host "Workspace Path: $workspacePath" -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting VS Code..." -ForegroundColor Green

& code --extensionDevelopmentPath="$extensionPath" "$workspacePath"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ VS Code launched successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "The extension should now be active." -ForegroundColor White
    Write-Host "Look for 'WB COMPONENTS' in the sidebar." -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Failed to launch VS Code" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "1. VS Code is installed" -ForegroundColor White
    Write-Host "2. 'code' command is in PATH" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

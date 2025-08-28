# Tests/VerifyCopilotAutopiCleanup.ps1
# This script verifies that all Auto Copilot Continue artifacts have been removed

$artifactPaths = @(
    "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\AutoContinueCopilot.js",
    "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\Install-CopilotAutoContinue.ps1",
    "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\Tests\TestCopilotAutoContinue.ps1",
    "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\vscode-copilot-auto-continue"
)

$allRemoved = $true

foreach ($path in $artifactPaths) {
    if (Test-Path $path) {
        Write-Host "❌ Found artifact still present: $path" -ForegroundColor Red
        $allRemoved = $false
    }
}

if ($allRemoved) {
    Write-Host "✅ All Auto Copilot Continue artifacts have been successfully removed!" -ForegroundColor Green
} else {
    Write-Host "❌ Some artifacts are still present. Please remove them manually." -ForegroundColor Red
}

# Also check if there are any files with "copilot" and "continue" in their names
$copilotFiles = Get-ChildItem -Path "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder" -Recurse | 
    Where-Object { $_.Name -like "*copilot*" -and $_.Name -like "*continue*" } |
    Select-Object -ExpandProperty FullName

if ($copilotFiles.Count -gt 0) {
    Write-Host "Found additional related files:" -ForegroundColor Yellow
    foreach ($file in $copilotFiles) {
        Write-Host "  - $file" -ForegroundColor Yellow
    }
} else {
    Write-Host "No additional related files found." -ForegroundColor Green
}

# Check for vsix files
$vsixFiles = Get-ChildItem -Path "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder" -Recurse -Filter "*.vsix" | 
    Select-Object -ExpandProperty FullName

if ($vsixFiles.Count -gt 0) {
    Write-Host "Found VSIX packages:" -ForegroundColor Yellow
    foreach ($file in $vsixFiles) {
        Write-Host "  - $file" -ForegroundColor Yellow
    }
} else {
    Write-Host "No VSIX packages found." -ForegroundColor Green
}

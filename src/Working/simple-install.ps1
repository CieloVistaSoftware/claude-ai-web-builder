# simple-install.ps1
# This script performs the essential steps for the modular structure setup

# Define paths
$workingDir = "c:\Users\jwpmi\Downloads\AI\wb\Working"

# Create a backup of the current Working directory
Write-Host "📦 Creating backup of current Working directory..."
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "c:\Users\jwpmi\Downloads\AI\wb\Working_backup_$timestamp"
Copy-Item -Path $workingDir -Destination $backupDir -Recurse
Write-Host "✅ Backup created at: $backupDir"

# Update the paths to ControlPanelContent.html
Write-Host "📝 Updating control panel paths..."
if (Test-Path "$workingDir\script.js") {
    $scriptContent = Get-Content -Path "$workingDir\script.js" -Raw
    $updatedScriptContent = $scriptContent -replace 'fetch\("\.\/ControlPanelContent\.html"\)', 'fetch("./components/control-panel/ControlPanelContent.html")'
    Set-Content -Path "$workingDir\script.js" -Value $updatedScriptContent
    Write-Host "✅ Updated control panel paths in script.js"
}

# If the ControlPanelContent.html exists in the root, move it to the components directory
if (Test-Path "$workingDir\ControlPanelContent.html") {
    # First ensure the components directory exists
    if (-not (Test-Path "$workingDir\components\control-panel")) {
        New-Item -Path "$workingDir\components\control-panel" -ItemType Directory -Force | Out-Null
        Write-Host "✅ Created components/control-panel directory"
    }
    Copy-Item -Path "$workingDir\ControlPanelContent.html" -Destination "$workingDir\components\control-panel\ControlPanelContent.html" -Force
    Remove-Item "$workingDir\ControlPanelContent.html"
    Write-Host "✅ Moved ControlPanelContent.html to components/control-panel directory"
}

Write-Host @"

✅ Installation complete!

The control panel content has been moved to the components/control-panel directory.
All references have been updated in script.js.

A backup of your original files is available at: $backupDir
"@

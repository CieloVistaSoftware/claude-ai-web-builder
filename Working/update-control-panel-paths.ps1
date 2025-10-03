# Fix Control Panel Content Path

# This script updates references to ControlPanelContent.html to use the new modular structure
$scriptPath = "script.js"

Write-Host "📝 Updating control panel content path in script.js..."

# Read the script file
$content = Get-Content -Path $scriptPath -Raw

# Replace the path to ControlPanelContent.html
$updatedContent = $content -replace 'fetch\("\.\/ControlPanelContent\.html"\)', 'fetch("./components/control-panel/ControlPanelContent.html")'

# Write the updated content back to the file
Set-Content -Path $scriptPath -Value $updatedContent

Write-Host "✅ Path updated successfully!"

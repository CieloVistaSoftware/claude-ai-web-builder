# Move all .js files to js folder - PowerShell version

Write-Host "Creating js folder and moving .js files..." -ForegroundColor Yellow

# Create js folder if it doesn't exist
if (!(Test-Path "js")) {
    New-Item -ItemType Directory -Name "js"
    Write-Host "Created js folder" -ForegroundColor Green
}

# Get all .js files in current directory
$jsFiles = Get-ChildItem -Filter "*.js" -File

foreach ($file in $jsFiles) {
    $destination = "js\$($file.Name)"
    Move-Item $file.FullName $destination -Force
    Write-Host "Moved: $($file.Name) -> js/$($file.Name)" -ForegroundColor Cyan
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
Write-Host "`nFolder structure:" -ForegroundColor Yellow
Write-Host "- wb.html (main file)" -ForegroundColor Green
Write-Host "- wb.css (styles)" -ForegroundColor Green
Write-Host "- js/ (folder containing all JavaScript files)" -ForegroundColor Green

Write-Host "`nFiles in js folder:" -ForegroundColor Cyan
Get-ChildItem "js" -Filter "*.js" | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor White }

Write-Host "`nDon't forget to update wb.html script references!" -ForegroundColor Yellow
Read-Host "`nPress Enter to continue"
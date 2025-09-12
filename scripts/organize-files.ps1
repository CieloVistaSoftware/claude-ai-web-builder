# Move .js files and update HTML references - PowerShell version

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

Write-Host "`nUpdating wb.html script references..." -ForegroundColor Yellow

# Update wb.html to reference js folder
if (Test-Path "wb.html") {
    $htmlContent = Get-Content "wb.html" -Raw
    
    # Update script src paths to include js/ folder
    $htmlContent = $htmlContent -replace 'src="([^"]*\.js)"', 'src="js/$1"'
    $htmlContent = $htmlContent -replace 'src="js/js/', 'src="js/'  # Fix double js/ paths
    
    Set-Content "wb.html" $htmlContent
    Write-Host "Updated wb.html script references" -ForegroundColor Green
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
Write-Host "`nNew folder structure:" -ForegroundColor Yellow
Write-Host "- wb.html (updated with js/ references)" -ForegroundColor Green
Write-Host "- wb.css (styles)" -ForegroundColor Green
Write-Host "- js/ (folder containing all JavaScript files)" -ForegroundColor Green

Write-Host "`nFiles in js folder:" -ForegroundColor Cyan
Get-ChildItem "js" -Filter "*.js" | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor White }

Write-Host "`nReady to test wb.html!" -ForegroundColor Yellow
Read-Host "`nPress Enter to continue"
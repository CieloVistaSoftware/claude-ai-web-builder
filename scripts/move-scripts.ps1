# Move all .ps1 files to scripts folder - PowerShell version

Write-Host "Creating scripts folder and moving .ps1 files..." -ForegroundColor Yellow

# Create scripts folder if it doesn't exist
if (!(Test-Path "scripts")) {
    New-Item -ItemType Directory -Name "scripts"
    Write-Host "Created scripts folder" -ForegroundColor Green
}

# Get all .ps1 files in current directory (except this one)
$ps1Files = Get-ChildItem -Filter "*.ps1" -File | Where-Object { $_.Name -ne "move-scripts.ps1" }

foreach ($file in $ps1Files) {
    $destination = "scripts\$($file.Name)"
    Move-Item $file.FullName $destination -Force
    Write-Host "Moved: $($file.Name) -> scripts/$($file.Name)" -ForegroundColor Cyan
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
Write-Host "`nNew folder structure:" -ForegroundColor Yellow
Write-Host "- wb.html" -ForegroundColor Green
Write-Host "- wb.css" -ForegroundColor Green
Write-Host "- js/ (JavaScript files)" -ForegroundColor Green
Write-Host "- scripts/ (PowerShell scripts)" -ForegroundColor Green

Write-Host "`nFiles in scripts folder:" -ForegroundColor Cyan
if (Test-Path "scripts") {
    Get-ChildItem "scripts" -Filter "*.ps1" | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor White }
}

Write-Host "`nTo run scripts, use: .\scripts\scriptname.ps1" -ForegroundColor Yellow
Read-Host "`nPress Enter to continue"
# FINAL CONSOLIDATION - MOVE ALL FOLDERS TO src/
# Run this in PowerShell and your root will be CLEAN!

cd C:\Users\jwpmi\Downloads\AI\wb

Write-Host "Moving all source folders to src/..." -ForegroundColor Cyan

# Move all folders to src/
$folders = @("cg", "demos", "howto", "html", "js", "layouts", "scripts", "server", "styles", "templates", "tools", "ui", "utils", "wb-chatbot", "Working", "componentslayout", "config", "archive")

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        $dest = "src\$folder"
        robocopy $folder $dest /E /MOVE | Out-Null
        Write-Host "✅ Moved: $folder → src/" -ForegroundColor Green
    }
}

Write-Host "`nVerifying root..." -ForegroundColor Cyan

$files = Get-ChildItem -File
$dirs = Get-ChildItem -Directory | Where-Object { $_.Name -ne "node_modules" }

Write-Host "`nFiles in root: $($files.Count)" -ForegroundColor Green
$files | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Green }

Write-Host "`nDirectories in root:" -ForegroundColor Green
$dirs | ForEach-Object { Write-Host "  - $($_.Name)/" -ForegroundColor Green }

Write-Host "`n✅ DONE! Root is now clean!" -ForegroundColor Cyan
Write-Host "Commit with: git add . && git commit -m 'refactor: consolidated all folders to src'" -ForegroundColor Yellow

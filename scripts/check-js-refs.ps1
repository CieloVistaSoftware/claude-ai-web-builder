# Check all .js references in wb.html - PowerShell version

Write-Host "Checking JavaScript references in wb.html..." -ForegroundColor Yellow

if (Test-Path "wb.html") {
    $htmlContent = Get-Content "wb.html" -Raw
    
    # Find all script src references
    $scriptMatches = [regex]::Matches($htmlContent, 'src="([^"]*\.js)"')
    
    Write-Host "`nFound JavaScript references:" -ForegroundColor Cyan
    
    $allCorrect = $true
    foreach ($match in $scriptMatches) {
        $fullPath = $match.Groups[1].Value
        Write-Host "- $fullPath" -ForegroundColor White
        
        # Check if it starts with js/
        if (-not $fullPath.StartsWith("js/")) {
            Write-Host "  ❌ Should be: js/$fullPath" -ForegroundColor Red
            $allCorrect = $false
        } else {
            Write-Host "  ✅ Correct" -ForegroundColor Green
        }
    }
    
    if ($allCorrect) {
        Write-Host "`n✅ All JavaScript references are correct!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Some references need fixing" -ForegroundColor Red
    }
    
    # Check if js folder exists and what files are in it
    if (Test-Path "js") {
        Write-Host "`nFiles in js folder:" -ForegroundColor Cyan
        Get-ChildItem "js" -Filter "*.js" | ForEach-Object { 
            Write-Host "  - $($_.Name)" -ForegroundColor White 
        }
    } else {
        Write-Host "`n❌ js folder doesn't exist yet!" -ForegroundColor Red
    }
    
} else {
    Write-Host "❌ wb.html not found!" -ForegroundColor Red
}

Read-Host "`nPress Enter to continue"
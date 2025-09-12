# Check if pages folder is still needed - PowerShell version

Write-Host "Analyzing pages folder..." -ForegroundColor Yellow

if (Test-Path "pages") {
    Write-Host "`nContents of pages folder:" -ForegroundColor Cyan
    Get-ChildItem "pages" -Recurse | ForEach-Object { 
        if ($_.PSIsContainer) {
            Write-Host "  📁 $($_.Name)/" -ForegroundColor Blue
        } else {
            Write-Host "  📄 $($_.Name)" -ForegroundColor White
        }
    }
    
    # Check if wb.html references pages folder
    if (Test-Path "wb.html") {
        $htmlContent = Get-Content "wb.html" -Raw
        $pagesRefs = [regex]::Matches($htmlContent, 'pages/')
        
        if ($pagesRefs.Count -gt 0) {
            Write-Host "`n❌ wb.html still references pages folder:" -ForegroundColor Red
            foreach ($match in $pagesRefs) {
                $line = ($htmlContent.Substring(0, $match.Index).Split("`n")).Count
                Write-Host "  Line $line" -ForegroundColor Gray
            }
        } else {
            Write-Host "`n✅ wb.html does NOT reference pages folder" -ForegroundColor Green
        }
    }
    
    # Check if any js files reference pages folder
    if (Test-Path "js") {
        $jsFiles = Get-ChildItem "js" -Filter "*.js"
        $foundRefs = $false
        
        foreach ($jsFile in $jsFiles) {
            $jsContent = Get-Content $jsFile.FullName -Raw
            $pagesRefs = [regex]::Matches($jsContent, 'pages/')
            
            if ($pagesRefs.Count -gt 0) {
                if (-not $foundRefs) {
                    Write-Host "`n❌ JavaScript files reference pages folder:" -ForegroundColor Red
                    $foundRefs = $true
                }
                Write-Host "  - $($jsFile.Name)" -ForegroundColor Gray
            }
        }
        
        if (-not $foundRefs) {
            Write-Host "`n✅ JavaScript files do NOT reference pages folder" -ForegroundColor Green
        }
    }
    
    Write-Host "`n🤔 RECOMMENDATION:" -ForegroundColor Yellow
    if ($pagesRefs.Count -eq 0 -and -not $foundRefs) {
        Write-Host "✅ SAFE TO DELETE - No references found" -ForegroundColor Green
        Write-Host "The pages folder appears to be unused legacy code." -ForegroundColor Gray
    } else {
        Write-Host "❌ DO NOT DELETE - Still referenced in code" -ForegroundColor Red
        Write-Host "Remove references first, then delete." -ForegroundColor Gray
    }
    
} else {
    Write-Host "✅ pages folder doesn't exist" -ForegroundColor Green
}

Read-Host "`nPress Enter to continue"
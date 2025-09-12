# Check wb.html for import button and fix if missing
# Run from scripts folder

Write-Host "=== CHECKING WB.HTML FOR IMPORT BUTTON ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Find wb.html file
Write-Host "`n🔍 Looking for wb.html file..." -ForegroundColor Blue

$wbHtmlLocations = @(
    "wb.html",
    "wb\wb.html",
    "wb\wb-current.html",
    "wb\wb-clean.html"
)

$foundWbHtml = $null

foreach ($location in $wbHtmlLocations) {
    if (Test-Path $location) {
        $foundWbHtml = $location
        Write-Host "  ✅ Found wb.html at: $location" -ForegroundColor Green
        break
    }
}

if (-not $foundWbHtml) {
    Write-Host "  ❌ wb.html not found in expected locations" -ForegroundColor Red
    Write-Host "Available HTML files:" -ForegroundColor Yellow
    Get-ChildItem -Recurse -Filter "*.html" | ForEach-Object {
        Write-Host "  📄 $($_.FullName)" -ForegroundColor Gray
    }
    Read-Host "Press Enter to continue"
    return
}

# Check content of wb.html
Write-Host "`n📄 Checking content of $foundWbHtml..." -ForegroundColor Blue

try {
    $content = Get-Content $foundWbHtml -Raw -Encoding UTF8
    
    # Check for import button
    $hasImportBtn = $content -match 'importBtn|Import.*Website|import.*button'
    $hasImportScript = $content -match 'wb-import-simple\.js|import.*script'
    
    Write-Host "`nImport functionality check:" -ForegroundColor Yellow
    Write-Host "  Import button present: $(if($hasImportBtn){'✅ YES'}else{'❌ NO'})" -ForegroundColor $(if($hasImportBtn){'Green'}else{'Red'})
    Write-Host "  Import script referenced: $(if($hasImportScript){'✅ YES'}else{'❌ NO'})" -ForegroundColor $(if($hasImportScript){'Green'}else{'Red'})
    
    # Show relevant parts of the file
    if ($hasImportBtn) {
        Write-Host "`n✅ Import button found in file!" -ForegroundColor Green
        
        # Extract lines around import button
        $lines = $content -split "`n"
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match 'importBtn|Import.*Website') {
                Write-Host "`nImport button section (around line $($i+1)):" -ForegroundColor Cyan
                $start = [Math]::Max(0, $i-2)
                $end = [Math]::Min($lines.Count-1, $i+5)
                for ($j = $start; $j -le $end; $j++) {
                    $prefix = if ($j -eq $i) { ">>> " } else { "    " }
                    Write-Host "$prefix$($lines[$j])" -ForegroundColor Gray
                }
                break
            }
        }
    } else {
        Write-Host "`n❌ Import button NOT found! Let me add it..." -ForegroundColor Red
        
        # Find a good place to add the import button (after opening body tag or in a container)
        $insertAfter = ""
        if ($content -match '<div class="container[^"]*"[^>]*>') {
            $insertAfter = $matches[0]
        } elseif ($content -match '<body[^>]*>') {
            $insertAfter = $matches[0]
        } else {
            Write-Host "  ⚠️  Could not find good insertion point" -ForegroundColor Yellow
        }
        
        if ($insertAfter) {
            $importButtonHtml = @"
    
    <!-- Import Website Button -->
    <div class="mb-3">
        <button id="importBtn" class="btn btn-info">
            📁 Import Existing Website
        </button>
    </div>
    <div id="importStatus" class="alert alert-info" style="display: none;"></div>
"@
            
            $newContent = $content -replace [regex]::Escape($insertAfter), "$insertAfter$importButtonHtml"
            Set-Content $foundWbHtml -Value $newContent -Encoding UTF8
            Write-Host "  ✅ Added import button to $foundWbHtml" -ForegroundColor Green
        }
    }
    
    # Check script references
    if (-not $hasImportScript) {
        Write-Host "`n❌ Import script reference missing! Let me add it..." -ForegroundColor Red
        
        # Add script reference before closing body tag
        $scriptTag = '    <script src="js/wb-import-simple.js"></script>'
        
        if ($content -match '</body>') {
            $newContent = $content -replace '</body>', "$scriptTag`n</body>"
            Set-Content $foundWbHtml -Value $newContent -Encoding UTF8
            Write-Host "  ✅ Added import script reference" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Could not find </body> tag to add script" -ForegroundColor Yellow
        }
    }
    
} catch {
    Write-Host "  ❌ Error reading $foundWbHtml : $($_.Exception.Message)" -ForegroundColor Red
}

# Verify import script file exists
Write-Host "`n📜 Checking for import script file..." -ForegroundColor Blue

$importScriptLocations = @(
    "js\wb-import-simple.js",
    "wb-import-simple.js"
)

$foundImportScript = $null
foreach ($location in $importScriptLocations) {
    if (Test-Path $location) {
        $foundImportScript = $location
        Write-Host "  ✅ Found import script at: $location" -ForegroundColor Green
        break
    }
}

if (-not $foundImportScript) {
    Write-Host "  ❌ Import script not found!" -ForegroundColor Red
    Write-Host "  Available JS files:" -ForegroundColor Yellow
    Get-ChildItem -Recurse -Filter "*import*.js" | ForEach-Object {
        Write-Host "    📜 $($_.FullName)" -ForegroundColor Gray
    }
}

Write-Host "`n✅ IMPORT BUTTON CHECK COMPLETE!" -ForegroundColor Green

Write-Host "`nStatus Summary:" -ForegroundColor Yellow
Write-Host "  📄 wb.html location: $foundWbHtml" -ForegroundColor Cyan
Write-Host "  🔘 Import button: $(if($hasImportBtn){'Present'}else{'Added/Missing'})" -ForegroundColor $(if($hasImportBtn){'Green'}else{'Yellow'})
Write-Host "  📜 Import script: $(if($foundImportScript){'Found at ' + $foundImportScript}else{'Missing'})" -ForegroundColor $(if($foundImportScript){'Green'}else{'Red'})

Read-Host "Press Enter to continue"
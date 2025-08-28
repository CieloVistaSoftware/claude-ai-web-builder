# Fix Playwright Test Paths for wb.html
# This script updates all Playwright test files to use the correct path to wb.html

Write-Host '🔍 Fixing Playwright test paths for wb.html...' -ForegroundColor Cyan

$testDir = Join-Path $PSScriptRoot 'Tests\playwright'
$testFiles = Get-ChildItem -Path $testDir -Filter '*.spec.ts' -Recurse

$totalChanges = 0

foreach ($file in $testFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Track changes for this file
    $fileChanged = $false
    $changes = 0
    
    # Fix pattern: "./wb.html" to "/wb/wb.html"
    if ($content -match '\.\/wb\.html') {
        $oldContent = $content
        $content = $content -replace '\.\/wb\.html', '/wb/wb.html'
        if ($oldContent -ne $content) {
            $fileChanged = $true
            $changes += ($content -split '\.\/wb\.html').Count - 1
        }
    }
    
    # Fix pattern: "/wb.html" to "/wb/wb.html"
    if ($content -match '[^\/]\/wb\.html') {
        $oldContent = $content
        $content = $content -replace '([^\/])\/wb\.html', '$1/wb/wb.html'
        if ($oldContent -ne $content) {
            $fileChanged = $true
            $changes += ($oldContent -split '\/wb\.html').Count - ($content -split '\/wb\.html').Count
        }
    }
    
    # Fix pattern: "wb.html" to "/wb/wb.html"
    if ($content -match '"wb\.html"') {
        $oldContent = $content
        $content = $content -replace '"wb\.html"', '"/wb/wb.html"'
        if ($oldContent -ne $content) {
            $fileChanged = $true
            $changes += ($content -split '"wb\.html"').Count - 1
        }
    }
    
    # Fix pattern: request.get('/wb.html') to request.get('/wb/wb.html')
    if ($content -match 'request\.get\(["'']\/wb\.html["'']\)') {
        $oldContent = $content
        $content = $content -replace 'request\.get\((["''])\/wb\.html(["''])\)', 'request.get($1/wb/wb.html$2)'
        if ($oldContent -ne $content) {
            $fileChanged = $true
            $changes += ($oldContent -split 'request\.get\(["'']\/wb\.html["'']\)').Count - ($content -split 'request\.get\(["'']\/wb\.html["'']\)').Count
        }
    }
    
    if ($fileChanged) {
        # Create backup of the original file
        $backupPath = "$($file.FullName).backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Copy-Item -Path $file.FullName -Destination $backupPath
        
        # Write updated content to file
        Set-Content -Path $file.FullName -Value $content
        
        $totalChanges += $changes
        Write-Host "✅ Updated $($file.Name): $changes references fixed" -ForegroundColor Green
    }
}

Write-Host "`n🎉 Fix complete! $totalChanges references to wb.html updated across all test files." -ForegroundColor Yellow

# Add entry to fixes.md
$timestamp = Get-Date -Format 'yyyy-MM-dd'
$fixesPath = Join-Path $PSScriptRoot 'docs\fixes.md'
$fixesContent = Get-Content -Path $fixesPath -Raw

$newFix = @"
## $timestamp - Playwright Test Path Fixes

### Changes Made:

1. **Fixed wb.html Path References in Tests**
   - Updated all Playwright tests to use the correct path to wb.html
   - Changed references from `/wb.html` and `./wb.html` to `/wb/wb.html`
   - Fixed request methods to use the correct path
   - Added consistency across all test files for better reliability
   - Total of $totalChanges path references updated

"@

$fixesContent = $newFix + $fixesContent
Set-Content -Path $fixesPath -Value $fixesContent

Write-Host '📝 Updated fixes.md with the changes' -ForegroundColor Green

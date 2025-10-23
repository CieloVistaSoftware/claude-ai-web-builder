# generate-demos-manifest.ps1
# PowerShell script to scan for all *demo*.html files and generate manifest
# Run with: .\generate-demos-manifest.ps1

$componentsDir = $PSScriptRoot
$outputFile = Join-Path $componentsDir "demos-manifest.json"

Write-Host "🔍 Scanning for demo files..." -ForegroundColor Cyan

# Find all HTML files containing 'demo' in their name
$demoFiles = Get-ChildItem -Path $componentsDir -Recurse -Filter "*.html" | 
    Where-Object { $_.Name -like "*demo*" -and $_.DirectoryName -notlike "*node_modules*" }

$demos = @()

foreach ($file in $demoFiles) {
    $relativePath = $file.FullName.Substring($componentsDir.Length + 1).Replace('\', '/')
    $componentName = Split-Path (Split-Path $relativePath -Parent) -Leaf
    
    # Format component name
    $displayName = ($componentName -split '-' | ForEach-Object { 
        $_.Substring(0,1).ToUpper() + $_.Substring(1) 
    }) -join ' '
    
    # Format demo name
    $demoName = $file.BaseName
    if ($demoName -like "*demo-clean*") { $demoName = "Clean Demo" }
    elseif ($demoName -like "*demo-simple*") { $demoName = "Simple Demo" }
    elseif ($demoName -like "*demo-test*") { $demoName = "Test Demo" }
    elseif ($demoName -like "*-demo") { $demoName = "Demo" }
    
    $demos += @{
        path = $relativePath
        component = $componentName
        filename = $file.Name
        displayName = $displayName
        demoName = $demoName
    }
}

# Sort by component name
$demos = $demos | Sort-Object -Property component

# Create manifest object
$manifest = @{
    generated = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    count = $demos.Count
    demos = $demos
}

# Save to JSON
$manifest | ConvertTo-Json -Depth 10 | Set-Content -Path $outputFile -Encoding UTF8

Write-Host "✅ Found $($demos.Count) demo files" -ForegroundColor Green
Write-Host "📝 Manifest saved to: $outputFile" -ForegroundColor Green

# Print summary
$componentCount = ($demos | Select-Object -Property component -Unique).Count
Write-Host "📦 Components with demos: $componentCount" -ForegroundColor Yellow

# Print first few demos as examples
Write-Host "`n📋 Sample demos found:" -ForegroundColor Cyan
$demos | Select-Object -First 5 | ForEach-Object {
    Write-Host "   - $($_.displayName): $($_.path)" -ForegroundColor Gray
}
if ($demos.Count -gt 5) {
    Write-Host "   ... and $($demos.Count - 5) more" -ForegroundColor Gray
}

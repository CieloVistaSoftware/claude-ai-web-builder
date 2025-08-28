# Simple script to check if HTML files are using new-wb.js
$wbPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\wb.html"
$fixedWbPath = "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\fixed-wb.html"

$wbContent = Get-Content -Path $wbPath -Raw
$fixedWbContent = Get-Content -Path $fixedWbPath -Raw

$wbUsesNewJs = $wbContent -match 'new-wb\.js'
$fixedWbUsesNewJs = $fixedWbContent -match 'new-wb\.js'

Write-Host "wb.html using new-wb.js: $wbUsesNewJs"
Write-Host "fixed-wb.html using new-wb.js: $fixedWbUsesNewJs"

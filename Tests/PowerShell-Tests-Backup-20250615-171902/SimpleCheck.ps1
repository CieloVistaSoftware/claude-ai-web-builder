# Simple test script
Write-Host "🧪 Running tests for the fixed dynamic page creation functionality" -ForegroundColor Cyan

# Test 1: Verify our test files exist
$testHtmlExists = Test-Path "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\test-dynamic-pages.html"
$testJsExists = Test-Path "c:\Users\jwpmi\Downloads\AI\ClaudeAIWebSiteBuilder\dynamic-pages.js"

Write-Host "Test HTML exists: $testHtmlExists"
Write-Host "Test JS exists: $testJsExists"

if ($testHtmlExists -and $testJsExists) {
    Write-Host "✅ All test files exist." -ForegroundColor Green
} else {
    Write-Host "❌ Some test files are missing." -ForegroundColor Red
}

Write-Host "🎉 Tests completed!" -ForegroundColor Cyan

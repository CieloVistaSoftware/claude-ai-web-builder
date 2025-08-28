# Test-MCPOutputSite.ps1
# Tests the MCP API by generating a site, saving the output, and testing the HTML

Write-Host "MCP Website Output Test" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

# Create output directory if it doesn't exist
$outputDir = "mcp-output"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "Created output directory: $outputDir" -ForegroundColor Yellow
}

# Define function to create nested directories
function Create-DirectoryIfNotExists {
    param([string]$path)
    
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created directory: $path" -ForegroundColor Yellow
    }
}

# Test if server is running
try {
    Write-Host "Checking if server is running..." -ForegroundColor Gray
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:8000/mcp/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Server is running with status: $($healthCheck.status)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Server is not running. Please start the server first with: npm run server" -ForegroundColor Red
    exit
}

# Generate website from MCP API
try {
    Write-Host "`nGenerating website from MCP API..." -ForegroundColor Cyan
    
    # Construct the payload
    $payload = @{
        toolName = "claude-ai-website-builder"
        website = @{
            type = "portfolio"
            features = @("table-theme", "theme-generator", "responsive-design")
        }
        content = @{
            title = "MCP Test Portfolio"
            description = "This site was automatically generated and tested by the MCP API Test Script"
        }
        output = @{
            format = "files"
        }
        customization = @{
            primaryColor = "#4f46e5"
            secondaryColor = "#f8fafc"
            accentColor = "#10b981"
        }
    } | ConvertTo-Json -Depth 5
    
    # Send request to generate website
    Write-Host "Sending request to MCP API..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:8000/mcp/generate" -Method Post -Body $payload -ContentType "application/json"
    
    # Check response
    if ($response.success -eq $true -and $response.files.Count -gt 0) {
        Write-Host "✅ Website generation successful!" -ForegroundColor Green
        Write-Host "Generated $($response.files.Count) files" -ForegroundColor Green
    } else {
        Write-Host "❌ Website generation failed or returned no files" -ForegroundColor Red
        exit
    }
    
    # Save all files to output directory
    Write-Host "`nSaving generated files to $outputDir..." -ForegroundColor Cyan
    
    # Track files for testing
    $htmlFiles = @()
    $cssFiles = @()
    $jsFiles = @()
    
    # Process each file in the response
    foreach ($file in $response.files) {
        $filePath = $file.path
        $content = $file.content
        $fullPath = Join-Path -Path $outputDir -ChildPath $filePath
        
        # Create directory for file if needed
        $directory = Split-Path -Path $fullPath -Parent
        Create-DirectoryIfNotExists -path $directory
        
        # Save file content
        $content | Out-File -FilePath $fullPath -Encoding UTF8
        Write-Host "Saved: $filePath ($([int]($content.Length / 1024))KB)" -ForegroundColor Yellow
        
        # Track file by type
        if ($filePath -match "\.html$") {
            $htmlFiles += $fullPath
        } elseif ($filePath -match "\.css$") {
            $cssFiles += $fullPath
        } elseif ($filePath -match "\.js$") {
            $jsFiles += $fullPath
        }
    }
    
    # Test HTML files
    Write-Host "`nTesting HTML files..." -ForegroundColor Cyan
    foreach ($htmlFile in $htmlFiles) {
        $fileName = Split-Path -Path $htmlFile -Leaf
        Write-Host "Testing $fileName..." -ForegroundColor Yellow
        
        # Basic validation - check for required elements
        $htmlContent = Get-Content -Path $htmlFile -Raw
        
        $validationResults = @()
        
        # Check for doctype
        if ($htmlContent -match "<!DOCTYPE html>") {
            $validationResults += "✅ Has DOCTYPE declaration"
        } else {
            $validationResults += "❌ Missing DOCTYPE declaration"
        }
        
        # Check for html tag
        if ($htmlContent -match "<html") {
            $validationResults += "✅ Has HTML tag"
        } else {
            $validationResults += "❌ Missing HTML tag"
        }
        
        # Check for head tag
        if ($htmlContent -match "<head>") {
            $validationResults += "✅ Has HEAD tag"
        } else {
            $validationResults += "❌ Missing HEAD tag"
        }
        
        # Check for body tag
        if ($htmlContent -match "<body") {
            $validationResults += "✅ Has BODY tag"
        } else {
            $validationResults += "❌ Missing BODY tag"
        }
        
        # Check for title tag
        if ($htmlContent -match "<title>") {
            $validationResults += "✅ Has TITLE tag"
        } else {
            $validationResults += "❌ Missing TITLE tag"
        }
        
        # Check for meta viewport
        if ($htmlContent -match '<meta name="viewport"') {
            $validationResults += "✅ Has viewport meta tag"
        } else {
            $validationResults += "❌ Missing viewport meta tag"
        }
        
        # Check for CSS references
        if ($htmlContent -match '<link rel="stylesheet"|<style>') {
            $validationResults += "✅ Has CSS styling"
        } else {
            $validationResults += "❌ Missing CSS styling"
        }
        
        # Check for JavaScript
        if ($htmlContent -match '<script>|<script src=') {
            $validationResults += "✅ Has JavaScript"
        } else {
            $validationResults += "❌ Missing JavaScript"
        }
        
        # Display validation results
        foreach ($result in $validationResults) {
            if ($result -match "^✅") {
                Write-Host "  $result" -ForegroundColor Green
            } else {
                Write-Host "  $result" -ForegroundColor Red
            }
        }
        
        # Overall validation result
        $failureCount = ($validationResults -match "^❌").Count
        if ($failureCount -eq 0) {
            Write-Host "✅ $fileName passed all validation checks" -ForegroundColor Green
        } else {
            Write-Host "⚠️ $fileName failed $failureCount validation check(s)" -ForegroundColor Yellow
        }
    }
    
    # Test CSS files
    Write-Host "`nTesting CSS files..." -ForegroundColor Cyan
    foreach ($cssFile in $cssFiles) {
        $fileName = Split-Path -Path $cssFile -Leaf
        Write-Host "Testing $fileName..." -ForegroundColor Yellow
        
        $cssContent = Get-Content -Path $cssFile -Raw
        $cssSize = $cssContent.Length
        
        # Basic CSS checks
        if ($cssSize -gt 1000) {
            Write-Host "  ✅ CSS file has substantial content ($([int]($cssSize / 1024))KB)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ CSS file seems small ($cssSize bytes)" -ForegroundColor Yellow
        }
        
        # Check for common CSS properties
        $cssChecks = @{
            "Root variables" = ":root {"
            "Color properties" = "--primary|color:|background-color:"
            "Layout properties" = "display:|grid-|flex-|width:|height:|margin:|padding:"
            "Media queries" = "@media"
        }
        
        foreach ($check in $cssChecks.GetEnumerator()) {
            if ($cssContent -match $check.Value) {
                Write-Host "  ✅ Has $($check.Key)" -ForegroundColor Green
            } else {
                Write-Host "  ❌ Missing $($check.Key)" -ForegroundColor Red
            }
        }
    }
    
    # Test JavaScript files
    Write-Host "`nTesting JavaScript files..." -ForegroundColor Cyan
    foreach ($jsFile in $jsFiles) {
        $fileName = Split-Path -Path $jsFile -Leaf
        Write-Host "Testing $fileName..." -ForegroundColor Yellow
        
        $jsContent = Get-Content -Path $jsFile -Raw
        $jsSize = $jsContent.Length
        
        # Basic JS checks
        if ($jsSize -gt 500) {
            Write-Host "  ✅ JS file has substantial content ($([int]($jsSize / 1024))KB)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ JS file seems small ($jsSize bytes)" -ForegroundColor Yellow
        }
        
        # Check for common JS patterns
        $jsChecks = @{
            "Event listeners" = "addEventListener"
            "DOM manipulation" = "document\.|getElementById|querySelector"
            "Functions" = "function\s|=>\s*{"
            "Classes" = "class\s"
        }
        
        foreach ($check in $jsChecks.GetEnumerator()) {
            if ($jsContent -match $check.Value) {
                Write-Host "  ✅ Has $($check.Key)" -ForegroundColor Green
            } else {
                Write-Host "  ❌ Missing $($check.Key)" -ForegroundColor Red
            }
        }
    }
    
    # Open the main HTML file in the default browser for visual inspection
    $indexHtmlPath = Join-Path -Path $outputDir -ChildPath "index.html"
    if (Test-Path $indexHtmlPath) {
        Write-Host "`n✅ Test completed. Opening the generated website in your default browser..." -ForegroundColor Cyan
        Start-Process $indexHtmlPath
        Write-Host "Generated website files are available in the '$outputDir' directory" -ForegroundColor Green
    } else {
        Write-Host "`n❌ index.html file not found in output directory" -ForegroundColor Red
    }
    
}
catch {
    Write-Host "❌ Error testing MCP output: $_" -ForegroundColor Red
}

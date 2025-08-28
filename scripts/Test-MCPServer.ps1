# Test-MCPServer.ps1
# This script tests the MCP server functionality with HTTP requests

Write-Host "MCP Server Function Tester" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

# Check if server is running
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:8000/mcp/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Server is running. Status: $($healthCheck.status)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Server is not running. Please start the server first with: npm start" -ForegroundColor Red
    exit
}

# Function to display response in a nice format
function Format-JsonResponse {
    param (
        [Parameter(Mandatory=$true)]
        [object]$Response,
        
        [Parameter(Mandatory=$true)]
        [string]$Title
    )
    
    Write-Host "`n$Title" -ForegroundColor Yellow
    Write-Host "-------------------------------------------" -ForegroundColor Yellow
    
    $json = $Response | ConvertTo-Json -Depth 3
    
    # Format the JSON with colors
    $lines = $json -split "`n"
    foreach ($line in $lines) {
        if ($line -match '^\s*"[^"]+"\s*:') {
            # Key
            $parts = $line -split ':', 2
            Write-Host $parts[0] -NoNewline -ForegroundColor Cyan
            Write-Host ":" -NoNewline
            Write-Host $parts[1] -ForegroundColor White
        }
        elseif ($line -match '^\s*"') {
            # String value
            Write-Host $line -ForegroundColor Green
        }
        elseif ($line -match '^\s*[0-9]') {
            # Number
            Write-Host $line -ForegroundColor Magenta
        }
        elseif ($line -match '^\s*\{' -or $line -match '^\s*\}' -or $line -match '^\s*\[' -or $line -match '^\s*\]') {
            # Brackets
            Write-Host $line -ForegroundColor Yellow
        }
        else {
            # Other
            Write-Host $line
        }
    }
}

# Get capabilities
try {
    Write-Host "`nTesting /mcp/capabilities endpoint..." -ForegroundColor Blue
    $capabilities = Invoke-RestMethod -Uri "http://localhost:8000/mcp/capabilities" -Method Get
    
    # Show main capabilities
    Write-Host "`nSupported Website Types:" -ForegroundColor Yellow
    foreach ($type in $capabilities.capabilities.websiteTypes) {
        Write-Host "  • $type" -ForegroundColor White
    }
    
    Write-Host "`nSupported Features:" -ForegroundColor Yellow
    foreach ($feature in $capabilities.capabilities.features) {
        Write-Host "  • $feature" -ForegroundColor White
    }
    
    Write-Host "`nFull Capabilities Response:" -ForegroundColor Yellow
    Format-JsonResponse -Response $capabilities -Title "Capabilities Response"
}
catch {
    Write-Host "❌ Error getting capabilities: $_" -ForegroundColor Red
}

# Test validation
try {
    Write-Host "`nTesting /mcp/validate endpoint..." -ForegroundColor Blue
    
    $validInput = @{
        website = @{
            type = "portfolio"
        }
        content = @{
            title = "Test Portfolio"
        }
        output = @{
            format = "files"
        }
    }
    
    $validJson = $validInput | ConvertTo-Json
    
    $validation = Invoke-RestMethod -Uri "http://localhost:8000/mcp/validate" -Method Post -Body $validJson -ContentType "application/json"
    Format-JsonResponse -Response $validation -Title "Validation Response"
}
catch {
    Write-Host "❌ Error validating input: $_" -ForegroundColor Red
}

# Test website generation
try {
    Write-Host "`nTesting /mcp/generate endpoint..." -ForegroundColor Blue
    
    $generateInput = @{
        toolName = "claude-ai-website-builder"
        website = @{
            type = "portfolio"
            features = @("table-theme", "theme-generator")
        }
        content = @{
            title = "MCP Test Portfolio"
            description = "Generated through MCP API"
        }
        output = @{
            format = "files"
        }
        customization = @{
            primaryColor = "#3b82f6"
            secondaryColor = "#f8fafc"
            accentColor = "#10b981"
        }
    }
    
    $generateJson = $generateInput | ConvertTo-Json -Depth 4
    
    Write-Host "`nSending generation request..." -ForegroundColor Yellow
    $generation = Invoke-RestMethod -Uri "http://localhost:8000/mcp/generate" -Method Post -Body $generateJson -ContentType "application/json"
    
    # Display generation results summary
    Write-Host "`nGeneration Results:" -ForegroundColor Green
    Write-Host "  Success: $($generation.success)" -ForegroundColor White
    Write-Host "  Files Generated: $($generation.files.Count)" -ForegroundColor White
    
    # List generated files
    Write-Host "`nGenerated Files:" -ForegroundColor Yellow
    foreach ($file in $generation.files) {
        Write-Host "  • $($file.path) ($(($file.content).Length) bytes)" -ForegroundColor White
    }
    
    # Save index.html to a file for inspection
    $indexHtml = $generation.files | Where-Object { $_.path -eq "index.html" }
    if ($indexHtml) {
        $outputPath = "mcp-generated-sample.html"
        $indexHtml.content | Out-File -FilePath $outputPath -Encoding utf8
        Write-Host "`n✅ Sample HTML saved to: $outputPath" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Error generating website: $_" -ForegroundColor Red
}

# Test metrics
try {
    Write-Host "`nTesting /mcp/metrics endpoint..." -ForegroundColor Blue
    $metrics = Invoke-RestMethod -Uri "http://localhost:8000/mcp/metrics" -Method Get
    Format-JsonResponse -Response $metrics -Title "Metrics Response"
}
catch {
    Write-Host "❌ Error getting metrics: $_" -ForegroundColor Red
}

Write-Host "`nMCP Server Function Test Completed" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan

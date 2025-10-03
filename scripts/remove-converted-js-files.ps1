# Script to remove JavaScript files that have been converted to TypeScript
# This script removes all .js files that have corresponding .ts files

$jsFiles = Get-ChildItem -Path . -Include "*.js" -Recurse -File

$conversionStats = @{
    Removed = 0
    NotRemoved = 0
    Total = $jsFiles.Count
}

Write-Host "Found $($jsFiles.Count) JavaScript files in the project" -ForegroundColor Cyan
Write-Host "Checking each file for TypeScript version..." -ForegroundColor Yellow
Write-Host ""

# Remove .js files that have corresponding .ts files
foreach ($jsFile in $jsFiles) {
    $tsFile = $jsFile.FullName -replace '\.js$', '.ts'
    
    if (Test-Path $tsFile) {
        try {
            # JavaScript file has a TypeScript version - remove it
            Write-Host "Removing $($jsFile.FullName)" -ForegroundColor Green
            Remove-Item -Path $jsFile.FullName -Force -ErrorAction Stop
            $conversionStats.Removed++
        }
    catch {
        $errorMessage = $_.Exception.Message
        Write-Host "ERROR: Failed to remove $($jsFile.FullName): $errorMessage" -ForegroundColor Red
            $conversionStats.NotRemoved++
            
            # Try alternate deletion method
            try {
                [System.IO.File]::Delete($jsFile.FullName)
                Write-Host "  Removed using alternate method" -ForegroundColor Green
                $conversionStats.Removed++
                $conversionStats.NotRemoved--
            }
            catch {
                $errorMessage = $_.Exception.Message
                Write-Host "  Failed alternate deletion method: $errorMessage" -ForegroundColor Red
            }
        }
    }
    else {
        # No TypeScript version exists yet
        Write-Host "Keeping $($jsFile.FullName) (no TypeScript version)" -ForegroundColor Yellow
        $conversionStats.NotRemoved++
    }
}

# Summary
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Total JavaScript files found: $($conversionStats.Total)" -ForegroundColor White
Write-Host "  Removed (had TypeScript version): $($conversionStats.Removed)" -ForegroundColor Green
Write-Host "  Kept (no TypeScript version): $($conversionStats.NotRemoved)" -ForegroundColor Yellow

# Fix the specific TypeScript error we found in claude-socket.spec.js
$errorFile = "tests\claude-socket.spec.js"
$tsErrorFile = $errorFile -replace '\.js$', '.ts'

if (Test-Path $errorFile) {
    Write-Host "`nFixing syntax errors in $errorFile" -ForegroundColor Cyan
    
    try {
        # Read file content
        $content = Get-Content -Path $errorFile -Raw
        
        # Fix extra closing brackets syntax error
        $content = $content -replace '\s+\}\);(\s*\}\);)+', ' });'
        
        # Write corrected version to .ts file
        Set-Content -Path $tsErrorFile -Value $content
        
        # Remove the original .js file
        Remove-Item -Path $errorFile -Force
        Write-Host "  Fixed errors and converted to $tsErrorFile" -ForegroundColor Green
    }
    catch {
        $errorMessage = $_.Exception.Message
        Write-Host "  ERROR: Failed to fix $errorFile: $errorMessage" -ForegroundColor Red
    }
}

# Fix the verbatimModuleSyntax issue in tsconfig.json
$tsconfigFile = "tsconfig.json"
if (Test-Path $tsconfigFile) {
    Write-Host "`nFixing tsconfig.json issues" -ForegroundColor Cyan
    
    try {
        # Read tsconfig.json
        $tsconfig = Get-Content -Path $tsconfigFile -Raw
        
        # Remove verbatimModuleSyntax option
        $tsconfig = $tsconfig -replace ',\s*"verbatimModuleSyntax":\s*false', ''
        
        # Ensure moduleResolution is set to "node"
        $tsconfig = $tsconfig -replace '"moduleResolution":\s*"bundler"', '"moduleResolution": "node"'
        
        # Write corrected version
        Set-Content -Path $tsconfigFile -Value $tsconfig
        Write-Host "  Fixed tsconfig.json issues" -ForegroundColor Green
    }
    catch {
        $errorMessage = $_.Exception.Message
        Write-Host "  ERROR: Failed to fix tsconfig.json: $errorMessage" -ForegroundColor Red
    }
}

Write-Host "`nDone!" -ForegroundColor Cyan

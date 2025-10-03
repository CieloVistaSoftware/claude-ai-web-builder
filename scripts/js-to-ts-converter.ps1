# JS to TS Converter with Cleanup Script
# This script finds all JS files in the project, converts them to TS, and removes the original JS files

# Define log files
$successLog = "js-to-ts-conversion-success.log"
$errorLog = "js-to-ts-conversion-errors.log"

# Clear logs if they exist
if (Test-Path $successLog) { Clear-Content $successLog }
if (Test-Path $errorLog) { Clear-Content $errorLog }

Write-Host "Starting JavaScript to TypeScript conversion..." -ForegroundColor Cyan

# Find all JS files in the project
Write-Host "Finding all JavaScript files in the project..." -ForegroundColor Yellow
$jsFiles = Get-ChildItem -Path . -Filter "*.js" -Recurse -File | Where-Object { 
    # Exclude node_modules, dist folders, and other common exclusions
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\dist\\" -and
    $_.FullName -notmatch "\\.git\\" -and
    $_.FullName -notmatch "\\tests\\test-results\\" -and
    $_.FullName -notmatch "\\tests\\playwright-report\\"
}

$totalFiles = $jsFiles.Count
Write-Host "Found $totalFiles JavaScript files to convert" -ForegroundColor Green

$successCount = 0
$errorCount = 0

# Process each file
foreach ($jsFile in $jsFiles) {
    $tsFile = $jsFile.FullName -replace '\.js$', '.ts'
    $relativeFilePath = $jsFile.FullName.Replace("$pwd\", "")
    
    try {
        Write-Host "Converting $relativeFilePath to TypeScript..." -ForegroundColor Yellow
        
        # Read JS content
        $jsContent = Get-Content -Path $jsFile.FullName -Raw
        
        # Basic conversion - add ts-nocheck at the top
        $tsContent = "// @ts-nocheck`n" + $jsContent
        
        # Apply common conversion fixes
        
        # 1. Convert require() to import statements
        $tsContent = $tsContent -replace 'const\s+(\w+)\s*=\s*require\([''"](.+?)[''"]\)', 'import * as $1 from "$2"'
        
        # 2. Handle default exports
        $tsContent = $tsContent -replace 'module\.exports\s*=\s*(\w+)', 'export default $1'
        
        # 3. Handle named exports
        $tsContent = $tsContent -replace 'exports\.(\w+)\s*=\s*(.+?);', 'export const $1 = $2;'
        
        # 4. Convert .js extensions in imports to .ts
        $tsContent = $tsContent -replace 'from\s+[''"](.+?)\.js[''"]', 'from "$1.ts"'
        
        # Write to TS file
        Set-Content -Path $tsFile -Value $tsContent
        
        # Check if TS file was created successfully
        if (Test-Path $tsFile) {
            # Delete the original JS file
            Remove-Item -Path $jsFile.FullName -Force
            
            # Verify the JS file was actually removed
            if (Test-Path $jsFile.FullName) {
                # Try alternative deletion method if the first one failed
                [System.IO.File]::Delete($jsFile.FullName)
                
                # Check again after alternative method
                if (Test-Path $jsFile.FullName) {
                    throw "Failed to delete JS file after multiple attempts"
                }
            }
            
            $successCount++
            Write-Host "Successfully converted and removed: $relativeFilePath" -ForegroundColor Green
            Add-Content -Path $successLog -Value "$relativeFilePath -> Success"
        } else {
            throw "Failed to create TS file"
        }
    }
    catch {
        $errorCount++
        $errorMessage = "Error converting $relativeFilePath : $_"
        Write-Host $errorMessage -ForegroundColor Red
        Add-Content -Path $errorLog -Value $errorMessage
    }
    
    # Update progress
    $completed = $successCount + $errorCount
    $percentComplete = [math]::Round(($completed / $totalFiles) * 100, 2)
    Write-Progress -Activity "Converting JavaScript to TypeScript" -Status "$percentComplete% Complete" -PercentComplete $percentComplete
}

Write-Host "`nConversion completed!" -ForegroundColor Green
Write-Host "Successfully converted: $successCount files" -ForegroundColor Green
Write-Host "Failed to convert: $errorCount files" -ForegroundColor ($errorCount -gt 0 ? "Red" : "Green")

# Verify all files were converted by checking for remaining JS files
$remainingJsFiles = Get-ChildItem -Path . -Filter "*.js" -Recurse -File | Where-Object { 
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\dist\\" -and
    $_.FullName -notmatch "\\.git\\" -and
    $_.FullName -notmatch "\\tests\\test-results\\" -and
    $_.FullName -notmatch "\\tests\\playwright-report\\"
}

if ($remainingJsFiles.Count -gt 0) {
    Write-Host "`nWARNING: Found $($remainingJsFiles.Count) JavaScript files that weren't properly converted:" -ForegroundColor Yellow
    
    foreach ($file in $remainingJsFiles) {
        $relativePath = $file.FullName.Replace("$pwd\", "")
        Write-Host "- $relativePath" -ForegroundColor Yellow
        
        # Try one more time to convert
        try {
            Write-Host "  Attempting conversion again..." -ForegroundColor Yellow
            $jsContent = Get-Content -Path $file.FullName -Raw
            $tsFile = $file.FullName -replace '\.js$', '.ts'
            $tsContent = "// @ts-nocheck`n" + $jsContent
            Set-Content -Path $tsFile -Value $tsContent
            
            # Delete original JS file with additional safeguards
            if (Test-Path $tsFile) {
                Remove-Item -Path $file.FullName -Force
                
                if (Test-Path $file.FullName) {
                    [System.IO.File]::Delete($file.FullName)
                }
                
                if (!(Test-Path $file.FullName)) {
                    Write-Host "  Successfully converted on retry!" -ForegroundColor Green
                }
            }
        }
        catch {
            Write-Host "  Failed to convert on retry: $_" -ForegroundColor Red
        }
    }
}

# Run TypeScript check after conversion
Write-Host "`nRunning TypeScript check..." -ForegroundColor Cyan
try {
    $tscOutput = npx tsc --noEmit 2>&1
    
    if ($tscOutput -match "error") {
        Write-Host "TypeScript check found errors:" -ForegroundColor Yellow
        Write-Host $tscOutput -ForegroundColor Yellow
    } else {
        Write-Host "TypeScript check passed!" -ForegroundColor Green
    }
} catch {
    Write-Host "Error running TypeScript check: $_" -ForegroundColor Red
}

Write-Host "`nConversion and cleanup process complete!" -ForegroundColor Green
Write-Host "Success log: $successLog" -ForegroundColor Cyan
Write-Host "Error log: $errorLog" -ForegroundColor Cyan

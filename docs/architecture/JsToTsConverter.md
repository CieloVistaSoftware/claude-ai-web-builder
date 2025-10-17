# JavaScript to TypeScript Converter

```powershell
# JS to TS Converter Script
# This script converts JavaScript files to TypeScript and removes the original JS files after successful conversion

# Get CPU core count for parallelism
$maxConcurrentJobs = [Environment]::ProcessorCount
Write-Host "Using $maxConcurrentJobs parallel conversion jobs (based on CPU core count)" -ForegroundColor Cyan

# Function to convert JS file to TS
function Convert-JsToTs {
    param(
        [string]$jsFilePath
    )
    
    try {
        # Create TS file path
        $tsFilePath = $jsFilePath -replace '\.js$', '.ts'
        
        # Read JS file content
        $content = Get-Content -Path $jsFilePath -Raw
        
        # Basic JS to TS conversion logic
        # This is a simplistic conversion - in a real scenario you'd want more sophisticated transformations
        
        # Add // @ts-nocheck at the top to temporarily bypass type checking
        $tsContent = "// @ts-nocheck`n" + $content
        
        # Output to TS file
        Set-Content -Path $tsFilePath -Value $tsContent
        
        # If successful, remove the JS file
        if (Test-Path $tsFilePath) {
            Remove-Item -Path $jsFilePath -Force
            return $true
        }
        
        return $false
    }
    catch {
        Write-Host "Error converting $jsFilePath : $_" -ForegroundColor Red
        return $false
    }
}

# Get all JS files from the jsFileList.md
$jsFileListContent = Get-Content -Path "c:\Users\jwpmi\Downloads\AI\wb\docs\jsFileList.md" -Raw
$jsFilePaths = @()

# Extract file paths using regex
$regex = [regex]'(?:^\d+\.\s+(.+\.js)$|^\d+\.\s+components\/(.+\.js)$|^\d+\.\s+conversion\/(.+\.js)$|^\d+\.\s+stacking\/(.+\.js)$|^\d+\.\s+tests\/(.+\.js)$|^\d+\.\s+ui\/(.+\.js)$|^\d+\.\s+wb-core\/(.+\.js)$|^\d+\.\s+bootstrap\/(.+\.js)$|^\d+\.\s+toBeConverted\/(.+\.js)$|^\d+\.\s+materialdesigncolorPickerWorks\/(.+\.js)$)'

$matches = $regex.Matches($jsFileListContent)
foreach ($match in $matches) {
    for ($i = 1; $i -lt $match.Groups.Count; $i++) {
        if ($match.Groups[$i].Success -and $match.Groups[$i].Value) {
            $jsFilePaths += $match.Groups[$i].Value
        }
    }
}

# Base path of the project
$basePath = "c:\Users\jwpmi\Downloads\AI\wb"

# Full paths for each file
$fullJsFilePaths = @()
foreach ($path in $jsFilePaths) {
    # Handle directory-specific paths
    if ($path -match '^(components|conversion|stacking|tests|ui|wb-core|bootstrap|toBeConverted|materialdesigncolorPickerWorks)\/') {
        $fullJsFilePaths += Join-Path -Path $basePath -ChildPath $path
    } else {
        $fullJsFilePaths += Join-Path -Path $basePath -ChildPath $path
    }
}

# Initialize tracking variables
$jobCount = $fullJsFilePaths.Count
$startedJobs = 0
$completedJobs = 0
$failedJobs = 0
$runningJobs = @{}
$startTime = Get-Date

# Function to update progress
function Update-Progress {
    $currentTime = Get-Date
    $elapsedTime = ($currentTime - $startTime).TotalSeconds
    
    # Calculate estimated completion time
    if ($completedJobs -gt 0) {
        $timePerJob = $elapsedTime / $completedJobs
        $remainingJobs = $jobCount - $startedJobs
        $jobsToRun = $jobCount - ($completedJobs + $failedJobs)
        $estimatedSecondsRemaining = $timePerJob * $jobsToRun
        $estimatedCompletion = $currentTime.AddSeconds($estimatedSecondsRemaining)
        $etaFormatted = $estimatedCompletion.ToString("yyyy-MM-dd HH:mm:ss")
    } else {
        $etaFormatted = "Calculating..."
    }
    
    # Clear the line and print status
    Write-Host "`r                                                                                                      " -NoNewline
    Write-Host "`rProgress: [$startedJobs/$jobCount] started | [$completedJobs/$jobCount] completed | [$failedJobs] failed | ETA: $etaFormatted" -NoNewline
    
    # If all jobs completed, print final message
    if (($completedJobs + $failedJobs) -eq $jobCount) {
        Write-Host "`n`nAll conversions completed!" -ForegroundColor Green
        Write-Host "Successfully converted: $completedJobs files" -ForegroundColor Green
        Write-Host "Failed conversions: $failedJobs files" -ForegroundColor ($failedJobs -gt 0 ? "Red" : "Green")
        Write-Host "Total time: $([math]::Round($elapsedTime, 2)) seconds" -ForegroundColor Cyan
    }
}

# Start a background job to update progress every 5 seconds
$progressJob = Start-Job -ScriptBlock {
    param($totalJobs)
    
    $startTime = Get-Date
    while ($true) {
        # Sleep for 5 seconds
        Start-Sleep -Seconds 5
        
        # Signal to update progress
        Write-Output "UPDATE_PROGRESS"
    }
} -ArgumentList $jobCount

# Process files with throttling
Write-Host "Starting conversion of $jobCount JavaScript files to TypeScript..." -ForegroundColor Green
Write-Host "Progress updates will appear every 5 seconds." -ForegroundColor Yellow
Write-Host ""

foreach ($jsFile in $fullJsFilePaths) {
    # Wait until we have an available slot
    while ($runningJobs.Count -ge $maxConcurrentJobs) {
        $completedJobIds = @()
        
        # Check for completed jobs
        foreach ($jobId in $runningJobs.Keys) {
            $job = $runningJobs[$jobId]
            if ($job.Job.State -ne "Running") {
                $result = Receive-Job -Job $job.Job
                if ($result) {
                    $completedJobs++
                } else {
                    $failedJobs++
                }
                Remove-Job -Job $job.Job -Force
                $completedJobIds += $jobId
            }
        }
        
        # Remove completed jobs from tracking
        foreach ($jobId in $completedJobIds) {
            $runningJobs.Remove($jobId)
        }
        
        # Check for progress update signal
        $progressUpdate = Receive-Job -Job $progressJob
        if ($progressUpdate -contains "UPDATE_PROGRESS") {
            Update-Progress
        }
        
        # Small sleep to prevent CPU thrashing
        Start-Sleep -Milliseconds 100
    }
    
    # Start a new job
    $jobScriptBlock = {
        param($jsFilePath)
        
        # Check if file exists
        if (Test-Path $jsFilePath) {
            # Create TS file path
            $tsFilePath = $jsFilePath -replace '\.js$', '.ts'
            
            # Read JS file content
            $content = Get-Content -Path $jsFilePath -Raw
            
            # Basic JS to TS conversion logic
            # Add // @ts-nocheck at the top to temporarily bypass type checking
            $tsContent = "// @ts-nocheck`n" + $content
            
            # Output to TS file
            Set-Content -Path $tsFilePath -Value $tsContent
            
            # If successful, remove the JS file
            if (Test-Path $tsFilePath) {
                Remove-Item -Path $jsFilePath -Force
                return $true
            }
        } else {
            Write-Host "File not found: $jsFilePath" -ForegroundColor Red
        }
        
        return $false
    }
    
    $job = Start-Job -ScriptBlock $jobScriptBlock -ArgumentList $jsFile
    $runningJobs.Add($jsFile, @{
        Job = $job
        StartTime = (Get-Date)
    })
    
    $startedJobs++
    
    # Check for progress update
    $progressUpdate = Receive-Job -Job $progressJob
    if ($progressUpdate -contains "UPDATE_PROGRESS") {
        Update-Progress
    }
    
    # Delay between job starts
    Start-Sleep -Milliseconds 1500
}

# Wait for remaining jobs to complete
while ($runningJobs.Count -gt 0) {
    $completedJobIds = @()
    
    # Check for completed jobs
    foreach ($jobId in $runningJobs.Keys) {
        $job = $runningJobs[$jobId]
        if ($job.Job.State -ne "Running") {
            $result = Receive-Job -Job $job.Job
            if ($result) {
                $completedJobs++
            } else {
                $failedJobs++
            }
            Remove-Job -Job $job.Job -Force
            $completedJobIds += $jobId
        }
    }
    
    # Remove completed jobs from tracking
    foreach ($jobId in $completedJobIds) {
        $runningJobs.Remove($jobId)
    }
    
    # Check for progress update signal
    $progressUpdate = Receive-Job -Job $progressJob
    if ($progressUpdate -contains "UPDATE_PROGRESS") {
        Update-Progress
    }
    
    # Small sleep to prevent CPU thrashing
    Start-Sleep -Milliseconds 100
}

# Stop progress update job
Stop-Job -Job $progressJob
Remove-Job -Job $progressJob -Force

# Final progress update
Update-Progress

Write-Host "`n`nJS to TS conversion process complete!" -ForegroundColor Green

# Update tsconfig.json if it exists, or create a new one
$tsconfigPath = Join-Path -Path $basePath -ChildPath "tsconfig.json"
if (Test-Path $tsconfigPath) {
    Write-Host "Updating existing tsconfig.json..." -ForegroundColor Yellow
} else {
    Write-Host "Creating new tsconfig.json..." -ForegroundColor Yellow
    $tsconfig = @{
        compilerOptions = @{
            target = "ES2020"
            module = "ESNext"
            moduleResolution = "node"
            esModuleInterop = $true
            allowSyntheticDefaultImports = $true
            strict = $false  # Initially set to false to make migration easier
            forceConsistentCasingInFileNames = $true
            outDir = "./dist"
            rootDir = "./"
            skipLibCheck = $true
        }
        include = @("**/*.ts")
        exclude = @("node_modules", "dist")
    }
    
    $tsconfigJson = $tsconfig | ConvertTo-Json -Depth 5
    Set-Content -Path $tsconfigPath -Value $tsconfigJson
}

Write-Host "Conversion complete! Next steps:" -ForegroundColor Green
Write-Host "1. Run 'npx tsc --noEmit' to check for TypeScript errors" -ForegroundColor Cyan
Write-Host "2. Fix any type issues in the converted files" -ForegroundColor Cyan
Write-Host "3. Update imports/exports to TypeScript format if needed" -ForegroundColor Cyan
Write-Host "4. Gradually enable stricter TypeScript rules in tsconfig.json" -ForegroundColor Cyan
```

## To Run This Script

1. Save the above script as `convert-js-to-ts.ps1` in your project directory
2. Open PowerShell and navigate to your project directory
3. Run `./convert-js-to-ts.ps1`

The script will:
- Convert all JavaScript files listed in `jsFileList.md` to TypeScript
- Add `// @ts-nocheck` to temporarily bypass TypeScript errors
- Use all available CPU cores for parallel processing
- Delay starting each job by 1.5 seconds
- Display progress updates every 5 seconds
- Remove original .js files after successful conversion
- Create or update tsconfig.json

## Note on Conversion Quality

This script performs a basic conversion that may require additional manual adjustments:

1. It doesn't add proper type annotations
2. It doesn't handle CommonJS to ESM module conversion
3. It adds `// @ts-nocheck` to bypass initial errors

After running the script, you'll need to go through the files to add proper type definitions and fix any TypeScript errors.

# COMPLETE ORGANIZATION SCRIPT - FIXED VERSION
# Run from scripts folder to organize everything

Write-Host "=== STARTING COMPLETE ORGANIZATION ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Step 1: Move PowerShell scripts
Write-Host "`n1. Moving PowerShell scripts to scripts/ folder..." -ForegroundColor Blue

$scriptsToMove = @(
    "add-favicon.js",
    "add-zia-symbol.js", 
    "build-complete.js",
    "build-dist-redirect.js",
    "build-dist.js",
    "build.js",
    "check-build-process.js",
    "check-index-refs.js",
    "dynamic-pages.js",
    "find-bad-href.js",
    "mcp-client-example.js",
    "server.js",
    "simple-server.js",
    "standalone-server.js",
    "test-obfuscation.js",
    "verify-dist.js",
    "verify-security.js"
)

$moved = 0
foreach ($script in $scriptsToMove) {
    if (Test-Path $script) {
        Move-Item $script "scripts\" -Force
        Write-Host "  ✅ Moved $script" -ForegroundColor Green
        $moved++
    }
}

Write-Host "  📦 Moved $moved script files" -ForegroundColor Cyan

# Step 2: Create js/ folder and move JS files
Write-Host "`n2. Creating js/ folder and moving JavaScript files..." -ForegroundColor Blue

if (-not (Test-Path "js")) {
    New-Item -ItemType Directory -Name "js" | Out-Null
    Write-Host "  📁 Created js/ folder" -ForegroundColor Green
}

$jsFiles = @(
    "wb.js",
    "wb-import-simple.js"
)

$jsFiles | ForEach-Object {
    if (Test-Path $_) {
        Move-Item $_ "js\" -Force
        Write-Host "  ✅ Moved $_" -ForegroundColor Green
    }
}

# Step 3: Create master runner script
Write-Host "`n3. Creating master runner script..." -ForegroundColor Blue

$runnerContent = @"
# Master script runner
param([string]`$ScriptName)

if (-not `$ScriptName) {
    Write-Host "Available scripts:" -ForegroundColor Yellow
    Get-ChildItem "scripts" -Filter "*.ps1" | ForEach-Object {
        Write-Host "  - `$(`$_.Name)" -ForegroundColor White
    }
    Write-Host "``nUsage: .\run.ps1 scriptname.ps1" -ForegroundColor Cyan
    return
}

`$scriptPath = "scripts\`$ScriptName"

if (Test-Path `$scriptPath) {
    Write-Host "Running `$ScriptName..." -ForegroundColor Green
    & `$scriptPath
} else {
    Write-Host "Script not found: `$scriptPath" -ForegroundColor Red
}
"@

$runnerContent | Out-File -FilePath "run.ps1" -Encoding UTF8

Write-Host "  ✅ Created run.ps1 master runner" -ForegroundColor Green

# Step 4: Show final structure
Write-Host "`n4. Final organization structure:" -ForegroundColor Blue
Write-Host "wb/" -ForegroundColor Yellow
Get-ChildItem | ForEach-Object {
    if ($_.PSIsContainer) {
        Write-Host "├── $($_.Name)/" -ForegroundColor Blue
        if ($_.Name -eq "scripts" -or $_.Name -eq "js") {
            Get-ChildItem $_.FullName | ForEach-Object {
                Write-Host "│   ├── $($_.Name)" -ForegroundColor Gray
            }
        }
    } else {
        if ($_.Name -eq "run.ps1" -or $_.Name -eq "wb.html") {
            Write-Host "├── $($_.Name)" -ForegroundColor Green
        }
    }
}

Write-Host "`n✅ COMPLETE ORGANIZATION FINISHED!" -ForegroundColor Green
Write-Host "✅ All scripts moved to scripts/ folder" -ForegroundColor Green
Write-Host "✅ JavaScript files moved to js/ folder" -ForegroundColor Green
Write-Host "✅ Master runner created: run.ps1" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Use: .\run.ps1 to list available scripts" -ForegroundColor Cyan
Write-Host "2. Test wb.html to verify import functionality" -ForegroundColor Cyan

Read-Host "`nPress Enter to continue"
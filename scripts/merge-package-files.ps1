# Merge all package*.json files into one consolidated package.json
# Run from scripts folder

Write-Host "=== MERGING PACKAGE JSON FILES ===" -ForegroundColor Yellow

# Go to parent directory (wb root)
Set-Location ".."

Write-Host "Now in: $PWD" -ForegroundColor Cyan

# Find all package*.json files
Write-Host "`n🔍 Scanning for package*.json files..." -ForegroundColor Blue

$packageFiles = Get-ChildItem -Filter "package*.json" | Where-Object { 
    $_.PSIsContainer -eq $false 
}

if ($packageFiles.Count -eq 0) {
    Write-Host "No package*.json files found" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    return
}

Write-Host "Found $($packageFiles.Count) package files:" -ForegroundColor Green
foreach ($file in $packageFiles) {
    Write-Host "  📋 $($file.Name)" -ForegroundColor Gray
}

# Initialize merged package structure
$mergedPackage = @{
    name = "claude-ai-web-builder"
    version = "1.0.0"
    description = "AI-powered website builder with import functionality"
    main = "index.html"
    scripts = @{}
    dependencies = @{}
    devDependencies = @{}
    keywords = @()
    author = ""
    license = "MIT"
    repository = @{
        type = "git"
        url = "https://github.com/CieloVistaSoftware/claude-ai-web-builder.git"
    }
    bugs = @{
        url = "https://github.com/CieloVistaSoftware/claude-ai-web-builder/issues"
    }
    homepage = "https://github.com/CieloVistaSoftware/claude-ai-web-builder#readme"
}

Write-Host "`n🔄 Processing and merging package files..." -ForegroundColor Blue

foreach ($file in $packageFiles) {
    try {
        Write-Host "  📋 Processing $($file.Name)..." -ForegroundColor Cyan
        
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $packageData = $content | ConvertFrom-Json
        
        # Merge scripts
        if ($packageData.scripts) {
            foreach ($script in $packageData.scripts.PSObject.Properties) {
                if (-not $mergedPackage.scripts.ContainsKey($script.Name)) {
                    $mergedPackage.scripts[$script.Name] = $script.Value
                    Write-Host "    ✅ Added script: $($script.Name)" -ForegroundColor Green
                }
            }
        }
        
        # Merge dependencies
        if ($packageData.dependencies) {
            foreach ($dep in $packageData.dependencies.PSObject.Properties) {
                if (-not $mergedPackage.dependencies.ContainsKey($dep.Name)) {
                    $mergedPackage.dependencies[$dep.Name] = $dep.Value
                    Write-Host "    ✅ Added dependency: $($dep.Name)@$($dep.Value)" -ForegroundColor Green
                } elseif ($mergedPackage.dependencies[$dep.Name] -ne $dep.Value) {
                    Write-Host "    ⚠️  Version conflict for $($dep.Name): existing $($mergedPackage.dependencies[$dep.Name]) vs new $($dep.Value)" -ForegroundColor Yellow
                    # Keep the newer version (simple string comparison)
                    if ($dep.Value -gt $mergedPackage.dependencies[$dep.Name]) {
                        $mergedPackage.dependencies[$dep.Name] = $dep.Value
                        Write-Host "    🔄 Updated to newer version: $($dep.Value)" -ForegroundColor Cyan
                    }
                }
            }
        }
        
        # Merge devDependencies
        if ($packageData.devDependencies) {
            foreach ($devDep in $packageData.devDependencies.PSObject.Properties) {
                if (-not $mergedPackage.devDependencies.ContainsKey($devDep.Name)) {
                    $mergedPackage.devDependencies[$devDep.Name] = $devDep.Value
                    Write-Host "    ✅ Added devDependency: $($devDep.Name)@$($devDep.Value)" -ForegroundColor Green
                } elseif ($mergedPackage.devDependencies[$devDep.Name] -ne $devDep.Value) {
                    Write-Host "    ⚠️  Version conflict for dev $($devDep.Name): existing $($mergedPackage.devDependencies[$devDep.Name]) vs new $($devDep.Value)" -ForegroundColor Yellow
                    # Keep the newer version
                    if ($devDep.Value -gt $mergedPackage.devDependencies[$devDep.Name]) {
                        $mergedPackage.devDependencies[$devDep.Name] = $devDep.Value
                        Write-Host "    🔄 Updated dev dependency to newer version: $($devDep.Value)" -ForegroundColor Cyan
                    }
                }
            }
        }
        
        # Merge keywords
        if ($packageData.keywords) {
            foreach ($keyword in $packageData.keywords) {
                if ($keyword -notin $mergedPackage.keywords) {
                    $mergedPackage.keywords += $keyword
                    Write-Host "    ✅ Added keyword: $keyword" -ForegroundColor Green
                }
            }
        }
        
        # Update metadata if more specific
        if ($packageData.description -and $packageData.description.Length -gt $mergedPackage.description.Length) {
            $mergedPackage.description = $packageData.description
            Write-Host "    🔄 Updated description" -ForegroundColor Cyan
        }
        
        if ($packageData.author -and -not $mergedPackage.author) {
            $mergedPackage.author = $packageData.author
            Write-Host "    ✅ Added author: $($packageData.author)" -ForegroundColor Green
        }
        
        if ($packageData.license -and $packageData.license -ne "MIT") {
            $mergedPackage.license = $packageData.license
            Write-Host "    🔄 Updated license: $($packageData.license)" -ForegroundColor Cyan
        }
        
    } catch {
        Write-Host "    ❌ Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Convert merged package to JSON with proper formatting
Write-Host "`n💾 Creating consolidated package.json..." -ForegroundColor Blue

$jsonOutput = $mergedPackage | ConvertTo-Json -Depth 10
# Format the JSON nicely
$jsonOutput = $jsonOutput -replace '(?m)^  ', '  '  # Ensure consistent indentation

# Backup existing package.json if it exists
if (Test-Path "package.json") {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    Copy-Item "package.json" "package-backup-$timestamp.json"
    Write-Host "  📋 Backed up existing package.json to package-backup-$timestamp.json" -ForegroundColor Yellow
}

# Write the merged package.json
$jsonOutput | Out-File -FilePath "package.json" -Encoding UTF8

Write-Host "  ✅ Created consolidated package.json" -ForegroundColor Green

# Create cleanup script for old package files
Write-Host "`n🗑️  Creating cleanup script..." -ForegroundColor Blue

$cleanupContent = @"
# Cleanup old package files after verifying merged package.json works
# Run this manually after testing

Write-Host "=== CLEANING UP OLD PACKAGE FILES ===" -ForegroundColor Yellow

`$oldFiles = @(
"@

foreach ($file in $packageFiles) {
    if ($file.Name -ne "package.json") {
        $cleanupContent += "`n    `"$($file.Name)`","
    }
}

$cleanupContent += @"

)

foreach (`$file in `$oldFiles) {
    if (Test-Path `$file) {
        Remove-Item `$file -Force
        Write-Host "  🗑️  Removed `$file" -ForegroundColor Red
    }
}

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
"@

$cleanupContent | Out-File -FilePath "scripts\cleanup-old-packages.ps1" -Encoding UTF8

# Show summary
Write-Host "`n📊 MERGE SUMMARY:" -ForegroundColor Yellow
Write-Host "  📋 Package files processed: $($packageFiles.Count)" -ForegroundColor Green
Write-Host "  📦 Scripts merged: $($mergedPackage.scripts.Count)" -ForegroundColor Cyan
Write-Host "  📦 Dependencies: $($mergedPackage.dependencies.Count)" -ForegroundColor Cyan
Write-Host "  📦 Dev dependencies: $($mergedPackage.devDependencies.Count)" -ForegroundColor Cyan
Write-Host "  🏷️  Keywords: $($mergedPackage.keywords.Count)" -ForegroundColor Cyan

Write-Host "`nMerged dependencies:" -ForegroundColor Blue
foreach ($dep in $mergedPackage.dependencies.PSObject.Properties) {
    Write-Host "  📦 $($dep.Name)@$($dep.Value)" -ForegroundColor Gray
}

if ($mergedPackage.devDependencies.Count -gt 0) {
    Write-Host "`nMerged dev dependencies:" -ForegroundColor Blue
    foreach ($devDep in $mergedPackage.devDependencies.PSObject.Properties) {
        Write-Host "  🔧 $($devDep.Name)@$($devDep.Value)" -ForegroundColor Gray
    }
}

Write-Host "`n✅ PACKAGE MERGE COMPLETE!" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review the merged package.json file" -ForegroundColor Cyan
Write-Host "2. Test that npm install works correctly" -ForegroundColor Cyan
Write-Host "3. Verify all scripts function properly" -ForegroundColor Cyan
Write-Host "4. Run .\scripts\cleanup-old-packages.ps1 to remove old files" -ForegroundColor Cyan
Write-Host "5. Commit the consolidated package.json to git" -ForegroundColor Cyan

Read-Host "Press Enter to continue"
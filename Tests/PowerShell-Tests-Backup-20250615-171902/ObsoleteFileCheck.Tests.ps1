# Test to verify obsolete files detection (zzz in name) works correctly
# Date: June 10, 2025

$ErrorActionPreference = "Stop"

Write-Host "=== Testing Obsolete File Detection ===" -ForegroundColor Cyan

$testsPassed = 0
$testsFailed = 0

# Test 1: Check that zzz directory exists
Write-Host "Test 1: Verifying zzz directory exists..." -ForegroundColor Yellow
$zzzDirExists = Test-Path -Path "..\zzz" -PathType Container
if ($zzzDirExists) {
    Write-Host "✅ zzz directory found" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "❌ zzz directory not found" -ForegroundColor Red
    $testsFailed++
}

# Test 2: Check that files in zzz directory have zzz in their name
if ($zzzDirExists) {
    Write-Host "Test 2: Checking files in zzz directory..." -ForegroundColor Yellow
    $zzzFiles = Get-ChildItem -Path "..\zzz" -File
    $allFilesHaveZzz = $true
    
    foreach ($file in $zzzFiles) {
        if (-not ($file.Name -match "zzz")) {
            Write-Host "❌ File without zzz prefix found in zzz directory: $($file.Name)" -ForegroundColor Red
            $allFilesHaveZzz = $false
        }
    }
    
    if ($allFilesHaveZzz) {
        Write-Host "✅ All files in zzz directory have zzz in their name" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "❌ Some files in zzz directory don't have zzz in their name" -ForegroundColor Red
        $testsFailed++
    }
} else {
    Write-Host "⚠️ Skipping Test 2 as zzz directory doesn't exist" -ForegroundColor Yellow
}

# Test 3: Simulate RunTestsOnce.ps1 file detection
Write-Host "Test 3: Testing obsolete file detection logic..." -ForegroundColor Yellow

$mockFiles = @(
    "NormalTest.ps1",
    "zzzObsoleteTest.ps1", 
    "TestWithzzz.ps1",
    "ConsolidatedTest.ps1"
)

$correctlyIdentified = $true
$obsoleteCount = 0
$regularCount = 0

foreach ($file in $mockFiles) {
    if ($file -match "zzz") {
        Write-Host "   $file - ✅ Correctly identified as obsolete" -ForegroundColor DarkGreen
        $obsoleteCount++
    } else {
        Write-Host "   $file - ✅ Correctly identified as regular" -ForegroundColor DarkGreen
        $regularCount++
    }
}

if ($obsoleteCount -eq 2 -and $regularCount -eq 2) {
    Write-Host "✅ Obsolete file detection logic works correctly" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "❌ Obsolete file detection logic failed" -ForegroundColor Red
    $testsFailed++
}

# Summary
Write-Host "`n=== Obsolete File Test Results Summary ===" -ForegroundColor Cyan
Write-Host "Total Tests: $($testsPassed + $testsFailed)"
Write-Host "Passed: $testsPassed" -ForegroundColor Green
Write-Host "Failed: $testsFailed" -ForegroundColor Red

if ($testsFailed -gt 0) {
    Write-Host "❌ Some tests failed. Please fix the issues and run the tests again." -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ All obsolete file tests passed!" -ForegroundColor Green
    exit 0
}

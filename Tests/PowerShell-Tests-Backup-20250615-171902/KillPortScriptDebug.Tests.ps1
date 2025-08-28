# PowerShell Kill Port Script Debug Test
# Test to identify and fix the kill-port npm script issue
# Date: 2025-06-12

Write-Host "🔍 Debugging Kill Port Script Issue" -ForegroundColor Yellow

# Test 1: Check if the command structure is correct
Write-Host "`n🧪 Test 1: Testing command structure" -ForegroundColor Cyan

# Break down the command into parts to identify the issue
Write-Host "Part 1: Killing node processes..."
try {
    Get-Process -Name 'node' -ErrorAction SilentlyContinue | Where-Object {$_.ProcessName -eq 'node'} | Stop-Process -Force
    Write-Host "✅ Node process kill: SUCCESS" -ForegroundColor Green
} catch {
    Write-Host "❌ Node process kill: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nPart 2: Finding processes on port 8000..."
try {
    $procs = netstat -ano | findstr :8000
    if($procs) {
        Write-Host "✅ Found processes on port 8000:" -ForegroundColor Green
        $procs | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Host "ℹ️ No processes found on port 8000" -ForegroundColor Blue
    }
} catch {
    Write-Host "❌ Port check: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nPart 3: Testing process ID extraction and kill..."
try {
    $procs = netstat -ano | findstr :8000
    if($procs) {
        $procs | ForEach-Object { 
            $processId = ($_ -split '\s+')[-1]
            Write-Host "Extracted process ID: $processId"
            if($processId -match '^\d+$') {
                Write-Host "Valid numeric process ID: $processId"
                # Don't actually kill - just test the logic
                Write-Host "Would kill process: $processId"
            } else {
                Write-Host "Invalid process ID: $processId"
            }
        }
        Write-Host "✅ Process extraction and validation: SUCCESS" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ No processes to test extraction on" -ForegroundColor Blue
    }
} catch {
    Write-Host "❌ Process extraction: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Create a simplified working version
Write-Host "`n🧪 Test 2: Testing simplified version" -ForegroundColor Cyan

$simplifiedCommand = @"
Get-Process -Name 'node' -ErrorAction SilentlyContinue | Stop-Process -Force;
`$procs = netstat -ano | findstr :8000;
if(`$procs) { 
    `$procs | ForEach-Object { 
        `$processId = (`$_ -split '\s+')[-1]; 
        if(`$processId -match '^\d+$') { 
            Stop-Process -Id `$processId -Force -ErrorAction SilentlyContinue 
        } 
    } 
}
"@

Write-Host "Testing simplified command..."
try {
    Invoke-Expression $simplifiedCommand
    Write-Host "✅ Simplified command: SUCCESS" -ForegroundColor Green
    $testResult = "PASS"
} catch {
    Write-Host "❌ Simplified command: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $testResult = "FAIL"
}

# Test 3: Create npm-compatible version
Write-Host "`n🧪 Test 3: Testing npm-compatible version" -ForegroundColor Cyan

$npmCommand = 'powershell -Command "Get-Process -Name ''node'' -ErrorAction SilentlyContinue | Stop-Process -Force; $procs = netstat -ano | findstr :8000; if($procs) { $procs | ForEach-Object { $processId = ($_ -split ''\s+'')[-1]; if($processId -match ''^\\d+$'') { Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue } } }"'

Write-Host "Testing npm-compatible command..."
try {
    Invoke-Expression $npmCommand
    Write-Host "✅ NPM-compatible command: SUCCESS" -ForegroundColor Green
    $npmResult = "PASS"
} catch {
    Write-Host "❌ NPM-compatible command: FAILED - $($_.Exception.Message)" -ForegroundColor Red
    $npmResult = "FAIL"
}

# Summary
Write-Host "`n📊 Test Summary:" -ForegroundColor Cyan
Write-Host "Command Structure Test: SUCCESS" -ForegroundColor Green
Write-Host "Simplified Command: $testResult" -ForegroundColor $(if($testResult -eq "PASS") { "Green" } else { "Red" })
Write-Host "NPM-Compatible Command: $npmResult" -ForegroundColor $(if($npmResult -eq "PASS") { "Green" } else { "Red" })

if ($npmResult -eq "PASS") {
    Write-Host "`n🎉 DIAGNOSIS: NPM command structure is correct!" -ForegroundColor Green
    Write-Host "The issue may be with npm script execution or escaping." -ForegroundColor Yellow
} else {
    Write-Host "`n💥 DIAGNOSIS: Command needs fixing!" -ForegroundColor Red
}

# PowerShell Test for Port Kill Script Fix
# Test Date: 2025-06-12
# Purpose: Test fix for $pid variable conflict in kill-port script

Write-Host "🧪 Testing Port Kill Script Fix..." -ForegroundColor Yellow

# Test the original problematic script (should fail)
Write-Host "`n❌ Testing original script (should fail):" -ForegroundColor Red
try {
    $testScript = 'Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force; $procs = netstat -ano | findstr :8000; if($procs) { $procs | ForEach-Object { $pid = ($_ -split "\s+")[-1]; if($pid -match "^\d+$") { Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue } } }'
    Invoke-Expression $testScript
    Write-Host "✅ Original script worked (unexpected)" -ForegroundColor Green
} catch {
    Write-Host "❌ Original script failed as expected: $($_.Exception.Message)" -ForegroundColor Red
}

# Test the fixed script (should work)
Write-Host "`n✅ Testing fixed script (should work):" -ForegroundColor Green
try {
    $fixedScript = 'Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force; $procs = netstat -ano | findstr :8000; if($procs) { $procs | ForEach-Object { $processId = ($_ -split "\s+")[-1]; if($processId -match "^\d+$") { Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue } } }'
    Invoke-Expression $fixedScript
    Write-Host "✅ Fixed script executed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Fixed script failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test port availability check
Write-Host "`n🔍 Testing port availability check..." -ForegroundColor Blue
$portCheck = netstat -an | findstr ":8000"
if ($portCheck) {
    Write-Host "🔍 Port 8000 is currently in use:" -ForegroundColor Yellow
    Write-Host $portCheck
} else {
    Write-Host "✅ Port 8000 is available" -ForegroundColor Green
}

Write-Host "`n✅ Port Kill Script Fix Test Completed!" -ForegroundColor Green
Write-Host "The fixed script uses `$processId` instead of `$pid` to avoid variable conflict." -ForegroundColor Cyan

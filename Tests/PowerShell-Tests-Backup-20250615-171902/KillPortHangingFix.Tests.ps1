# PowerShell Command Hanging Diagnostic Test
# Test to identify why kill-port command hangs and needs Enter key
# Date: 2025-06-12

Write-Host "🧪 Testing PowerShell Command Hanging Issue" -ForegroundColor Yellow

# Test the current command that hangs
Write-Host "`n🔍 Testing current kill-port command:" -ForegroundColor Cyan
$currentCommand = 'try { $nodeProcs = Get-Process -Name "node" -ErrorAction SilentlyContinue; if($nodeProcs) { $nodeProcs | Stop-Process -Force; Write-Host "Killed node processes" }; $procs = netstat -ano | findstr :8000; if($procs) { $killed = 0; $procs | ForEach-Object { $processId = ($_ -split "\s+")[-1]; if($processId -match "^\d+$") { try { Stop-Process -Id $processId -Force -ErrorAction Stop; $killed++ } catch {} } }; if($killed -gt 0) { Write-Host "Killed $killed processes on port 8000" } }; Write-Host "Port cleanup completed"; exit 0 } catch { Write-Host "Error during cleanup"; exit 1 }'

Write-Host "Command: $currentCommand" -ForegroundColor Gray

# Test with timeout to see if it hangs
Write-Host "`n⏱️ Testing with 5-second timeout..." -ForegroundColor Yellow
$job = Start-Job -ScriptBlock { 
    param($cmd)
    Invoke-Expression $cmd
} -ArgumentList $currentCommand

$completed = Wait-Job $job -Timeout 5
if ($completed) {
    $result = Receive-Job $job
    Write-Host "✅ Command completed within 5 seconds" -ForegroundColor Green
    Write-Host "Output: $result" -ForegroundColor Gray
    Remove-Job $job
} else {
    Write-Host "❌ Command is hanging (timed out after 5 seconds)" -ForegroundColor Red
    Stop-Job $job
    Remove-Job $job
}

# Test improved version that shouldn't hang
Write-Host "`n✅ Testing improved non-hanging version:" -ForegroundColor Green
$improvedCommand = 'try { Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue; $procs = netstat -ano | findstr ":8000" 2>$null; if($procs) { $procs | ForEach-Object { $processId = ($_.Split(" ", [System.StringSplitOptions]::RemoveEmptyEntries))[-1]; if($processId -match "^\d+$") { Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue } } }; Write-Host "Port cleanup completed" } catch { Write-Host "Port cleanup completed with errors" }'

$job2 = Start-Job -ScriptBlock { 
    param($cmd)
    Invoke-Expression $cmd
} -ArgumentList $improvedCommand

$completed2 = Wait-Job $job2 -Timeout 3
if ($completed2) {
    $result2 = Receive-Job $job2
    Write-Host "✅ Improved command completed within 3 seconds" -ForegroundColor Green
    Write-Host "Output: $result2" -ForegroundColor Gray
    Remove-Job $job2
    $testResult = "PASS"
} else {
    Write-Host "❌ Improved command also hanging" -ForegroundColor Red
    Stop-Job $job2
    Remove-Job $job2
    $testResult = "FAIL"
}

# Test summary
Write-Host "`n📊 Test Summary:" -ForegroundColor Cyan
Write-Host "Current Command: HANGS (requires Enter key)" -ForegroundColor Red
Write-Host "Improved Command: $testResult" -ForegroundColor $(if($testResult -eq "PASS") { "Green" } else { "Red" })

if ($testResult -eq "PASS") {
    Write-Host "`n🎉 Test PASSED - Ready to implement fix!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n💥 Test FAILED - Need different approach!" -ForegroundColor Red
    exit 1
}

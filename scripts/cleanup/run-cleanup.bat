@echo off
echo Running WB Cleanup Script...
powershell -ExecutionPolicy Bypass -File "%~dp0cleanup-duplicates.ps1"
pause

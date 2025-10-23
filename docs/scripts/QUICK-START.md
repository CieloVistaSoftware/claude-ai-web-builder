# Quick Start - Run Status Aggregation

## Option 1: From PowerShell (Recommended)

```powershell
cd C:\Users\jwpmi\Downloads\AI\wb
.\docs\scripts\update-status.ps1
```

## Option 2: Direct Path

```powershell
& "C:\Users\jwpmi\Downloads\AI\wb\docs\scripts\update-status.ps1"
```

## Option 3: Windows Command Prompt

```cmd
cd C:\Users\jwpmi\Downloads\AI\wb
powershell -NoProfile -ExecutionPolicy Bypass -File ".\docs\scripts\update-status.ps1"
```

## What Happens

1. Script reads all `/components/*/claude.md` files
2. Script reads `/CLAUDE.md` and `/tests/claude.md`
3. Script reads all `/docs/_today/*.md` files
4. Script extracts status and issues
5. Script generates `/docs/status/currentstatus.md`
6. Script creates mirror at `/docs/todo/currentstatus.md`
7. Console shows summary of findings

## If You Get an Error

### Error: "Cannot find path"
- Make sure you're in the right directory: `cd C:\Users\jwpmi\Downloads\AI\wb`
- Check that the script exists: `ls .\docs\scripts\`

### Error about ExecutionPolicy
- Run: `Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process`
- Then run the script again

### Error about PSCommandPath
- The script is fixed - just run again with the latest version

## Output Files

After running successfully, you'll have:
- `/docs/status/currentstatus.md` - PRIMARY master file
- `/docs/todo/currentstatus.md` - MIRROR copy

Both contain the complete aggregated project status!


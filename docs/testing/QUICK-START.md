# 🚀 WB FRAMEWORK - QUICK TEST REFERENCE

**TL;DR - Just want to run tests?**

---

## ⚡ SUPER QUICK START (2 Minutes)

### Step 1: Open File
```
Download: wb-component-unit-tests.html
Open in: Any web browser
```

### Step 2: Run Tests
```
Click button: "▶ Run All Tests"
Wait: ~5 seconds
```

### Step 3: Check Results
```
Green ✓ = Component works
Red ✗ = Component broken
See stats at top for: Total/Passed/Failed
```

---

## 🎯 WHAT GETS TESTED

✅ All components exist  
✅ All demos load  
✅ All CSS works  
✅ All JavaScript runs  
✅ All paths are correct  
✅ All JSON is valid  
✅ All HTML is valid  

---

## 📊 EXPECTED RESULT

```
✓ Passed: 21
✗ Failed: 0  
⏱ Duration: < 5 seconds
📈 Coverage: 100%
```

---

## 🔧 COMMAND LINE (Advanced)

```bash
# Run tests
node wb-component-tests.js

# Output:
# 📋 File Structure Tests
# ============================================================
# ✓ components folder exists
# ✓ manifest.json exists and is valid
# ✓ ...
#
# 📊 TEST SUMMARY
# ✓ File Structure: 4/4 (100%)
# ...
# Total: 21 passed, 0 failed
```

---

## 🚨 IF TESTS FAIL

1. **Read error message**
2. **Find file mentioned**
3. **Look for the problem**
4. **Fix it**
5. **Re-run tests**

Example:
```
✗ Demo file validation
  Error: Malformed path found (..../../)
  In: wb-resize-panel-demo.html
  
→ Fix: Change ..../../ to ../../
→ Re-run test
```

---

## 📁 FILES YOU GET

```
wb-component-unit-tests.html    ← Open in browser
wb-component-tests.js           ← Run: node wb-component-tests.js
COMPREHENSIVE-GUIDE.md          ← Full guide
FRAMEWORK-OVERVIEW.md           ← Full summary
QUICK-START.md                  ← This file
```

---

## ✨ 5-SECOND TEST

**Browser:**
```javascript
// Open F12, paste this:
console.log('✓ JavaScript works');
```

**Components:**
```html
<!-- Each component should load without errors -->
<wb-button></wb-button>
<wb-input></wb-input>
<wb-select></wb-select>
```

**Network Tab (F12):**
```
Should see: CSS/JS files loading (green)
Should NOT see: 404 errors (red)
```

---

## 🎓 UNDERSTAND RESULTS

| Result | Meaning | Action |
|--------|---------|--------|
| ✓ Green | Test passed | No action needed |
| ✗ Red | Test failed | Fix issue and re-run |
| ⏳ Running | Test in progress | Wait for completion |
| ⊘ Skipped | Test skipped | Not applicable |

---

## 📈 WHAT GOOD LOOKS LIKE

```
╔════════════════════════════════════╗
║  🧪 WB COMPONENT UNIT TEST SUITE  ║
╚════════════════════════════════════╝

[▶ Run All Tests] [↻ Reset] [✕ Clear]

📊 STATS:
  Passed: 21  |  Failed: 0  |  Total: 21

✓ All tests passed!
📈 Coverage: 100%
⏱ Duration: 2.5 seconds
```

---

## 🆘 COMMON ISSUES

### "Test file won't open"
→ Make sure file is in correct location  
→ Try double-clicking file  
→ Or open browser and drag file into it

### "Tests don't run"
→ Click "Run All Tests" button  
→ Check browser console (F12) for errors  
→ Try refreshing page (F5)

### "See red failed tests"
→ Read error message  
→ Go to file mentioned  
→ Find and fix issue  
→ Run tests again

### "Node tests fail"
→ Verify node installed: `node --version`  
→ Check file paths are correct  
→ Run from project root directory

---

## 💪 MAKE IT PART OF YOUR WORKFLOW

### Before committing:
```bash
node wb-component-tests.js
# If all pass → commit
# If any fail → fix then commit
```

### Before releasing:
```bash
# Run browser tests
open wb-component-unit-tests.html
# Click: Run All Tests
# Check: 100% pass rate
```

### Before deploying:
```bash
npm run test:components
# Ensure CI/CD passes
```

---

## 🎯 SUCCESS CHECKLIST

- [ ] File opens in browser without errors
- [ ] "Run All Tests" button works
- [ ] Tests complete in < 10 seconds
- [ ] 21 tests shown
- [ ] 0 failures (all green)
- [ ] 100% coverage
- [ ] Can run Node tests: `node wb-component-tests.js`
- [ ] No 404 errors in Network tab

---

## 🚀 THAT'S IT!

You now have a complete test framework that:
- ✅ Proves components work
- ✅ Catches regressions
- ✅ Validates file structure
- ✅ Integrates with CI/CD
- ✅ Runs in browser or Node.js

**Next step:** Open `wb-component-unit-tests.html` and click "Run All Tests" 🎉

---

## 📞 QUICK REFERENCE

| Task | Command |
|------|---------|
| Run browser tests | Open `wb-component-unit-tests.html` |
| Run Node tests | `node wb-component-tests.js` |
| Save test results | `node wb-component-tests.js > results.txt` |
| View documentation | Open `COMPREHENSIVE-GUIDE.md` |
| See full summary | Open `FRAMEWORK-OVERVIEW.md` |

---

**Status:** ✅ READY  
**Time to run:** < 5 seconds  
**Pass rate:** 100% expected  
**Go test! 🚀**

# 🚀 Implementation Checklist: Auto-Inject wb-event-log

## Phase 1: Add Static Properties to WBBaseComponent

- [ ] **File**: `components/wb-base/wb-base.js`
- [ ] **Location**: Right after class declaration, before constructor
- [ ] **Code**:
```javascript
export class WBBaseComponent extends HTMLElement {
    // ✅ Add these static properties
    static _globalEventLogInitialized = false;
    static _globalEventLog = null;
    
    constructor() {
        super();
        // ... rest of existing code
    }
}
```

## Phase 2: Add Auto-Injection Trigger in Constructor

- [ ] **File**: `components/wb-base/wb-base.js`
- [ ] **Location**: Inside constructor, immediately after `super()` call
- [ ] **Code**:
```javascript
constructor() {
    super();
    
    // ✅ Add this check
    if (!WBBaseComponent._globalEventLogInitialized) {
        WBBaseComponent._initializeGlobalEventLog();
    }
    
    // ... rest of existing constructor code
}
```

## Phase 3: Implement Auto-Injection Method

- [ ] **File**: `components/wb-base/wb-base.js`
- [ ] **Location**: End of WBBaseComponent class (after last method)
- [ ] **Code**: Copy the entire `_initializeGlobalEventLog()` static method from `AUTO_INJECT_WBEVENTLOG.md`

## Phase 4: Add Helper Methods

- [ ] **File**: `components/wb-base/wb-base.js`
- [ ] **Location**: End of WBBaseComponent class
- [ ] **Add Method 1 - getGlobalEventLog()**:
```javascript
static getGlobalEventLog() {
    return WBBaseComponent._globalEventLog;
}
```

- [ ] **Add Method 2 - toggleEventLogVisibility()**:
```javascript
static toggleEventLogVisibility() {
    if (WBBaseComponent._globalEventLog) {
        const current = WBBaseComponent._globalEventLog.style.display;
        WBBaseComponent._globalEventLog.style.display = 
            current === 'none' ? 'flex' : 'none';
        return WBBaseComponent._globalEventLog.style.display !== 'none';
    }
    return false;
}
```

## Phase 5: Test Auto-Injection

- [ ] **Create test HTML** with a single WB component (no explicit event log):
```html
<!DOCTYPE html>
<html>
<head>
    <script src="/config.js"></script>
    <script src="../../utils/auto-loader.js"></script>
</head>
<body>
    <wb-control-panel></wb-control-panel>
    <script>
        setTimeout(() => {
            console.log('Event Log:', WBBaseComponent.getGlobalEventLog());
            console.log('Initialized:', WBBaseComponent._globalEventLogInitialized);
        }, 500);
    </script>
</body>
</html>
```

- [ ] **Verify in console**:
  - [ ] `WBBaseComponent._globalEventLogInitialized` is `true`
  - [ ] `WBBaseComponent.getGlobalEventLog()` returns a DOM element
  - [ ] Element has id `wb-global-event-log`
  - [ ] Element is initially hidden (display: none)

## Phase 6: Test Event Capture

- [ ] **Trigger event**:
```javascript
// In console:
WBBaseComponent.toggleEventLogVisibility();  // Make it visible

document.dispatchEvent(new CustomEvent('wb:info', {
    detail: { message: 'Test event' }
}));
```

- [ ] **Verify**: Event appears in the event log

## Phase 7: Test Toggle Functionality

- [ ] **Run in console**:
```javascript
// Toggle on
WBBaseComponent.toggleEventLogVisibility();  // Should return true, show visible
// Check: Event log appears in bottom-right corner

// Toggle off
WBBaseComponent.toggleEventLogVisibility();  // Should return false
// Check: Event log hides
```

## Phase 8: Test Backward Compatibility

- [ ] **Create HTML with explicit event log**:
```html
<wb-event-log></wb-event-log>  <!-- User-provided -->
<wb-control-panel></wb-control-panel>
```

- [ ] **Verify**:
  - [ ] No duplicate event logs created
  - [ ] `WBBaseComponent.getGlobalEventLog()` returns the user-provided one
  - [ ] System reuses existing event log

## Phase 9: Test Edge Cases

- [ ] **No wb-event-log registered**:
  - [ ] Should create one without errors
  - [ ] Graceful fallback if import fails

- [ ] **Multiple WB components**:
  - [ ] Only one event log created (not multiple)
  - [ ] All components use same event log

- [ ] **Event log already in DOM**:
  - [ ] Detects and uses existing one
  - [ ] Doesn't create duplicate

## Phase 10: Update Documentation

- [ ] **Update component README**: Note that explicit `<wb-event-log>` is optional
- [ ] **Update migration guide**: Show before/after examples
- [ ] **Add to claude.md**: Document the auto-injection feature

## Phase 11: Clean Up

- [ ] **Remove old explicit event log includes** from:
  - [ ] `wb-event-log-demo.html` (if needed)
  - [ ] Test files
  - [ ] Documentation examples

- [ ] **Update wb-event-log.js header** - Already done ✅

## Verification Commands

```javascript
// Quick verification in console:
console.log('✅ Initialized:', WBBaseComponent._globalEventLogInitialized);
console.log('✅ Event Log ID:', WBBaseComponent.getGlobalEventLog()?.id);
console.log('✅ Display:', WBBaseComponent.getGlobalEventLog()?.style.display);
console.log('✅ Can toggle:', WBBaseComponent.toggleEventLogVisibility());
```

## Rollback Plan (if needed)

If something breaks, simply:

1. Remove the static properties from WBBaseComponent
2. Remove the auto-injection trigger from constructor
3. Remove the static methods
4. Users can add explicit `<wb-event-log>` markup back

## Success Criteria

✅ All boxes checked
✅ Event log auto-creates on first WB component load
✅ Events are captured and displayed
✅ Toggle functionality works
✅ No console errors
✅ Backward compatibility maintained
✅ No performance regression

## Timeline Estimate

- Phase 1-4 (Implementation): 5-10 minutes
- Phase 5-9 (Testing): 10-15 minutes
- Phase 10-11 (Documentation): 5 minutes

**Total: ~30 minutes** ⏱️

## Questions?

If anything fails:
1. Check browser console for errors
2. Verify wb-event-log.js is loaded properly
3. Check that WBBaseComponent modifications are syntactically correct
4. Verify event log element is appended to document.body (not other parent)

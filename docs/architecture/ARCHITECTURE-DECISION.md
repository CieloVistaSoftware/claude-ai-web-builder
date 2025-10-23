# JavaScript Architecture Decision - Prototypes vs WBBaseComponent

**File**: `ARCHITECTURE-DECISION.md`  
**Location**: `/docs/architecture/`  
**Date**: October 22, 2025  
**Priority**: 🔴 CRITICAL - Foundational decision  
**Status**: ⏳ **DECISION IN PROGRESS**

---

## 🎯 The Question

> "Because this entire project is JavaScript, are we better off adding all properties and functions to the prototypes of our modules? That does follow the 'favor composition over inheritance' principle because properties are always compositional in nature."

---

## 📋 Decision Matrix

### Option A: **Prototype-Based Composition** ✨ RECOMMENDED

#### Approach
```javascript
// All properties/methods on prototype
WBButton.prototype.render = function() { /* ... */ };
WBButton.prototype.setVariant = function(v) { /* ... */ };
WBButton.prototype.disabled = false;
WBButton.prototype.onClick = null;

// Components remain HTMLElement-based
class WBButton extends HTMLElement {
    connectedCallback() {
        this.render();
    }
}
```

#### Advantages ✅
1. **True Composition** - Properties are compositional, not inherited
2. **DRY Principle** - Shared functionality once on prototype
3. **Memory Efficient** - Methods shared across all instances
4. **Flexible** - Can override/extend on instance basis
5. **Simpler Testing** - Each component can be tested independently
6. **No Super Class Dependency** - Each component self-contained
7. **Matches Web Standards** - Aligns with native Web Components approach

#### Disadvantages ❌
1. **Less IDE Support** - No TypeScript/autocomplete for prototype methods
2. **More Manual Setup** - Each component needs explicit prototype methods
3. **No Validation** - No compile-time checking (but this project doesn't use TS anyway)

#### Impact on Existing Code
- **Current**: 8 components extend WBBaseComponent
- **Change**: Keep them as HTMLElement, add methods to prototype
- **Benefit**: Simpler, more flexible, true composition

---

### Option B: **WBBaseComponent Inheritance** (Current Approach)

#### Approach
```javascript
// Shared functionality in base class
class WBBaseComponent extends HTMLElement {
    logInfo() { /* ... */ }
    fireEvent() { /* ... */ }
    render() { /* abstract */ }
}

// Components extend the base
class WBButton extends WBBaseComponent {
    render() { /* ... */ }
}
```

#### Advantages ✅
1. **IDE Support** - Good autocomplete and type hints
2. **Shared Patterns** - Common methods centralized
3. **Consistent API** - All components have same interface

#### Disadvantages ❌
1. **Inheritance Chain** - Violates "composition over inheritance"
2. **Tight Coupling** - Components depend on WBBaseComponent
3. **Hard to Extend** - Adding new behavior requires modifying base class
4. **Memory Overhead** - Less efficient than prototypes
5. **Not Web Standards** - Most Web Components don't extend a custom base

---

## 🏆 **RECOMMENDATION: PROTOTYPE-BASED COMPOSITION**

### Why This Decision

1. **Truly Compositional** - Properties are compositional by nature, not inherited
2. **Project Alignment** - You already have 41 components written as modules
3. **JavaScript Philosophy** - Prototypes are idiomatic JavaScript
4. **Web Standards** - Native Web Components don't use inheritance bases
5. **Flexibility** - Components can compose any mix of behaviors they need
6. **Project Maturity** - You don't need TypeScript benefits at this stage

### Implementation Plan

#### Phase 1: Stop Using WBBaseComponent
- Don't add new components extending WBBaseComponent
- Keep existing 8 components working (no immediate migration needed)
- Use WBBaseComponent as reference for common patterns only

#### Phase 2: New Components Use Prototypes
For all **new components** going forward:

```javascript
// wb-example.js

// 1. Define the class
class WBExample extends HTMLElement {
    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }
    
    disconnectedCallback() {
        this.cleanup();
    }
}

// 2. Add methods to prototype (these are COMPOSED, not inherited)
WBExample.prototype.render = function() {
    const html = `
        <div class="wb-example">
            <!-- HTML -->
        </div>
    `;
    this.innerHTML = html;
};

WBExample.prototype.attachEventListeners = function() {
    this.querySelector('.btn')?.addEventListener('click', () => this.handleClick());
};

WBExample.prototype.handleClick = function() {
    this.fireEvent('wb:click', { source: this });
};

WBExample.prototype.fireEvent = function(eventName, detail = {}) {
    this.dispatchEvent(new CustomEvent(eventName, { 
        bubbles: true, 
        composed: true,
        detail 
    }));
};

WBExample.prototype.logInfo = function(message) {
    console.log(`[wb-example] ${message}`);
    this.fireEvent('wb:info', { message });
};

// 3. Register component
customElements.define('wb-example', WBExample);
```

#### Phase 3: Refactor Existing Components (Optional, Long-Term)
- Can gradually migrate existing 8 WBBaseComponent components to prototype approach
- No rush - they work fine now
- Do this only if you want consistency across ALL 41 components

---

## 🎯 Composition Pattern Examples

### Logging Composition
```javascript
WBButton.prototype.logInfo = function(msg) { /* ... */ };
WBButton.prototype.logError = function(msg) { /* ... */ };
WBButton.prototype.logWarning = function(msg) { /* ... */ };
```

### Event Composition
```javascript
WBButton.prototype.fireEvent = function(name, detail) { /* ... */ };
WBButton.prototype.addListener = function(name, handler) { /* ... */ };
```

### Rendering Composition
```javascript
WBButton.prototype.render = function() { /* ... */ };
WBButton.prototype.update = function() { /* ... */ };
```

### Attribute Composition
```javascript
WBButton.prototype.getAttribute = function(attr) { /* ... */ };
WBButton.prototype.setAttribute = function(attr, val) { /* ... */ };
```

---

## ✅ Decision Checklist

- [ ] **Approval**: Confirm prototype-based composition is preferred approach
- [ ] **Communication**: Notify team about new component development pattern
- [ ] **Documentation**: Update ARCHITECTURE-STANDARDS.md with prototype pattern
- [ ] **Templates**: Update component template to use prototype methods
- [ ] **Examples**: Create reference implementation for new components

---

## 📊 Implementation Timeline

| Phase | Task | Timeline | Status |
|-------|------|----------|--------|
| **Now** | ✅ Make this decision | Today | ⏳ AWAITING |
| **Week 1** | ✅ Document prototype pattern | This week | ⏳ AWAITING |
| **Week 1** | ✅ Update component template | This week | ⏳ AWAITING |
| **Week 2-3** | ✅ Create 2-3 new components with prototype approach | Next 2 weeks | ⏳ AWAITING |
| **Month 2+** | ✅ Optional: Refactor existing 8 components | Optional | ⏳ FUTURE |

---

## 🔗 Related Tasks

Once this decision is made, it unblocks:

1. ✅ **wb-nav Interactive Examples** (Task #3)
   - Can use prototype-based event handling
   
2. ✅ **wb-tab Injectable Configuration** (Task #4)
   - Can use prototype methods for configuration
   
3. ✅ **Testing Infrastructure** (Task #1)
   - Can test prototype methods directly
   - Simpler test mocking without base class

---

## 💾 Save This Decision

This decision applies to:
- ✅ All **NEW components** going forward
- ✅ **Reference** for understanding existing WBBaseComponent
- ✅ **Guidance** for prototype method patterns
- ℹ️ Existing 8 WBBaseComponent components can stay as-is (working fine)

---

**Decision Status**: ⏳ **AWAITING CONFIRMATION**

**Next Action**: Confirm this approach, then proceed to wb-nav interactive examples implementation.

---

**Last Updated**: October 22, 2025  
**Location**: `/docs/architecture/ARCHITECTURE-DECISION.md`

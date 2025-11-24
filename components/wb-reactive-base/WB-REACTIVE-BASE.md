# WB Reactive Base Component

**Proxy-based reactive state management for all WB components**

## 🎯 What Is This?

A base class that adds automatic reactivity to your Web Components. Change state, UI updates automatically - no manual `render()` calls needed!

## ✨ Features

- ✅ **Automatic UI Updates** - Change state → UI updates
- ✅ **Deep Reactivity** - Nested objects and arrays are reactive
- ✅ **Batched Updates** - Multiple state changes = single render
- ✅ **Performance Tracking** - Built-in metrics
- ✅ **Lifecycle Hooks** - beforeUpdate, afterUpdate, onStateChange
- ✅ **Debug Helpers** - logState(), watch(), getMetrics()
- ✅ **Event Dispatching** - Fires `wb:state-changed` and `wb:updated`

---

## 🚀 Quick Start

### **Basic Usage:**

```javascript
import { WBReactiveBase } from '../wb-reactive-base/wb-reactive-base.js';

class WBCounter extends WBReactiveBase {
    constructor() {
        super();
        
        // Define reactive state
        this.state = {
            count: 0
        };
    }
    
    connectedCallback() {
        super.connectedCallback();
        this.render(); // Initial render
    }
    
    // Render method - called automatically when state changes
    render() {
        this.innerHTML = `
            <div>
                <h2>Count: ${this.state.count}</h2>
                <button onclick="this.parentElement.increment()">+</button>
                <button onclick="this.parentElement.decrement()">-</button>
            </div>
        `;
    }
    
    increment() {
        this.state.count++; // ✨ UI updates automatically!
    }
    
    decrement() {
        this.state.count--; // ✨ UI updates automatically!
    }
}

customElements.define('wb-counter', WBCounter);
```

**Usage:**
```html
<wb-counter></wb-counter>
```

---

## 📚 API Reference

### **State Management:**

#### `this.state` (getter/setter)
```javascript
// Get state
const currentCount = this.state.count;

// Set entire state object
this.state = { count: 10, name: 'Counter' };

// Change individual properties (triggers update)
this.state.count = 5;
```

#### `setState(updates)`
Update multiple properties at once (more efficient):
```javascript
this.setState({
    count: 10,
    name: 'Counter',
    active: true
});
```

#### `getState()`
Get state as plain object (non-reactive):
```javascript
const plainState = this.getState();
console.log(plainState); // { count: 10, name: 'Counter' }
```

#### `resetState(initialState)`
Reset to initial state:
```javascript
this.resetState({ count: 0 });
```

---

### **Lifecycle Hooks:**

#### `render()` - REQUIRED
```javascript
render() {
    this.innerHTML = `<div>${this.state.value}</div>`;
}
```

#### `beforeUpdate(changes)`
Called before render:
```javascript
beforeUpdate(changes) {
    console.log('About to update:', changes);
}
```

#### `afterUpdate(changes)`
Called after render:
```javascript
afterUpdate(changes) {
    console.log('Updated:', changes);
}
```

#### `onStateChange(property, newValue, oldValue)`
Called for each state change:
```javascript
onStateChange(property, newValue, oldValue) {
    if (property === 'count') {
        console.log(`Count changed: ${oldValue} → ${newValue}`);
    }
}
```

---

### **Update Control:**

#### `requestUpdate()`
Manually request an update:
```javascript
this.requestUpdate(); // Schedules a render
```

---

### **Debug Methods:**

#### `logState()`
Log current state to console:
```javascript
this.logState();
// 🔄 State: wb-counter
//   Current State: { count: 5 }
//   Metrics: { renderCount: 3, lastRenderTime: 1.2ms }
```

#### `getMetrics()`
Get performance metrics:
```javascript
const metrics = this.getMetrics();
// { renderCount: 10, lastRenderTime: 2.1, averageRenderTime: 1.8 }
```

#### `watch(property, callback)`
Watch a specific property:
```javascript
this.watch('count', (newValue, oldValue) => {
    console.log(`Count: ${oldValue} → ${newValue}`);
});
```

---

## 🎨 Examples

### **Example 1: Todo List**

```javascript
class WBTodoList extends WBReactiveBase {
    constructor() {
        super();
        this.state = {
            todos: [],
            input: ''
        };
    }
    
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    
    render() {
        this.innerHTML = `
            <div>
                <input 
                    value="${this.state.input}" 
                    onInput="this.parentElement.updateInput(event)"
                    placeholder="Add todo..."
                />
                <button onclick="this.parentElement.addTodo()">Add</button>
                
                <ul>
                    ${this.state.todos.map((todo, i) => `
                        <li>
                            ${todo}
                            <button onclick="this.parentElement.removeTodo(${i})">×</button>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    updateInput(event) {
        this.state.input = event.target.value;
    }
    
    addTodo() {
        if (this.state.input.trim()) {
            this.state.todos = [...this.state.todos, this.state.input];
            this.state.input = '';
        }
    }
    
    removeTodo(index) {
        this.state.todos = this.state.todos.filter((_, i) => i !== index);
    }
}

customElements.define('wb-todo-list', WBTodoList);
```

---

### **Example 2: Form with Validation**

```javascript
class WBForm extends WBReactiveBase {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {},
            isValid: false
        };
    }
    
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    
    onStateChange(property, newValue) {
        // Validate on state change
        if (property === 'email' || property === 'password') {
            this.validate();
        }
    }
    
    validate() {
        const errors = {};
        
        if (!this.state.email.includes('@')) {
            errors.email = 'Invalid email';
        }
        
        if (this.state.password.length < 6) {
            errors.password = 'Password too short';
        }
        
        this.setState({
            errors,
            isValid: Object.keys(errors).length === 0
        });
    }
    
    render() {
        this.innerHTML = `
            <form onsubmit="event.preventDefault(); this.parentElement.submit()">
                <input 
                    type="email" 
                    value="${this.state.email}"
                    onInput="this.parentElement.updateEmail(event)"
                    placeholder="Email"
                />
                ${this.state.errors.email ? `<p style="color:red">${this.state.errors.email}</p>` : ''}
                
                <input 
                    type="password" 
                    value="${this.state.password}"
                    onInput="this.parentElement.updatePassword(event)"
                    placeholder="Password"
                />
                ${this.state.errors.password ? `<p style="color:red">${this.state.errors.password}</p>` : ''}
                
                <button type="submit" ${!this.state.isValid ? 'disabled' : ''}>
                    Submit
                </button>
            </form>
        `;
    }
    
    updateEmail(event) {
        this.state.email = event.target.value;
    }
    
    updatePassword(event) {
        this.state.password = event.target.value;
    }
    
    submit() {
        if (this.state.isValid) {
            console.log('Form submitted:', this.getState());
        }
    }
}

customElements.define('wb-form', WBForm);
```

---

### **Example 3: Nested State**

```javascript
class WBProfile extends WBReactiveBase {
    constructor() {
        super();
        this.state = {
            user: {
                name: 'John',
                address: {
                    city: 'New York',
                    zip: '10001'
                }
            }
        };
    }
    
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    
    render() {
        this.innerHTML = `
            <div>
                <h2>${this.state.user.name}</h2>
                <p>${this.state.user.address.city}, ${this.state.user.address.zip}</p>
                <button onclick="this.parentElement.updateCity()">Change City</button>
            </div>
        `;
    }
    
    updateCity() {
        // Nested objects are reactive!
        this.state.user.address.city = 'Los Angeles';
        this.state.user.address.zip = '90001';
    }
}

customElements.define('wb-profile', WBProfile);
```

---

## 🔄 Events

### `wb:state-changed`
Fired when any state property changes:
```javascript
component.addEventListener('wb:state-changed', (e) => {
    console.log('State changed:', e.detail);
    // {
    //   property: 'count',
    //   newValue: 5,
    //   oldValue: 4,
    //   state: { count: 5, ... }
    // }
});
```

### `wb:updated`
Fired after component updates:
```javascript
component.addEventListener('wb:updated', (e) => {
    console.log('Render metrics:', e.detail);
    // {
    //   renderCount: 10,
    //   renderTime: 2.1
    // }
});
```

---

## ⚡ Performance

### **Batched Updates**
Multiple state changes are batched into a single render:

```javascript
// This only triggers ONE render
this.state.count = 1;
this.state.name = 'Test';
this.state.active = true;
```

### **Optimization Tips**

1. **Use `setState()` for bulk updates:**
```javascript
// ✅ Good - One update
this.setState({ count: 1, name: 'Test', active: true });

// ❌ Slower - Three updates (still batched, but less efficient)
this.state.count = 1;
this.state.name = 'Test';
this.state.active = true;
```

2. **Track performance:**
```javascript
const metrics = this.getMetrics();
if (metrics.lastRenderTime > 16) {
    console.warn('Slow render detected');
}
```

---

## 🆚 Comparison

### **Traditional Web Component:**
```javascript
class OldComponent extends HTMLElement {
    set count(val) {
        this._count = val;
        this.render(); // ❌ Manual render
    }
    
    increment() {
        this.count++;
        this.render(); // ❌ Manual render
    }
}
```

### **Reactive Component:**
```javascript
class NewComponent extends WBReactiveBase {
    constructor() {
        super();
        this.state = { count: 0 };
    }
    
    increment() {
        this.state.count++; // ✅ Auto-updates!
    }
}
```

---

## 📝 Migration Guide

### **From WBBaseComponent:**

```javascript
// Before
import { WBBaseComponent } from '../wb-base/wb-base.js';
class MyComponent extends WBBaseComponent { ... }

// After
import { WBReactiveBase } from '../wb-reactive-base/wb-reactive-base.js';
class MyComponent extends WBReactiveBase { ... }
```

### **From wb-layout style:**

Your `wb-layout` already uses this pattern! Just extend `WBReactiveBase` instead of implementing Proxy manually.

---

## 🐛 Debugging

```javascript
// Log state
component.logState();

// Watch property
component.watch('count', (newVal, oldVal) => {
    console.log(`Count changed: ${oldVal} → ${newVal}`);
});

// Check metrics
console.log(component.getMetrics());

// Get plain state
console.log(component.getState());
```

---

## ✅ Best Practices

1. **Always define state in constructor**
2. **Use descriptive state property names**
3. **Implement `render()` method**
4. **Use `setState()` for bulk updates**
5. **Don't mutate state directly in render**
6. **Use lifecycle hooks for side effects**

---

## 🎯 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires Proxy support (all modern browsers)

---

**Version:** 1.0.0
**License:** MIT
**Author:** WB Team

# UserCard - AI/Claude Documentation

---

## 📋 Component Metadata

**Component Name:** user-card  
**Component Class:** UserCard  
**Version:** 2.0.0  
**Created:** 2024-12-15 10:30:00  
**Last Updated:** 2025-01-20 14:45:00  
**Status:** 🟢 Production Ready

### 📁 File Locations

```
user-card/
├── user-card.js           # Component implementation (285 lines)
├── user-card.css          # Component styles (180 lines)
├── user-card.html         # Demo page with examples
├── user-card.md           # Human documentation (600+ lines)
├── claude.md              # This file (AI documentation)
└── schema.json            # Component schema (validated)
```

### 🔗 Important Links

- **Component Documentation:** [user-card.md](./user-card.md)
- **Demo Page:** [user-card.html](./user-card.html)
- **Component Schema:** [schema.json](./schema.json)
- **How to Create Web Components:** [../HowToCreateWebcomponent.md](../HowToCreateWebcomponent.md)
- **Component Guidelines:** [WB Standards](../HowToCreateWebcomponent.md#wb-specific-css-rules--patterns)
- **Live Demo:** [https://your-domain.com/components/user-card/](https://your-domain.com/components/user-card/)

---

## 🐛 Issue Tracking

### Current Issues

```
Total Issues: 2
├── 🟡 P2: 1 issue
└── 🟢 P3: 1 issue
```

#### **[P2 - MEDIUM] Avatar fallback needs improvement**
- **Timestamp:** 2025-01-18 09:15:00
- **File:** user-card.js
- **Line:** 234-240
- **Description:** Avatar fallback icon doesn't respect theme colors properly
- **Impact:** Poor visual consistency in dark mode
- **Fix:** Update CSS to use theme variables for fallback background
- **Assigned:** Development Team
- **Status:** In Progress

#### **[P3 - LOW] Email copy animation could be smoother**
- **Timestamp:** 2025-01-20 14:30:00
- **File:** user-card.js
- **Line:** 189-195
- **Description:** The "Email copied" confirmation could have a smoother fade effect
- **Impact:** Minor UX improvement
- **Fix:** Add CSS transition with cubic-bezier for smoother animation
- **Assigned:** UX Team
- **Status:** Backlog

### Resolved Issues

#### **[P1 - HIGH] ✅ RESOLVED: Click event not firing on mobile**
- **Timestamp:** 2025-01-10 11:20:00
- **Resolved:** 2025-01-12 16:45:00
- **File:** user-card.js
- **Line:** 156-162
- **Description:** Touch events weren't properly handled on mobile devices
- **Fix:** Added touch event listeners and preventDefault for better mobile support
- **Resolution:** Implemented touchstart and touchend handlers with proper event delegation

#### **[P0 - CRITICAL] ✅ RESOLVED: Component fails without email attribute**
- **Timestamp:** 2025-01-05 08:00:00
- **Resolved:** 2025-01-05 10:30:00
- **File:** user-card.js
- **Line:** 145
- **Description:** Component crashed when email attribute was missing
- **Fix:** Added null check and default empty string for email attribute
- **Resolution:** Implemented defensive programming with optional chaining

---

This file provides AI-optimized documentation for the user-card Web Component.

## Component Purpose

Displays user profile information with avatar, name, email, role, and custom actions.

This component is designed to display user profile information in a card format with interactive features. It follows Web Components standards and can be used in any modern web application.

## Usage for AI

When generating code using this component, remember:

1. **Tag Name**: Always use `<user-card>` (with hyphen)
2. **Shadow DOM**: This component uses **open** shadow DOM
3. **Framework Agnostic**: Works with vanilla JS, React, Vue, Angular, etc.
4. **Self-Contained**: All styles are encapsulated within shadow DOM

## Key Attributes

### name

- **Type**: `string`
- **Purpose**: User's full name
- **Required**: No
- **Default**: "Unknown User"

```html
<user-card name="Alice Johnson"></user-card>
```

### email

- **Type**: `string`
- **Purpose**: User's email address
- **Required**: No
- **Features**: Click to copy to clipboard

```html
<user-card email="alice@example.com"></user-card>
```

### avatar

- **Type**: `string`
- **Purpose**: URL to avatar image
- **Required**: No
- **Fallback**: Shows placeholder icon if not provided

```html
<user-card avatar="https://example.com/avatar.jpg"></user-card>
```

### role

- **Type**: `string`
- **Purpose**: User role (admin, user, guest)
- **Required**: No
- **Default**: "user"
- **Valid Values**: admin, user, guest

```html
<user-card role="admin"></user-card>
```

### verified

- **Type**: `boolean`
- **Purpose**: Whether user account is verified
- **Required**: No
- **Usage**: Presence indicates true, absence indicates false

```html
<!-- Verified user -->
<user-card verified></user-card>

<!-- Unverified user -->
<user-card></user-card>
```

## Events

### card-clicked

Fired when the user card is clicked.

**Listening to the event:**

```javascript
const card = document.querySelector('user-card');
card.addEventListener('card-clicked', (event) => {
  console.log('Card clicked:', event.detail);
  // event.detail contains: { name, email, role }
});
```

**Event Detail Structure:**

```javascript
{
  name: "Alice Johnson",
  email: "alice@example.com",
  role: "admin",
  timestamp: 1234567890
}
```

### email-copied

Fired when the email address is successfully copied to clipboard.

**Listening to the event:**

```javascript
card.addEventListener('email-copied', (event) => {
  console.log('Email copied:', event.detail.email);
  // Show notification to user
  alert(`✓ Email copied: ${event.detail.email}`);
});
```

**Event Detail Structure:**

```javascript
{
  email: "alice@example.com"
}
```

## Slots

### actions Slot

Custom action buttons for user interactions.

```html
<user-card>
  <button slot="actions">Message</button>
  <button slot="actions">Follow</button>
  <button slot="actions">Block</button>
</user-card>
```

### badge Slot

Custom badge content displayed next to the user's name.

```html
<user-card>
  <span slot="badge" class="pro-badge">⭐ Pro Member</span>
</user-card>
```

## Common Patterns

### Basic Usage

```html
<user-card name="John Doe" email="john@example.com"></user-card>
```

### With All Attributes

```html
<user-card
  name="Alice Johnson"
  email="alice@example.com"
  avatar="https://example.com/alice.jpg"
  role="admin"
  verified
></user-card>
```

### With Slots

```html
<user-card name="Bob Smith" email="bob@example.com">
  <button slot="actions">Send Message</button>
  <button slot="actions">View Profile</button>
  <span slot="badge" style="background: gold;">🏆 Top Contributor</span>
</user-card>
```

### Programmatic Creation

```javascript
// Create element
const card = document.createElement('user-card');

// Set attributes
card.setAttribute('name', 'Charlie Brown');
card.setAttribute('email', 'charlie@example.com');
card.setAttribute('avatar', 'charlie.jpg');
card.setAttribute('role', 'user');
card.setAttribute('verified', '');

// Add event listeners
card.addEventListener('card-clicked', (e) => {
  console.log('Card clicked:', e.detail);
  // Navigate to profile page
  window.location.href = `/profile/${e.detail.email}`;
});

card.addEventListener('email-copied', (e) => {
  // Show success notification
  showNotification(`Email copied: ${e.detail.email}`);
});

// Append to DOM
document.body.appendChild(card);
```

## Code Examples

### Example 1: User Directory

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="user-card.js"></script>
  <style>
    .user-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
  </style>
</head>
<body>
  <div class="user-grid">
    <user-card
      name="Alice Johnson"
      email="alice@example.com"
      avatar="alice.jpg"
      role="admin"
      verified
    >
      <button slot="actions">Message</button>
      <button slot="actions">View Profile</button>
    </user-card>
    
    <user-card
      name="Bob Smith"
      email="bob@example.com"
      avatar="bob.jpg"
      role="user"
    >
      <button slot="actions">Follow</button>
    </user-card>
    
    <user-card
      name="Carol White"
      email="carol@example.com"
      role="guest"
    >
      <button slot="actions">Invite</button>
    </user-card>
  </div>
</body>
</html>
```

### Example 2: Dynamic User List from API

```javascript
// Fetch users from API and display
async function loadUsers() {
  try {
    const users = await fetch('/api/users').then(r => r.json());
    const container = document.getElementById('user-list');
    
    users.forEach(user => {
      const card = document.createElement('user-card');
      card.setAttribute('name', user.name);
      card.setAttribute('email', user.email);
      card.setAttribute('avatar', user.avatar);
      card.setAttribute('role', user.role);
      
      if (user.verified) {
        card.setAttribute('verified', '');
      }
      
      // Add action buttons
      const messageBtn = document.createElement('button');
      messageBtn.textContent = 'Message';
      messageBtn.slot = 'actions';
      messageBtn.onclick = () => sendMessage(user.email);
      
      const profileBtn = document.createElement('button');
      profileBtn.textContent = 'View Profile';
      profileBtn.slot = 'actions';
      profileBtn.onclick = () => viewProfile(user.id);
      
      card.appendChild(messageBtn);
      card.appendChild(profileBtn);
      
      // Add event listener
      card.addEventListener('card-clicked', (e) => {
        console.log('User card clicked:', e.detail);
      });
      
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}

// Call on page load
loadUsers();
```

### Example 3: Search and Filter

```javascript
// Filter user cards by role
function filterByRole(role) {
  const cards = document.querySelectorAll('user-card');
  
  cards.forEach(card => {
    const cardRole = card.getAttribute('role');
    card.style.display = (role === 'all' || cardRole === role) ? 'block' : 'none';
  });
}

// Search users by name or email
function searchUsers(query) {
  const lowerQuery = query.toLowerCase();
  const cards = document.querySelectorAll('user-card');
  
  cards.forEach(card => {
    const name = card.getAttribute('name').toLowerCase();
    const email = card.getAttribute('email').toLowerCase();
    const matches = name.includes(lowerQuery) || email.includes(lowerQuery);
    
    card.style.display = matches ? 'block' : 'none';
  });
}

// Usage
document.getElementById('role-filter').addEventListener('change', (e) => {
  filterByRole(e.target.value);
});

document.getElementById('search-input').addEventListener('input', (e) => {
  searchUsers(e.target.value);
});
```

## Integration Notes

### Framework Integration

#### Vanilla JavaScript

```javascript
// Select and interact
const card = document.querySelector('user-card');

// Listen to events
card.addEventListener('card-clicked', (e) => {
  console.log('Clicked:', e.detail.name);
});

// Update attributes
card.setAttribute('name', 'New Name');

// Access properties
console.log(card.name); // getter
card.name = 'Another Name'; // setter
```

#### React

```jsx
import { useRef, useEffect } from 'react';

function UserProfile({ user }) {
  const cardRef = useRef();
  
  useEffect(() => {
    const card = cardRef.current;
    
    const handleClick = (e) => {
      console.log('Card clicked:', e.detail);
    };
    
    const handleEmailCopy = (e) => {
      alert(`Copied: ${e.detail.email}`);
    };
    
    card.addEventListener('card-clicked', handleClick);
    card.addEventListener('email-copied', handleEmailCopy);
    
    return () => {
      card.removeEventListener('card-clicked', handleClick);
      card.removeEventListener('email-copied', handleEmailCopy);
    };
  }, []);
  
  return (
    <user-card
      ref={cardRef}
      name={user.name}
      email={user.email}
      avatar={user.avatar}
      role={user.role}
      verified={user.verified || undefined}
    >
      <button slot="actions" onClick={() => sendMessage(user)}>
        Message
      </button>
      <button slot="actions" onClick={() => viewProfile(user)}>
        Profile
      </button>
    </user-card>
  );
}
```

#### Vue 3

```vue
<template>
  <user-card
    :name="user.name"
    :email="user.email"
    :avatar="user.avatar"
    :role="user.role"
    :verified="user.verified || null"
    @card-clicked="handleCardClick"
    @email-copied="handleEmailCopy"
  >
    <button slot="actions" @click="sendMessage">Message</button>
    <button slot="actions" @click="viewProfile">Profile</button>
  </user-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['user']);

const handleCardClick = (event) => {
  console.log('Card clicked:', event.detail);
};

const handleEmailCopy = (event) => {
  alert(`Copied: ${event.detail.email}`);
};

const sendMessage = () => {
  // Send message logic
};

const viewProfile = () => {
  // View profile logic
};
</script>
```

#### Angular

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: `
    <user-card
      #userCard
      [attr.name]="user.name"
      [attr.email]="user.email"
      [attr.avatar]="user.avatar"
      [attr.role]="user.role"
      [attr.verified]="user.verified ? '' : null"
    >
      <button slot="actions" (click)="sendMessage()">Message</button>
      <button slot="actions" (click)="viewProfile()">Profile</button>
    </user-card>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserProfileComponent implements AfterViewInit {
  @ViewChild('userCard') userCard!: ElementRef;
  
  user = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'alice.jpg',
    role: 'admin',
    verified: true
  };
  
  ngAfterViewInit() {
    const card = this.userCard.nativeElement;
    
    card.addEventListener('card-clicked', (e: CustomEvent) => {
      console.log('Card clicked:', e.detail);
    });
    
    card.addEventListener('email-copied', (e: CustomEvent) => {
      alert(`Copied: ${e.detail.email}`);
    });
  }
  
  sendMessage() {
    console.log('Sending message to', this.user.email);
  }
  
  viewProfile() {
    console.log('Viewing profile of', this.user.name);
  }
}
```

### Browser Support

- ✅ Chrome 54+
- ✅ Firefox 63+
- ✅ Safari 10.1+
- ✅ Edge 79+
- ✅ Opera 41+
- ✅ Samsung Internet 6.0+

For older browsers, use polyfills:
```html
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2/webcomponents-loader.js"></script>
```

### Performance Considerations

- **Shadow DOM Encapsulation**: Styles are scoped, preventing CSS conflicts
- **Efficient Rendering**: Only re-renders when attributes change
- **Memory Management**: Properly cleans up event listeners in disconnectedCallback
- **Lazy Loading**: Can be dynamically imported for better initial load time

```javascript
// Lazy load when needed
async function loadUserCard() {
  await import('./user-card.js');
  // Component is now available
}
```

### Accessibility

The component follows WCAG 2.1 guidelines:

- ✅ **Keyboard Navigation**: Focusable with Tab key
- ✅ **ARIA Attributes**: Proper role="article" and aria-label
- ✅ **Screen Reader**: All content accessible to screen readers
- ✅ **Focus Indicators**: Clear visual focus states
- ✅ **Semantic HTML**: Uses semantic elements in shadow DOM

**Enhanced Accessibility:**

```html
<user-card
  name="Alice Johnson"
  email="alice@example.com"
  role="admin"
  aria-label="User profile card for Alice Johnson, Administrator"
></user-card>
```

### Styling and Theming

The component uses CSS Custom Properties for theming:

```css
user-card {
  --card-bg: #ffffff;
  --card-border: #e0e0e0;
  --card-padding: 1rem;
  --card-radius: 8px;
  
  --avatar-size: 64px;
  
  --name-color: #333333;
  --name-size: 1.25rem;
  
  --email-color: #666666;
  --email-hover-color: #0066cc;
  
  --role-bg-admin: #fce4ec;
  --role-color-admin: #c2185b;
  --role-bg-user: #e3f2fd;
  --role-color-user: #0066cc;
  --role-bg-guest: #f5f5f5;
  --role-color-guest: #757575;
  
  --verified-color: #0066cc;
}

/* Dark mode example */
@media (prefers-color-scheme: dark) {
  user-card {
    --card-bg: #1e1e1e;
    --card-border: #404040;
    --name-color: #e0e0e0;
    --email-color: #b0b0b0;
  }
}
```

## AI Code Generation Tips

When generating code that uses this component:

1. **Always include the hyphen** in the tag name (`user-card`)
2. **Import before use**: `<script type="module" src="user-card.js"></script>`
3. **Attribute types matter**: 
   - name: string
   - email: string
   - avatar: string (URL)
   - role: string (admin/user/guest)
   - verified: boolean (presence = true)
4. **Events bubble**: They cross shadow DOM boundaries (composed: true)
5. **Slots are optional**: Component works without slots
6. **Email click-to-copy**: Built-in functionality, no extra code needed
7. **Responsive**: Adapts to mobile automatically
8. **Framework agnostic**: Works everywhere

### Common Mistakes to Avoid

❌ **Wrong tag name:**
```html
<usercard></usercard>  <!-- Missing hyphen -->
<UserCard></UserCard>  <!-- Wrong case -->
```

✅ **Correct:**
```html
<user-card></user-card>
```

❌ **Boolean attribute with value:**
```html
<user-card verified="true"></user-card>  <!-- Wrong -->
```

✅ **Correct:**
```html
<user-card verified></user-card>  <!-- Right -->
```

❌ **Forgetting to import:**
```html
<body>
  <user-card></user-card>  <!-- Won't work without import -->
</body>
```

✅ **Correct:**
```html
<head>
  <script type="module" src="user-card.js"></script>
</head>
<body>
  <user-card></user-card>  <!-- Works -->
</body>
```

## Troubleshooting

### Component Not Displaying

**Symptoms**: Element appears in DOM but nothing renders

**Possible Causes:**
1. Script not loaded: Check console for 404 errors
2. Tag name incorrect: Must be `user-card` with hyphen
3. Browser compatibility: Use modern browser or polyfills

**Solution:**
```html
<!-- Ensure script is loaded -->
<script type="module" src="user-card.js"></script>

<!-- Use correct tag name -->
<user-card name="Test"></user-card>
```

### Styles Not Applied

**Symptoms**: Component appears unstyled or inherits page styles

**Possible Causes:**
1. Shadow DOM not attached
2. External styles trying to style internal elements

**Solution:**
```javascript
// Styles are encapsulated in shadow DOM
// Use CSS custom properties to theme
```

### Events Not Firing

**Symptoms**: Event listeners don't trigger

**Possible Causes:**
1. Listener attached before component registered
2. Event name misspelled
3. Listener on wrong element

**Solution:**
```javascript
// Wait for component to be defined
customElements.whenDefined('user-card').then(() => {
  const card = document.querySelector('user-card');
  card.addEventListener('card-clicked', handler);
});
```

### Avatar Not Loading

**Symptoms**: Avatar placeholder shows instead of image

**Possible Causes:**
1. Invalid URL
2. CORS issues
3. Image doesn't exist

**Solution:**
```html
<!-- Use full URL -->
<user-card avatar="https://example.com/avatar.jpg"></user-card>

<!-- Or relative path -->
<user-card avatar="/images/avatar.jpg"></user-card>
```

## Version History

- **v1.0.0**: Initial release
  - Basic user card display
  - All five attributes (name, email, avatar, role, verified)
  - Two custom events (card-clicked, email-copied)
  - Two slots (actions, badge)
  - Click-to-copy email functionality
  - Shadow DOM encapsulation
  - Responsive design
  - Accessibility support

## Author

Your Name

## Related Components

Consider using with:
- `avatar-component` - Standalone avatar display
- `user-list` - List of multiple users
- `profile-page` - Full user profile
- `contact-card` - Contact information display

---

**This documentation is optimized for AI assistants like Claude to understand and generate code using this component.**
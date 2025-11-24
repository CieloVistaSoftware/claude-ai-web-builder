
## What is claude.md?

`claude.md` is a **comprehensive documentation and issue tracking file** for each Web Component that serves three purposes:

**Filename Status Icons:**

- All `claude.md` files must include a status icon before the name in the filename:
   - `🔴claude.md` → Needs work
   - `🟢claude.md` → Work complete

This gives a visual indication of which documentation files need work. When a file is updated and all required work is complete, rename the file to use the green icon (🟢) before `claude.md`.

1. **AI-optimized documentation** for AI assistants to understand and generate code
2. **Issue tracking system** with timestamps, line numbers, and priorities
3. **Component metadata** including file locations and important links

## File Structure

Every `claude.md` file MUST have this exact structure and follow the filename icon rule:

```markdown
# ComponentName - AI/Claude Documentation

---

## 📋 Component Metadata
[Component information, versions, status]

### 📁 File Locations
[Directory structure and file paths]

### 🔗 Important Links
[Links to docs, demo, schema, guidelines]

---

## 🐛 Issue Tracking
[Current issues with priority, timestamps, line numbers]

### Current Issues
[Active issues that need attention]

### Resolved Issues
[Historical record of fixed issues]

---

## 🎯 Component Purpose
[What the component does and why]

---

## 💡 Usage for AI
[Key facts AI needs to generate code]

---

## 📝 Key Attributes
[Every attribute with examples]

---

## 🎪 Events
[All events with listening examples]

---

## 🎨 Slots
[All slots with usage examples]

---

## 🔧 Common Patterns
[Frequent usage patterns]

---

## 💻 Code Examples
[Multiple working examples]

---

## 🔌 Integration Notes
[Framework integration, browser support, etc.]

---

## 🤖 AI Code Generation Tips
[Specific tips for AI]

---

## 🔍 Troubleshooting
[Common problems and solutions]
```

---

## Section 1: Component Metadata

### Required Information

```markdown
## 📋 Component Metadata

**Component Name:** user-card  
**Component Class:** UserCard  
**Version:** 2.0.0  
**Created:** 2024-12-15 10:30:00  
**Last Updated:** 2025-01-20 14:45:00  
**Status:** 🟢 Production Ready
```

**Status Options:**
- 🟢 **Production Ready** - Fully tested, stable
- 🟡 **Beta** - Feature complete, testing needed
- 🟠 **Alpha** - Under development
- 🔴 **Deprecated** - No longer maintained
- 🔵 **Experimental** - Proof of concept

### File Locations

```markdown
### 📁 File Locations

\`\`\`
user-card/
├── user-card.js           # Component implementation (285 lines)
├── user-card.css          # Component styles (180 lines)
├── user-card.html         # Demo page with examples
├── user-card.md           # Human documentation (600+ lines)
├── claude.md              # This file (AI documentation)
└── schema.json            # Component schema (validated)
\`\`\`
```

**Include:**
- File names
- Purpose of each file
- Optional: Line counts for context

### Important Links

```markdown
### 🔗 Important Links

- **Component Documentation:** [user-card.md](./user-card.md)
- **Demo Page:** [user-card.html](./user-card.html)
- **Component Schema:** [schema.json](./schema.json)
- **How to Create Web Components:** [../HowToCreateWebcomponent.md](../HowToCreateWebcomponent.md)
- **Component Guidelines:** [WB Standards](../HowToCreateWebcomponent.md#wb-specific-css-rules--patterns)
```

**REQUIRED Links:**
1. Component's own `.md` file
2. Demo page
3. Schema file
4. **HowToCreateWebcomponent.md** (MANDATORY)
5. WB Standards section

---

## Section 2: Issue Tracking System

### Issue Priority Levels

| Priority | Icon | Label | Description | Action Required |
|----------|------|-------|-------------|----------------|
| P0 | 🔴 | CRITICAL | Blocks functionality, system broken | Fix immediately |
| P1 | 🟠 | HIGH | Major issue, fix before release | Fix this sprint |
| P2 | 🟡 | MEDIUM | Important but not blocking | Schedule fix |
| P3 | 🟢 | LOW | Minor issue, nice to have | Backlog |
| P4 | 🔵 | ENHANCEMENT | Future improvement | Future release |

### Issue Template

Every issue MUST include:

```markdown
**[PRIORITY] Issue Title**  
- **Timestamp:** YYYY-MM-DD HH:MM:SS
- **File:** component-name.js
- **Line:** Line number(s) or range
- **Description:** Clear description of the issue
- **Impact:** How this affects functionality
- **Fix:** Proposed solution (if known)
- **Assigned:** Person/team (optional)
- **Status:** Open/In Progress/Blocked (optional)
```

### Example Issue Entries

#### Critical Issue (P0)

```markdown
**[P0 - CRITICAL] Component crashes on initialization**
- **Timestamp:** 2025-01-20 09:00:00
- **File:** user-card.js
- **Line:** 78-85
- **Description:** TypeError thrown when schema.json fails to load
- **Impact:** Component completely non-functional, breaks entire page
- **Fix:** Add try-catch block around schema loading with fallback
- **Assigned:** @lead-developer
- **Status:** 🔥 URGENT - In Progress
```

#### High Priority (P1)

```markdown
**[P1 - HIGH] Memory leak in event listeners**
- **Timestamp:** 2025-01-19 14:30:00
- **File:** user-card.js
- **Line:** 145-150, 203
- **Description:** Event listeners not removed in disconnectedCallback
- **Impact:** Memory grows over time, poor performance with many components
- **Fix:** Add removeEventListener calls for all registered listeners
- **Assigned:** @developer-2
- **Status:** Ready for Fix
```

#### Medium Priority (P2)

```markdown
**[P2 - MEDIUM] Avatar fallback styling inconsistent**
- **Timestamp:** 2025-01-18 11:15:00
- **File:** user-card.css
- **Line:** 45-52
- **Description:** Fallback avatar doesn't use theme colors properly
- **Impact:** Visual inconsistency in dark mode, confusing UX
- **Fix:** Update CSS to use --text-secondary and --bg-tertiary variables
- **Assigned:** @design-team
- **Status:** Design Review
```

#### Low Priority (P3)

```markdown
**[P3 - LOW] Animation could be smoother**
- **Timestamp:** 2025-01-17 16:45:00
- **File:** user-card.css
- **Line:** 128-135
- **Description:** Click animation feels slightly abrupt
- **Impact:** Minor UX polish opportunity
- **Fix:** Change transition timing to cubic-bezier(0.4, 0, 0.2, 1)
- **Assigned:** Backlog
- **Status:** Low Priority
```

#### Enhancement (P4)

```markdown
**[P4 - ENHANCEMENT] Add copy animation**
- **Timestamp:** 2025-01-16 10:00:00
- **File:** user-card.js (new feature)
- **Line:** N/A - New feature
- **Description:** Add ripple effect when email is copied
- **Impact:** Enhanced user feedback, better UX
- **Fix:** Implement CSS ripple animation with JavaScript trigger
- **Assigned:** Future Release
- **Status:** Idea Phase
```

### Resolved Issues Section

```markdown
### Resolved Issues

#### **[P1 - HIGH] ✅ RESOLVED: Click event not firing**
- **Timestamp:** 2025-01-10 11:20:00
- **Resolved:** 2025-01-12 16:45:00
- **Resolution Time:** 2 days, 5 hours
- **File:** user-card.js
- **Line:** 156-162
- **Description:** Touch events weren't properly handled on mobile
- **Fix Applied:** Added touchstart/touchend handlers with event delegation
- **Tested:** ✅ iOS Safari, Android Chrome
- **Resolved By:** @developer-1
```

**Include for resolved issues:**
- Original timestamp
- Resolution timestamp
- Time taken to resolve
- What was implemented
- Testing confirmation
- Who resolved it

### Issue Statistics

```markdown
### Current Issues

\`\`\`
Total Issues: 5
├── 🔴 P0: 1 issue (URGENT)
├── 🟠 P1: 2 issues
├── 🟡 P2: 1 issue
└── 🟢 P3: 1 issue
\`\`\`
```

---

## Best Practices for Issue Tracking

### DO ✅

1. **Always include timestamps** in ISO format or readable format
   ```markdown
   Timestamp: 2025-01-20 14:30:00
   ```

2. **Specify exact line numbers**
   ```markdown
   Line: 145-150 (handleClick method)
   ```

3. **Describe impact clearly**
   ```markdown
   Impact: Prevents users from copying email, breaks key feature
   ```

4. **Provide actionable fixes**
   ```markdown
   Fix: Add null check before accessing email.value property
   ```

5. **Update status regularly**
   ```markdown
   Status: In Progress → Testing → Resolved
   ```

6. **Link to related issues**
   ```markdown
   Related: See issue #P1-003 for similar problem
   ```

### DON'T ❌

1. **Don't use vague descriptions**
   ```markdown
   ❌ Description: Something is broken
   ✅ Description: TypeError on line 45 when email attribute is null
   ```

2. **Don't omit line numbers**
   ```markdown
   ❌ File: user-card.js
   ✅ File: user-card.js, Line: 156-162
   ```

3. **Don't forget timestamps**
   ```markdown
   ❌ Just noting this is broken
   ✅ Timestamp: 2025-01-20 09:00:00
   ```

4. **Don't leave issues unresolved in Current Issues**
   ```markdown
   ❌ Keep old resolved issues in Current Issues
   ✅ Move to Resolved Issues with resolution date
   ```

---

## Integration with Development Workflow

### When to Create Issues

Create issues for:
- ✅ Bugs discovered during development
- ✅ Bugs reported by users
- ✅ Performance problems
- ✅ Accessibility violations
- ✅ Browser compatibility issues
- ✅ Enhancement requests
- ✅ Technical debt

### When to Update Issues

Update issues when:
- 🔄 Status changes (Open → In Progress → Resolved)
- 🔄 New information discovered
- 🔄 Priority changes
- 🔄 Assignment changes
- 🔄 Fix approach changes

### When to Resolve Issues

Resolve issues when:
- ✅ Fix is implemented
- ✅ Fix is tested
- ✅ Fix is merged to main branch
- ✅ Documentation updated

### Issue Workflow

```
1. Discover Issue
   ↓
2. Log in claude.md with [P?] priority
   ↓
3. Assign priority and developer
   ↓
4. Developer picks up (Status: In Progress)
   ↓
5. Fix implemented
   ↓
6. Test fix
   ↓
7. Move to Resolved Issues with resolution details
   ↓
8. Update component version if needed
```

---

## Component Metadata Best Practices

### Version Numbering

Follow semantic versioning:

```
Major.Minor.Patch
  ↓     ↓     ↓
  2  .  1  .  3

Major: Breaking changes
Minor: New features (backward compatible)
Patch: Bug fixes
```

**Example:**
```markdown
Version: 2.1.3
- Major: 2 (Second major release with breaking changes)
- Minor: 1 (Added new slot feature)
- Patch: 3 (Third bug fix release)
```

### Update Timestamps

Update **Last Updated** when:
- Code changes
- Documentation updates
- Issues resolved
- New features added

```markdown
**Last Updated:** 2025-01-20 14:45:00
```

### Status Updates

Update status based on maturity:

```markdown
🔴 Deprecated → Not maintained anymore
🟠 Alpha → Heavy development, breaking changes expected
🟡 Beta → Feature complete, testing in progress
🟢 Production → Stable, tested, ready for use
🔵 Experimental → Proof of concept, may be removed
```

---

## Link to HowToCreateWebcomponent.md

### MANDATORY Link

Every `claude.md` MUST include this link:

```markdown
### 🔗 Important Links

- **How to Create Web Components:** [../HowToCreateWebcomponent.md](../HowToCreateWebcomponent.md)
- **Component Guidelines:** [WB Standards](../HowToCreateWebcomponent.md#wb-specific-css-rules--patterns)
```

**Why this link is required:**
1. Ensures developers follow WB standards
2. Provides reference for component architecture
3. Links to CSS rules and patterns
4. Documents naming conventions
5. Explains composition principles

### Deep Links to Specific Sections

Link to relevant sections based on component type:

```markdown
- **Naming Convention:** [Singular vs Plural](../HowToCreateWebcomponent.md#wb-naming-convention)
- **CSS Architecture:** [No Duplication](../HowToCreateWebcomponent.md#wb-css-architecture)
- **Schema Rules:** [Schema-Driven Config](../HowToCreateWebcomponent.md#component-schema-configuration)
```

---

## Complete Template

### Traditional Documentation (component-name.md)
- Written for **human developers**
- Focuses on concepts and explanations
- Assumes human understanding and context

### AI Documentation (claude.md)
- Written for **AI assistants**
- Focuses on **concrete code examples**
- Provides **explicit patterns** AI can copy
- Includes **framework-specific** integration code
- Contains **troubleshooting** with solutions
- Shows **common mistakes** and how to avoid them

## File Location

```
component-name/
├── component-name.js
├── component-name.css
├── component-name.html
├── component-name.md       ← Human docs
├── claude.md               ← AI docs (THIS FILE)
└── schema.json
```

## Required Sections

### 1. Component Purpose

**What to include:**
- Clear, concise description
- What problem it solves
- Primary use cases

**Example:**
```markdown
## Component Purpose

Displays user profile information with avatar, name, email, role, and custom actions.

This component is designed to display user profile information in a card format with 
interactive features. It follows Web Components standards and can be used in any modern 
web application.
```

### 2. Usage for AI

**What to include:**
- Key facts AI needs to know
- Tag name (with emphasis on hyphen)
- Shadow DOM mode
- Framework compatibility

**Example:**
```markdown
## Usage for AI

When generating code using this component, remember:

1. **Tag Name**: Always use `<user-card>` (with hyphen)
2. **Shadow DOM**: This component uses **open** shadow DOM
3. **Framework Agnostic**: Works with vanilla JS, React, Vue, Angular, etc.
4. **Self-Contained**: All styles are encapsulated
```

### 3. Key Attributes

**What to include:**
- Every attribute with full details
- Type, purpose, required status
- Code example for EACH attribute
- Default values

**Example:**
```markdown
## Key Attributes

### name

- **Type**: `string`
- **Purpose**: User's full name
- **Required**: No
- **Default**: "Unknown User"

\`\`\`html
<user-card name="Alice Johnson"></user-card>
\`\`\`

### verified

- **Type**: `boolean`
- **Purpose**: Whether user account is verified
- **Required**: No
- **Usage**: Presence indicates true, absence indicates false

\`\`\`html
<!-- Verified user -->
<user-card verified></user-card>

<!-- Unverified user -->
<user-card></user-card>
\`\`\`
```

### 4. Events

**What to include:**
- Event name and description
- How to listen to the event
- Event detail structure
- Complete working example

**Example:**
```markdown
## Events

### card-clicked

Fired when the user card is clicked.

**Listening to the event:**

\`\`\`javascript
const card = document.querySelector('user-card');
card.addEventListener('card-clicked', (event) => {
  console.log('Card clicked:', event.detail);
  // event.detail contains: { name, email, role }
});
\`\`\`

**Event Detail Structure:**

\`\`\`javascript
{
  name: "Alice Johnson",
  email: "alice@example.com",
  role: "admin"
}
\`\`\`
```

### 5. Common Patterns

**What to include:**
- Basic usage
- All attributes example
- With slots example
- Programmatic creation

**Example:**
```markdown
## Common Patterns

### Basic Usage

\`\`\`html
<user-card name="John Doe" email="john@example.com"></user-card>
\`\`\`

### With All Attributes

\`\`\`html
<user-card
  name="Alice Johnson"
  email="alice@example.com"
  avatar="https://example.com/alice.jpg"
  role="admin"
  verified
></user-card>
\`\`\`

### Programmatic Creation

\`\`\`javascript
const card = document.createElement('user-card');
card.setAttribute('name', 'Charlie Brown');
card.setAttribute('email', 'charlie@example.com');
document.body.appendChild(card);
\`\`\`
```

### 6. Code Examples

**What to include:**
- 3+ complete, working examples
- Different use cases
- Real-world scenarios
- Full HTML documents

**Example:**
```markdown
## Code Examples

### Example 1: Simple Implementation

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="user-card.js"></script>
</head>
<body>
  <user-card name="Example"></user-card>
</body>
</html>
\`\`\`

### Example 2: Dynamic from API

\`\`\`javascript
async function loadUsers() {
  const users = await fetch('/api/users').then(r => r.json());
  users.forEach(user => {
    const card = document.createElement('user-card');
    card.setAttribute('name', user.name);
    document.body.appendChild(card);
  });
}
\`\`\`
```

### 7. Integration Notes

**What to include:**
- Framework-specific code for React, Vue, Angular
- Browser support
- Performance considerations
- Accessibility notes
- Styling/theming

**Example:**
```markdown
## Integration Notes

### Framework Integration

#### React

\`\`\`jsx
function UserProfile({ user }) {
  const cardRef = useRef();
  
  useEffect(() => {
    const handleClick = (e) => console.log(e.detail);
    cardRef.current.addEventListener('card-clicked', handleClick);
    return () => cardRef.current.removeEventListener('card-clicked', handleClick);
  }, []);
  
  return <user-card ref={cardRef} name={user.name} />;
}
\`\`\`

#### Vue

\`\`\`vue
<template>
  <user-card :name="user.name" @card-clicked="handleClick" />
</template>
\`\`\`
```

### 8. AI Code Generation Tips

**What to include:**
- Specific tips for generating code
- Common mistakes to avoid
- Attribute type reminders
- Event bubbling notes

**Example:**
```markdown
## AI Code Generation Tips

When generating code that uses this component:

1. **Always include the hyphen** in the tag name (`user-card`)
2. **Import before use**: `<script type="module" src="user-card.js"></script>`
3. **Attribute types matter**: 
   - name: string
   - verified: boolean (presence = true)
4. **Events bubble**: Set `bubbles: true` when dispatching

### Common Mistakes to Avoid

❌ **Wrong:**
\`\`\`html
<usercard></usercard>  <!-- Missing hyphen -->
\`\`\`

✅ **Correct:**
\`\`\`html
<user-card></user-card>
\`\`\`
```

### 9. Troubleshooting

**What to include:**
- Common problems
- Symptoms
- Causes
- Solutions with code

**Example:**
```markdown
## Troubleshooting

### Component Not Displaying

**Symptoms**: Element appears in DOM but nothing renders

**Possible Causes:**
1. Script not loaded
2. Tag name incorrect
3. Browser compatibility

**Solution:**
\`\`\`html
<!-- Ensure script is loaded -->
<script type="module" src="user-card.js"></script>

<!-- Use correct tag name -->
<user-card name="Test"></user-card>
\`\`\`
```

## Best Practices for Writing claude.md

### DO ✅

1. **Include Complete Code Examples**
   ```markdown
   ✅ Full working code that can be copy-pasted
   ```

2. **Show Multiple Variations**
   ```markdown
   ✅ Basic, intermediate, and advanced examples
   ```

3. **Include Framework Integration**
   ```markdown
   ✅ React, Vue, Angular examples
   ```

4. **Provide Context**
   ```markdown
   ✅ Explain WHY as well as HOW
   ```

5. **Show Common Mistakes**
   ```markdown
   ✅ What NOT to do, with corrections
   ```

6. **Use Consistent Formatting**
   ```markdown
   ✅ Use code blocks with syntax highlighting
   ```

7. **Include Event Details**
   ```markdown
   ✅ Show exact structure of event.detail
   ```

8. **Provide Fallbacks**
   ```markdown
   ✅ What happens if optional attributes missing
   ```

### DON'T ❌

1. **Don't Be Vague**
   ```markdown
   ❌ "The component can be styled"
   ✅ Shows exact CSS custom properties with examples
   ```

2. **Don't Skip Error Handling**
   ```markdown
   ❌ Code without try-catch
   ✅ Complete error handling shown
   ```

3. **Don't Assume Knowledge**
   ```markdown
   ❌ "Import the component"
   ✅ Shows exact import statement
   ```

4. **Don't Use Pseudo-code**
   ```markdown
   ❌ ... rest of the code
   ✅ Complete, runnable code
   ```

5. **Don't Forget Edge Cases**
   ```markdown
   ❌ Only happy path
   ✅ Shows null, undefined, error cases
   ```

## Typical File Size

A good `claude.md` file is usually:
- **800-1200 lines** for simple components
- **1200-2000 lines** for complex components
- **60-100 KB** in size

This is **significantly longer** than the human documentation because it includes:
- Multiple complete code examples
- Framework-specific integration code
- Troubleshooting solutions
- Common patterns and anti-patterns

## Validation

The type checker validates that `claude.md`:

✅ File exists  
✅ Has required sections  
✅ Contains code examples  
✅ Mentions component tag  
✅ Includes AI-specific guidance  
✅ Is substantial (>200 characters)  

## Generator Support

The `wc-generator.js` automatically creates a complete `claude.md` file with:
- All required sections
- Code examples for your specific component
- Framework integration templates
- Troubleshooting guides
- AI generation tips

## Example Structure

```markdown
# ComponentName - AI/Claude Documentation

## Component Purpose
[What it does]

## Usage for AI
[Key facts for AI]

## Key Attributes
### attribute-1
[Full details + code]
### attribute-2
[Full details + code]

## Events
### event-1
[How to listen + code]
### event-2
[How to listen + code]

## Slots
### slot-1
[How to use + code]

## Common Patterns
[3-5 common usage patterns]

## Code Examples
### Example 1: [Use case]
[Complete working code]
### Example 2: [Use case]
[Complete working code]
### Example 3: [Use case]
[Complete working code]

## Integration Notes
### React
[React-specific code]
### Vue
[Vue-specific code]
### Angular
[Angular-specific code]

### Browser Support
[Compatibility info]

### Performance
[Performance notes]

### Accessibility
[A11y guidelines]

## AI Code Generation Tips
[Specific tips for AI]

### Common Mistakes
[What to avoid]

## Troubleshooting
### Issue 1
[Problem + solution]
### Issue 2
[Problem + solution]

## Version History
[Changes by version]

## Author
[Your name]

---
This documentation is optimized for AI assistants.
```

## Benefits

### For AI Assistants

1. **Faster Code Generation** - All patterns readily available
2. **Fewer Errors** - Common mistakes documented
3. **Better Integration** - Framework-specific examples
4. **Context Awareness** - Understanding of component purpose

### For Developers

1. **Consistent AI Output** - AI generates correct code
2. **Time Savings** - AI doesn't need trial and error
3. **Better Onboarding** - New team members use AI to learn
4. **Documentation as Code** - Examples are always current

### For Projects

1. **Quality Assurance** - AI follows best practices
2. **Faster Development** - AI assists effectively
3. **Reduced Bugs** - Correct patterns from the start
4. **Maintainability** - Clear usage examples

## Real-World Usage

### Scenario 1: New Developer

```
Developer: "Claude, create a user profile page using user-card"

Claude: *Reads claude.md*
       *Generates complete, working code with:
        - Correct tag name
        - Proper event handling
        - Framework integration
        - Error handling*
```

### Scenario 2: Bug Fix

```
Developer: "Claude, the user-card isn't displaying"

Claude: *Reads Troubleshooting section*
       *Identifies common causes*
       *Provides exact solution*
```

### Scenario 3: Integration

```
Developer: "Claude, integrate user-card into our React app"

Claude: *Reads React integration section*
       *Generates working React component*
       *Includes proper hooks and event handling*
```

## Maintenance

### Keep Updated

When you update your component:

1. ✅ Update the `.js` file
2. ✅ Update `claude.md` with new features
3. ✅ Add new code examples
4. ✅ Update troubleshooting if needed
5. ✅ Regenerate if using generator

### Version Control

```bash
# claude.md should be committed
git add user-card/claude.md
git commit -m "Update claude.md with new examples"
```

## Conclusion

`claude.md` is a **critical part** of your Web Component that:
- Enables AI assistants to generate correct code
- Provides comprehensive, copy-paste ready examples
- Documents integration patterns for all major frameworks
- Prevents common mistakes through explicit guidance
- Makes your component AI-friendly and developer-friendly

**Every Web Component MUST have a claude.md file** to pass validation and ensure AI assistants can effectively use your component.

---

**The future of development includes AI assistants - make your components AI-ready with excellent claude.md documentation!** 🤖✨

---

## Example: Generator Questions and Sample Input

When you run the generator, you will be prompted with questions like these:

```
Component tag name (e.g., user-card): my-widget
Component description: A simple widget for demonstration
Author name: Jane Doe
Shadow DOM mode (open/closed/none) [open]: open

📋 Add attributes (press Enter with empty name to finish):
  Attribute name: title
  Attribute type (string/number/boolean): string
  Attribute description: The widget title
  Attribute name: 

🎯 Add events (press Enter with empty name to finish):
  Event name (kebab-case): widget-clicked
  Event description: Fired when the widget is clicked
  Event name (kebab-case): 

📌 Add slots (press Enter with empty name to finish):
  Slot name (or "default"): default
  Slot description: Main content slot
  Slot name (or "default"): 
```

This input will generate a component directory with all required files for `my-widget`.
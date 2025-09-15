# Total Instructions for Cielo Vista Software way of doing things

## Table of Contents
1. [Trace Element Design Instructions](#trace-element-design-instructions)
2. [General Development Guidelines](#general-development-guidelines)
3. [Code Quality Standards](#code-quality-standards)
4. [Project Architecture](#project-architecture)
5. [User Interface Guidelines](#user-interface-guidelines)
6. [Performance Requirements](#performance-requirements)
7. [Security Considerations](#security-considerations)
8. [Testing Standards](#testing-standards)
9. [Documentation Requirements](#documentation-requirements)

---

## Trace Element Design Instructions

### Purpose
The Trace Element is a custom web component designed to display debug, trace, or log information in a structured and user-friendly way. It is intended for use in developer tools, chat widgets, or any application where real-time or historical network or workflow trace data needs to be visualized.

### Key Features
- **Directional Arrows**: Visual arrows indicate log direction:
  - `→` Outbound (to Claude or external service) - purple/blue
  - `←` Inbound (response from server) - green
  - `↓` User input - orange
  - `↑` UI update - teal. When a UI update is logged, the entire data object passed up should be included. This must show any errors, reasons for failures, and the response code if present.
- **Dark/Light Mode**: Adapts to parent or system theme.

### Structure
```html
<trace-element>
  <!-- Most recent log entries appear at the top -->
  <div class="trace-entry info">[12:00:05] ↓ USER: Newest message</div>
  <div class="trace-entry outgoing">[12:00:04] → TO CLAUDE: Payload sent</div>
  <div class="trace-entry incoming">[12:00:03] ← FROM CLAUDE: Response received</div>
  <div class="trace-entry ui">[12:00:02] ↑ TO UI: Response displayed { "response": "...", "error": null, "reason": null, "status": 200 }</div>
  <div class="trace-entry error">[12:00:01] Error: API failed</div>
  
  <div class="trace-controls">
    <button class="trace-toggle">Collapse</button>
    <select class="trace-level-filter">
      <option value="all">All</option>
      <option value="info">Info</option>
      <option value="warning">Warning</option>
      <option value="error">Error</option>
      <option value="success">Success</option>
    </select>
  </div>
  
  <div class="trace-log">
    <!-- Log entries go here -->
  </div>
</trace-element>
```

### Styling Guidelines
- Use CSS custom properties for easy theming
- Log levels and directions have different colors/icons as specified above
- Scrollable log area with max height
- Responsive and accessible design
- High contrast support

### API Methods
- `addEntry({level, direction, message, data, timestamp})`: Add a new log entry. `direction` can be `outgoing`, `incoming`, `user`, or `ui`. For `ui` direction, the `data` object (including errors, reasons, and response code) must be included.
- `clear()`: Clear all logs
- `filter(level, text)`: Filter logs by level or text
- `copy()`: Copy logs to clipboard
- `export(format)`: Export logs as text or JSON

### Example Usage
```javascript
const trace = document.querySelector('trace-element');
trace.addEntry({level: 'info', direction: 'user', message: 'Message sent', timestamp: new Date()});
trace.addEntry({level: 'info', direction: 'outgoing', message: 'Payload sent to Claude', timestamp: new Date()});
trace.addEntry({level: 'info', direction: 'incoming', message: 'Response from Claude', timestamp: new Date()});
trace.addEntry({level: 'info', direction: 'ui', message: 'Response displayed in UI', data: { response: "...", error: null, reason: null, status: 200 }, timestamp: new Date()});
```

### Accessibility Requirements
- Keyboard accessible controls
- ARIA labels for buttons
- High contrast support
- Screen reader compatibility

### Extensibility Features
- Allow custom log levels via attribute/property
- Support for grouping/collapsing log sections
- Optionally support streaming logs from a source

---

## General Development Guidelines

### Code Organization
- Follow modular architecture principles
- Separate concerns (UI, business logic, data layer)
- Use consistent file naming conventions
- Maintain clear folder structure
- Document all public APIs

### Technology Stack Preferences
- **Frontend**: HTML5, CSS3, Modern JavaScript (ES6+)
- **Styling**: CSS Custom Properties, Flexbox/Grid
- **Components**: Web Components or modern framework components
- **Build Tools**: Vite, Webpack, or similar modern bundlers
- **Package Management**: npm or yarn

### File Structure Standards
```
project/
├── components/
│   ├── core/
│   ├── ui/
│   └── trace/
├── css/
│   ├── base/
│   ├── components/
│   └── themes/
├── js/
│   ├── modules/
│   ├── utils/
│   └── main.js
├── docs/
├── tests/
└── assets/
```

---

## Code Quality Standards

### JavaScript Standards
- Use ES6+ features (const/let, arrow functions, destructuring)
- Implement proper error handling with try-catch blocks
- Use async/await for asynchronous operations
- Follow consistent naming conventions (camelCase for variables/functions)
- Write self-documenting code with clear variable names
- Add JSDoc comments for complex functions

### CSS Standards
- Use CSS Custom Properties for theming
- Implement responsive design with mobile-first approach
- Use semantic class names (BEM methodology preferred)
- Avoid inline styles except for dynamic values
- Ensure cross-browser compatibility
- Optimize for performance (minimize reflows/repaints)

### HTML Standards
- Use semantic HTML5 elements
- Ensure proper accessibility (ARIA labels, alt text, etc.)
- Validate markup for standards compliance
- Implement proper SEO meta tags
- Use progressive enhancement principles

---

## Project Architecture

### Component Architecture
- Build reusable, self-contained components
- Implement clear component interfaces
- Use composition over inheritance
- Maintain single responsibility principle
- Ensure components are testable in isolation

### Data Flow
- Implement unidirectional data flow
- Use event-driven architecture for component communication
- Centralize state management for complex applications
- Implement proper data validation and sanitization

### Error Handling Strategy
- Implement global error handling
- Provide user-friendly error messages
- Log errors for debugging purposes
- Implement graceful degradation
- Use proper HTTP status codes

---

## User Interface Guidelines

### Design Principles
- Prioritize user experience and accessibility
- Implement consistent visual hierarchy
- Use clear and intuitive navigation
- Provide immediate feedback for user actions
- Ensure responsive design across all devices

### Interaction Design
- Implement smooth transitions and animations
- Provide clear hover and focus states
- Use consistent interaction patterns
- Implement proper loading states
- Ensure keyboard navigation support

### Visual Design
- Maintain consistent color scheme and typography
- Use appropriate white space and visual balance
- Implement dark/light mode support
- Ensure sufficient color contrast ratios
- Use meaningful icons and imagery

---

## Performance Requirements

### Loading Performance
- Optimize initial page load times
- Implement code splitting and lazy loading
- Minimize and compress assets
- Use efficient caching strategies
- Optimize images and media files

### Runtime Performance
- Minimize DOM manipulations
- Use efficient algorithms and data structures
- Implement virtual scrolling for large lists
- Avoid memory leaks
- Optimize event handling

### Network Performance
- Minimize HTTP requests
- Implement proper caching headers
- Use CDN for static assets
- Implement progressive loading strategies
- Optimize API calls and data transfer

---

## Security Considerations

### Input Validation
- Sanitize all user inputs
- Implement proper data validation
- Use parameterized queries for database operations
- Prevent XSS and injection attacks
- Validate file uploads and handle them securely

### Authentication & Authorization
- Implement secure authentication mechanisms
- Use proper session management
- Implement role-based access control
- Secure API endpoints
- Use HTTPS for all communications

### Data Protection
- Implement proper data encryption
- Follow GDPR and privacy regulations
- Secure sensitive data storage
- Implement audit logging
- Use secure communication protocols

---

## Testing Standards

### Unit Testing
- Write tests for all business logic
- Achieve high code coverage (minimum 80%)
- Use descriptive test names and clear assertions
- Mock external dependencies
- Test edge cases and error conditions

### Integration Testing
- Test component interactions
- Verify API integrations
- Test user workflows end-to-end
- Validate data flow between components
- Test error handling scenarios

### Performance Testing
- Test loading performance
- Validate memory usage
- Test under various network conditions
- Benchmark critical operations
- Monitor real-world performance metrics

---

## Documentation Requirements

### Code Documentation
- Document all public APIs with JSDoc
- Include usage examples for components
- Document configuration options
- Maintain up-to-date README files
- Document known issues and limitations

### User Documentation
- Provide clear setup instructions
- Include usage guides and tutorials
- Document all features and capabilities
- Provide troubleshooting guides
- Maintain changelog for updates

### Architecture Documentation
- Document system architecture decisions
- Maintain component relationship diagrams
- Document data flow and state management
- Include deployment and configuration guides
- Document security considerations and best practices

---

## Implementation Guidelines

### Development Workflow
1. Plan features with clear requirements
2. Design component interfaces and APIs
3. Implement with proper testing
4. Review code for quality and standards compliance
5. Document changes and update relevant documentation
6. Deploy with proper monitoring and rollback capabilities

### Quality Assurance
- Implement continuous integration/deployment
- Use automated testing pipelines
- Perform regular code reviews
- Monitor application performance and errors
- Gather user feedback and iterate based on insights

### Maintenance and Updates
- Keep dependencies up to date
- Monitor security vulnerabilities
- Implement proper versioning strategies
- Plan for backward compatibility
- Document migration guides for breaking changes

---

This comprehensive instruction set should guide all development decisions and ensure consistent, high-quality implementation across the entire Claude AI Web Builder project.
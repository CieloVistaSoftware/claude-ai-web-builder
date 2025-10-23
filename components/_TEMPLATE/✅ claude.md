# ✅ WB COMPONENT-NAME - Claude Development Notes

## Component Status: 🟢 Stable

### Last Updated
2025-10-21

## Issues Resolved

### ✅ None Yet
- Component created from standardized template
- All best practices applied from the start

## Current Implementation

### Architecture
- ✅ Extends WBBaseComponent (no duplicate shadow root)
- ✅ Uses reactive signals for state management
- ✅ Proper attribute observation
- ✅ Event-driven architecture

### Styling
- ✅ Uses data-mode attributes for dark mode (NOT @media queries)
- ✅ Imports only from /styles/main.css
- ✅ BEM naming convention
- ✅ CSS custom properties for theming

### Demo
- ✅ Filename includes "demo" for auto-discovery
- ✅ Uses wb-demo wrapper component
- ✅ Includes event logging
- ✅ Has interactive examples

## Known Issues

### None Currently

## Testing Notes

- [ ] Test in light mode
- [ ] Test in dark mode
- [ ] Test all variants
- [ ] Test all events
- [ ] Test attribute changes
- [ ] Test with wb-demo component
- [ ] Verify auto-discovery by build system
- [ ] Check console for errors

## Development Notes

### Template Features Used
- WBBaseComponent inheritance
- Reactive signals (createSignal)
- Proper lifecycle hooks
- Standardized event naming
- CSS custom properties
- Data-attribute theming

### Next Steps
1. Implement actual component functionality
2. Add comprehensive demos
3. Write full documentation
4. Add unit tests
5. Performance testing
6. Accessibility audit

## References

- Template: `/components/_TEMPLATE/`
- Base Component: `/components/wb-base/`
- Style System: `/styles/main.css`
- Demo Component: `/components/wb-demo/`

---

## Template Checklist

When creating from this template:

- [ ] Find/Replace `COMPONENT-NAME` with actual name
- [ ] Find/Replace `ComponentName` with actual PascalCase name
- [ ] Update this claude.md file with specific issues
- [ ] Implement component logic
- [ ] Style the component
- [ ] Create comprehensive demo
- [ ] Write documentation
- [ ] Add schema (if complex)
- [ ] Run `npm run build`
- [ ] Test thoroughly
- [ ] Commit to repo

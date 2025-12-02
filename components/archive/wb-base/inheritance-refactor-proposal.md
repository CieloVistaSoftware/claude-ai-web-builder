# Proposal: Refactor WB Components to Inherit from WBBaseComponent

## Background
Currently, most WB components (including `wb-demo`) extend `HTMLElement` directly. However, a shared base class, `WBBaseComponent`, exists in `components/wb-base/wb-base.js` and is designed to encapsulate common logic, lifecycle management, event dispatching, logging, and style loading for all WB components.

## Problem
- **Duplication:** Many components re-implement similar logic (lifecycle hooks, logging, event helpers, etc.).
- **Inconsistency:** Updates to shared behaviors require manual changes in each component.
- **Maintainability:** As the codebase grows, maintaining consistency and adding new shared features becomes harder.

## Proposal
Refactor all WB components in `components/` to extend `WBBaseComponent` instead of `HTMLElement`.

### Steps
1. **Audit Components:** Identify all components in `components/` that currently extend `HTMLElement`.
2. **Update Imports:** Ensure each component imports `WBBaseComponent` from `./wb-base/wb-base.js`.
3. **Change Inheritance:** Update each class definition to extend `WBBaseComponent`.
4. **Remove Duplicates:** Remove or refactor any logic now handled by the base class (e.g., logging, event dispatch, style loading).
5. **Test:** Verify that all components function as expected and that shared features (logging, lifecycle, etc.) work consistently.
6. **Document:** Update documentation to reflect the new inheritance model and any new/revised APIs.

### Example
```js
import { WBBaseComponent } from '../wb-base/wb-base.js';

class MyComponent extends WBBaseComponent {
  // ...component logic...
}
```

## Benefits
- **DRY Principle:** Centralizes shared logic, reducing code duplication.
- **Consistency:** All components benefit from updates and bug fixes in the base class.
- **Scalability:** Easier to add new shared features across all components.
- **Maintainability:** Simplifies long-term maintenance and onboarding for new developers.

## Risks & Mitigation
- **Breaking Changes:** Some components may rely on custom lifecycle or event logic. Mitigate by thorough testing and incremental migration.
- **Import Issues:** Ensure all build tools and environments support ES6 module imports.

## Next Steps
- Review and approve this proposal.
- Schedule and execute the refactor in phases, starting with low-risk components.
- Monitor for regressions and update documentation as needed.

---
Proposal by: GitHub Copilot
Date: 2025-10-13

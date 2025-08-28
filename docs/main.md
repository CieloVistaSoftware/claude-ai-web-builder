# Main Application Entry Point

## Overview

This file serves as the main entry point for the Claude AI Web Site Builder React application. It initializes the React application and renders the main `HybridWebsiteBuilder` component.

## Functionality

- Imports required React libraries and components
- Imports the custom CSS styles
- Renders the main `HybridWebsiteBuilder` component inside a React StrictMode wrapper

## Implementation

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import HybridWebsiteBuilder from '../lowcode_website_builder';
import '../css/custom.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HybridWebsiteBuilder />
  </React.StrictMode>
);
```

## Dependencies

- React and ReactDOM
- lowcode_website_builder.tsx (main application component)
- custom.css (for styling)

## Notes

This file is intentionally kept minimal and focuses solely on bootstrapping the React application. All application logic and component rendering is handled by the `HybridWebsiteBuilder` component.

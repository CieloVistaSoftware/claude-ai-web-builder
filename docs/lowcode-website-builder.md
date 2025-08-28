# Hybrid Website Builder Component

## Overview

The `HybridWebsiteBuilder` is the core component of the Claude AI Web Site Builder application. It provides a low-code interface for building and customizing websites with various layouts, themes, and content blocks.

## Features

- Dynamic page creation and management
- Multiple layout options (centered, sidebar, etc.)
- Theme customization
- Content block management (text, images, videos)
- Real-time preview
- HTML export capability

## Component Architecture

The component is built with TypeScript and uses several interfaces to define its data structure:

```typescript
interface ContentBlock {
  type: string;
  content: string;
}

interface PageData {
  title: string;
  content: ContentBlock[];
}

interface PagesState {
  [key: string]: PageData;
}

interface ThemeConfig {
  name: string;
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  primaryColor: string;
  // additional properties...
}
```

## Usage

This component is the main application component and is imported and rendered in the main.tsx file:

```tsx
import HybridWebsiteBuilder from './lowcode_website_builder';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HybridWebsiteBuilder />
  </React.StrictMode>
);
```

## Component State Management

The component manages several state variables:

- `design`: Controls the overall layout and theme settings
- `currentPage`: Tracks which page is currently being edited
- Additional state variables handle content blocks, editing modes, and UI state

## Event Handling

The component listens for custom events from the HTML template:

- Layout changes
- Theme changes
- Export requests
- Edit mode toggling

## Content Block Management

Users can add, edit, and remove various content blocks like:

- Text blocks
- Image/media blocks
- Custom HTML/component blocks

## Export Functionality

The component can export the designed website as HTML code that can be used independently.

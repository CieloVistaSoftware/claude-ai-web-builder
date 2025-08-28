# Theme Demo Component

## Overview

The Theme Demo Component is a React component that showcases different visual themes for the Claude AI Web Site Builder application. It provides an interactive interface for previewing and selecting different color schemes and design styles.

## Features

- Multiple predefined themes with different color schemes (Ocean Blue, etc.)
- Support for both light and dark modes
- Real-time theme preview and switching
- Interactive UI components demonstrating theme application

## Component Structure

The component is defined with TypeScript interfaces for strong typing:

```typescript
interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  mode: 'light' | 'dark';
}
```

## Usage

Import and use the ThemeDemo component in your React application:

```tsx
import ThemeDemo from './theme-demo-component';

function App() {
  return (
    <div className="app">
      <ThemeDemo />
    </div>
  );
}
```

## Dependencies

- React
- lucide-react (for icons)
- custom.css (for styling)

## Example

The component showcases various UI elements styled according to the selected theme, allowing users to preview how different color schemes would look in the actual application.

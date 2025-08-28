# Enhanced Demo with Pages

## Overview

The Enhanced Demo with Pages component is an expanded version of the theme demo that incorporates multi-page functionality, more advanced layout options, and additional website building features.

## Features

- Multi-page website structure with navigation
- Multiple layout options (left navigation, right navigation, top navigation)
- Advanced theme customization with glass morphism effects
- Interactive content editing capabilities
- Real-time preview mode
- Code export functionality

## Component Structure

### Key TypeScript Interfaces

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
    border: string;
    glass: string;
  };
  mode: 'light' | 'dark';
}

// Layout types
type LayoutType = 'left-nav' | 'right-nav' | 'top-nav';
type PageType = 'demo' | 'getStarted' | 'builder';
type WebsiteState = {
  layout: LayoutType;
  // additional properties...
};
```

## Component Pages

The component includes multiple page types:
- Demo page: Showcases theme and layout options
- Get Started page: Provides instructions and documentation
- Builder page: The main website building interface

## Layout System

The component offers three main layout types:
1. Left navigation: Navigation menu on the left side of the screen
2. Right navigation: Navigation menu on the right side of the screen
3. Top navigation: Navigation menu at the top of the screen

## Interactive Features

- Real-time theme switching
- Layout changes with live preview
- Content editing with WYSIWYG interface
- Code viewing option to see the generated HTML/CSS
- Export functionality for saving the website

## Usage

This component represents an enhanced version of the website builder with more features and flexibility than the basic theme demo component.

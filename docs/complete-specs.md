# Claude AI Website Builder - Complete Specifications

<div align="center">
  <img src="/images/ziasymbol.svg" alt="Zia Symbol Logo" width="150" height="100">
</div>

## Table of Contents
1. [Product Overview](#product-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Core Features](#core-features)
4. [Component System](#component-system)
5. [Theme System](#theme-system)
6. [AI Integration](#ai-integration)
7. [User Interface Specifications](#user-interface-specifications)
8. [Data Models & Interfaces](#data-models--interfaces)
9. [Testing Strategy](#testing-strategy)
10. [Development Workflow](#development-workflow)
11. [Deployment & Export](#deployment--export)
12. [Recent Improvements & Project Status](#recent-improvements--project-status)
13. [Quality Standards](#quality-standards)

---

## Product Overview

### Vision
A revolutionary no-code website builder that integrates Claude AI to help users create, customize, and optimize websites through natural language interactions. Users can describe what they want, and Claude generates the appropriate components, layouts, and styling in real-time.

### Target Market
- **Small Business Owners** - Need websites without coding knowledge
- **Freelancers & Consultants** - Quick professional sites
- **Marketing Agencies** - Rapid client website development
- **Non-profits** - Cost-effective web presence

### Key Value Propositions
- 🤖 **AI-Powered Generation** - Natural language to website conversion
- 🎨 **Real-Time Theme System** - Instant visual feedback
- 📱 **Responsive Design** - Mobile-first approach
- 🚀 **No-Code Interface** - Visual drag-and-drop
- 💾 **JSON-Based Storage** - No SQL database required
- ⚡ **Export Ready** - Production-ready code output

---

## Architecture & Tech Stack

### Frontend Stack
- **Framework**: TypeScript + HTML5 (Pure Web Standards)
- **Styling**: CSS Variables + Tailwind CSS for theming
- **Build Tool**: TypeScript Compiler
- **Component System**: Vanilla TypeScript with DOM manipulation
- **Icons**: SVG icons and standard web fonts
- **Architecture**: Traditional MPA (Multi-Page Application) approach

### Backend & Services
- **Server**: Express.js with CORS support
- **Database**: JSON-based file storage
- **AI Integration**: Claude API (Anthropic)
- **Deployment**: Vercel/Netlify ready

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    Claude Website Builder                    │
├─────────────────────────────────────────────────────────────┤
│  Visual Editor  │  AI Chat Interface  │  Component Library  │
├─────────────────────────────────────────────────────────────┤
│           Component System (Drag & Drop)                    │
├─────────────────────────────────────────────────────────────┤
│         Theme Engine (Dark/Light + Custom Colors)           │
├─────────────────────────────────────────────────────────────┤
│              Claude API Integration Layer                   │
├─────────────────────────────────────────────────────────────┤
│                   Export & Deployment                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Features

### 1. AI-Powered Website Generation
- **Natural Language to Website**: Describe website needs in plain English
- **Intelligent Component Selection**: Claude suggests appropriate components
- **Content Generation**: AI-generated placeholder content
- **SEO Recommendations**: Built-in optimization suggestions
- **Conversational Interface**: Chat-based website building

### 2. Multi-Page Website Structure
- Dynamic page creation and management
- Navigation between pages
- Page templates and layouts
- Content block management per page

### 3. Advanced Layout System
- **Left Navigation Layout**: Sidebar navigation with header, main, footer
- **Right Navigation Layout**: Right-side navigation structure
- **Top Navigation Layout**: Header-based navigation system
- **Responsive Breakpoints**: Golden ratio-based calculations
- **Grid Layout Engine**: CSS Grid with mathematical proportions

### 4. Real-Time Theme System
- **Dark/Light Mode Toggle**: Instant theme switching
- **Custom Color Palettes**: User-defined color schemes
- **Glass Morphism Effects**: Modern UI styling with transparency
- **Theme Presets**: Ocean Blue, Cyberpunk, Sunset, Forest themes
- **Color Bar Controls**: Interactive color picker with HSL controls

### 5. Component Library
#### Navigation Components
- Headers with multiple styles
- Sidebar navigation
- Breadcrumbs
- Tab navigation

#### Content Components
- Hero sections
- Content cards
- Testimonials
- Pricing tables
- Text blocks with rich formatting

#### Interactive Components
- Contact forms
- Newsletter signup
- Accordions and tabs
- Modals and tooltips
- Image galleries and carousels

#### Media Components
- Image placeholders with drag-and-drop
- Video players
- Media galleries
- Responsive image handling

---

## Component System

### Component Architecture
```typescript
// Base component interface
interface Component {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  children?: Component[];
  style?: ComponentStyle;
}

// Specific component types
type ComponentType = 
  | 'header' | 'footer' | 'navigation' | 'hero'
  | 'card' | 'form' | 'gallery' | 'text' | 'image';
```

### Component Organization
- **Core Components**: `/components/`
  - **Theme Components**: `/components/theme/`
    - `theme-generator-component.js`
    - `table-theme-component.js`
  - **Table Components**: `/components/table/`
    - `table.html`
    - `table.json`
  - **Registry**: `/components/registry/`

### Component Features
- **Drag & Drop Interface**: Visual component placement
- **Real-Time Editing**: Inline content editing
- **Responsive Behavior**: Automatic mobile adaptation
- **Theme Integration**: Components respond to theme changes
- **Export Capability**: Clean HTML/CSS output

---

## Theme System

### Theme Structure
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
    glass?: string;
  };
  mode: 'light' | 'dark';
  effects?: {
    glassMorphism: boolean;
    borderRadius: number;
    shadows: boolean;
  };
}
```

### CSS Variable System
- **Golden Ratio Foundation**: Mathematical spacing and proportions
- **Responsive Variables**: Viewport-based calculations
- **Theme Variables**: Dynamic color and styling properties

```css
:root {
  --golden-ratio: 1.618;
  --inverse-golden-ratio: 0.618;
  --header-height: 20vh;
  --nav-width: calc(100vw / (var(--golden-ratio) * 2.75));
  --content-padding: calc(1rem * var(--golden-ratio));
}
```

### Theme Controls
- **Color Bar**: Interactive HSL color picker
- **Saturation/Lightness Sliders**: Fine-tune color values
- **Theme Presets**: Quick theme switching
- **Dark Mode Toggle**: System and manual preference
- **Glass Effects**: Transparency and blur controls

---

## AI Integration

### Claude API Integration
```typescript
interface ClaudeIntegration {
  apiKey: string; // Environment variable
  model: string; // Claude model version
  maxTokens: number;
  temperature: number;
}
```

### AI Capabilities
- **Component Generation**: Natural language to HTML/CSS/TypeScript components
- **Content Creation**: AI-generated text, headlines, descriptions
- **Layout Suggestions**: Optimal layout recommendations
- **SEO Optimization**: Meta tags and content suggestions
- **Design Feedback**: Real-time design improvement suggestions

### Chat Interface
- **Conversational UI**: Chat-based interaction
- **Context Awareness**: Understands current website state
- **Multi-turn Conversations**: Iterative design refinement
- **Command Recognition**: Specific website building commands

---

## User Interface Specifications

### Main Application Layout
```
┌─────────────────────────────────────────────────────────────┐
│                         Header                              │
│              "Claude Website Builder"                       │
├─────────────────────────────────────────────────────────────┤
│ Nav │                    Main Content                       │
│     │  ┌─────────────────────────────────────────────────┐  │
│     │  │            Website Preview                      │  │
│     │  │                                                 │  │
│     │  │  Header │ Navigation │ Main │ Footer             │  │
│     │  │                                                 │  │
│     │  └─────────────────────────────────────────────────┘  │
│     │                                                       │
│     │  ┌─────────────────────────────────────────────────┐  │
│     │  │            Claude AI Chat                       │  │
│     │  └─────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                         Footer                              │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Panel Components
- **Layout Selector**: Dropdown for left/right/top navigation
- **Theme Controls**: Color picker and theme presets
- **Website Type Selector**: Template categories
- **Component Library**: Draggable component palette
- **Page Manager**: Multi-page navigation and creation

### Control Specifications
- **Color Bar**: 360-degree hue selection
- **Saturation Slider**: 0-100% saturation control
- **Lightness Slider**: 0-100% lightness control
- **Theme Selector**: Preset theme dropdown
- **Layout Selector**: Navigation layout options
- **Website Type**: Industry/purpose-based templates

---

## Data Models & Interfaces

### Core Application Interfaces
```typescript
// Main application state
interface WebsiteState {
  layout: LayoutType;
  theme: Theme;
  pages: PagesState;
  currentPage: string;
  editMode: boolean;
}

// Page management
interface PageData {
  title: string;
  slug: string;
  content: ContentBlock[];
  meta: PageMeta;
}

interface PagesState {
  [key: string]: PageData;
}

// Content blocks
interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'form' | 'custom';
  content: string;
  props?: Record<string, any>;
  style?: CSSProperties;
}

// Layout types
type LayoutType = 'left-nav' | 'right-nav' | 'top-nav';
type PageType = 'demo' | 'getStarted' | 'builder';

// Theme configuration
interface ThemeConfig {
  name: string;
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  primaryColor: string;
  mode: 'light' | 'dark';
}
```

### Component Props Interfaces
```typescript
// Theme generator component props
interface ThemeGeneratorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  showPreview?: boolean;
}

// Website builder component props
interface HybridWebsiteBuilderProps {
  initialTheme?: Theme;
  initialLayout?: LayoutType;
  enableAI?: boolean;
}
```

---

## Testing Strategy

### Testing Framework
- **Playwright**: Cross-browser end-to-end testing with TypeScript
- **Cross-Platform**: Runs on Windows, macOS, and Linux
- **Visual Debugging**: Screenshot and video capture capabilities
- **Modern Test Features**: Detailed reporting and parallel execution

### Migration from PowerShell
The project successfully migrated from PowerShell-based testing to modern Playwright tests:
- **15 PowerShell tests converted** to TypeScript Playwright tests
- **Enhanced cross-browser testing** with Chrome, Firefox, and Safari
- **Automated visual verification** replacing manual checks
- **CI/CD ready** test suite with detailed reporting

### Test Coverage Areas
1. **UI Component Tests**: 
   - Color wheel functionality and HSL calculations
   - Color bar interactions and theme updates
   - Navigation components and responsive behavior
   
2. **Theme System Tests**: 
   - Theme switching between light/dark modes
   - Custom color palette generation
   - Glass morphism effects and visual styling
   
3. **Layout Tests**: 
   - Grid layout calculations and responsive breakpoints
   - Left/right/top navigation layouts
   - Golden ratio-based spacing and proportions
   
4. **Integration Tests**: 
   - Component interaction and data flow
   - Theme application across components
   - Multi-page navigation and state management
   
5. **Standards Compliance**: 
   - CSS standards validation
   - TypeScript configuration verification
   - Template loading and rendering accuracy

### Playwright Test Files
```bash
Tests/playwright/
├── colorWheel.spec.ts          # Color wheel component tests
├── colorBar.spec.ts            # Color bar functionality tests  
├── dynamicPages.spec.ts        # Multi-page navigation tests
├── footer.spec.ts              # Footer component tests
├── themeOrganization.spec.ts   # Theme system tests
├── tableTheme.spec.ts          # Table component theming tests
├── gridLayout.spec.ts          # Grid layout and responsive tests
├── navWidth.spec.ts            # Navigation width calculations
├── mediaPlaceholder.spec.ts    # Media placeholder tests
├── cssStandards.spec.ts        # CSS validation tests
├── floatingTableTheme.spec.ts  # Floating table theme tests
├── tabStyling.spec.ts          # Tab styling and interaction tests
├── templateLoader.spec.ts      # Template loading tests
├── themeGeneratorSimple.spec.ts # Theme generator tests
└── typescriptConfig.spec.ts    # TypeScript configuration tests
```

### Test Scripts
```bash
# Run all Playwright tests
npm test
npm run test:playwright

# Category-specific tests
npm run test:colorWheel
npm run test:colorBar
npm run test:dynamicPages
npm run test:footer
npm run test:themeOrganization
npm run test:tableTheme
npm run test:gridLayout
npm run test:navWidth
npm run test:mediaPlaceholder
npm run test:cssStandards
npm run test:floatingTableTheme
npm run test:tabStyling
npm run test:templateLoader
npm run test:themeGeneratorSimple
npm run test:typescriptConfig

# Interactive testing with UI
npm run test:ui
npm run test:debug

# Generate test reports
npm run test:report
```

---

## Development Workflow

### File Structure
```
/
├── components/
│   ├── theme/
│   │   ├── theme-generator-component.js
│   │   └── table-theme-component.js
│   ├── table/
│   └── registry/
├── themes/
│   ├── hsl-color-picker.html
│   ├── hue-color-slider.html
│   └── theme-generator.html
├── css/
│   ├── custom.css
│   └── themes/
├── wb/
│   ├── wb.html
│   ├── wb.ts
│   ├── wb.css
│   └── wb.js
├── Tests/
│   └── playwright/
└── docs/
```

### Development Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Kill port (utility)
npm run kill-port
```

### Environment Setup
- Node.js 18+
- Claude API key configuration
- TypeScript configuration
- Playwright browser setup

---

## Deployment & Export

### Export Capabilities
- **Clean HTML/CSS**: Production-ready code
- **Component-based Structure**: Modular output
- **Theme CSS Variables**: Maintainable styling
- **Responsive Design**: Mobile-optimized output
- **SEO-Optimized**: Meta tags and structure

### Deployment Options
- **Vercel**: One-click deployment
- **Netlify**: Static site hosting
- **Custom Hosting**: Exported HTML/CSS/JS files
- **GitHub Pages**: Repository-based hosting

### Export Features
- Minified CSS and JavaScript
- Optimized images and assets
- Clean, semantic HTML structure
- Cross-browser compatible code
- Performance-optimized output

---

## Recent Improvements & Project Status

### PowerShell to Playwright Migration (December 2025)
- **Complete Test Suite Modernization**: Successfully converted 15 PowerShell tests to TypeScript Playwright tests
- **Enhanced Cross-Platform Support**: Tests now run on Windows, macOS, and Linux
- **Improved Test Reliability**: Automated visual verification replaces manual testing
- **Better Developer Experience**: Visual debugging, detailed reporting, and parallel test execution

### Current Technical Debt Resolved
1. **Color Theme Issues**: Fixed table-theme.html not responding to color selector changes
2. **Dark Mode Implementation**: Proper default dark mode rendering
3. **Test Infrastructure**: Modern testing framework with comprehensive coverage
4. **Documentation**: Consolidated specifications in single source of truth

### Known Issues & Limitations
- **AI Integration**: Claude API integration pending environment setup
- **Export Functionality**: Code export feature in development
- **Mobile Optimization**: Some responsive behaviors need refinement
- **Performance**: Large theme changes may have slight delays

### Roadmap & Future Enhancements
1. **AI Features**: Complete Claude API integration for natural language website generation
2. **Component Library**: Expand component library with more pre-built elements
3. **Templates**: Add industry-specific website templates
4. **Export Options**: Multiple export formats (HTML/CSS/JS, static sites)
5. **Collaboration**: Multi-user editing and sharing capabilities

---

## Quality Standards

### Code Quality
- TypeScript for type safety
- ESLint and Prettier configuration
- Component-based architecture
- Responsive design principles
- Accessibility compliance (WCAG guidelines)

### Performance Standards
- Fast initial load times
- Smooth theme transitions
- Efficient rendering updates
- Optimized asset loading
- Mobile performance optimization

### Browser Support
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

This comprehensive specification document serves as the single source of truth for the Claude AI Website Builder project, combining all architectural, functional, and technical requirements in one consolidated reference.

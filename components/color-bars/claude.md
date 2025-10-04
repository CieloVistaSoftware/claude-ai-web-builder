# Color-Bars Component Specification

## Overview
This component builds off of the individual `color-bar` component, which provides a single HSL color slider. The `wb-color-bars` component combines multiple color bars to control both text color and background color properties.

## Component Structure
The `wb-color-bars` component contains **6 individual color bars** arranged in two logical groups:

### Text Color Controls (color property)
1. **Hue bar** - Controls hue for text color (0-360°)
2. **Saturation bar** - Controls saturation for text color (0-100%)  
3. **Lightness bar** - Controls lightness for text color (0-100%)

### Background Color Controls (background-color property)
4. **Hue bar** - Controls hue for background color (0-360°)
5. **Saturation bar** - Controls saturation for background color (0-100%)
6. **Lightness bar** - Controls lightness for background color (0-100%)

## Demo Requirements
The demo page should showcase:

- **Full semantic HTML webpage** with typical elements:
  - Headers (h1, h2, h3)
  - Paragraphs and text content
  - Navigation elements
  - Cards and sections
  - Buttons and interactive elements
  - Lists and tables

- **Real-time color application** where:
  - The first 3 bars control the `color` (text color) of selected elements
  - The second 3 bars control the `background-color` of selected elements
  - Changes are applied immediately as users drag the sliders

- **Element targeting** system to choose which HTML elements are affected by the color controls

## Implementation Details
- Uses 6 instances of the `wb-color-bar` component
- Groups them visually into "Text Color" and "Background Color" sections
- Provides live preview on actual semantic HTML elements
- Shows real-world application of color theory and accessibility